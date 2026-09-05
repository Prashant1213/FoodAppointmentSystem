import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../axios'

function OwnerRestaurant() {
  const navigate = useNavigate()

  const [restaurant, setRestaurant] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    cuisine: ''
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchRestaurant()
  }, [])

  const fetchRestaurant = async () => {
    try {
      const response = await api.get('/api/owner/restaurant')

      setRestaurant(response.data)

      setFormData({
        name: response.data.name || '',
        location: response.data.location || '',
        cuisine: response.data.cuisine || ''
      })
    } catch (error) {
      console.error(error)
      setMessage('Unable to load restaurant information.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setSaving(true)
    setMessage('')

    try {
      const response = await api.put(
        '/api/owner/restaurant',
        formData
      )

      setRestaurant(response.data)

      setFormData({
        name: response.data.name || '',
        location: response.data.location || '',
        cuisine: response.data.cuisine || ''
      })

      setMessage('Restaurant updated successfully.')
    } catch (error) {
      console.error(error)
      setMessage('Failed to update restaurant.')
    } finally {
      setSaving(false)
    }
  }

    const handleImageUpload = async () => {
    if (!imageFile) {
      setMessage('Please select an image first.')
      return
    }
  
    setUploading(true)
    setMessage('')
  
    try {
      const data = new FormData()
      data.append('file', imageFile)
  
      const response = await api.post(
        '/api/owner/restaurant/image',
        data
      )
  
      setRestaurant(response.data)
      setImageFile(null)
  
      setMessage('Restaurant image uploaded successfully.')
    } catch (error) {
      console.error(error)
  
      setMessage(
        error.response?.data ||
        'Failed to upload restaurant image.'
      )
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h4>Loading...</h4>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Restaurant information not found.
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>My Restaurant</h2>
          <p className="text-muted">
            Manage your restaurant information
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => navigate('/owner/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>

      {message && (
        <div className="alert alert-info">
          {message}
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">

          <h5 className="mb-4">
            Restaurant Details
          </h5>

          <div className="mb-4">

          <label className="form-label fw-bold">
            Restaurant Image
          </label>
        
          {restaurant.imageUrl && (
            <div className="mb-3">
              <img
                src={restaurant.imageUrl}
                alt={restaurant.name}
                className="img-fluid rounded"
                style={{
                  maxHeight: '250px',
                  width: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}
        
          <input
            type="file"
            className="form-control"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={(e) =>
              setImageFile(e.target.files[0])
            }
          />
        
          <small className="text-muted">
            JPG, JPEG, PNG or WEBP only.
          </small>
        
          <button
            type="button"
            className="btn btn-success mt-3"
            onClick={handleImageUpload}
            disabled={uploading || !imageFile}
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        
        </div>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">
                Restaurant Name
              </label>

              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Location
              </label>

              <input
                type="text"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">
                Cuisine
              </label>

              <input
                type="text"
                name="cuisine"
                className="form-control"
                value={formData.cuisine}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">
                Rating
              </label>

              <input
                type="text"
                className="form-control"
                value={restaurant.rating}
                disabled
              />

              <small className="text-muted">
                Rating is managed by customer reviews.
              </small>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

          </form>

        </div>
      </div>

    </div>
  )
}

export default OwnerRestaurant