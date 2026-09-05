package com.foodappointment.backend.controller;

import com.foodappointment.backend.entity.Booking;
import com.foodappointment.backend.repository.BookingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/bookings")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('ADMIN')")
public class AdminBookingController {

    private final BookingRepository bookingRepository;

    public AdminBookingController(
            BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    // Get all bookings
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {

        return ResponseEntity.ok(
                bookingRepository.findAll()
        );
    }

    // Get booking by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(
            @PathVariable Long id) {

        return bookingRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update booking status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        Booking booking = bookingRepository
                .findById(id)
                .orElse(null);

        if (booking == null) {
            return ResponseEntity.notFound().build();
        }

        booking.setStatus(status);

        return ResponseEntity.ok(
                bookingRepository.save(booking)
        );
    }
}