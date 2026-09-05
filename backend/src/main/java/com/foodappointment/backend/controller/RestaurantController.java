package com.foodappointment.backend.controller;

import com.foodappointment.backend.entity.MenuItem;
import com.foodappointment.backend.entity.Restaurant;
import com.foodappointment.backend.repository.MenuItemRepository;
import com.foodappointment.backend.repository.RestaurantRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "http://localhost:5173")
public class RestaurantController {

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    public RestaurantController(
            RestaurantRepository restaurantRepository,
            MenuItemRepository menuItemRepository) {

        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
    }

    // Get all restaurants
    @GetMapping
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {

        return ResponseEntity.ok(
                restaurantRepository.findAll()
        );
    }

    // Get restaurant by ID
    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurant(
            @PathVariable Long id) {

        return restaurantRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get menu items of a restaurant
    @GetMapping("/{id}/menu")
    public ResponseEntity<List<MenuItem>> getRestaurantMenu(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                menuItemRepository.findByRestaurantId(id)
        );
    }
}