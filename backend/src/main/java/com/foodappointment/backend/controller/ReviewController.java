package com.foodappointment.backend.controller;

import com.foodappointment.backend.entity.Booking;
import com.foodappointment.backend.entity.Restaurant;
import com.foodappointment.backend.entity.Review;
import com.foodappointment.backend.entity.User;
import com.foodappointment.backend.repository.BookingRepository;
import com.foodappointment.backend.repository.RestaurantRepository;
import com.foodappointment.backend.repository.ReviewRepository;
import com.foodappointment.backend.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('CUSTOMER')")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    public ReviewController(
            ReviewRepository reviewRepository,
            BookingRepository bookingRepository,
            RestaurantRepository restaurantRepository,
            UserRepository userRepository) {

        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
    }

    // Add Review
    @PostMapping
    public ResponseEntity<?> addReview(
            @RequestParam Long bookingId,
            @RequestParam Integer rating,
            @RequestParam(required = false) String comment,
            Authentication authentication) {

        String email = authentication.getName();

        User customer = userRepository
                .findByEmail(email)
                .orElse(null);

        if (customer == null) {
            return ResponseEntity
                    .status(404)
                    .body("Customer not found");
        }

        Booking booking = bookingRepository
                .findById(bookingId)
                .orElse(null);

        if (booking == null) {
            return ResponseEntity
                    .status(404)
                    .body("Booking not found");
        }

        // Ownership check
        if (!email.equalsIgnoreCase(
                booking.getCustomerEmail())) {

            return ResponseEntity
                    .status(403)
                    .body("You cannot review this booking");
        }

        // Only completed booking can be reviewed
        if (!"COMPLETED".equalsIgnoreCase(
                booking.getStatus())) {

            return ResponseEntity
                    .badRequest()
                    .body(
                        "Only completed bookings can be reviewed"
                    );
        }

        // Rating validation
        if (rating == null || rating < 1 || rating > 5) {

            return ResponseEntity
                    .badRequest()
                    .body("Rating must be between 1 and 5");
        }

        // One review per booking
        if (reviewRepository.existsByBookingId(
                bookingId)) {

            return ResponseEntity
                    .badRequest()
                    .body(
                        "This booking has already been reviewed"
                    );
        }

        Restaurant restaurant =
                booking.getRestaurant();

        if (restaurant == null) {
            return ResponseEntity
                    .status(404)
                    .body("Restaurant not found");
        }

        Review review = new Review();

        review.setBooking(booking);
        review.setRestaurant(restaurant);
        review.setCustomerName(
                booking.getCustomerName()
        );
        review.setCustomerEmail(email);
        review.setRating(rating);
        review.setComment(comment);
        review.setCreatedAt(LocalDateTime.now());

        Review savedReview =
                reviewRepository.save(review);

        // Update restaurant average rating
        List<Review> reviews =
                reviewRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurant.getId());
        
        double averageRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        
        restaurant.setRating(averageRating);
        restaurantRepository.save(restaurant);
        
        return ResponseEntity.ok(savedReview);
    }

    // Get reviews for a restaurant
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<?> getRestaurantReviews(
            @PathVariable Long restaurantId) {

        List<Review> reviews =
                reviewRepository
                        .findByRestaurantIdOrderByCreatedAtDesc(
                                restaurantId
                        );

        return ResponseEntity.ok(reviews);
    }

    // Check whether current customer already reviewed booking
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getBookingReview(
            @PathVariable Long bookingId,
            Authentication authentication) {

        String email = authentication.getName();

        Booking booking = bookingRepository
                .findById(bookingId)
                .orElse(null);

        if (booking == null) {
            return ResponseEntity
                    .status(404)
                    .body("Booking not found");
        }

        if (!email.equalsIgnoreCase(
                booking.getCustomerEmail())) {

            return ResponseEntity
                    .status(403)
                    .body("You cannot access this review");
        }

        return ResponseEntity.ok(
                reviewRepository.findByBookingId(
                        bookingId
                )
        );
    }
}