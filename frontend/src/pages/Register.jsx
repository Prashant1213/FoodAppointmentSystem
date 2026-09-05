import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
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

    const handleSubmit = async (e) => {
    e.preventDefault()
  
    setMessage('')
    setError('')
    setLoading(true)
  
    try {
  
      const response = await axios.post(
        'http://localhost:8080/api/auth/register',
        formData
      )
  
      setMessage(response.data)
  
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: ''
      })
  
      setTimeout(() => {
        navigate('/login')
      }, 1500)
  
    } catch (error) {
  
      console.error(error)
  
      if (error.response) {
        setError(error.response.data)
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

      <div className="col-md-6">

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


              {/* Register Button */}
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >

                {loading
                  ? 'Creating Account...'
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