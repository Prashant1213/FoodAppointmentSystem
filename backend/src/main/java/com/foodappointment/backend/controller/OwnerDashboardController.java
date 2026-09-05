package com.foodappointment.backend.controller;

import com.foodappointment.backend.entity.Restaurant;
import com.foodappointment.backend.entity.User;
import com.foodappointment.backend.repository.BookingRepository;
import com.foodappointment.backend.repository.MenuItemRepository;
import com.foodappointment.backend.repository.RestaurantRepository;
import com.foodappointment.backend.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/owner/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('RESTAURANT_OWNER')")
public class OwnerDashboardController {

    private final BookingRepository bookingRepository;
    private final MenuItemRepository menuItemRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    public OwnerDashboardController(
            BookingRepository bookingRepository,
            MenuItemRepository menuItemRepository,
            RestaurantRepository restaurantRepository,
            UserRepository userRepository) {

        this.bookingRepository = bookingRepository;
        this.menuItemRepository = menuItemRepository;
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getDashboard(
            Authentication authentication) {

        String email = authentication.getName();

        User owner = userRepository
                .findByEmail(email)
                .orElse(null);

        if (owner == null) {
            return ResponseEntity
                    .status(404)
                    .body("Owner not found");
        }

        Restaurant restaurant = restaurantRepository
                .findByOwnerId(owner.getId())
                .orElse(null);

        if (restaurant == null) {
            return ResponseEntity
                    .status(404)
                    .body("Restaurant not found");
        }

        Long restaurantId = restaurant.getId();

        long totalMenuItems =
                menuItemRepository.countByRestaurantId(
                        restaurantId
                );

        long totalBookings =
                bookingRepository.countByRestaurantId(
                        restaurantId
                );

        long confirmedBookings =
                bookingRepository
                        .countByRestaurantIdAndStatus(
                                restaurantId,
                                "CONFIRMED"
                        );

        long pendingBookings =
                bookingRepository
                        .countByRestaurantIdAndStatus(
                                restaurantId,
                                "PENDING_PAYMENT"
                        );

        long cancelledBookings =
                bookingRepository
                        .countByRestaurantIdAndStatus(
                                restaurantId,
                                "CANCELLED"
                        );

        long completedBookings =
                bookingRepository
                        .countByRestaurantIdAndStatus(
                                restaurantId,
                                "COMPLETED"
                        );

        Double revenue =
                bookingRepository.getOwnerRevenue(
                        restaurantId
                );

        return ResponseEntity.ok(
                java.util.Map.of(
                        "restaurantId", restaurantId,
                        "restaurantName", restaurant.getName(),
                        "totalMenuItems", totalMenuItems,
                        "totalBookings", totalBookings,
                        "confirmedBookings", confirmedBookings,
                        "pendingBookings", pendingBookings,
                        "cancelledBookings", cancelledBookings,
                        "completedBookings", completedBookings,
                        "revenue", revenue
                )
        );
    }
}