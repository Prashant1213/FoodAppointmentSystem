package com.foodappointment.backend.controller;

import com.foodappointment.backend.dto.ChangePasswordRequest;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.foodappointment.backend.entity.User;
import com.foodappointment.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository,
        PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        user.setPassword(null);

        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(
            Authentication authentication,
            @RequestBody User updatedUser) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        user.setName(updatedUser.getName());
        user.setPhone(updatedUser.getPhone());

        User savedUser = userRepository.save(user);

        savedUser.setPassword(null);

        return ResponseEntity.ok(savedUser);
    }

        @PutMapping("/change-password")
        public ResponseEntity<?> changePassword(
                Authentication authentication,
                @RequestBody ChangePasswordRequest request) {
        
            String email = authentication.getName();
        
            User user = userRepository.findByEmail(email).orElse(null);
        
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
        
            if (!passwordEncoder.matches(
                    request.getCurrentPassword(),
                    user.getPassword())) {
        
                return ResponseEntity.badRequest()
                        .body("Current password is incorrect");
            }
        
            if (!request.getNewPassword().equals(
                    request.getConfirmPassword())) {
        
                return ResponseEntity.badRequest()
                        .body("New password and confirm password do not match");
            }
        
            if (request.getNewPassword().length() < 6) {
        
                return ResponseEntity.badRequest()
                        .body("New password must be at least 6 characters");
            }
        
            user.setPassword(
                    passwordEncoder.encode(request.getNewPassword())
            );
        
            userRepository.save(user);
        
            return ResponseEntity.ok(
                    "Password changed successfully"
            );
        }
}