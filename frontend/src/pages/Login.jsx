import { useState } from 'react'
import axios from 'axios'

function Login() {

  const [formData, setFormData] = useState({
    email: '',
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
        'http://localhost:8080/api/auth/login',
        formData
      )

      const data = response.data
      
      localStorage.setItem(
        'token',
        data.token
      )
      
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: data.userId,
          name: data.name,
          email: data.email,
          role: data.role
        })
      )
      
      setMessage(data.message)

      setTimeout(() => {
        if (data.role === 'ADMIN') {
          window.location.href = '/admin/dashboard'
        } else if (data.role === 'RESTAURANT_OWNER') {
          window.location.href = '/owner/dashboard'
        } else {
          window.location.href = '/'
        }
      }, 1000)

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

        <div className="col-md-6 col-lg-5">

          <div className="card shadow-sm border-0">

            <div className="card-body p-4">

              <h2 className="text-center fw-bold mb-4">
                Login
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

                {/* Password */}

                <div className="mb-4">

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

                {/* Login Button */}

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Login