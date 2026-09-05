package com.foodappointment.backend.controller;

import com.foodappointment.backend.entity.MenuItem;
import com.foodappointment.backend.repository.MenuItemRepository;
import com.foodappointment.backend.repository.RestaurantRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/menu-items")
@CrossOrigin(origins = "http://localhost:5173")
public class MenuItemController {

    private final MenuItemRepository menuItemRepository;
    private final RestaurantRepository restaurantRepository;

    public MenuItemController(
            MenuItemRepository menuItemRepository,
            RestaurantRepository restaurantRepository) {

        this.menuItemRepository = menuItemRepository;
        this.restaurantRepository = restaurantRepository;
    }

    @PostMapping("/restaurant/{restaurantId}")
    public ResponseEntity<?> createMenuItem(
            @PathVariable Long restaurantId,
            @RequestBody MenuItem menuItem) {

        return restaurantRepository.findById(restaurantId)
                .map(restaurant -> {

                    menuItem.setRestaurant(restaurant);

                    return ResponseEntity.ok(
                            menuItemRepository.save(menuItem)
                    );

                })
                .orElse(ResponseEntity.notFound().build());
    }
}