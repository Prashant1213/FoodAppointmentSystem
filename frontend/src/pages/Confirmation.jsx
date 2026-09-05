import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../axios'

function Confirmation() {
  const { id } = useParams()

  const [booking, setBooking] = useState(null)
  const [bookingItems, setBookingItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const bookingResponse = await api.get(
          `/api/bookings/${id}`
        )

        const itemsResponse = await api.get(
          `/api/bookings/${id}/items`
        )

        setBooking(bookingResponse.data)
        setBookingItems(itemsResponse.data)
        setLoading(false)

      } catch (error) {
        console.error(error)

        setError('Unable to load booking details')
        setLoading(false)
      }
    }

    fetchBooking()
  }, [id])

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <p>Loading booking...</p>
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

  if (!booking) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Booking not found.
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">

      {/* Success Header */}
      <div className="text-center mb-5">

        <div className="display-1">
          ✅
        </div>

        <h1 className="fw-bold">
          Booking Confirmed!
        </h1>

        <p className="text-muted">
          Your food appointment has been successfully confirmed.
        </p>

      </div>

      <div className="row justify-content-center">

        <div className="col-lg-8">

          <div className="card shadow-sm border-0">

            <div className="card-body p-4">

              {/* Booking Details */}
              <h4 className="fw-bold mb-4">
                Booking Details
              </h4>

              <div className="row g-3">

                <div className="col-md-6">
                  <small className="text-muted">
                    Booking ID
                  </small>

                  <h6>
                    #{booking.id}
                  </h6>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">
                    Restaurant
                  </small>

                  <h6>
                    {booking.restaurant.name}
                  </h6>
                </div>

                <div className="col-md-4">
                  <small className="text-muted">
                    Date
                  </small>

                  <h6>
                    {booking.bookingDate}
                  </h6>
                </div>

                <div className="col-md-4">
                  <small className="text-muted">
                    Time
                  </small>

                  <h6>
                    {booking.bookingTime}
                  </h6>
                </div>

                <div className="col-md-4">
                  <small className="text-muted">
                    People
                  </small>

                  <h6>
                    {booking.numberOfPeople}
                  </h6>
                </div>

              </div>

              {/* Customer Details */}
              <hr className="my-4" />

              <h5 className="fw-bold">
                Customer Details
              </h5>

              <div className="row g-3 mt-1">

                <div className="col-md-4">
                  <small className="text-muted">
                    Name
                  </small>

                  <h6>
                    {booking.customerName}
                  </h6>
                </div>

                <div className="col-md-4">
                  <small className="text-muted">
                    Email
                  </small>

                  <h6>
                    {booking.customerEmail}
                  </h6>
                </div>

                <div className="col-md-4">
                  <small className="text-muted">
                    Phone
                  </small>

                  <h6>
                    {booking.customerPhone}
                  </h6>
                </div>

              </div>

              {/* Food Items */}
              <hr className="my-4" />

              <h5 className="fw-bold">
                Food Items
              </h5>

              <div className="mt-3">

                {bookingItems.length === 0 ? (
                  <p className="text-muted">
                    No food items found.
                  </p>
                ) : (

                  bookingItems.map((item) => (

                    <div
                      key={item.id}
                      className="d-flex justify-content-between align-items-center border-bottom py-3"
                    >

                      <div>

                        <h6 className="mb-1">
                          {item.menuItem.name}
                        </h6>

                        <small className="text-muted">
                          ₹{item.price} × {item.quantity}
                        </small>

                      </div>

                      <strong>
                        ₹{item.subtotal}
                      </strong>

                    </div>

                  ))

                )}

              </div>

              {/* Payment */}
              <hr className="my-4" />

              <h5 className="fw-bold">
                Payment
              </h5>

              <div className="d-flex justify-content-between mt-3">
                <span>Total Amount</span>

                <strong>
                  ₹{booking.totalAmount}
                </strong>
              </div>

              <div className="d-flex justify-content-between mt-2">
                <span>Paid (25%)</span>

                <strong className="text-success">
                  ₹{booking.advanceAmount}
                </strong>
              </div>

              <div className="d-flex justify-content-between mt-2">
                <span>Remaining</span>

                <strong>
                  ₹{
                    booking.totalAmount -
                    booking.advanceAmount
                  }
                </strong>
              </div>

              {/* Status */}
              <div className="d-flex justify-content-between mt-3">

                <span>
                  Status
                </span>

                <span className="badge bg-success">
                  {booking.status}
                </span>

              </div>

              {/* Special Request */}
              {booking.specialRequest && (
                <div className="alert alert-info mt-4">
                  <strong>Special Request:</strong>
                  <br />
                  {booking.specialRequest}
                </div>
              )}

              {/* Success Message */}
              <div className="alert alert-success mt-4">
                <strong>
                  Payment successful!
                </strong>

                <br />

                Your booking has been confirmed.
                A confirmation email has been sent to{' '}
                {booking.customerEmail}.
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Confirmation