# 🍽️ Food Appointment System

A full-stack restaurant food appointment and booking system built using **React.js, Spring Boot, and MySQL**.

The application allows customers to discover restaurants, view menus, select food items, book appointments, pay a 25% advance amount through Razorpay, receive email confirmation, and manage their bookings.

The system also provides separate features for **Admin** and **Restaurant Owner** users.

---

## 📌 Project Overview

The Food Appointment System is designed to provide a complete digital booking experience for restaurants.

Customers can:

- Register and login
- Browse restaurants
- View restaurant details
- Explore food menus
- Select food items
- Select appointment date and time
- Select number of people
- Create a booking
- Pay 25% advance payment
- Receive booking confirmation by email
- View and manage their bookings
- Cancel eligible bookings
- Submit restaurant reviews and ratings

The application also provides management functionality for Admin and Restaurant Owners.

---

# 🚀 Main Features

## 👤 Customer Features

- Customer registration
- Customer login
- JWT-based authentication
- Browse restaurants
- View restaurant details
- View restaurant menu
- View menu item images
- Add food items to booking
- Select booking date
- Select booking time
- Select number of people
- Enter customer details
- Create booking
- Automatic total amount calculation
- 25% advance payment
- Razorpay payment integration
- Razorpay payment verification
- Booking confirmation
- Email confirmation
- My Bookings
- Booking details
- Booking cancellation
- Restaurant reviews
- Rating from 1 to 5
- Customer profile management
- Change password
- Logout

---

# 👨‍💼 Admin Features

The Admin has access to a separate Admin Dashboard.

## Dashboard

The Admin Dashboard provides information such as:

- Total Users
- Total Restaurants
- Total Menu Items
- Total Bookings
- Confirmed Bookings
- Pending Bookings
- Cancelled Bookings
- Total Revenue
- Total Payments
- Successful Payments
- Monthly Booking Reports

## Restaurant Management

Admin can:

- Add restaurant
- View restaurants
- Update restaurant
- Delete restaurant

## Menu Management

Admin can:

- Add menu items
- View menu items
- Update menu items
- Delete menu items

## Booking Management

Admin can:

- View all bookings
- View booking details
- Update booking status

## User Management

Admin can:

- View users
- View user details
- Change user role
- Delete users
- Prevent accidental deletion of own account

## Payment Management

Admin can:

- View payment information
- View successful payments
- Monitor payment records

## Reports

Admin can view monthly confirmed booking reports.

---

# 🍴 Restaurant Owner Features

Restaurant Owners have access to their own restaurant menu management.

Restaurant Owners can:

- Register as a Restaurant Owner
- Login
- Access owner-protected APIs
- View their own menu items
- Add menu items
- Update menu items
- Delete menu items
- Upload menu item images

### Owner Data Isolation

Restaurant Owners can only manage menu items belonging to their own restaurant.

One restaurant owner cannot modify another restaurant owner's menu items.

---

# 💳 Razorpay Payment Integration

The application uses **Razorpay Test Mode** for online advance payments.

Customers pay:

> **25% of the total booking amount as advance payment**

The remaining amount can be handled according to the restaurant's payment process.

## Payment Flow

