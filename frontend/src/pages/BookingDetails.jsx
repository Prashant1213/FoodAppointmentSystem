import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../axios'

function BookingDetails() {

  const { id } = useParams()

  const [booking, setBooking] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    const fetchDetails = async () => {

      try {

        const bookingResponse =
          await api.get(`/api/bookings/${id}`)

        const itemsResponse =
          await api.get(`/api/bookings/${id}/items`)

        setBooking(bookingResponse.data)
        setItems(itemsResponse.data)

      } catch (error) {

        console.error(error)
        setError('Unable to load booking details')

      } finally {

        setLoading(false)

      }
    }

    fetchDetails()

  }, [id])

     const handleCancel = async () => {
     const confirmCancel = window.confirm(
       "Are you sure you want to cancel this booking?"
     );
   
     if (!confirmCancel) return;
   
     try {
       const response = await api.put(`/api/bookings/${id}/cancel`);
   
       setBooking(response.data);
   
       alert("Booking cancelled successfully");
     } catch (error) {
       alert(
         error.response?.data || "Failed to cancel booking"
       );
     }
   };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h5>Loading booking details...</h5>
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
        Booking Details
      </h2>

      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <h4>
            {booking.restaurant.name}
          </h4>

          <hr />

          <p>
            <strong>Booking ID:</strong> #{booking.id}
          </p>

          <p>
            <strong>Date:</strong> {booking.bookingDate}
          </p>

          <p>
            <strong>Time:</strong> {booking.bookingTime}
          </p>

          <p>
            <strong>People:</strong> {booking.numberOfPeople}
          </p>

        <p>
          <strong>Status:</strong>{' '}
          <span
            className={
              booking.status === "CANCELLED"
                ? "badge bg-danger"
                : "badge bg-success"
            }
          >
            {booking.status}
          </span>
        </p>
        
        {booking.status !== "CANCELLED" && (
          <button
            className="btn btn-danger mt-2"
            onClick={handleCancel}
          >
            Cancel Booking
          </button>
        )}
        
        </div>

      </div>

      <div className="card shadow-sm">

        <div className="card-body">

          <h4 className="mb-3">
            Food Items
          </h4>

          {items.map((item) => (

            <div
              key={item.id}
              className="d-flex justify-content-between
                         border-bottom py-3"
            >

              <div>
                <strong>
                  {item.menuItem.name}
                </strong>

                <div className="text-muted">
                  ₹{item.price} × {item.quantity}
                </div>
              </div>

              <strong>
                ₹{item.subtotal}
              </strong>

            </div>

          ))}

          <hr />

          <div className="d-flex justify-content-between">
            <strong>Total</strong>
            <strong>₹{booking.totalAmount}</strong>
          </div>

          <div className="d-flex justify-content-between mt-2">
            <span>Paid (25%)</span>
            <span className="text-success">
              ₹{booking.advanceAmount}
            </span>
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

        </div>

      </div>

    </div>
  )
}

export default BookingDetails