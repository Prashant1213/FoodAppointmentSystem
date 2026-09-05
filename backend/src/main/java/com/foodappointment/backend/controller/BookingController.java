package com.foodappointment.backend.controller;

import com.foodappointment.backend.dto.CreateBookingRequest;
import com.foodappointment.backend.entity.Booking;
import com.foodappointment.backend.entity.BookingItem;
import com.foodappointment.backend.entity.MenuItem;
import com.foodappointment.backend.entity.Restaurant;
import com.foodappointment.backend.repository.BookingItemRepository;
import com.foodappointment.backend.repository.BookingRepository;
import com.foodappointment.backend.repository.MenuItemRepository;
import com.foodappointment.backend.repository.RestaurantRepository;

import org.springframework.security.core.Authentication;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final BookingItemRepository bookingItemRepository;
    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    public BookingController(
            BookingRepository bookingRepository,
            BookingItemRepository bookingItemRepository,
            RestaurantRepository restaurantRepository,
            MenuItemRepository menuItemRepository) {

        this.bookingRepository = bookingRepository;
        this.bookingItemRepository = bookingItemRepository;
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createBooking(
            @RequestBody CreateBookingRequest request) {

        Restaurant restaurant =
                restaurantRepository.findById(
                        request.getRestaurantId()
                ).orElse(null);

        if (restaurant == null) {
            return ResponseEntity.badRequest()
                    .body("Restaurant not found");
        }

        if (request.getItems() == null ||
                request.getItems().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("No food items selected");
        }

        double totalAmount = 0;

        for (CreateBookingRequest.BookingItemRequest itemRequest
                : request.getItems()) {

            MenuItem menuItem =
                    menuItemRepository.findById(
                            itemRequest.getMenuItemId()
                    ).orElse(null);

            if (menuItem == null) {
                return ResponseEntity.badRequest()
                        .body("Menu item not found");
            }

            if (itemRequest.getQuantity() == null ||
                    itemRequest.getQuantity() < 1) {

                return ResponseEntity.badRequest()
                        .body("Invalid quantity");
            }

            totalAmount +=
                    menuItem.getPrice()
                            * itemRequest.getQuantity();
        }

        double advanceAmount = totalAmount * 0.25;

        Booking booking = new Booking();

        booking.setRestaurant(restaurant);
        booking.setCustomerName(request.getCustomerName());
        booking.setCustomerEmail(request.getCustomerEmail());
        booking.setCustomerPhone(request.getCustomerPhone());
        booking.setBookingDate(request.getBookingDate());
        booking.setBookingTime(request.getBookingTime());
        booking.setNumberOfPeople(request.getNumberOfPeople());
        booking.setSpecialRequest(request.getSpecialRequest());

        booking.setTotalAmount(totalAmount);
        booking.setAdvanceAmount(advanceAmount);

        booking.setStatus("PENDING_PAYMENT");

        Booking savedBooking =
                bookingRepository.save(booking);

        for (CreateBookingRequest.BookingItemRequest itemRequest
                : request.getItems()) {

            MenuItem menuItem =
                    menuItemRepository.findById(
                            itemRequest.getMenuItemId()
                    ).orElseThrow();

            BookingItem bookingItem = new BookingItem();

            bookingItem.setBooking(savedBooking);
            bookingItem.setMenuItem(menuItem);
            bookingItem.setQuantity(
                    itemRequest.getQuantity()
            );
            bookingItem.setPrice(menuItem.getPrice());

            bookingItem.setSubtotal(
                    menuItem.getPrice()
                            * itemRequest.getQuantity()
            );

            bookingItemRepository.save(bookingItem);
        }

        return ResponseEntity.ok(savedBooking);
    }

    @GetMapping("/{id}")
     public ResponseEntity<?> getBooking(
        @PathVariable Long id) {

    return bookingRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
     }

     @GetMapping("/{id}/items")
     public ResponseEntity<?> getBookingItems(
        @PathVariable Long id) {

    if (!bookingRepository.existsById(id)) {
        return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok(
            bookingItemRepository.findByBookingId(id)
    );
   }

   @GetMapping("/my")
   public ResponseEntity<?> getMyBookings(
           Authentication authentication) {
   
       String email = authentication.getName();
   
       List<Booking> bookings =
               bookingRepository.findByCustomerEmail(email);
   
       return ResponseEntity.ok(bookings);
   }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(
            @PathVariable Long id,
            Authentication authentication) {
    
        String email = authentication.getName();
    
        Booking booking = bookingRepository
                .findById(id)
                .orElse(null);
    
        if (booking == null) {
            return ResponseEntity
                    .notFound()
                    .build();
        }
    
        if (!booking.getCustomerEmail().equals(email)) {
            return ResponseEntity
                    .status(403)
                    .body("You cannot cancel this booking");
        }
    
        if ("CANCELLED".equals(booking.getStatus())) {
            return ResponseEntity
                    .badRequest()
                    .body("Booking is already cancelled");
        }
    
        booking.setStatus("CANCELLED");
    
        Booking savedBooking =
                bookingRepository.save(booking);
    
        return ResponseEntity.ok(savedBooking);
    }
}