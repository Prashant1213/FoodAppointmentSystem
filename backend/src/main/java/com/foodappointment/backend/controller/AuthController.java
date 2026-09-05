package com.foodappointment.backend.controller;

import com.foodappointment.backend.dto.LoginRequest;
import com.foodappointment.backend.dto.RegisterRequest;
import com.foodappointment.backend.entity.User;
import com.foodappointment.backend.repository.UserRepository;
import com.foodappointment.backend.service.JwtService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.foodappointment.backend.dto.RegisterOwnerRequest;
import com.foodappointment.backend.entity.Restaurant;
import com.foodappointment.backend.repository.RestaurantRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RestaurantRepository restaurantRepository;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
        JwtService jwtService,
        RestaurantRepository restaurantRepository) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.restaurantRepository = restaurantRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        if (userRepository.existsByEmail(
                request.getEmail())) {

            return ResponseEntity.badRequest()
                    .body("Email already registered");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setRole("CUSTOMER");

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(
        "Registration successful"
        );
    }

    @PostMapping("/register-owner")
    public ResponseEntity<?> registerOwner(
            @RequestBody RegisterOwnerRequest request) {
    
        // Check email
        if (userRepository.existsByEmail(request.getEmail())) {
    
            return ResponseEntity.badRequest()
                    .body("Email already registered");
        }
    
        // Create owner user
        User user = new User();
    
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
    
        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );
    
        user.setRole("RESTAURANT_OWNER");
    
        User savedUser = userRepository.save(user);
    
        // Create restaurant
        Restaurant restaurant = new Restaurant();
    
        restaurant.setName(request.getRestaurantName());
        restaurant.setLocation(request.getLocation());
        restaurant.setCuisine(request.getCuisine());
        restaurant.setRating(0.0);
    
        // Link restaurant to owner
        restaurant.setOwner(savedUser);
    
        Restaurant savedRestaurant =
                restaurantRepository.save(restaurant);
    
        return ResponseEntity.ok(
                java.util.Map.of(
                        "message", "Owner registration successful",
                        "userId", savedUser.getId(),
                        "restaurantId", savedRestaurant.getId()
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
        @RequestBody LoginRequest request) {
    
        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);
    
        if (user == null) {
            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password");
        }
    
        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );
    
        if (!passwordMatches) {
            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password");
        }
    
        String token =
        jwtService.generateToken(user.getEmail(),user.getRole());

        return ResponseEntity.ok(
                java.util.Map.of(
                        "message", "Login successful",
                        "token", token,
                        "userId", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "role", user.getRole()
                )
        );
   }
}