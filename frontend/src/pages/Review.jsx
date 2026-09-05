import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../axios'

function Review() {
  const { bookingId } = useParams()
  const navigate = useNavigate()

  const [booking, setBooking] = useState(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [alreadyReviewed, setAlreadyReviewed] = useState(false)

  useEffect(() => {
    fetchBooking()
    checkReview()
  }, [bookingId])

  const fetchBooking = async () => {
    try {
      const response = await axios.get(`/api/bookings/${bookingId}`)
      setBooking(response.data)

      if (response.data.status !== 'COMPLETED') {
        setError('Only completed bookings can be reviewed.')
      }
    } catch (err) {
      console.error(err)
      setError('Unable to load booking details.')
    } finally {
      setLoading(false)
    }
  }

  const checkReview = async () => {
    try {
      const response = await axios.get(
        `/api/reviews/booking/${bookingId}`
      )

      if (response.data) {
        setAlreadyReviewed(true)
      }
    } catch (err) {
      console.log('Review check:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setMessage('')
    setError('')

    if (rating < 1 || rating > 5) {
      setError('Please select a rating between 1 and 5.')
      return
    }

    if (alreadyReviewed) {
      setError('This booking has already been reviewed.')
      return
    }

    try {
      setSubmitting(true)

      await axios.post('/api/reviews', null, {
        params: {
          bookingId: bookingId,
          rating: rating,
          comment: comment
        }
      })

      setMessage('Review submitted successfully! ⭐')

      setAlreadyReviewed(true)

      setTimeout(() => {
        navigate(`/restaurants/${booking.restaurant.id}`)
      }, 1500)

    } catch (err) {
      console.error(err)

      setError(
        err.response?.data ||
        'Failed to submit review.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border"></div>
        <p className="mt-3">Loading booking...</p>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Booking not found.
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">

      <div className="row justify-content-center">

        <div className="col-md-8 col-lg-6">

          <div className="card shadow-sm">

            <div className="card-body p-4">

              <h2 className="text-center mb-2">
                Leave a Review
              </h2>

              <p className="text-center text-muted mb-4">
                Share your experience with the restaurant
              </p>

              <div className="text-center mb-4">

                <h4>
                  {booking.restaurant?.name}
                </h4>

                <p className="text-muted mb-1">
                  Booking #{booking.id}
                </p>

                <span className="badge bg-success">
                  {booking.status}
                </span>

              </div>

              {alreadyReviewed ? (

                <div className="text-center">

                  <div className="alert alert-success">
                    <h5>Thank you! ⭐</h5>
                    <p className="mb-0">
                      You have already reviewed this booking.
                    </p>
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      navigate(
                        `/restaurants/${booking.restaurant.id}`
                      )
                    }
                  >
                    View Restaurant
                  </button>

                </div>

              ) : (

                <form onSubmit={handleSubmit}>

                  <div className="mb-4 text-center">

                    <label className="form-label fw-bold d-block">
                      How would you rate your experience?
                    </label>

                    <div className="d-flex justify-content-center gap-2">

                      {[1, 2, 3, 4, 5].map((star) => (

                        <button
                          type="button"
                          key={star}
                          className="btn btn-link p-0"
                          style={{
                            fontSize: '2.5rem',
                            textDecoration: 'none',
                            color:
                              star <= rating
                                ? '#ffc107'
                                : '#ccc'
                          }}
                          onClick={() => setRating(star)}
                        >
                          ★
                        </button>

                      ))}

                    </div>

                    <small className="text-muted">
                      {rating === 0
                        ? 'Select your rating'
                        : `${rating} out of 5 stars`}
                    </small>

                  </div>

                  <div className="mb-4">

                    <label className="form-label fw-bold">
                      Your Comment
                    </label>

                    <textarea
                      className="form-control"
                      rows="5"
                      placeholder="Tell us about your experience..."
                      value={comment}
                      onChange={(e) =>
                        setComment(e.target.value)
                      }
                      maxLength={1000}
                    />

                    <div className="text-end text-muted small mt-1">
                      {comment.length}/1000
                    </div>

                  </div>

                  {error && (
                    <div className="alert alert-danger">
                      {error}
                    </div>
                  )}

                  {message && (
                    <div className="alert alert-success">
                      {message}
                    </div>
                  )}

                  <div className="d-flex gap-2">

                    <button
                      type="button"
                      className="btn btn-outline-secondary w-50"
                      onClick={() => navigate('/my-bookings')}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary w-50"
                      disabled={submitting}
                    >
                      {submitting
                        ? 'Submitting...'
                        : 'Submit Review'}
                    </button>

                  </div>

                </form>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Review