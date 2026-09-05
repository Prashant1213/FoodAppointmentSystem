package com.foodappointment.backend.repository;

import com.foodappointment.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookingRepository
        extends JpaRepository<Booking, Long> {

    Optional<Booking> findByRazorpayOrderId(
            String razorpayOrderId
    );

    List<Booking> findByCustomerEmail(
            String customerEmail
    );

    List<Booking> findByRestaurantId(
            Long restaurantId
    );

    long countByStatus(
            String status
    );

    // Owner dashboard - total bookings
    long countByRestaurantId(
            Long restaurantId
    );

    // Owner dashboard - status-wise bookings
    long countByRestaurantIdAndStatus(
            Long restaurantId,
            String status
    );

    // Admin dashboard - total revenue
    @Query("""
        SELECT COALESCE(SUM(b.advanceAmount), 0)
        FROM Booking b
        WHERE b.status = 'CONFIRMED'
    """)
    Double getTotalRevenue();

    // Owner dashboard - own restaurant revenue
    @Query("""
        SELECT COALESCE(SUM(b.advanceAmount), 0)
        FROM Booking b
        WHERE b.restaurant.id = :restaurantId
          AND b.status = 'CONFIRMED'
    """)
    Double getOwnerRevenue(
            @Param("restaurantId") Long restaurantId
    );

    // Admin monthly report
    @Query("""
        SELECT FUNCTION('YEAR', b.bookingDate),
               FUNCTION('MONTH', b.bookingDate),
               COUNT(b),
               COALESCE(SUM(b.advanceAmount), 0)
        FROM Booking b
        WHERE b.status = 'CONFIRMED'
        GROUP BY FUNCTION('YEAR', b.bookingDate),
                 FUNCTION('MONTH', b.bookingDate)
        ORDER BY FUNCTION('YEAR', b.bookingDate),
                 FUNCTION('MONTH', b.bookingDate)
    """)
    List<Object[]> getMonthlyConfirmedReport();
}