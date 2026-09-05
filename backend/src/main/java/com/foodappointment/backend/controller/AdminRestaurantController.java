package com.foodappointment.backend.controller;

import com.foodappointment.backend.entity.Restaurant;
import com.foodappointment.backend.repository.RestaurantRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/restaurants")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('ADMIN')")
public class AdminRestaurantController {

    private final RestaurantRepository restaurantRepository;

    public AdminRestaurantController(
            RestaurantRepository restaurantRepository) {

        this.restaurantRepository = restaurantRepository;
    }

    // Get all restaurants for Admin
    @GetMapping
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {

        return ResponseEntity.ok(
                restaurantRepository.findAll()
        );
    }

    // Add restaurant
    @PostMapping
    public ResponseEntity<Restaurant> addRestaurant(
            @RequestBody Restaurant restaurant) {

        Restaurant savedRestaurant =
                restaurantRepository.save(restaurant);

        return ResponseEntity.ok(savedRestaurant);
    }

    // Update restaurant
    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(
        @PathVariable Long id,
        @RequestBody Restaurant updatedRestaurant) {

    Restaurant restaurant =
            restaurantRepository.findById(id).orElse(null);

    if (restaurant == null) {
        return ResponseEntity.notFound().build();
    }

    restaurant.setName(updatedRestaurant.getName());
    restaurant.setLocation(updatedRestaurant.getLocation());
    restaurant.setCuisine(updatedRestaurant.getCuisine());
    restaurant.setRating(updatedRestaurant.getRating());

    Restaurant savedRestaurant =
            restaurantRepository.save(restaurant);

    return ResponseEntity.ok(savedRestaurant);
    }

    // Delete restaurant
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRestaurant(
            @PathVariable Long id) {

        Restaurant restaurant =
                restaurantRepository.findById(id).orElse(null);

        if (restaurant == null) {
            return ResponseEntity.notFound().build();
        }

        restaurantRepository.delete(restaurant);

        return ResponseEntity.ok(
                "Restaurant deleted successfully"
        );
    }
}