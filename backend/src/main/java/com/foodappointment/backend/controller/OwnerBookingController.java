package com.foodappointment.backend.controller;

import com.foodappointment.backend.entity.Booking;
import com.foodappointment.backend.entity.Restaurant;
import com.foodappointment.backend.entity.User;
import com.foodappointment.backend.repository.BookingRepository;
import com.foodappointment.backend.repository.RestaurantRepository;
import com.foodappointment.backend.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner/bookings")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('RESTAURANT_OWNER')")
public class OwnerBookingController {

    private final BookingRepository bookingRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    public OwnerBookingController(
            BookingRepository bookingRepository,
            RestaurantRepository restaurantRepository,
            UserRepository userRepository) {

        this.bookingRepository = bookingRepository;
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
    }

    private Restaurant getOwnerRestaurant(
            Authentication authentication) {

        String email = authentication.getName();

        User owner = userRepository
                .findByEmail(email)
                .orElse(null);

        if (owner == null) {
            return null;
        }

        return restaurantRepository
                .findByOwnerId(owner.getId())
                .orElse(null);
    }

    // GET - Owner's bookings
    @GetMapping
    public ResponseEntity<?> getMyBookings(
            Authentication authentication) {

        Restaurant restaurant =
                getOwnerRestaurant(authentication);

        if (restaurant == null) {
            return ResponseEntity
                    .status(404)
                    .body("Restaurant not found");
        }

        List<Booking> bookings =
                bookingRepository.findByRestaurantId(
                        restaurant.getId()
                );

        return ResponseEntity.ok(bookings);
    }

    // GET - Single booking
    @GetMapping("/{id}")
    public ResponseEntity<?> getBooking(
            @PathVariable Long id,
            Authentication authentication) {

        Restaurant restaurant =
                getOwnerRestaurant(authentication);

        if (restaurant == null) {
            return ResponseEntity
                    .status(404)
                    .body("Restaurant not found");
        }

        Booking booking =
                bookingRepository.findById(id)
                        .orElse(null);

        if (booking == null) {
            return ResponseEntity
                    .status(404)
                    .body("Booking not found");
        }

        if (booking.getRestaurant() == null ||
                !booking.getRestaurant().getId()
                        .equals(restaurant.getId())) {

            return ResponseEntity
                    .status(403)
                    .body("You cannot access this booking");
        }

        return ResponseEntity.ok(booking);
    }

    // PUT - Update booking status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam String status,
            Authentication authentication) {

        Restaurant restaurant =
                getOwnerRestaurant(authentication);

        if (restaurant == null) {
            return ResponseEntity
                    .status(404)
                    .body("Restaurant not found");
        }

        Booking booking =
                bookingRepository.findById(id)
                        .orElse(null);

        if (booking == null) {
            return ResponseEntity
                    .status(404)
                    .body("Booking not found");
        }

        if (booking.getRestaurant() == null ||
                !booking.getRestaurant().getId()
                        .equals(restaurant.getId())) {

            return ResponseEntity
                    .status(403)
                    .body("You cannot modify this booking");
        }

        String newStatus = status.toUpperCase();

        if (!newStatus.equals("CONFIRMED") &&
                !newStatus.equals("CANCELLED") &&
                !newStatus.equals("COMPLETED")) {

            return ResponseEntity
                    .badRequest()
                    .body(
                        "Invalid status. Use CONFIRMED, CANCELLED or COMPLETED"
                    );
        }

        booking.setStatus(newStatus);

        Booking savedBooking =
                bookingRepository.save(booking);

        return ResponseEntity.ok(savedBooking);
    }
}