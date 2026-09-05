package com.foodappointment.backend.controller;

import com.foodappointment.backend.dto.VerifyPaymentRequest;
import com.foodappointment.backend.service.PaymentService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }


    // Create Razorpay Order using Booking ID
    @PostMapping("/create-order/{bookingId}")
    public ResponseEntity<?> createOrder(
            @PathVariable Long bookingId) {

        try {

            String order =
                    paymentService.createOrder(bookingId);

            return ResponseEntity.ok(order);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // Verify Razorpay Payment
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
        @RequestBody VerifyPaymentRequest request
) {

    try {

        boolean verified =
                paymentService.verifyAndSavePayment(
                        request.getRazorpayPaymentId(),
                        request.getRazorpayOrderId(),
                        request.getRazorpaySignature()
                );

        if (verified) {
            return ResponseEntity.ok(
                    "Payment verified and booking confirmed"
            );
        }

        return ResponseEntity.badRequest()
                .body("Payment verification failed");

    } catch (Exception e) {

        return ResponseEntity.badRequest()
                .body(e.getMessage());
    }
  }
}