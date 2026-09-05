package com.foodappointment.backend.controller;

import com.foodappointment.backend.entity.Booking;
import com.foodappointment.backend.entity.BookingItem;
import com.foodappointment.backend.entity.Restaurant;
import com.foodappointment.backend.entity.User;
import com.foodappointment.backend.repository.BookingItemRepository;
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
public class OwnerBookingItemController {

    private final BookingItemRepository bookingItemRepository;
    private final BookingRepository bookingRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    public OwnerBookingItemController(
            BookingItemRepository bookingItemRepository,
            BookingRepository bookingRepository,
            RestaurantRepository restaurantRepository,
            UserRepository userRepository) {

        this.bookingItemRepository = bookingItemRepository;
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

    @GetMapping("/{bookingId}/items")
    public ResponseEntity<?> getBookingItems(
            @PathVariable Long bookingId,
            Authentication authentication) {

        Restaurant restaurant =
                getOwnerRestaurant(authentication);

        if (restaurant == null) {
            return ResponseEntity
                    .status(404)
                    .body("Restaurant not found");
        }

        Booking booking =
                bookingRepository.findById(bookingId)
                        .orElse(null);

        if (booking == null) {
            return ResponseEntity
                    .status(404)
                    .body("Booking not found");
        }

        // Security check
        if (booking.getRestaurant() == null ||
                !booking.getRestaurant().getId()
                        .equals(restaurant.getId())) {

            return ResponseEntity
                    .status(403)
                    .body("You cannot access items of this booking");
        }

        List<BookingItem> items =
                bookingItemRepository.findByBookingId(
                        bookingId
                );

        return ResponseEntity.ok(items);
    }
}