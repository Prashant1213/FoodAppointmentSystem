import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Restaurants from './pages/Restaurants'
import Login from './pages/Login'
import Register from './pages/Register'
import RestaurantDetails from './pages/RestaurantDetails'
import Booking from './pages/Booking'
import ReviewBooking from './pages/ReviewBooking'
import { BookingProvider } from './context/BookingContext'
import Confirmation from './pages/Confirmation'
import MyBookings from './pages/MyBookings'
import BookingDetails from './pages/BookingDetails'
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import AdminRestaurants from "./pages/AdminRestaurants";
import AdminMenuItems from "./pages/AdminMenuItems";
import AdminBookings from "./pages/AdminBookings";
import AdminUsers from "./pages/AdminUsers";
import AdminPayments from "./pages/AdminPayments";
import AdminMonthlyReports from "./pages/AdminMonthlyReports";
import OwnerRoute from './components/OwnerRoute'
import OwnerDashboard from './pages/OwnerDashboard'
import OwnerRestaurant from './pages/OwnerRestaurant'
import OwnerMenu from './pages/OwnerMenu'
import OwnerBookings from './pages/OwnerBookings'
import OwnerBookingDetails from './pages/OwnerBookingDetails'
import Review from './pages/Review'

function App() {
  return (
    <BrowserRouter>
     <BookingProvider>
      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/restaurants"
          element={<Restaurants />}
        />

        <Route
          path="/restaurants/:id"
          element={<RestaurantDetails />}
        />

        <Route
          path="/review-booking"
          element={<ReviewBooking />}
        />

        <Route
          path="/review/:bookingId"
          element={
            <ProtectedRoute>
              <Review />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking"
          element={<Booking />}
        />

        <Route
          path="/confirmation/:id"
          element={<Confirmation />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/my-bookings"
          element={<ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>}
        />

        <Route
          path="/booking/:id"
          element={<ProtectedRoute>
                    <BookingDetails />
                  </ProtectedRoute>}
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/restaurants"
          element={
            <AdminRoute>
              <AdminRestaurants />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/menu-items"
          element={
            <AdminRoute>
              <AdminMenuItems />
            </AdminRoute>
          }
        />
        
        <Route
          path="/admin/bookings"
          element={
            <AdminRoute>
              <AdminBookings />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/payments"
          element={
            <AdminRoute>
              <AdminPayments />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/reports/monthly"
          element={
            <AdminRoute>
              <AdminMonthlyReports />
            </AdminRoute>
          }
        />

        <Route
          path="/owner/dashboard"
          element={
            <OwnerRoute>
              <OwnerDashboard />
            </OwnerRoute>
          }
        />

        <Route
          path="/owner/restaurant"
          element={
            <OwnerRoute>
              <OwnerRestaurant />
            </OwnerRoute>
          }
        />

        <Route
          path="/owner/menu"
          element={
            <OwnerRoute>
              <OwnerMenu />
            </OwnerRoute>
          }
        />

        <Route
          path="/owner/bookings"
          element={
            <OwnerRoute>
              <OwnerBookings />
            </OwnerRoute>
          }
        />

        <Route
          path="/owner/bookings/:id"
          element={
            <OwnerRoute>
              <OwnerBookingDetails />
            </OwnerRoute>
          }
        />



      </Routes>
     </BookingProvider>
    </BrowserRouter>
  )
}

export default App