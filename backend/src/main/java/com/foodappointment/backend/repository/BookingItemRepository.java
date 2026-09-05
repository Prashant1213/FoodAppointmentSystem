package com.foodappointment.backend.repository;

import com.foodappointment.backend.entity.BookingItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingItemRepository
        extends JpaRepository<BookingItem, Long> {

        List<BookingItem> findByBookingId(Long bookingId);
}