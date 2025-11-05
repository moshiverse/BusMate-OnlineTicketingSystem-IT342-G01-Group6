import { useState, useEffect } from 'react';
import { routesAPI } from '../../api/axios';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [showForm, setShowForm] = useState(false);
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
      await routesAPI.create(formData);
      setFormData({ origin: '', destination: '', distance: '', duration: '' });
      setShowForm(false);
      loadRoutes();
    } catch (error) {
      alert('Failed to create route');
    }
  };

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Route Management</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Route'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h3>Add New Route</h3>
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
          <button type="submit" className="btn-primary">Add Route</button>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RouteManagement;