package com.foodappointment.backend.controller;

import com.foodappointment.backend.entity.MenuItem;
import com.foodappointment.backend.repository.MenuItemRepository;
import com.foodappointment.backend.repository.RestaurantRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/menu-items")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('ADMIN')")
public class AdminMenuItemController {

    private final MenuItemRepository menuItemRepository;
    private final RestaurantRepository restaurantRepository;

    public AdminMenuItemController(
            MenuItemRepository menuItemRepository,
            RestaurantRepository restaurantRepository) {

        this.menuItemRepository = menuItemRepository;
        this.restaurantRepository = restaurantRepository;
    }

    // Get all menu items
    @GetMapping
    public ResponseEntity<List<MenuItem>> getAllMenuItems() {
        return ResponseEntity.ok(menuItemRepository.findAll());
    }

    // Get menu items by restaurant
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<MenuItem>> getMenuByRestaurant(
            @PathVariable Long restaurantId) {

        return ResponseEntity.ok(
                menuItemRepository.findByRestaurantId(restaurantId)
        );
    }

    // Add menu item
    @PostMapping("/restaurant/{restaurantId}")
    public ResponseEntity<?> addMenuItem(
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

    // Update menu item
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMenuItem(
            @PathVariable Long id,
            @RequestBody MenuItem updatedMenuItem) {

        MenuItem menuItem = menuItemRepository
                .findById(id)
                .orElse(null);

        if (menuItem == null) {
            return ResponseEntity.notFound().build();
        }

        menuItem.setName(updatedMenuItem.getName());
        menuItem.setDescription(updatedMenuItem.getDescription());
        menuItem.setPrice(updatedMenuItem.getPrice());
        menuItem.setCategory(updatedMenuItem.getCategory());

        return ResponseEntity.ok(
                menuItemRepository.save(menuItem)
        );
    }

    // Delete menu item
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMenuItem(
            @PathVariable Long id) {

        MenuItem menuItem = menuItemRepository
                .findById(id)
                .orElse(null);

        if (menuItem == null) {
            return ResponseEntity.notFound().build();
        }

        menuItemRepository.delete(menuItem);

        return ResponseEntity.ok(
                "Menu item deleted successfully"
        );
    }
}