import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { busAPI, busTypeAPI } from '../../api/axios';
import BusMateLayout from '../layout/BusMateLayout';
import '../../styles/BusManagement.css';

const BusManagementPage = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [busTypes, setBusTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBusId, setEditingBusId] = useState(null);
  const [formData, setFormData] = useState({
    busNumber: '',
    plateNo: '',
    busTypeId: '',
    status: 'ACTIVE'
  });

  // Fetch buses and bus types on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [busesRes, typesRes] = await Promise.all([
        busAPI.getAll(),
        busTypeAPI.getAll()
      ]);
      setBuses(busesRes.data || []);
      setBusTypes(typesRes.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setBuses([]);
      setBusTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  const handleAddBus = async (e) => {
    e.preventDefault();
    if (!formData.busNumber || !formData.busTypeId) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingBusId) {
        // Update existing bus
        await busAPI.update(editingBusId, {
          busNumber: formData.busNumber,
          plateNo: formData.plateNo,
          busTypeId: parseInt(formData.busTypeId),
          status: formData.status
        });
      } else {
        // Create new bus
        await busAPI.create({
          busNumber: formData.busNumber,
          plateNo: formData.plateNo,
          busTypeId: parseInt(formData.busTypeId),
          status: formData.status
        });
      }
      setFormData({ busNumber: '', plateNo: '', busTypeId: '', status: 'ACTIVE' });
      setEditingBusId(null);
      setShowAddForm(false);
      await fetchData(); // Refresh the list
    } catch (error) {
      console.error('Failed to save bus:', error);
      alert('Failed to save bus');
    }
  };

  const handleEditBus = (bus) => {
    setEditingBusId(bus.id);
    setFormData({
      busNumber: bus.busNumber,
      plateNo: bus.plateNo || '',
      busTypeId: bus.busTypeId || '',
      status: bus.status
    });
    setShowAddForm(true);
  };

  const handleCancelEdit = () => {
    setEditingBusId(null);
    setFormData({ busNumber: '', plateNo: '', busTypeId: '', status: 'ACTIVE' });
    setShowAddForm(false);
  };

  const handleDeleteBus = async (busId) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        await busAPI.delete(busId);
        await fetchData(); // Refresh the list
      } catch (error) {
        const errorMsg = error.response?.data?.error || error.response?.data || error.message || 'Failed to delete bus';
        alert(`Failed to delete bus: ${errorMsg}`);
        console.error('Delete error:', error);
      }
    }
  };

  if (loading) {
    return (
      <BusMateLayout>
        <div className="bus-management-page">
          <div className="bus-management-content">
            <p style={{ textAlign: 'center', color: '#64748b' }}>Loading buses...</p>
          </div>
        </div>
      </BusMateLayout>
    );
  }

  return (
    <BusMateLayout>
      <div className="bus-management-page">
        <div className="bus-management-content">
          {/* Page Header */}
          <div className="bus-page-header">
            <div className="bus-header-info">
              <button className="bus-back-btn" onClick={handleBackToDashboard}>
                ← Back to Dashboard
              </button>
              <h1>Manage Buses</h1>
              <p>Add, edit, or remove buses from your fleet</p>
            </div>
            <button className="bus-add-btn" onClick={() => setShowAddForm(!showAddForm)}>
              <span>+</span> Add Bus
            </button>
          </div>

          {/* Add Bus Form */}
          {showAddForm && (
          <div className="bus-form-container">
            <form onSubmit={handleAddBus} className="bus-form">
              <h3>{editingBusId ? 'Edit Bus' : 'Add New Bus'}</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Bus Number *</label>
                  <input
                    type="text"
                    placeholder="e.g., BM-001"
                    value={formData.busNumber}
                    onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Plate Number</label>
                  <input
                    type="text"
                    placeholder="e.g., ABC 1234"
                    value={formData.plateNo}
                    onChange={(e) => setFormData({ ...formData, plateNo: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Bus Type *</label>
                  <select
                    value={formData.busTypeId}
                    onChange={(e) => setFormData({ ...formData, busTypeId: e.target.value })}
                    required
                  >
                    <option value="">Select a bus type</option>
                    {busTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name} ({type.capacity} seats)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="RETIRED">Retired</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingBusId ? 'Update Bus' : 'Add Bus'}
                </button>
                <button type="button" className="btn-secondary" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Bus Cards Grid */}
        {buses.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', marginTop: '2rem' }}>
            No buses added yet. Click "Add Bus" to create one.
          </p>
        ) : (
          <div className="bus-cards-grid">
            {buses.map((bus) => (
              <div key={bus.id} className="bus-card">
                {/* Card Header */}
                <div className="bus-card-header">
                  <div className="bus-card-info">
                    <h3 className="bus-card-number">{bus.busNumber}</h3>
                    <span className="bus-card-type">{bus.busType?.name}</span>
                  </div>
                  <div className="bus-card-actions">
                    <button 
                      className="bus-action-btn edit"
                      onClick={() => handleEditBus(bus)}
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button 
                      className="bus-action-btn delete"
                      onClick={() => handleDeleteBus(bus.id)}
                      title="Delete"
                    >
                      🗑
                    </button>
                  </div>
                </div>

                {/* Card Details */}
                <div className="bus-card-body">
                  <div className="bus-detail-section">
                    <label className="bus-detail-label">Capacity</label>
                    <p className="bus-detail-value">{bus.busType?.capacity || 0} seats</p>
                  </div>
                  <div className="bus-detail-section">
                    <label className="bus-detail-label">Amenities</label>
                    <div className="bus-amenities">
                      <span className="amenity-badge">WiFi</span>
                      <span className="amenity-badge">AC</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="bus-card-footer">
                  <label className="bus-status-label">Status</label>
                  <span className={`bus-status-badge status-${bus.status?.toLowerCase()}`}>
                    {bus.status === 'ACTIVE' ? 'Active' : bus.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </BusMateLayout>
  );
};

export default BusManagementPage;
