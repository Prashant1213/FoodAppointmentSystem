import axios from '../axios'
import { useBooking } from '../context/BookingContext'
import { Link, useNavigate } from 'react-router-dom'

function ReviewBooking() {
  const {
    selectedItems,
    totalAmount,
    bookingId,
  } = useBooking()

  const navigate = useNavigate()

  if (selectedItems.length === 0) {
    return (
      <div className="container py-5 text-center">

        <h2>No items selected</h2>

        <p className="text-muted">
          Please select food items before reviewing your booking.
        </p>

        <Link
          to="/restaurants"
          className="btn btn-primary"
        >
          Browse Restaurants
        </Link>

      </div>
    )
  }

  const advanceAmount = totalAmount * 0.25
  const remainingAmount = totalAmount - advanceAmount

  const handlePayment = async () => {

    // Check booking ID
    if (!bookingId) {
      alert(
        'Booking not found. Please go back and create the booking again.'
      )
      return
    }

    try {

      console.log(
        'Creating Razorpay order for Booking ID:',
        bookingId
      )

      // Create Razorpay order
      const response = await axios.post(
        `/api/payment/create-order/${bookingId}`
      )

      const order = response.data

      console.log(
        'Razorpay order created:',
        order
      )

      const options = {
        key: 'rzp_test_TUllPQISglKGhL',

        amount: order.amount,

        currency: order.currency,

        name: 'Food Appointment System',

        description: 'Food Appointment Advance Payment',

        order_id: order.id,

        handler: async function (paymentResponse) {

          try {

            console.log(
              'Razorpay payment response:',
              paymentResponse
            )

            // Verify payment
            const verifyResponse = await axios.post(
              '/api/payment/verify',
              {
                razorpayPaymentId:
                  paymentResponse.razorpay_payment_id,

                razorpayOrderId:
                  paymentResponse.razorpay_order_id,

                razorpaySignature:
                  paymentResponse.razorpay_signature,
              }
            )

            console.log(
              'Payment verification response:',
              verifyResponse.data
            )

            if (verifyResponse.status === 200) {

              // Go to confirmation page
              navigate(
                `/confirmation/${bookingId}`
              )
            }

          } catch (error) {

            console.error(
              'Payment verification failed:',
              error
            )

            if (error.response) {

              console.error(
                'Verification status:',
                error.response.status
              )

              console.error(
                'Verification response:',
                error.response.data
              )
            }

            alert(
              'Payment verification failed'
            )
          }
        },

        prefill: {
          name: 'John Doe',
          email: 'john@example.com',
          contact: '9876543210',
        },

        theme: {
          color: '#0d6efd',
        },
      }

      // Open Razorpay Checkout
      const razorpay =
        new window.Razorpay(options)

      razorpay.open()

    } catch (error) {

      console.error(
        'Payment order creation failed:',
        error
      )

      if (error.response) {

        console.error(
          'Payment order status:',
          error.response.status
        )

        console.error(
          'Payment order response:',
          error.response.data
        )

        alert(
          typeof error.response.data === 'string'
            ? error.response.data
            : 'Unable to start payment'
        )

      } else {

        alert(
          'Unable to connect to server'
        )
      }
    }
  }

  return (
    <div className="container py-5">

      {/* Page Header */}
      <div className="text-center mb-5">

        <h1 className="fw-bold">
          Review Your Booking
        </h1>

        <p className="text-muted">
          Please check your booking details before payment.
        </p>

      </div>

      <div className="row g-4">

        {/* Booking Details */}
        <div className="col-lg-8">

          {/* Restaurant */}
          <div className="card shadow-sm border-0 mb-4">

            <div className="card-body">

              <h4 className="fw-bold">
                Restaurant
              </h4>

              <h5 className="mt-3">
                Spice Garden
              </h5>

              <p className="text-muted mb-0">
                📍 Pune
              </p>

            </div>

          </div>

          {/* Food Items */}
          <div className="card shadow-sm border-0 mb-4">

            <div className="card-body">

              <h4 className="fw-bold mb-4">
                Selected Food
              </h4>

              {selectedItems.map((item) => (

                <div
                  className="d-flex justify-content-between border-bottom py-3"
                  key={item.id}
                >

                  <div>

                    <h6 className="mb-1">
                      {item.name}
                    </h6>

                    <small className="text-muted">
                      ₹{item.price} × {item.quantity}
                    </small>

                  </div>

                  <strong>
                    ₹{item.price * item.quantity}
                  </strong>

                </div>

              ))}

            </div>

          </div>

          {/* Appointment */}
          <div className="card shadow-sm border-0 mb-4">

            <div className="card-body">

              <h4 className="fw-bold mb-4">
                Appointment Details
              </h4>

              <div className="row">

                <div className="col-md-4">

                  <p className="text-muted mb-1">
                    Date
                  </p>

                  <strong>
                    Booking created
                  </strong>

                </div>

                <div className="col-md-4">

                  <p className="text-muted mb-1">
                    Booking ID
                  </p>

                  <strong>
                    #{bookingId}
                  </strong>

                </div>

                <div className="col-md-4">

                  <p className="text-muted mb-1">
                    Status
                  </p>

                  <strong className="text-warning">
                    PENDING PAYMENT
                  </strong>

                </div>

              </div>

            </div>

          </div>

          {/* Customer */}
          <div className="card shadow-sm border-0">

            <div className="card-body">

              <h4 className="fw-bold mb-4">
                Customer Details
              </h4>

              <p className="mb-2">
                <strong>
                  Booking ID:
                </strong>{' '}
                #{bookingId}
              </p>

              <p className="mb-0">
                <strong>
                  Payment:
                </strong>{' '}
                25% advance payment required
              </p>

            </div>

          </div>

        </div>

        {/* Payment Summary */}
        <div className="col-lg-4">

          <div className="card shadow border-0">

            <div className="card-body">

              <h4 className="fw-bold mb-4">
                Payment Summary
              </h4>

              <div className="d-flex justify-content-between mb-3">

                <span>
                  Total Amount
                </span>

                <strong>
                  ₹{totalAmount}
                </strong>

              </div>

              <div className="d-flex justify-content-between mb-3">

                <span>
                  Advance (25%)
                </span>

                <strong className="text-primary">
                  ₹{advanceAmount.toFixed(2)}
                </strong>

              </div>

              <div className="d-flex justify-content-between mb-3">

                <span>
                  Remaining
                </span>

                <strong>
                  ₹{remainingAmount.toFixed(2)}
                </strong>

              </div>

              <hr />

              <p className="small text-muted">

                You need to pay 25% of the total amount
                to confirm your appointment.

              </p>

              <button
                className="btn btn-primary w-100 mt-2"
                onClick={handlePayment}
              >
                Pay ₹{advanceAmount.toFixed(2)}
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default ReviewBooking