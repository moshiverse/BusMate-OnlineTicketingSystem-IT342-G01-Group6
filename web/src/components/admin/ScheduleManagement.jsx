import { useState, useEffect } from 'react';
import { scheduleAPI, routesAPI, busAPI, seatAPI } from '../../api/axios';

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  const [formData, setFormData] = useState({
    routeId: '',
    busId: '',
    travelDate: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    availableSeats: '40'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [schedulesRes, routesRes, busesRes] = await Promise.all([
        scheduleAPI.getAll(),
        routesAPI.getAll(),
        busAPI.getAll()
      ]);
      setSchedules(schedulesRes.data);
      setRoutes(routesRes.data);
      setBuses(busesRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const scheduleData = {
        route: { id: parseInt(formData.routeId) },
        bus: { id: parseInt(formData.busId) },
        travelDate: formData.travelDate,
        departureTime: formData.departureTime,
        arrivalTime: formData.arrivalTime,
        price: parseFloat(formData.price),
        availableSeats: parseInt(formData.availableSeats)
      };

      if (editingSchedule) {
        await scheduleAPI.update(editingSchedule.id, scheduleData);
      } else {
        const response = await scheduleAPI.create(scheduleData);
        await seatAPI.generate(response.data.id, 10, 4);
      }

      resetForm();
      loadData();
    } catch (error) {
      alert(error.response?.data || `Failed to ${editingSchedule ? 'update' : 'create'} schedule`);
    }
  };

  const handleEdit = (schedule) => {
    setFormData({
      routeId: schedule.route?.id.toString(),
      busId: schedule.bus?.id.toString(),
      travelDate: schedule.travelDate,
      departureTime: schedule.departureTime.slice(0, 16),
      arrivalTime: schedule.arrivalTime.slice(0, 16),
      price: schedule.price.toString(),
      availableSeats: schedule.availableSeats.toString()
    });
    setEditingSchedule(schedule);
    setShowForm(true);
  };

  const handleDelete = async (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await scheduleAPI.delete(scheduleId);
        loadData();
      } catch (error) {
        alert('Failed to delete schedule');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      routeId: '',
      busId: '',
      travelDate: '',
      departureTime: '',
      arrivalTime: '',
      price: '',
      availableSeats: '40'
    });
    setShowForm(false);
    setEditingSchedule(null);
  };

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Schedule Management</h2>
        <button className="btn-primary" onClick={() => showForm ? resetForm() : setShowForm(true)}>
          {showForm ? 'Cancel' : 'Add Schedule'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h3>{editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}</h3>

          <select
            value={formData.routeId}
            onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
            required
          >
            <option value="">Select Route</option>
            {routes.map(route => (
              <option key={route.id} value={route.id}>
                {route.origin} → {route.destination}
              </option>
            ))}
          </select>

          <select
            value={formData.busId}
            onChange={(e) => setFormData({ ...formData, busId: e.target.value })}
            required
          >
            <option value="">Select Bus</option>
            {buses.filter(bus => bus.status === 'ACTIVE').map(bus => (
              <option key={bus.id} value={bus.id}>
                {bus.plateNumber} - {bus.busType?.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={formData.travelDate}
            onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
            required
          />

          <input
            type="datetime-local"
            value={formData.departureTime}
            onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
            required
          />

          <input
            type="datetime-local"
            value={formData.arrivalTime}
            onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Price"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Available Seats"
            value={formData.availableSeats}
            onChange={(e) => setFormData({ ...formData, availableSeats: e.target.value })}
            required
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-primary">
              {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
            </button>
            <button type="button" className="btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Route</th>
              <th>Bus</th>
              <th>Travel Date</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Price</th>
              <th>Available Seats</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map(schedule => (
              <tr key={schedule.id}>
                <td>{schedule.id}</td>
                <td>{schedule.route?.origin} → {schedule.route?.destination}</td>
                <td>{schedule.bus?.plateNumber}</td>
                <td>{schedule.travelDate}</td>
                <td>{new Date(schedule.departureTime).toLocaleString()}</td>
                <td>{new Date(schedule.arrivalTime).toLocaleString()}</td>
                <td>₱{schedule.price}</td>
                <td>{schedule.availableSeats}</td>
                <td>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button className="btn-secondary btn-small" onClick={() => handleEdit(schedule)}>
                      Edit
                    </button>
                    <button className="btn-danger btn-small" onClick={() => handleDelete(schedule.id)}>
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

export default ScheduleManagement;
