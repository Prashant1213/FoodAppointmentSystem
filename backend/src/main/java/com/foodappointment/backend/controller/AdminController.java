package com.foodappointment.backend.controller;

import com.foodappointment.backend.repository.UserRepository;
import com.foodappointment.backend.repository.RestaurantRepository;
import com.foodappointment.backend.repository.MenuItemRepository;
import com.foodappointment.backend.repository.BookingRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.foodappointment.backend.repository.PaymentRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    public AdminController(
            UserRepository userRepository,
            RestaurantRepository restaurantRepository,
            MenuItemRepository menuItemRepository,
            BookingRepository bookingRepository,
            PaymentRepository paymentRepository) {

        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
    }

    @GetMapping("/test")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminTest() {
        return "Admin access successful";
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> dashboard() {

        Map<String, Object> stats = new HashMap<>();

        stats.put("totalUsers", userRepository.count());
        stats.put("totalRestaurants", restaurantRepository.count());
        stats.put("totalMenuItems", menuItemRepository.count());
        stats.put("totalBookings", bookingRepository.count());

    stats.put(
    "confirmedBookings",
    bookingRepository.countByStatus("CONFIRMED")
    );

    stats.put(
        "pendingPayments",
        bookingRepository.countByStatus("PENDING_PAYMENT")
    );
    
    stats.put(
        "cancelledBookings",
        bookingRepository.countByStatus("CANCELLED")
    );

    stats.put(
        "totalRevenue",
        bookingRepository.getTotalRevenue()
    );

    stats.put(
        "totalPayments",
        paymentRepository.count()
    );
    
    stats.put(
        "successfulPayments",
        paymentRepository.countByStatus("SUCCESS")
    );

        return stats;
    }

    @GetMapping("/reports/monthly")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getMonthlyReport() {
    
        List<Object[]> results = bookingRepository.getMonthlyConfirmedReport();
    
        List<Map<String, Object>> report = new ArrayList<>();
    
        for (Object[] row : results) {
    
            Map<String, Object> data = new HashMap<>();
    
            data.put("year", row[0]);
            data.put("month", row[1]);
            data.put("bookings", row[2]);
            data.put("revenue", row[3]);
    
            report.add(data);
        }
    
        return ResponseEntity.ok(report);
    }
}