import { useEffect, useState } from 'react'
import api from '../axios'
import { Link } from 'react-router-dom'

function OwnerDashboard() {
  const [restaurant, setRestaurant] = useState(null)
  const [dashboard, setDashboard] = useState(null)
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRestaurant()
    fetchDashboard()
    fetchRecentBookings()
  }, [])

  const fetchRestaurant = async () => {
    try {
      const response = await api.get('/api/owner/restaurant')
      setRestaurant(response.data)
    } catch (error) {
      console.error('Failed to load restaurant:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/api/owner/dashboard')
      setDashboard(response.data)
    } catch (error) {
      console.error('Failed to load dashboard:', error)
    }
  }

  const fetchRecentBookings = async () => {
      try {
        const response = await api.get('/api/owner/bookings')
    
        const sortedBookings = [...response.data]
          .sort((a, b) => b.id - a.id)
          .slice(0, 5)
    
        setRecentBookings(sortedBookings)
      } catch (error) {
        console.error('Failed to load recent bookings:', error)
      }
    }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h4>Loading...</h4>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Restaurant information could not be loaded.
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Owner Dashboard</h2>
          <p className="text-muted mb-0">
            Manage your restaurant
          </p>
        </div>

        <span className="badge bg-primary fs-6">
          Restaurant Owner
        </span>
      </div>

      <div className="row g-4">

        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">My Restaurant</h5>

              <h4 className="mt-3">
                {restaurant.name}
              </h4>

              <p className="mb-1">
                📍 {restaurant.location}
              </p>

              <p className="mb-1">
                🍴 {restaurant.cuisine}
              </p>

              <p className="mb-0">
                ⭐ {restaurant.rating}
              </p>

              <Link
                to="/owner/restaurant"
                className="btn btn-primary mt-3"
              >
                Manage Restaurant
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Menu</h5>

              <p className="text-muted mt-3">
                Manage your restaurant menu items.
              </p>

              <Link
                 to="/owner/menu"
                 className="btn btn-primary"
              >
                 Manage Menu
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Bookings</h5>

              <p className="text-muted mt-3">
                View and manage customer bookings.
              </p>

              <Link
                to="/owner/bookings"
                className="btn btn-success"
              >
                View Bookings
              </Link>
            </div>
          </div>
        </div>

      </div>

      {dashboard && (
  <div className="row g-4 mt-4">

    <div className="col-md-4">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <h6 className="text-muted">Menu Items</h6>
          <h2>{dashboard.totalMenuItems}</h2>
        </div>
      </div>
    </div>

    <div className="col-md-4">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <h6 className="text-muted">Total Bookings</h6>
          <h2>{dashboard.totalBookings}</h2>
        </div>
      </div>
    </div>

    <div className="col-md-4">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <h6 className="text-muted">Revenue</h6>
          <h2>₹{dashboard.revenue}</h2>
        </div>
      </div>
    </div>

    <div className="col-md-3">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <h6 className="text-muted">Confirmed</h6>
          <h3>{dashboard.confirmedBookings}</h3>
        </div>
      </div>
    </div>

    <div className="col-md-3">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <h6 className="text-muted">Pending</h6>
          <h3>{dashboard.pendingBookings}</h3>
        </div>
      </div>
    </div>

    <div className="col-md-3">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <h6 className="text-muted">Cancelled</h6>
          <h3>{dashboard.cancelledBookings}</h3>
        </div>
      </div>
    </div>

    <div className="col-md-3">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <h6 className="text-muted">Completed</h6>
          <h3>{dashboard.completedBookings}</h3>
        </div>
      </div>
    </div>

  </div>
)}

<div className="card shadow-sm mt-4">
  <div className="card-body">

    <div className="d-flex justify-content-between align-items-center mb-3">
      <h5 className="mb-0">Recent Bookings</h5>

      <Link
        to="/owner/bookings"
        className="btn btn-sm btn-outline-primary"
      >
        View All
      </Link>
    </div>

    {recentBookings.length === 0 ? (

      <div className="alert alert-light mb-0">
        No recent bookings found.
      </div>

    ) : (

      <div className="table-responsive">

        <table className="table table-hover align-middle mb-0">

          <thead className="table-light">
            <tr>
              <th>Booking</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Time</th>
              <th>People</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {recentBookings.map((booking) => (

              <tr key={booking.id}>

                <td>
                  <strong>
                    #{booking.id}
                  </strong>
                </td>

                <td>
                  {booking.customerName}
                </td>

                <td>
                  {booking.bookingDate}
                </td>

                <td>
                  {booking.bookingTime}
                </td>

                <td>
                  {booking.numberOfPeople}
                </td>

                <td>
                  ₹{booking.totalAmount}
                </td>

                <td>
                  <span className="badge bg-secondary">
                    {booking.status}
                  </span>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    )}

  </div>
</div>

      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <h5>Restaurant Information</h5>

          <div className="row mt-3">
            <div className="col-md-6">
              <strong>Name:</strong> {restaurant.name}
            </div>

            <div className="col-md-6">
              <strong>Location:</strong> {restaurant.location}
            </div>

            <div className="col-md-6 mt-2">
              <strong>Cuisine:</strong> {restaurant.cuisine}
            </div>

            <div className="col-md-6 mt-2">
              <strong>Rating:</strong> ⭐ {restaurant.rating}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default OwnerDashboard