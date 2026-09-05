package com.foodappointment.backend.service;

import com.razorpay.Utils;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;

import com.foodappointment.backend.entity.Booking;
import com.foodappointment.backend.repository.BookingRepository;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.foodappointment.backend.entity.Payment;
import com.foodappointment.backend.repository.PaymentRepository;

@Service
public class PaymentService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final EmailService emailService;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;


    // Constructor
    public PaymentService(
        BookingRepository bookingRepository,
        PaymentRepository paymentRepository,
        EmailService emailService) {

    this.bookingRepository = bookingRepository;
    this.paymentRepository = paymentRepository;
    this.emailService = emailService;
}

    // Create Razorpay Order using Booking ID
    public String createOrder(Long bookingId) throws Exception {

        // Find booking from database
        Booking booking = bookingRepository
                .findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));


        // Payment should be created only for pending booking
        if (!"PENDING_PAYMENT".equals(booking.getStatus())) {

            throw new RuntimeException(
                    "Booking is not available for payment"
            );
        }


        // Get 25% advance amount from database
        double advanceAmount =
                booking.getAdvanceAmount();


        // Create Razorpay client
        RazorpayClient razorpayClient =
                new RazorpayClient(
                        keyId,
                        keySecret
                );


        // Convert rupees to paise
        int amountInPaise =
                (int) Math.round(
                        advanceAmount * 100
                );


        // Create Razorpay order request
        JSONObject orderRequest =
                new JSONObject();

        orderRequest.put(
                "amount",
                amountInPaise
        );

        orderRequest.put(
                "currency",
                "INR"
        );

        orderRequest.put(
                "receipt",
                "booking_" + bookingId
        );


        // Create order
        Order order =
        razorpayClient.orders.create(orderRequest);

        // Save Razorpay Order ID in Booking
        booking.setRazorpayOrderId(order.get("id"));
        
        bookingRepository.save(booking);
        // Return Razorpay order response
       return order.toString();
    }


    // Verify Razorpay Payment Signature
    public boolean verifyAndSavePayment(
        String paymentId,
        String orderId,
        String signature
) throws Exception {

    String payload = orderId + "|" + paymentId;

    boolean verified = Utils.verifySignature(
            payload,
            signature,
            keySecret
    );

    if (!verified) {
        return false;
    }

    Booking booking = bookingRepository
            .findByRazorpayOrderId(orderId)
            .orElseThrow(() ->
                    new RuntimeException(
                            "Booking not found for this order"
                    )
            );

    if (!"PENDING_PAYMENT".equals(booking.getStatus())) {
        throw new RuntimeException(
                "Booking is not pending payment"
        );
    }

    Payment payment = new Payment();

    payment.setBooking(booking);
    payment.setRazorpayOrderId(orderId);
    payment.setRazorpayPaymentId(paymentId);
    payment.setRazorpaySignature(signature);
    payment.setAmount(booking.getAdvanceAmount());
    payment.setStatus("SUCCESS");

    paymentRepository.save(payment);

    booking.setStatus("CONFIRMED");

    bookingRepository.save(booking);

    emailService.sendBookingConfirmation(booking);

    return true;
  }
}