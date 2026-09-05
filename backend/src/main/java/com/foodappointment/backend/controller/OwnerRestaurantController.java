package com.foodappointment.backend.controller;

import com.foodappointment.backend.entity.Restaurant;
import com.foodappointment.backend.entity.User;
import com.foodappointment.backend.repository.RestaurantRepository;
import com.foodappointment.backend.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.foodappointment.backend.service.CloudinaryService;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/owner/restaurant")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('RESTAURANT_OWNER')")
public class OwnerRestaurantController {

    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    public OwnerRestaurantController(
            RestaurantRepository restaurantRepository,
            UserRepository userRepository,
            CloudinaryService cloudinaryService) {

        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
    }

    // Get logged-in owner's restaurant
    @GetMapping
    public ResponseEntity<?> getMyRestaurant(
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

        Restaurant restaurant =
                restaurantRepository
                        .findByOwnerId(owner.getId())
                        .orElse(null);

        if (restaurant == null) {
            return ResponseEntity
                    .status(404)
                    .body("Restaurant not found");
        }

        return ResponseEntity.ok(restaurant);
    }

    // Update logged-in owner's restaurant
    @PutMapping
    public ResponseEntity<?> updateMyRestaurant(
            @RequestBody Restaurant updatedRestaurant,
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

        Restaurant restaurant =
                restaurantRepository
                        .findByOwnerId(owner.getId())
                        .orElse(null);

        if (restaurant == null) {
            return ResponseEntity
                    .status(404)
                    .body("Restaurant not found");
        }

        restaurant.setName(updatedRestaurant.getName());
        restaurant.setLocation(updatedRestaurant.getLocation());
        restaurant.setCuisine(updatedRestaurant.getCuisine());

        Restaurant savedRestaurant =
                restaurantRepository.save(restaurant);

        return ResponseEntity.ok(savedRestaurant);
    }

    @PostMapping("/image")
    public ResponseEntity<?> uploadRestaurantImage(
        @RequestParam("file") MultipartFile file,
        Authentication authentication) {

    try {

        String email = authentication.getName();

        User owner = userRepository
                .findByEmail(email)
                .orElse(null);

        if (owner == null) {
            return ResponseEntity
                    .status(404)
                    .body("Owner not found");
        }

        Restaurant restaurant =
                restaurantRepository
                        .findByOwnerId(owner.getId())
                        .orElse(null);

        if (restaurant == null) {
            return ResponseEntity
                    .status(404)
                    .body("Restaurant not found");
        }

        String imageUrl =
                cloudinaryService.uploadImage(file);

        restaurant.setImageUrl(imageUrl);

        Restaurant savedRestaurant =
                restaurantRepository.save(restaurant);

        return ResponseEntity.ok(savedRestaurant);

    } catch (IllegalArgumentException e) {

        return ResponseEntity
                .badRequest()
                .body(e.getMessage());

    } catch (Exception e) {

        return ResponseEntity
                .status(500)
                .body("Image upload failed");
    }
}
}