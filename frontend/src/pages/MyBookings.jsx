import { useEffect, useState } from 'react'
import api from '../axios'
import { Link } from 'react-router-dom'

function MyBookings() {

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    const fetchBookings = async () => {

      try {

        const response = await api.get(
          '/api/bookings/my'
        )

        setBookings(response.data)

      } catch (error) {

        console.error(error)
        setError('Unable to load bookings')

      } finally {

        setLoading(false)

      }
    }

    fetchBookings()

  }, [])

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <p>Loading bookings...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">

      <h2 className="fw-bold mb-4">
        My Bookings
      </h2>

      {bookings.length === 0 ? (

        <div className="alert alert-info">
          You don't have any bookings yet.
        </div>

      ) : (

        <div className="row g-4">

          {bookings.map((booking) => (

            <div
              className="col-md-6 col-lg-4"
              key={booking.id}
            >

              <div className="card shadow-sm h-100">

                <div className="card-body">

                  <div className="d-flex justify-content-between">

                    <h5 className="fw-bold">
                      {booking.restaurant.name}
                    </h5>

                    <span
                      className={`badge ${
                        booking.status === 'CONFIRMED' ||
                        booking.status === 'COMPLETED'
                          ? 'bg-success'
                          : booking.status === 'CANCELLED'
                            ? 'bg-danger'
                            : 'bg-warning text-dark'
                      }`}
                    >
                      {booking.status}
                    </span>

                  </div>

                  <hr />

                  <p className="mb-2">
                    <strong>Booking ID:</strong>{' '}
                    #{booking.id}
                  </p>

                  <p className="mb-2">
                    <strong>Date:</strong>{' '}
                    {booking.bookingDate}
                  </p>

                  <p className="mb-2">
                    <strong>Time:</strong>{' '}
                    {booking.bookingTime}
                  </p>

                  <p className="mb-2">
                    <strong>People:</strong>{' '}
                    {booking.numberOfPeople}
                  </p>

                  <p className="mb-2">
                    <strong>Total:</strong>{' '}
                    ₹{booking.totalAmount}
                  </p>

                  <p className="mb-0">
                    <strong>Advance:</strong>{' '}
                    ₹{booking.advanceAmount}
                  </p>

                  <Link
                    to={`/booking/${booking.id}`}
                    className="btn btn-primary w-100 mt-3"
                  >
                    View Details
                  </Link>

                  {booking.status === 'COMPLETED' && (
                    <Link
                      to={`/review/${booking.id}`}
                      className="btn btn-warning w-100 mt-2"
                    >
                      ⭐ Write Review
                    </Link>
                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  )
}

export default MyBookings