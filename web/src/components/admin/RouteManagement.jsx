import { useState, useEffect } from 'react';
import { routesAPI } from '../../api/axios';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    distance: '',
    duration: ''
  });

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      const response = await routesAPI.getAll();
      setRoutes(response.data);
    } catch (error) {
      console.error('Failed to load routes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoute) {
        await routesAPI.update(editingRoute.id, formData);
      } else {
        await routesAPI.create(formData);
      }
      setFormData({ origin: '', destination: '', distance: '', duration: '' });
      setShowForm(false);
      setEditingRoute(null);
      loadRoutes();
    } catch (error) {
      alert(`Failed to ${editingRoute ? 'update' : 'create'} route`);
    }
  };

  const handleEdit = (route) => {
    setFormData({
      origin: route.origin,
      destination: route.destination,
      distance: route.distance,
      duration: route.duration
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
        alert('Failed to delete route');
      }
    }
  };

  const handleCancel = () => {
    setFormData({ origin: '', destination: '', distance: '', duration: '' });
    setShowForm(false);
    setEditingRoute(null);
  };

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Route Management</h2>
        <button className="btn-primary" onClick={() => {
          if (showForm) {
            handleCancel();
          } else {
            setShowForm(true);
          }
        }}>
          {showForm ? 'Cancel' : 'Add Route'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h3>{editingRoute ? 'Edit Route' : 'Add New Route'}</h3>
          <input
            type="text"
            placeholder="Origin"
            value={formData.origin}
            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Destination"
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Distance (km)"
            value={formData.distance}
            onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            required
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-primary">
              {editingRoute ? 'Update Route' : 'Add Route'}
            </button>
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Distance (km)</th>
              <th>Duration (min)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map(route => (
              <tr key={route.id}>
                <td>{route.id}</td>
                <td>{route.origin}</td>
                <td>{route.destination}</td>
                <td>{route.distance}</td>
                <td>{route.duration}</td>
                <td>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                      className="btn-secondary btn-small"
                      onClick={() => handleEdit(route)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-danger btn-small"
                      onClick={() => handleDelete(route.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RouteManagement;