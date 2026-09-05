import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../axios'
import { useBooking } from '../context/BookingContext'

function RestaurantDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToBooking } = useBooking()

  const [restaurant, setRestaurant] = useState(null)
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const restaurantResponse = await axios.get(
          `/api/restaurants/${id}`
        )

        const menuResponse = await axios.get(
          `/api/restaurants/${id}/menu`
        )

        setRestaurant(restaurantResponse.data)
        setMenuItems(menuResponse.data)
        setLoading(false)
      } catch (error) {
        console.error(error)
        setError('Unable to load restaurant details')
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <p>Loading restaurant...</p>
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

  if (!restaurant) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Restaurant not found.
        </div>
      </div>
    )
  }

  return (
    <div className="container mb-5">

      {/* Restaurant Image */}
      {restaurant.imageUrl && (
        <div
          className="rounded overflow-hidden mb-4"
          style={{ height: '300px' }}
        >
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-100 h-100"
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Restaurant Details */}
      <div className="bg-light rounded p-5 mb-5">

        <h1 className="fw-bold">
          {restaurant.name}
        </h1>

        <p className="text-muted">
          📍 {restaurant.location}
        </p>

        <p>
          🍴 {restaurant.cuisine}
          &nbsp; | &nbsp;
          ⭐ {restaurant.rating}
        </p>

        <p className="text-muted">
          Enjoy delicious food and book your meal
          in advance without waiting.
        </p>

      </div>

      {/* Menu Heading */}
      <div className="mb-4">

        <h2 className="fw-bold">
          Menu
        </h2>

        <p className="text-muted">
          Select your favourite food items.
        </p>

      </div>

      {/* Menu Items */}
      <div className="row g-4">

        {menuItems.map((item) => (

          <div
            className="col-md-6"
            key={item.id}
          >

            <div className="card h-100 shadow-sm border-0 overflow-hidden">

              {/* Menu Item Image */}
              <div
                className="bg-light d-flex align-items-center justify-content-center"
                style={{
                  height: '220px',
                  overflow: 'hidden'
                }}
              >

                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-100 h-100"
                    style={{
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <span className="fs-1">
                    🍽️
                  </span>
                )}

              </div>

              {/* Menu Item Details */}
              <div className="card-body">

                <div className="d-flex justify-content-between align-items-start">

                  <h5 className="fw-bold mb-2">
                    {item.name}
                  </h5>

                  <span className="fw-bold text-primary">
                    ₹{item.price}
                  </span>

                </div>

                <p className="text-muted">
                  {item.description || 'Delicious food item'}
                </p>

                <span className="badge bg-secondary">
                  {item.category}
                </span>

                <button
                  className="btn btn-outline-primary w-100 mt-3"
                  onClick={() => {
                    addToBooking(item)
                    navigate('/booking')
                  }}
                >
                  Add to Booking
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {menuItems.length === 0 && (
        <div className="alert alert-info mt-4">
          No menu items available.
        </div>
      )}

    </div>
  )
}

export default RestaurantDetails