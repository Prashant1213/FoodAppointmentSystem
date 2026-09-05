package com.foodappointment.backend.service;

import com.foodappointment.backend.entity.Booking;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendBookingConfirmation(Booking booking) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(booking.getCustomerEmail());

        message.setSubject(
                "Food Appointment - Booking Confirmed"
        );

        String emailBody =
                "Hello " +
                booking.getCustomerName() +
                ",\n\n" +

                "Your food appointment has been confirmed.\n\n" +

                "Booking ID: #" +
                booking.getId() + "\n" +

                "Restaurant: " +
                booking.getRestaurant().getName() + "\n" +

                "Date: " +
                booking.getBookingDate() + "\n" +

                "Time: " +
                booking.getBookingTime() + "\n" +

                "Number of People: " +
                booking.getNumberOfPeople() + "\n\n" +

                "Total Amount: ₹" +
                booking.getTotalAmount() + "\n" +

                "Paid Amount (25%): ₹" +
                booking.getAdvanceAmount() + "\n" +

                "Remaining Amount: ₹" +
                (
                    booking.getTotalAmount()
                    - booking.getAdvanceAmount()
                ) + "\n\n" +

                "Booking Status: " +
                booking.getStatus() + "\n\n" +

                "Thank you for using Food Appointment System!";

        message.setText(emailBody);

        mailSender.send(message);
    }
}