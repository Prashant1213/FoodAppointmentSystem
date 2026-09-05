import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../axios'

function OwnerBookings() {
  const navigate = useNavigate()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await api.get('/api/owner/bookings')
      setBookings(response.data)
    } catch (error) {
      console.error(error)
      setMessage('Unable to load bookings.')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await api.put(
        `/api/owner/bookings/${id}/status?status=${status}`
      )

      setMessage(`Booking status changed to ${status}.`)

      fetchBookings()
    } catch (error) {
      console.error(error)

      if (error.response?.data) {
        setMessage(error.response.data)
      } else {
        setMessage('Failed to update booking status.')
      }
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-success'

      case 'CANCELLED':
        return 'bg-danger'

      case 'COMPLETED':
        return 'bg-primary'

      case 'PENDING_PAYMENT':
        return 'bg-warning text-dark'

      default:
        return 'bg-secondary'
    }
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h4>Loading bookings...</h4>
      </div>
    )
  }

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>My Bookings</h2>

          <p className="text-muted mb-0">
            Manage bookings for your restaurant
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => navigate('/owner/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>

      {message && (
        <div className="alert alert-info">
          {message}
        </div>
      )}

      {bookings.length === 0 ? (

        <div className="card shadow-sm">
          <div className="card-body text-center py-5">

            <h5>No bookings found</h5>

            <p className="text-muted">
              Customer bookings for your restaurant will appear here.
            </p>

          </div>
        </div>

      ) : (

        <div className="card shadow-sm">

          <div className="card-body">

            <div className="table-responsive">

              <table className="table table-bordered table-hover align-middle">

                <thead className="table-light">

                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>People</th>
                    <th>Total</th>
                    <th>Advance</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {bookings.map((booking) => (

                    <tr key={booking.id}>

                      <td>
                        #{booking.id}
                      </td>

                      <td>
                        <strong>
                          {booking.customerName}
                        </strong>

                        <br />

                        <small className="text-muted">
                          {booking.customerEmail}
                        </small>
                      </td>

                      <td>
                        {booking.customerPhone}
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
                        ₹{booking.advanceAmount}
                      </td>

                      <td>
                        <span
                          className={`badge ${getStatusClass(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>

                      <td>

                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() =>
                            navigate(`/owner/bookings/${booking.id}`)
                          }
                        >
                          View
                        </button>

                        {booking.status === 'PENDING_PAYMENT' && (
                          <>
                            <button
                              className="btn btn-sm btn-success me-1"
                              onClick={() =>
                                updateStatus(
                                  booking.id,
                                  'CONFIRMED'
                                )
                              }
                            >
                              Confirm
                            </button>

                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() =>
                                updateStatus(
                                  booking.id,
                                  'CANCELLED'
                                )
                              }
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        {booking.status === 'CONFIRMED' && (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                              updateStatus(
                                booking.id,
                                'COMPLETED'
                              )
                            }
                          >
                            Complete
                          </button>
                        )}

                        {(booking.status === 'CANCELLED' ||
                          booking.status === 'COMPLETED') && (
                          <span className="text-muted">
                            No action
                          </span>
                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default OwnerBookings