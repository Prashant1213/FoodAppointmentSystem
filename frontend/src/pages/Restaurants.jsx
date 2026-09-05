import { useEffect, useState } from 'react'
import axios from '../axios'
import { Link } from 'react-router-dom'

function Restaurants() {
  const [restaurants, setRestaurants] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
  axios
    .get('http://localhost:8080/api/restaurants')
    .then((response) => {
      setRestaurants(response.data)
      setLoading(false)
    })
    .catch((error) => {
      console.error(error)
      setError('Unable to load restaurants')
      setLoading(false)
    })
    }, [])

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(search.toLowerCase())
  )


  return (
    <div className="container py-5">

      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="fw-bold">Find Your Restaurant</h1>

        <p className="text-muted">
          Choose a restaurant and book your meal in advance.
        </p>
      </div>

      {/* Search */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Search restaurant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>


      {
       loading && (
       <div className="text-center">
         <p>Loading restaurants...</p>
       </div>
     )}
     
     {
       error && (
       <div className="alert alert-danger">
         {error}
       </div>
     )}


      {/* Restaurant Cards */}
      <div className="row g-4">

        {filteredRestaurants.map((restaurant) => (
          <div className="col-md-6 col-lg-3" key={restaurant.id}>

            <div className="card h-100 shadow-sm">

              <div
                className="bg-light d-flex align-items-center justify-content-center"
                style={{ height: '180px', overflow: 'hidden' }}
              >
                {restaurant.imageUrl ? (
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <span className="fs-1">🍽️</span>
                )}
              </div>

              <div className="card-body">

                <h5 className="card-title fw-bold">
                  {restaurant.name}
                </h5>

                <p className="text-muted mb-2">
                  📍 {restaurant.location}
                </p>

                <p className="mb-2">
                  🍴 {restaurant.cuisine}
                </p>

                <p className="mb-3">
                  ⭐ {restaurant.rating}
                </p>

                <Link
                  to={`/restaurants/${restaurant.id}`}
                  className="btn btn-primary w-100"
                >
                  View Menu
                </Link>

              </div>

            </div>

          </div>
        ))}

      </div>

      {filteredRestaurants.length === 0 && (
        <div className="text-center mt-5">
          <p className="text-muted">
            No restaurants found.
          </p>
        </div>
      )}

    </div>
  )
}

export default Restaurants