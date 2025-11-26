import { useState, useEffect } from 'react';
import { busAPI, busTypeAPI } from '../../api/axios';

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [busTypes, setBusTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [formData, setFormData] = useState({
    busNumber: '',
    plateNo: '',
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
      if (editingBus) {
        await busAPI.update(editingBus.id, {
          busNumber: formData.busNumber,
          plateNo: formData.plateNo,
          busTypeId: parseInt(formData.busTypeId),
          status: formData.status
        });
      } else {
        await busAPI.create({
          busNumber: formData.busNumber,
          plateNo: formData.plateNo,
          busTypeId: parseInt(formData.busTypeId),
          status: formData.status
        });
      }
      setFormData({ busNumber: '', plateNo: '', busTypeId: '', status: 'ACTIVE' });
      setShowForm(false);
      setEditingBus(null);
      loadData();
    } catch (error) {
      alert(`Failed to ${editingBus ? 'update' : 'create'} bus`);
    }
  };

  const handleEdit = (bus) => {
    setFormData({
      busNumber: bus.busNumber,
      plateNo: bus.plateNo,
      busTypeId: bus.busType.id.toString(),
      status: bus.status
    });
    setEditingBus(bus);
    setShowForm(true);
  };

  const handleDelete = async (busId) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        await busAPI.delete(busId);
        loadData();
      } catch (error) {
        alert('Failed to delete bus');
      }
    }
  };

  const handleCancel = () => {
    setFormData({ busNumber: '', plateNo: '', busTypeId: '', status: 'ACTIVE' });
    setShowForm(false);
    setEditingBus(null);
  };

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Bus Management</h2>
        <button className="btn-primary" onClick={() => {
          if (showForm) {
            handleCancel();
          } else {
            setShowForm(true);
          }
        }}>
          {showForm ? 'Cancel' : 'Add Bus'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h3>{editingBus ? 'Edit Bus' : 'Add New Bus'}</h3>
          <input
            type="text"
            placeholder="Bus Number"
            value={formData.busNumber}
            onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Plate Number"
            value={formData.plateNo}
            onChange={(e) => setFormData({ ...formData, plateNo: e.target.value })}
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
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-primary">
              {editingBus ? 'Update Bus' : 'Add Bus'}
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
              <th>Bus Number</th>
              <th>Plate Number</th>
              <th>Bus Type</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map(bus => (
              <tr key={bus.id}>
                <td>{bus.id}</td>
                <td>{bus.busNumber}</td>
                <td>{bus.plateNo}</td>
                <td>{bus.busType?.name}</td>
                <td>{bus.busType?.capacity}</td>
                <td>
                  <span className={`status-badge ${bus.status.toLowerCase()}`}>
                    {bus.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                      className="btn-secondary btn-small"
                      onClick={() => handleEdit(bus)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-danger btn-small"
                      onClick={() => handleDelete(bus.id)}
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

export default BusManagement;
