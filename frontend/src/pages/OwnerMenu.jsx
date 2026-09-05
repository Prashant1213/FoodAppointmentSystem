import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../axios'

function OwnerMenu() {
  const navigate = useNavigate()

  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState({})
  const [uploadingId, setUploadingId] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  })

  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchMenu()
  }, [])

  const fetchMenu = async () => {
    try {
      const response = await api.get('/api/owner/menu-items')
      setMenuItems(response.data)
    } catch (error) {
      console.error(error)
      setMessage('Unable to load menu items.')
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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: ''
    })

    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setSaving(true)
    setMessage('')

    try {
      const data = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category
      }

      if (editingId) {
        await api.put(
          `/api/owner/menu-items/${editingId}`,
          data
        )

        setMessage('Menu item updated successfully.')
      } else {
        await api.post(
          '/api/owner/menu-items',
          data
        )

        setMessage('Menu item added successfully.')
      }

      resetForm()
      fetchMenu()

    } catch (error) {
      console.error(error)
      setMessage('Failed to save menu item.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)

    setFormData({
      name: item.name || '',
      description: item.description || '',
      price: item.price || '',
      category: item.category || ''
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handleFileChange = (id, file) => {
    setSelectedFiles((currentFiles) => ({
      ...currentFiles,
      [id]: file
    }))
  }
  
    const handleImageUpload = async (id) => {
    const file = selectedFiles[id]
  
    if (!file) {
      setMessage('Please select an image first.')
      return
    }
  
    const formData = new FormData()
    formData.append('file', file)
  
    setUploadingId(id)
    setMessage('')
  
    try {
      await api.post(
        `/api/owner/menu-items/${id}/image`,
        formData
      )
  
      setMessage('Menu item image uploaded successfully.')
  
      setSelectedFiles((currentFiles) => {
        const updatedFiles = { ...currentFiles }
        delete updatedFiles[id]
        return updatedFiles
      })
  
      fetchMenu()
  
    } catch (error) {
      console.error(error)
  
      const errorMessage =
        error.response?.data ||
        'Failed to upload menu item image.'
  
      setMessage(errorMessage)
  
    } finally {
      setUploadingId(null)
    }
  }
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this menu item?'
    )

    if (!confirmed) {
      return
    }

    try {
      await api.delete(
        `/api/owner/menu-items/${id}`
      )

      setMessage('Menu item deleted successfully.')
      fetchMenu()

    } catch (error) {
      console.error(error)
      setMessage('Failed to delete menu item.')
    }
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h4>Loading menu...</h4>
      </div>
    )
  }

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>My Menu</h2>
          <p className="text-muted mb-0">
            Add and manage your restaurant menu
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

      {/* Add / Edit Form */}

      <div className="card shadow-sm mb-4">
        <div className="card-body">

          <h5 className="mb-4">
            {editingId
              ? 'Edit Menu Item'
              : 'Add New Menu Item'}
          </h5>

          <form onSubmit={handleSubmit}>

            <div className="row">

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Item Name
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

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  className="form-control"
                  placeholder="e.g. Starter, Main Course"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  className="form-control"
                  min="1"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Description
                </label>

                <input
                  type="text"
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

            </div>

            <button
              type="submit"
              className="btn btn-primary me-2"
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : editingId
                  ? 'Update Item'
                  : 'Add Item'}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}

          </form>

        </div>
      </div>

      {/* Menu List */}

      <div className="card shadow-sm">

        <div className="card-body">

          <h5 className="mb-3">
            Menu Items
          </h5>

          {menuItems.length === 0 ? (
            <div className="alert alert-warning mb-0">
              No menu items found. Add your first menu item above.
            </div>
          ) : (
            <div className="table-responsive">

              <table className="table table-bordered table-hover align-middle">

                <thead className="table-light">
                  <tr>
                     <th>#</th>
                     <th>Image</th>
                     <th>Name</th>
                     <th>Category</th>
                     <th>Description</th>
                     <th>Price</th>
                     <th>Actions</th>
                </tr>
                </thead>

                <tbody>

                  {menuItems.map((item, index) => (
                    <tr key={item.id}>

                      <td>{index + 1}</td>

                      <td style={{ minWidth: '220px' }}>
                      
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            style={{
                              width: '100px',
                              height: '75px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              display: 'block',
                              marginBottom: '8px'
                            }}
                          />
                        ) : (
                          <div
                            className="bg-light d-flex align-items-center justify-content-center"
                            style={{
                              width: '100px',
                              height: '75px',
                              borderRadius: '8px',
                              marginBottom: '8px'
                            }}
                          >
                            🍽️
                          </div>
                        )}
                      
                        <input
                          type="file"
                          className="form-control form-control-sm mb-2"
                          accept=".jpg,.jpeg,.png,.webp"
                          onChange={(e) =>
                            handleFileChange(
                              item.id,
                              e.target.files[0]
                            )
                          }
                        />
                      
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleImageUpload(item.id)}
                          disabled={uploadingId === item.id}
                        >
                          {uploadingId === item.id
                            ? 'Uploading...'
                            : item.imageUrl
                              ? 'Change Image'
                              : 'Upload Image'}
                        </button>
                      
                      </td>
                      
                      <td>
                        <strong>{item.name}</strong>
                      </td>

                      <td>
                        <span className="badge bg-secondary">
                          {item.category}
                        </span>
                      </td>

                      <td>
                        {item.description || '-'}
                      </td>

                      <td>
                        ₹{item.price}
                      </td>

                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

    </div>
  )
}

export default OwnerMenu