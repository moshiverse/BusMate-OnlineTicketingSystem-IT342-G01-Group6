import { useState, useEffect } from 'react';
import { busAPI, busTypeAPI } from '../../api/axios';

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [busTypes, setBusTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    plateNumber: '',
    busTypeId: '',
    status: 'ACTIVE'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [busesRes, typesRes] = await Promise.all([
        busAPI.getAll(),
        busTypeAPI.getAll()
      ]);
      setBuses(busesRes.data);
      setBusTypes(typesRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await busAPI.create({
        plateNumber: formData.plateNumber,
        busType: { id: parseInt(formData.busTypeId) },
        status: formData.status
      });
      setFormData({ plateNumber: '', busTypeId: '', status: 'ACTIVE' });
      setShowForm(false);
      loadData();
    } catch (error) {
      alert('Failed to create bus');
    }
  };

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Bus Management</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Bus'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h3>Add New Bus</h3>
          <input
            type="text"
            placeholder="Plate Number"
            value={formData.plateNumber}
            onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
            required
          />
          <select
            value={formData.busTypeId}
            onChange={(e) => setFormData({ ...formData, busTypeId: e.target.value })}
            required
          >
            <option value="">Select Bus Type</option>
            {busTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name} - {type.capacity} seats
              </option>
            ))}
          </select>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="ACTIVE">Active</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="RETIRED">Retired</option>
          </select>
          <button type="submit" className="btn-primary">Add Bus</button>
        </form>
      )}

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Plate Number</th>
              <th>Bus Type</th>
              <th>Capacity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {buses.map(bus => (
              <tr key={bus.id}>
                <td>{bus.id}</td>
                <td>{bus.plateNumber}</td>
                <td>{bus.busType?.name}</td>
                <td>{bus.busType?.capacity}</td>
                <td>
                  <span className={`status-badge ${bus.status.toLowerCase()}`}>
                    {bus.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusManagement;
