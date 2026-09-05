import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../axios'
import { useBooking } from '../context/BookingContext'

function Booking() {
  const navigate = useNavigate()

  const loggedInUser = JSON.parse(
    localStorage.getItem('user')
  )

  const {
    selectedItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromBooking,
    totalAmount,
    setBookingId,
  } = useBooking()

  const [bookingDate, setBookingDate] = useState('')
  const [bookingTime, setBookingTime] = useState('')
  const [numberOfPeople, setNumberOfPeople] = useState(1)

  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState(
  loggedInUser?.email || ''
)
  const [customerPhone, setCustomerPhone] = useState('')
  const [specialRequest, setSpecialRequest] = useState('')

  const [loading, setLoading] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const advanceAmount = totalAmount * 0.25
  const remainingAmount = totalAmount - advanceAmount

  // Convert "08:00 PM" -> "20:00"
  const convertTimeTo24Hour = (time) => {
    if (!time) return ''

    const [timePart, modifier] = time.split(' ')
    let [hours, minutes] = timePart.split(':')

    hours = parseInt(hours, 10)

    if (modifier === 'AM') {
      if (hours === 12) {
        hours = 0
      }
    } else if (modifier === 'PM') {
      if (hours !== 12) {
        hours += 12
      }
    }

    return `${String(hours).padStart(2, '0')}:${minutes}`
  }

  const handleContinueBooking = async () => {
    // Check food items
    if (selectedItems.length === 0) {
      alert('Please select at least one food item')
      return
    }

    // Check date
    if (!bookingDate) {
      alert('Please select booking date')
      return
    }

    // Check time
    if (!bookingTime) {
      alert('Please select booking time')
      return
    }

    // Check number of people
    if (numberOfPeople < 1 || numberOfPeople > 20) {
      alert('Number of people must be between 1 and 20')
      return
    }

    // Check customer name
    if (!customerName.trim()) {
      alert('Please enter your name')
      return
    }

    // Check email
    if (!customerEmail.trim()) {
      alert('Please enter your email')
      return
    }

    // Check phone
    if (!customerPhone.trim()) {
      alert('Please enter your phone number')
      return
    }

    // Get restaurant ID from selected menu item
    const restaurantId =
      selectedItems[0]?.restaurant?.id ||
      selectedItems[0]?.restaurantId

    if (!restaurantId) {
      alert(
        'Restaurant information not found. Please select food again.'
      )

      console.error('Selected items:', selectedItems)

      return
    }

    // Booking request
    const bookingData = {
      restaurantId: restaurantId,

      customerName: customerName.trim(),
      customerEmail: loggedInUser?.email || customerEmail.trim(),
      customerPhone: customerPhone.trim(),

      bookingDate: bookingDate,

      // Backend LocalTime expects 24-hour format
      // Example: "08:00 PM" -> "20:00"
      bookingTime: convertTimeTo24Hour(bookingTime),

      numberOfPeople: numberOfPeople,

      specialRequest: specialRequest.trim(),

      items: selectedItems.map((item) => ({
        menuItemId: item.id,
        quantity: item.quantity,
      })),
    }

    console.log('Creating booking:', bookingData)

    try {
      setLoading(true)

      const response = await axios.post(
        '/api/bookings',
        bookingData
      )

      console.log('Booking created:', response.data)

      // Save newly created booking ID
      setBookingId(response.data.id)

      alert(
        `Booking created successfully! Booking ID: ${response.data.id}`
      )

      // Go to review/payment page
      navigate('/review-booking')

    } catch (error) {
      console.error('Booking creation failed:', error)

      if (error.response) {
        console.error(
          'Status:',
          error.response.status
        )

        console.error(
          'Response:',
          error.response.data
        )

        alert(
          typeof error.response.data === 'string'
            ? error.response.data
            : 'Unable to create booking. Please try again.'
        )
      } else {
        alert('Unable to connect to server.')
      }

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5">

      {/* Page Header */}
      <div className="mb-5">
        <h1 className="fw-bold">
          Booking Summary
        </h1>

        <p className="text-muted">
          Review your selected food items.
        </p>
      </div>

      <div className="row">

        {/* LEFT SIDE */}
        <div className="col-lg-8">

          {/* Selected Food Items */}
          <div className="mb-4">

            <h4 className="fw-bold mb-3">
              Selected Food
            </h4>

            {selectedItems.length === 0 ? (

              <div className="alert alert-info">

                No food items selected.

                <div className="mt-3">

                  <Link
                    to="/restaurants"
                    className="btn btn-primary"
                  >
                    Browse Restaurants
                  </Link>

                </div>

              </div>

            ) : (

              selectedItems.map((item) => (

                <div
                  className="card mb-3 shadow-sm border-0"
                  key={item.id}
                >

                  <div className="card-body">

                    <div className="row align-items-center">

                      {/* Food Information */}
                      <div className="col-md-5">

                        <h5 className="fw-bold">
                          {item.name}
                        </h5>

                        <p className="text-muted mb-0">
                          ₹{item.price} per item
                        </p>

                      </div>

                      {/* Quantity */}
                      <div className="col-md-4 mt-3 mt-md-0">

                        <div className="d-flex align-items-center gap-2 flex-wrap">

                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() =>
                              decreaseQuantity(item.id)
                            }
                          >
                            −
                          </button>

                          <span className="fw-bold px-2">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() =>
                              increaseQuantity(item.id)
                            }
                          >
                            +
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger ms-2"
                            onClick={() =>
                              removeFromBooking(item.id)
                            }
                          >
                            Remove
                          </button>

                        </div>

                      </div>

                      {/* Item Total */}
                      <div className="col-md-3 text-md-end mt-3 mt-md-0">

                        <strong>
                          ₹{item.price * item.quantity}
                        </strong>

                      </div>

                    </div>

                  </div>

                </div>

              ))

            )}

          </div>

          {/* Appointment Details */}
          {selectedItems.length > 0 && (

            <div className="card shadow-sm border-0 mb-4">

              <div className="card-body">

                <h4 className="fw-bold mb-4">
                  Appointment Details
                </h4>

                <div className="row g-3">

                  {/* Date */}
                  <div className="col-md-4">

                    <label className="form-label">
                      Select Date
                    </label>

                    <input
                      type="date"
                      className="form-control"
                      min={today}
                      value={bookingDate}
                      onChange={(e) =>
                        setBookingDate(e.target.value)
                      }
                    />

                  </div>

                  {/* Time */}
                  <div className="col-md-4">

                    <label className="form-label">
                      Select Time
                    </label>

                    <select
                      className="form-select"
                      value={bookingTime}
                      onChange={(e) =>
                        setBookingTime(e.target.value)
                      }
                    >

                      <option value="">
                        Select Time
                      </option>

                      <option value="12:00 PM">
                        12:00 PM
                      </option>

                      <option value="01:00 PM">
                        01:00 PM
                      </option>

                      <option value="07:00 PM">
                        07:00 PM
                      </option>

                      <option value="08:00 PM">
                        08:00 PM
                      </option>

                      <option value="09:00 PM">
                        09:00 PM
                      </option>

                    </select>

                  </div>

                  {/* Number of People */}
                  <div className="col-md-4">

                    <label className="form-label">
                      Number of People
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      max="20"
                      value={numberOfPeople}
                      onChange={(e) =>
                        setNumberOfPeople(
                          Number(e.target.value)
                        )
                      }
                    />

                  </div>

                </div>

              </div>

            </div>

          )}

          {/* Customer Details */}
          {selectedItems.length > 0 && (

            <div className="card shadow-sm border-0 mb-4">

              <div className="card-body">

                <h4 className="fw-bold mb-4">
                  Customer Details
                </h4>

                <div className="row g-3">

                  {/* Full Name */}
                  <div className="col-md-6">

                    <label className="form-label">
                      Full Name
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your full name"
                      value={customerName}
                      onChange={(e) =>
                        setCustomerName(e.target.value)
                      }
                    />

                  </div>

                  {/* Email */}
                  <div className="col-md-6">

                    <label className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={customerEmail}
                      readOnly
                    />

                  </div>

                  {/* Phone */}
                  <div className="col-md-6">

                    <label className="form-label">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Enter your phone number"
                      value={customerPhone}
                      onChange={(e) =>
                        setCustomerPhone(e.target.value)
                      }
                    />

                  </div>

                  {/* Special Request */}
                  <div className="col-md-6">

                    <label className="form-label">
                      Special Request
                    </label>

                    <textarea
                      className="form-control"
                      rows="1"
                      placeholder="Any special request?"
                      value={specialRequest}
                      onChange={(e) =>
                        setSpecialRequest(e.target.value)
                      }
                    />

                  </div>

                </div>

              </div>

            </div>

          )}

        </div>

        {/* RIGHT SIDE - PAYMENT SUMMARY */}
        <div className="col-lg-4">

          <div className="card shadow-sm border-0">

            <div className="card-body">

              <h4 className="fw-bold mb-4">
                Payment Summary
              </h4>

              {/* Appointment Summary */}
              {selectedItems.length > 0 && (

                <>
                  <div className="mb-3">

                    <p className="mb-1">
                      <strong>Date:</strong>{' '}
                      {bookingDate || 'Not selected'}
                    </p>

                    <p className="mb-1">
                      <strong>Time:</strong>{' '}
                      {bookingTime || 'Not selected'}
                    </p>

                    <p className="mb-0">
                      <strong>People:</strong>{' '}
                      {numberOfPeople}
                    </p>

                  </div>

                  <hr />
                </>

              )}

              {/* Total */}
              <div className="d-flex justify-content-between mb-2">

                <span>
                  Total Amount
                </span>

                <strong>
                  ₹{totalAmount}
                </strong>

              </div>

              {/* Advance */}
              <div className="d-flex justify-content-between mb-3">

                <span>
                  25% Advance
                </span>

                <strong>
                  ₹{advanceAmount.toFixed(2)}
                </strong>

              </div>

              <hr />

              {/* Remaining */}
              <p className="text-muted mb-1">
                Remaining Amount
              </p>

              <h5 className="fw-bold">
                ₹{remainingAmount.toFixed(2)}
              </h5>

              {/* Continue Button */}
              {selectedItems.length > 0 && (

                <button
                  type="button"
                  className="btn btn-primary w-100 mt-3"
                  onClick={handleContinueBooking}
                  disabled={loading}
                >

                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>

                      Creating Booking...
                    </>
                  ) : (
                    'Continue Booking'
                  )}

                </button>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Booking