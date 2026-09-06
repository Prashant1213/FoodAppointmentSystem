package com.foodappointment.backend.service;

import com.razorpay.Utils;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;

import com.foodappointment.backend.entity.Booking;
import com.foodappointment.backend.entity.Payment;
import com.foodappointment.backend.repository.BookingRepository;
import com.foodappointment.backend.repository.PaymentRepository;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final EmailService emailService;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    public PaymentService(
            BookingRepository bookingRepository,
            PaymentRepository paymentRepository,
            EmailService emailService) {

        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.emailService = emailService;
    }

    // Create Razorpay Order using Booking ID
    public String createOrder(
            Long bookingId,
            String customerEmail) throws Exception {

        // Find booking
        Booking booking = bookingRepository
                .findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found"
                        )
                );

        // Ownership check
        if (booking.getCustomerEmail() == null ||
                !booking.getCustomerEmail()
                        .equalsIgnoreCase(customerEmail)) {

            throw new RuntimeException(
                    "You cannot create payment for this booking"
            );
        }

        // Payment only for pending booking
        if (!"PENDING_PAYMENT"
                .equalsIgnoreCase(booking.getStatus())) {

            throw new RuntimeException(
                    "Booking is not available for payment"
            );
        }

        // Get advance amount from database
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

        // Create Razorpay order
        Order order =
                razorpayClient.orders.create(
                        orderRequest
                );

        // Save Razorpay Order ID
        booking.setRazorpayOrderId(
                order.get("id")
        );

        bookingRepository.save(booking);

        // Return Razorpay order response
        return order.toString();
    }


    // Verify Razorpay Payment Signature
    public boolean verifyAndSavePayment(
            String paymentId,
            String orderId,
            String signature,
            String customerEmail) throws Exception {

        // Basic input validation
        if (paymentId == null ||
                paymentId.isBlank() ||
                orderId == null ||
                orderId.isBlank() ||
                signature == null ||
                signature.isBlank()) {

            throw new RuntimeException(
                    "Invalid payment details"
            );
        }

        // Verify Razorpay signature
        String payload =
                orderId + "|" + paymentId;

        boolean verified =
                Utils.verifySignature(
                        payload,
                        signature,
                        keySecret
                );

        if (!verified) {
            return false;
        }

        // Find booking using Razorpay Order ID
        Booking booking =
                bookingRepository
                        .findByRazorpayOrderId(orderId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found for this order"
                                )
                        );

        // Ownership check
        if (booking.getCustomerEmail() == null ||
                !booking.getCustomerEmail()
                        .equalsIgnoreCase(customerEmail)) {

            throw new RuntimeException(
                    "You cannot verify payment for this booking"
            );
        }

        // Booking must still be pending payment
        if (!"PENDING_PAYMENT"
                .equalsIgnoreCase(booking.getStatus())) {

            throw new RuntimeException(
                    "Booking is not pending payment"
            );
        }

        // Prevent duplicate payment record
        if (paymentRepository
                .existsByRazorpayPaymentId(paymentId)) {

            throw new RuntimeException(
                    "Payment has already been processed"
            );
        }

        // Create payment record
        Payment payment = new Payment();

        payment.setBooking(booking);
        payment.setRazorpayOrderId(orderId);
        payment.setRazorpayPaymentId(paymentId);
        payment.setRazorpaySignature(signature);

        // Amount comes from database
        payment.setAmount(
                booking.getAdvanceAmount()
        );

        payment.setStatus("SUCCESS");

        paymentRepository.save(payment);

        // Confirm booking
        booking.setStatus("CONFIRMED");

        bookingRepository.save(booking);

        // Send confirmation email
        emailService.sendBookingConfirmation(
                booking
        );

        return true;
    }
}