package com.foodappointment.backend.controller;

import com.foodappointment.backend.entity.User;
import com.foodappointment.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserRepository userRepository;

    public AdminUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get all users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {

        List<User> users = userRepository.findAll();

        // Never send passwords to frontend
        users.forEach(user -> user.setPassword(null));

        return ResponseEntity.ok(users);
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(
            @PathVariable Long id) {

        User user = userRepository
                .findById(id)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        // Never send password
        user.setPassword(null);

        return ResponseEntity.ok(user);
    }

    // Update user role
    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long id,
            @RequestParam String role,
            Authentication authentication) {
    
        User user = userRepository
                .findById(id)
                .orElse(null);
    
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
    
        String loggedInEmail = authentication.getName();
    
        // Prevent admin from changing their own role
        if (user.getEmail().equals(loggedInEmail)) {
            return ResponseEntity
                    .badRequest()
                    .body("You cannot change your own role");
        }
    
        if (!role.equals("CUSTOMER") &&
            !role.equals("ADMIN")) {
    
            return ResponseEntity
                    .badRequest()
                    .body("Invalid role");
        }
    
        user.setRole(role);
    
        User savedUser = userRepository.save(user);
    
        savedUser.setPassword(null);
    
        return ResponseEntity.ok(savedUser);
    }

    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id,
            Authentication authentication) {
    
        User user = userRepository
                .findById(id)
                .orElse(null);
    
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
    
        String loggedInEmail = authentication.getName();
    
        // Prevent admin from deleting their own account
        if (user.getEmail().equals(loggedInEmail)) {
            return ResponseEntity
                    .badRequest()
                    .body("You cannot delete your own account");
        }
    
        userRepository.delete(user);
    
        return ResponseEntity.ok(
                "User deleted successfully"
        );
    }
}