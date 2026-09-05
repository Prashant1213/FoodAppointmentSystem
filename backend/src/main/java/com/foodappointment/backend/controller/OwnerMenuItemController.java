package com.foodappointment.backend.controller;

import com.foodappointment.backend.entity.MenuItem;
import com.foodappointment.backend.entity.Restaurant;
import com.foodappointment.backend.entity.User;
import com.foodappointment.backend.repository.MenuItemRepository;
import com.foodappointment.backend.repository.RestaurantRepository;
import com.foodappointment.backend.repository.UserRepository;

import com.foodappointment.backend.service.CloudinaryService;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner/menu-items")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('RESTAURANT_OWNER')")
public class OwnerMenuItemController {

    private final MenuItemRepository menuItemRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    public OwnerMenuItemController(
            MenuItemRepository menuItemRepository,
            RestaurantRepository restaurantRepository,
            UserRepository userRepository,
            CloudinaryService cloudinaryService) {

        this.menuItemRepository = menuItemRepository;
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
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

    // GET - Owner's menu items
    @GetMapping
    public ResponseEntity<?> getMyMenu(
            Authentication authentication) {

        Restaurant restaurant =
                getOwnerRestaurant(authentication);

        if (restaurant == null) {
            return ResponseEntity
                    .status(404)
                    .body("Restaurant not found");
        }

        List<MenuItem> menuItems =
                menuItemRepository.findByRestaurantId(
                        restaurant.getId()
                );

        return ResponseEntity.ok(menuItems);
    }

    // POST - Add menu item
    @PostMapping
    public ResponseEntity<?> addMenuItem(
            @RequestBody MenuItem menuItem,
            Authentication authentication) {

        Restaurant restaurant =
                getOwnerRestaurant(authentication);

        if (restaurant == null) {
            return ResponseEntity
                    .status(404)
                    .body("Restaurant not found");
        }

        menuItem.setRestaurant(restaurant);

        MenuItem savedItem =
                menuItemRepository.save(menuItem);

        return ResponseEntity.ok(savedItem);
    }

    // POST - Upload menu item image
    @PostMapping("/{id}/image")
    public ResponseEntity<?> uploadMenuItemImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
    
        Restaurant restaurant =
                getOwnerRestaurant(authentication);
    
        if (restaurant == null) {
            return ResponseEntity
                    .status(404)
                    .body("Restaurant not found");
        }
    
        MenuItem existingItem =
                menuItemRepository.findById(id)
                        .orElse(null);
    
        if (existingItem == null) {
            return ResponseEntity
                    .status(404)
                    .body("Menu item not found");
        }
    
        // Security check:
        // Owner can upload image only for
        // their own restaurant's menu item
        if (existingItem.getRestaurant() == null ||
                !existingItem.getRestaurant().getId()
                        .equals(restaurant.getId())) {
    
            return ResponseEntity
                    .status(403)
                    .body("You cannot modify this menu item");
        }
    
        try {
    
            String imageUrl =
                    cloudinaryService.uploadImage(
                            file,
                            "food-appointment/menu-items"
                    );
    
            existingItem.setImageUrl(imageUrl);
    
            MenuItem savedItem =
                    menuItemRepository.save(existingItem);
    
            return ResponseEntity.ok(savedItem);
    
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

    // PUT - Update menu item
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMenuItem(
            @PathVariable Long id,
            @RequestBody MenuItem updatedItem,
            Authentication authentication) {

        Restaurant restaurant =
                getOwnerRestaurant(authentication);

        if (restaurant == null) {
            return ResponseEntity
                    .status(404)
                    .body("Restaurant not found");
        }

        MenuItem existingItem =
                menuItemRepository.findById(id)
                        .orElse(null);

        if (existingItem == null) {
            return ResponseEntity
                    .status(404)
                    .body("Menu item not found");
        }

        // Security check:
        // Owner can update only their own restaurant's item
        if (existingItem.getRestaurant() == null ||
                !existingItem.getRestaurant().getId()
                        .equals(restaurant.getId())) {

            return ResponseEntity
                    .status(403)
                    .body("You cannot modify this menu item");
        }

        existingItem.setName(updatedItem.getName());
        existingItem.setDescription(
                updatedItem.getDescription()
        );
        existingItem.setPrice(updatedItem.getPrice());
        existingItem.setCategory(
                updatedItem.getCategory()
        );

        MenuItem savedItem =
                menuItemRepository.save(existingItem);

        return ResponseEntity.ok(savedItem);
    }

    // DELETE - Delete menu item
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMenuItem(
            @PathVariable Long id,
            Authentication authentication) {

        Restaurant restaurant =
                getOwnerRestaurant(authentication);

        if (restaurant == null) {
            return ResponseEntity
                    .status(404)
                    .body("Restaurant not found");
        }

        MenuItem existingItem =
                menuItemRepository.findById(id)
                        .orElse(null);

        if (existingItem == null) {
            return ResponseEntity
                    .status(404)
                    .body("Menu item not found");
        }

        // Security check
        if (existingItem.getRestaurant() == null ||
                !existingItem.getRestaurant().getId()
                        .equals(restaurant.getId())) {

            return ResponseEntity
                    .status(403)
                    .body("You cannot delete this menu item");
        }

        menuItemRepository.delete(existingItem);

        return ResponseEntity.ok(
                "Menu item deleted successfully"
        );
    }
}