package com.foodappointment.backend.controller;

import com.foodappointment.backend.dto.VerifyPaymentRequest;
import com.foodappointment.backend.service.PaymentService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> createOrder(
            @PathVariable Long bookingId,
            Authentication authentication) {

        try {

            String customerEmail = authentication.getName();

            String order = paymentService.createOrder(
                    bookingId,
                    customerEmail
            );

            return ResponseEntity.ok(order);

        } catch (RuntimeException e) {

            if (e.getMessage() != null &&
                    e.getMessage().contains("cannot create payment")) {

                return ResponseEntity
                        .status(403)
                        .body(e.getMessage());
            }

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body("Unable to create payment order");
        }
    }

    // Verify Razorpay Payment
    @PostMapping("/verify")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> verifyPayment(
            @RequestBody VerifyPaymentRequest request,
            Authentication authentication) {

        try {

            String customerEmail = authentication.getName();

            boolean verified =
                    paymentService.verifyAndSavePayment(
                            request.getRazorpayPaymentId(),
                            request.getRazorpayOrderId(),
                            request.getRazorpaySignature(),
                            customerEmail
                    );

            if (verified) {

                return ResponseEntity.ok(
                        "Payment verified and booking confirmed"
                );
            }

            return ResponseEntity
                    .badRequest()
                    .body("Payment verification failed");

        } catch (RuntimeException e) {

            if (e.getMessage() != null &&
                    e.getMessage().contains("cannot verify payment")) {

                return ResponseEntity
                        .status(403)
                        .body(e.getMessage());
            }

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body("Payment verification failed");
        }
    }
}