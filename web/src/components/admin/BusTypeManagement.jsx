import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { busTypeAPI } from '../../api/axios'
import BusMateLayout from '../layout/BusMateLayout'
import '../../styles/BusTypeManagement.css'

const BusTypeManagement = () => {
  const navigate = useNavigate()
  const [busTypes, setBusTypes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingType, setEditingType] = useState(null)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    description: ''
  })

  // Handle bus type selection and auto-set capacity
  const handleBusTypeChange = (selectedType) => {
    const capacityMap = {
      'Standard': 41,
      'Premium': 53
    }
    
    setFormData({
      ...formData,
      name: selectedType,
      capacity: capacityMap[selectedType].toString()
    })
  }

  useEffect(() => {
    loadTypes()
  }, [])

  const loadTypes = async () => {
    try {
      setLoading(true)
      const res = await busTypeAPI.getAll()
      setBusTypes(res.data)
    } catch (err) {
      console.error('Failed to load types', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingType) {
        await busTypeAPI.update(editingType.id, {
          name: formData.name,
          capacity: parseInt(formData.capacity),
          description: formData.description
        })
      } else {
        await busTypeAPI.create({
          name: formData.name,
          capacity: parseInt(formData.capacity),
          description: formData.description
        })
      }

      resetForm()
      loadTypes()
    } catch (err) {
      alert(`Failed to ${editingType ? 'update' : 'create'} bus type.`)
    }
  }

  const handleEdit = (type) => {
    setFormData({
      name: type.name,
      capacity: type.capacity.toString(),
      description: type.description
    })
    setEditingType(type)
    setShowForm(true)
  }

  const handleDelete = async (typeId) => {
    if (window.confirm('Are you sure you want to delete this bus type?')) {
      try {
        await busTypeAPI.delete(typeId)
        loadTypes()
      } catch (error) {
        const errorMsg = error.response?.data?.error || error.response?.data || error.message || 'Failed to delete bus type'
        alert(`Failed to delete bus type: ${errorMsg}`)
        console.error('Delete error:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({ name: '', capacity: '', description: '' })
    setShowForm(false)
    setEditingType(null)
  }

  const handleBackToDashboard = () => {
    navigate('/admin')
  }

  if (loading) {
    return (
      <BusMateLayout>
        <div className="bus-type-management-page">
          <div className="bus-type-management-content">
            <p style={{ textAlign: 'center', color: '#64748b', marginTop: '2rem' }}>Loading bus types...</p>
          </div>
        </div>
      </BusMateLayout>
    )
  }

  return (
    <BusMateLayout>
      <div className="bus-type-management-page">
        <div className="bus-type-management-content">
          {/* Page Header */}
          <div className="bus-type-page-header">
            <div className="bus-type-header-content">
              <button className="bus-type-back-link" onClick={handleBackToDashboard}>
                ← Back to Dashboard
              </button>
              <h1>Manage Bus Types</h1>
              <p>Add, edit, or remove bus types</p>
            </div>
            <button className="bus-type-add-btn" onClick={() => setShowForm(!showForm)}>
              + Add Bus Type
            </button>
          </div>

          {/* Add Bus Type Form */}
          {showForm && (
            <div className="bus-type-add-form-container">
              <form onSubmit={handleSubmit} className="bus-type-add-form">
                <h3>{editingType ? 'Edit Bus Type' : 'Add New Bus Type'}</h3>

                <div className="form-group">
                  <label>Bus Type</label>
                  <select
                    value={formData.name}
                    onChange={(e) => handleBusTypeChange(e.target.value)}
                    required
                    className="form-input"
                  >
                    <option value="">Select Bus Type</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Capacity (Auto-set)</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    readOnly
                    className="form-input"
                    style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                  />
                  <small style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                    Standard: 41 seats | Premium: 53 seats
                  </small>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="Describe this bus type..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="form-textarea"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    {editingType ? 'Update Bus Type' : 'Add Bus Type'}
                  </button>
                  <button type="button" className="btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Bus Types List */}
          <div className="bus-types-cards-container">
            {busTypes.length === 0 ? (
              <p className="empty-state">No bus types found. Create one to get started.</p>
            ) : (
              busTypes.map((type) => (
                <div key={type.id} className="bus-type-card">
                  <div className="bus-type-card-content">
                    <div className="bus-type-card-section">
                      <p className="bus-type-card-label">Type Name</p>
                      <p className="bus-type-card-value">{type.name}</p>
                    </div>

                    <div className="bus-type-card-section">
                      <p className="bus-type-card-label">Capacity</p>
                      <p className="bus-type-card-value">{type.capacity} seats</p>
                    </div>

                    <div className="bus-type-card-section">
                      <p className="bus-type-card-label">Description</p>
                      <p className="bus-type-card-value">{type.description || '—'}</p>
                    </div>
                  </div>

                  <div className="bus-type-card-actions">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => handleEdit(type)}
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDelete(type.id)}
                      title="Delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </BusMateLayout>
  )
}

export default BusTypeManagement
