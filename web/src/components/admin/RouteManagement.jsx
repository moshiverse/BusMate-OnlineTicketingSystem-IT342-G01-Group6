import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { routesAPI } from '../../api/axios';
import BusMateLayout from '../layout/BusMateLayout';
import '../../styles/RouteManagement.css';

const RouteManagement = () => {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    distanceKm: '',
    durationMinutes: ''
  });

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      const response = await routesAPI.getAll();
      setRoutes(response.data || []);
    } catch (error) {
      console.error('Failed to load routes:', error);
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const routeData = {
        origin: formData.origin,
        destination: formData.destination,
        distanceKm: parseFloat(formData.distanceKm),
        durationMinutes: parseInt(formData.durationMinutes)
      };

      if (editingRoute) {
        await routesAPI.update(editingRoute.id, routeData);
      } else {
        await routesAPI.create(routeData);
      }
      resetForm();
      loadRoutes();
    } catch (error) {
      alert(`Failed to ${editingRoute ? 'update' : 'create'} route`);
    }
  };

  const handleEdit = (route) => {
    setFormData({
      origin: route.origin,
      destination: route.destination,
      distanceKm: (route.distanceKm || route.distance)?.toString() || '',
      durationMinutes: (route.durationMinutes || route.duration)?.toString() || ''
    });
    setEditingRoute(route);
    setShowForm(true);
  };

  const handleDelete = async (routeId) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        await routesAPI.delete(routeId);
        loadRoutes();
      } catch (error) {
        const errorMsg = error.response?.data?.error || error.response?.data || error.message || 'Failed to delete route';
        alert(`Failed to delete route: ${errorMsg}`);
        console.error('Delete error:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ origin: '', destination: '', distanceKm: '', durationMinutes: '' });
    setShowForm(false);
    setEditingRoute(null);
  };

  if (loading) {
    return (
      <BusMateLayout>
        <div className="route-management-page">
          <div className="route-management-content">
            <p style={{ textAlign: 'center', color: '#64748b' }}>Loading routes...</p>
          </div>
        </div>
      </BusMateLayout>
    );
  }

  return (
    <BusMateLayout>
      <div className="route-management-page">
        <div className="route-management-content">
          {/* Page Header */}
          <div className="route-page-header">
            <div className="route-header-content">
              <button className="route-back-link" onClick={handleBackToDashboard}>
                ← Back to Dashboard
              </button>
              <h1>Manage Routes</h1>
              <p>Add, edit, or remove bus routes</p>
            </div>
            <button className="route-add-btn" onClick={() => setShowForm(!showForm)}>
              + Add Route
            </button>
          </div>

          {/* Add Route Form */}
          {showForm && (
          <div className="route-add-form-container">
            <form onSubmit={handleSubmit} className="route-add-form">
              <h3>{editingRoute ? 'Edit Route' : 'Add New Route'}</h3>
              <div className="form-group">
                <label>Origin City</label>
                <input
                  type="text"
                  placeholder="e.g., Manila"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Destination City</label>
                <input
                  type="text"
                  placeholder="e.g., Cebu"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Distance (km)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 567.5"
                  value={formData.distanceKm}
                  onChange={(e) => setFormData({ ...formData, distanceKm: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  placeholder="e.g., 480"
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingRoute ? 'Update Route' : 'Add Route'}
                </button>
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Routes Grid */}
        {routes.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', marginTop: '2rem' }}>No routes added yet. Click "Add Route" to create one.</p>
        ) : (
          <div className="routes-cards-grid">
            {routes.map((route) => {
              // Handle both distanceKm and distance (backend uses @JsonProperty)
              const distance = route.distanceKm || route.distance || 0;
              const duration = route.durationMinutes || route.duration || 0;
              const hours = Math.floor(duration / 60);
              const minutes = duration % 60;
              const durationStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
              
              return (
                <div key={route.id} className="route-card">
                  <div className="route-card-header">
                    <div className="route-name">
                      <span className="route-icon">📍</span>
                      <span className="route-text">{route.origin} → {route.destination}</span>
                    </div>
                    <div className="route-actions">
                      <button
                        className="route-action-btn edit"
                        onClick={() => handleEdit(route)}
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        className="route-action-btn delete"
                        onClick={() => handleDelete(route.id)}
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="route-card-details">
                    <div className="route-detail">
                      <p className="detail-label">Distance</p>
                      <p className="detail-value">{distance} km</p>
                    </div>
                    <div className="route-detail">
                      <p className="detail-label">Duration</p>
                      <p className="detail-value">{durationStr}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </div>
      </div>
    </BusMateLayout>
  );
};

export default RouteManagement;