package com.foodappointment.backend.repository;

import com.foodappointment.backend.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RestaurantRepository
    extends JpaRepository<Restaurant, Long> {

    Optional<Restaurant> findByOwnerId(Long ownerId);
}