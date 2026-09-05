package com.foodappointment.backend.repository;

import com.foodappointment.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository
        extends JpaRepository<Payment, Long> {
        long countByStatus(String status);
}