import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../axios'

function OwnerBookingDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [booking, setBooking] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchBookingDetails()
  }, [id])

  const fetchBookingDetails = async () => {
    try {
      const bookingResponse = await api.get(
        `/api/owner/bookings/${id}`
      )

      const itemsResponse = await api.get(
        `/api/owner/bookings/${id}/items`
      )

      setBooking(bookingResponse.data)
      setItems(itemsResponse.data)

    } catch (error) {
      console.error(error)

      if (error.response?.data) {
        setMessage(error.response.data)
      } else {
        setMessage('Unable to load booking details.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h4>Loading booking details...</h4>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="container mt-5">

        <div className="alert alert-danger">
          {message || 'Booking not found.'}
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => navigate('/owner/bookings')}
        >
          Back to Bookings
        </button>

      </div>
    )
  }

  const remainingAmount =
    (booking.totalAmount || 0) -
    (booking.advanceAmount || 0)

  return (
    <div className="container mt-4">

      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2>Booking #{booking.id}</h2>

          <p className="text-muted mb-0">
            Booking details and ordered items
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => navigate('/owner/bookings')}
        >
          Back to Bookings
        </button>

      </div>

      {/* Customer Information */}

      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <h5 className="mb-3">
            Customer Information
          </h5>

          <div className="row">

            <div className="col-md-4 mb-3">
              <strong>Name</strong>
              <div>{booking.customerName}</div>
            </div>

            <div className="col-md-4 mb-3">
              <strong>Email</strong>
              <div>{booking.customerEmail}</div>
            </div>

            <div className="col-md-4 mb-3">
              <strong>Phone</strong>
              <div>{booking.customerPhone}</div>
            </div>

          </div>

        </div>

      </div>

      {/* Booking Information */}

      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <h5 className="mb-3">
            Booking Information
          </h5>

          <div className="row">

            <div className="col-md-4 mb-3">
              <strong>Date</strong>
              <div>{booking.bookingDate}</div>
            </div>

            <div className="col-md-4 mb-3">
              <strong>Time</strong>
              <div>{booking.bookingTime}</div>
            </div>

            <div className="col-md-4 mb-3">
              <strong>Number of People</strong>
              <div>{booking.numberOfPeople}</div>
            </div>

            <div className="col-md-4 mb-3">
              <strong>Status</strong>
              <div>
                <span className="badge bg-primary">
                  {booking.status}
                </span>
              </div>
            </div>

            <div className="col-md-8 mb-3">
              <strong>Special Request</strong>
              <div>
                {booking.specialRequest || 'None'}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Ordered Items */}

      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <h5 className="mb-3">
            Ordered Items
          </h5>

          {items.length === 0 ? (

            <p className="text-muted mb-0">
              No items found.
            </p>

          ) : (

            <div className="table-responsive">

              <table className="table table-bordered align-middle">

                <thead className="table-light">

                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>

                </thead>

                <tbody>

                  {items.map((item) => (

                    <tr key={item.id}>

                      <td>
                        <strong>
                          {item.menuItem?.name}
                        </strong>
                      </td>

                      <td>
                        {item.menuItem?.category || '-'}
                      </td>

                      <td>
                        ₹{item.price}
                      </td>

                      <td>
                        {item.quantity}
                      </td>

                      <td>
                        ₹{item.subtotal}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

      {/* Payment Information */}

      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <h5 className="mb-3">
            Payment Information
          </h5>

          <div className="row">

            <div className="col-md-4">
              <strong>Total Amount</strong>
              <h4>₹{booking.totalAmount}</h4>
            </div>

            <div className="col-md-4">
              <strong>Advance Paid</strong>
              <h4>₹{booking.advanceAmount}</h4>
            </div>

            <div className="col-md-4">
              <strong>Remaining Amount</strong>
              <h4>₹{remainingAmount}</h4>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default OwnerBookingDetails