```text
Customer selects food
        ↓
Customer selects date/time
        ↓
Booking is created
        ↓
Booking Status = PENDING_PAYMENT
        ↓
Razorpay Order is Created
        ↓
Razorpay Checkout Opens
        ↓
Customer Completes Payment
        ↓
Payment Signature is Verified
        ↓
Payment is Saved
        ↓
Booking Status = CONFIRMED
        ↓
Confirmation Email is Sent

----------------------------------------------------------------------
Payment Security

The backend verifies the Razorpay payment signature before confirming the booking.

The system also prevents:

Unauthorized payment access
Payment verification for another customer's booking
Re-verification of an already confirmed booking
Invalid payment signatures
📧 Email Confirmation

The application sends a booking confirmation email after successful payment.

The email can contain information such as:

Customer name
Restaurant name
Booking details
Payment details
Booking confirmation status

Gmail SMTP is used for sending emails.

☁️ Cloudinary Image Upload

Cloudinary is used for image storage.

The application supports images for:

Restaurants
Menu Items

Instead of storing image files directly in the database, the application stores the image URL.

🔐 Authentication & Security

The application uses JWT authentication with Spring Security.

Security Features
User registration
Secure login
BCrypt password hashing
JWT token generation
JWT token validation
Role-based authorization
Protected APIs
Customer authorization
Admin authorization
Restaurant Owner authorization
Booking ownership validation
Payment ownership validation
Review ownership validation
Restaurant Owner data isolation
Admin self-protection
👥 User Roles

The application supports three main roles:

CUSTOMER
RESTAURANT_OWNER
ADMIN
CUSTOMER

Customers can:

Browse restaurants
Book appointments
Make payments
View bookings
Cancel bookings
Submit reviews
RESTAURANT_OWNER

Restaurant Owners can:

Manage their restaurant menu
Add menu items
Update menu items
Delete menu items
Upload menu images
ADMIN

Admins can:

Manage users
Manage restaurants
Manage menu items
Manage bookings
View payments
View dashboard statistics
View monthly reports
🛠️ Technology Stack
Frontend
React.js
Vite
JavaScript
React Router
Axios
Bootstrap 5
Backend
Java 21
Spring Boot
Spring Security
Spring Data JPA
Hibernate
JWT
BCrypt
Maven
Database
MySQL 8
External Services
Razorpay
Gmail SMTP
Cloudinary
Development & Testing Tools
Visual Studio Code
IntelliJ IDEA
Postman
Git
GitHub
📁 Project Structure
FoodAppointmentSystem/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── axios.js
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   │
│   │   └── test/
│   │
│   ├── pom.xml
│   └── ...
│
├── .gitignore
└── README.md
🗄️ Main Database Entities

The application uses MySQL with Spring Data JPA and Hibernate.

Main entities include:

User
Restaurant
MenuItem
Booking
BookingItem
Payment
Review
Entity Relationship Overview
User
 │
 └── Booking
       │
       ├── BookingItem
       │       │
       │       └── MenuItem
       │
       └── Payment


Restaurant
 │
 ├── MenuItem
 │
 ├── Booking
 │
 └── Review
🔄 Customer Booking Flow
Register / Login
        ↓
Browse Restaurants
        ↓
Select Restaurant
        ↓
View Restaurant Details
        ↓
View Menu
        ↓
Select Food Items
        ↓
Select Date & Time
        ↓
Enter Customer Details
        ↓
Create Booking
        ↓
Review Booking
        ↓
Pay 25% Advance
        ↓
Razorpay Checkout
        ↓
Payment Verification
        ↓
Booking Confirmed
        ↓
Confirmation Email
        ↓
My Bookings
        ↓
Booking Details
📡 Important REST APIs
Authentication
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
PUT  /api/auth/me
PUT  /api/auth/change-password
Restaurants
GET /api/restaurants
GET /api/restaurants/{id}
Menu Items
GET /api/menu-items/restaurant/{restaurantId}
Customer Bookings
POST /api/bookings
GET  /api/bookings/my
GET  /api/bookings/{id}
GET  /api/bookings/{id}/items
PUT  /api/bookings/{id}/cancel
Payments
POST /api/payment/create-order/{bookingId}
POST /api/payment/verify
Reviews
POST /api/reviews
GET  /api/reviews/restaurant/{restaurantId}
GET  /api/reviews/booking/{bookingId}
Admin
GET    /api/admin/dashboard

GET    /api/admin/restaurants
POST   /api/admin/restaurants
PUT    /api/admin/restaurants/{id}
DELETE /api/admin/restaurants/{id}

GET    /api/admin/menu-items
POST   /api/admin/menu-items
PUT    /api/admin/menu-items/{id}
DELETE /api/admin/menu-items/{id}

GET    /api/admin/bookings
PUT    /api/admin/bookings/{id}/status

GET    /api/admin/users
PUT    /api/admin/users/{id}/role
DELETE /api/admin/users/{id}

GET    /api/admin/reports/monthly
Restaurant Owner
GET    /api/owner/menu-items
POST   /api/owner/menu-items
PUT    /api/owner/menu-items/{id}
DELETE /api/owner/menu-items/{id}
⚙️ Local Setup
Prerequisites

Install the following:

Java 21
Node.js
npm
MySQL 8
Git
1. Clone the Repository
git clone <your-github-repository-url>
cd Food-Appointment-System
2. Database Setup

Create the MySQL database:

CREATE DATABASE food_appointment_db;

Configure the database connection in your local Spring Boot configuration.

3. Backend Configuration

The actual local configuration file is:

backend/src/main/resources/application.properties

This file contains private credentials and should not be committed to GitHub.

Use:

backend/src/main/resources/application.example.properties

as the configuration template.

Configure your own local values for:

spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

spring.mail.username=YOUR_GMAIL
spring.mail.password=YOUR_GMAIL_APP_PASSWORD

razorpay.key.id=YOUR_RAZORPAY_KEY_ID
razorpay.key.secret=YOUR_RAZORPAY_KEY_SECRET

jwt.secret=YOUR_JWT_SECRET

cloudinary.cloud-name=YOUR_CLOUD_NAME
cloudinary.api-key=YOUR_CLOUDINARY_API_KEY
cloudinary.api-secret=YOUR_CLOUDINARY_API_SECRET

Do not publish real secrets in the repository.

4. Run Backend

Open a terminal:

cd backend

Run:

mvn spring-boot:run

Backend:

http://localhost:8080
5. Run Frontend

Open another terminal:

cd frontend

Install dependencies:

npm install

Run the development server:

npm run dev

Frontend:

http://localhost:5173
🔒 Security & Secrets

The project intentionally keeps sensitive configuration outside the Git repository.

The following information must never be committed:

Database password
Gmail App Password
Razorpay Secret
Cloudinary API Secret
JWT Secret
Production API credentials
Other private credentials

The local:

application.properties

file is ignored using .gitignore.

The repository contains an example configuration:

application.example.properties

with placeholder values.

🧪 API Testing

The backend APIs were tested using Postman.

Testing includes:

Authentication
Customer registration
Customer login
JWT authentication
Protected API access
Invalid authentication
Booking
Booking creation
Booking ownership
Cross-user booking protection
Cross-restaurant menu item validation
Booking cancellation
Completed booking protection
Payment
Razorpay order creation
Payment verification
Invalid signature handling
Payment ownership
Duplicate payment protection
Reviews
Rating validation
Comment length validation
Booking ownership
Completed booking requirement
Duplicate review protection
Admin
Admin authorization
Customer access protection
Restaurant Owner access protection
Dashboard access
User management
Restaurant management
Menu management
Booking management
Restaurant Owner
Owner authorization
Own restaurant menu access
Menu CRUD operations
Cross-owner access protection
📊 Booking Status Flow
PENDING_PAYMENT
       │
       │ Successful Payment
       ↓
   CONFIRMED
       │
       │ Restaurant completes booking
       ↓
   COMPLETED

Cancellation is available for eligible bookings:

PENDING_PAYMENT / CONFIRMED
          │
          ↓
      CANCELLED
⭐ Review System

Customers can submit a review for a completed booking.

Review includes:

Rating
Comment
Customer information
Restaurant
Booking
Creation date

Rating range:

1 ⭐ to 5 ⭐

The restaurant's average rating is recalculated when a review is submitted.

🖥️ Application Pages

The frontend contains pages for:

Home
Restaurants
Restaurant Details
Menu
Booking
Review Booking
Confirmation
My Bookings
Booking Details
Customer Details
Review
Login
Register
Profile
Admin Dashboard
Admin Restaurants
Admin Menu
Admin Bookings
Admin Users
Admin Payments
Admin Reports
Restaurant Owner Menu Management
📸 Screenshots

Screenshots can be added here to demonstrate the working application.

Recommended screenshots:

Home Page
Restaurant List
Restaurant Details
Menu
Booking Page
Review Booking
Razorpay Checkout
Booking Confirmation
My Bookings
Booking Details
Customer Profile
Admin Dashboard
Admin Restaurant Management
Admin Menu Management
Admin Booking Management
Admin User Management
Restaurant Owner Menu Management

Example:

## Home Page

Add screenshot here.
🔮 Future Improvements

Possible future improvements include:

Restaurant table availability
Automatic table allocation
Real-time availability
Refund management
SMS notifications
Advanced analytics
Restaurant search
Menu search
Food category filtering
Customer favorites
Coupon and discount system
Restaurant Owner Dashboard
Better reporting
Production payment integration
Cloud deployment
Mobile application
🌐 Deployment

The application is currently designed to run locally during development.

Possible future deployment architecture:

React Frontend
      ↓
Cloud Hosting
      ↓
Spring Boot Backend
      ↓
MySQL Database
      ↓
Razorpay
      ↓
Cloudinary
      ↓
Gmail SMTP
🎯 Project Highlights

This project demonstrates practical implementation of:

Full-stack web development
REST API development
React.js frontend development
Spring Boot backend development
MySQL database integration
Spring Data JPA
JWT authentication
Spring Security
Role-based authorization
BCrypt password hashing
Razorpay payment integration
Payment signature verification
Gmail email integration
Cloudinary image management
CRUD operations
Entity relationships
API validation
Ownership-based authorization
Admin management
Restaurant Owner management
Postman API testing
Git and GitHub version control
👨‍💻 Project Information

Project Name: Food Appointment System

Type: Full-Stack Web Application

Frontend: React.js

Backend: Spring Boot

Database: MySQL

Authentication: JWT + Spring Security

Payment: Razorpay

Email: Gmail SMTP

Image Storage: Cloudinary

📌 Note

This project is intended for learning, demonstration, and development purposes.

Razorpay is currently configured for test/development usage.

Sensitive credentials are not included in the repository.