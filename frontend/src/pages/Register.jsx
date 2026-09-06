import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()

  const [role, setRole] = useState('CUSTOMER')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    restaurantName: '',
    location: '',
    cuisine: ''
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleRoleChange = (e) => {
    setRole(e.target.value)

    setMessage('')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setMessage('')
    setError('')
    setLoading(true)

    try {
      let response

      if (role === 'CUSTOMER') {

        const customerData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        }

        response = await axios.post(
          'http://localhost:8080/api/auth/register',
          customerData
        )

      } else {

        const ownerData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          restaurantName: formData.restaurantName,
          location: formData.location,
          cuisine: formData.cuisine
        }

        response = await axios.post(
          'http://localhost:8080/api/auth/register-owner',
          ownerData
        )
      }

      setMessage(
        response.data.message ||
        response.data ||
        'Registration successful'
      )

      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        restaurantName: '',
        location: '',
        cuisine: ''
      })

      setTimeout(() => {
        navigate('/login')
      }, 1500)

    } catch (error) {

      console.error(error)

      if (error.response) {
        setError(
          typeof error.response.data === 'string'
            ? error.response.data
            : error.response.data.message ||
              'Registration failed'
        )
      } else {
        setError('Unable to connect to server')
      }

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5">

      <div className="row justify-content-center">

        <div className="col-md-7 col-lg-6">

          <div className="card shadow">

            <div className="card-body p-4">

              <h2 className="text-center mb-4">
                Create Account
              </h2>

              {message && (
                <div className="alert alert-success">
                  {message}
                </div>
              )}

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                {/* Account Type */}

                <div className="mb-4">

                  <label className="form-label fw-bold">
                    Account Type
                  </label>

                  <select
                    className="form-select"
                    value={role}
                    onChange={handleRoleChange}
                  >
                    <option value="CUSTOMER">
                      Customer
                    </option>

                    <option value="RESTAURANT_OWNER">
                      Restaurant Owner
                    </option>
                  </select>

                </div>


                {/* Name */}

                <div className="mb-3">

                  <label className="form-label">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* Email */}

                <div className="mb-3">

                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* Phone */}

                <div className="mb-3">

                  <label className="form-label">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* Password */}

                <div className="mb-3">

                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* Owner Fields */}

                {role === 'RESTAURANT_OWNER' && (
                  <div className="border rounded p-3 mb-3 bg-light">

                    <h5 className="mb-3">
                      Restaurant Details
                    </h5>

                    {/* Restaurant Name */}

                    <div className="mb-3">

                      <label className="form-label">
                        Restaurant Name
                      </label>

                      <input
                        type="text"
                        name="restaurantName"
                        className="form-control"
                        placeholder="Enter restaurant name"
                        value={formData.restaurantName}
                        onChange={handleChange}
                        required
                      />

                    </div>


                    {/* Location */}

                    <div className="mb-3">

                      <label className="form-label">
                        Location
                      </label>

                      <input
                        type="text"
                        name="location"
                        className="form-control"
                        placeholder="e.g. Pune"
                        value={formData.location}
                        onChange={handleChange}
                        required
                      />

                    </div>


                    {/* Cuisine */}

                    <div className="mb-2">

                      <label className="form-label">
                        Cuisine
                      </label>

                      <input
                        type="text"
                        name="cuisine"
                        className="form-control"
                        placeholder="e.g. Indian, Chinese"
                        value={formData.cuisine}
                        onChange={handleChange}
                        required
                      />

                    </div>

                  </div>
                )}


                {/* Register Button */}

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading
                    ? 'Creating Account...'
                    : role === 'RESTAURANT_OWNER'
                      ? 'Register as Restaurant Owner'
                      : 'Register'}
                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Register