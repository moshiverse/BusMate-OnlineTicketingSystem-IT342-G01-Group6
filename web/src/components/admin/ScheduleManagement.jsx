import { useState, useEffect } from 'react';
import { scheduleAPI, routesAPI, busAPI, seatAPI } from '../../api/axios';

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    routeId: '',
    busId: '',
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
        departureTime: formData.departureTime,
        arrivalTime: formData.arrivalTime,
        price: parseFloat(formData.price),
        availableSeats: parseInt(formData.availableSeats)
      };
      
      const response = await scheduleAPI.create(scheduleData);
      
      // Generate seats for the new schedule
      await seatAPI.generate(response.data.id, 10, 4);
      
      setFormData({
        routeId: '',
        busId: '',
        departureTime: '',
        arrivalTime: '',
        price: '',
        availableSeats: '40'
      });
      setShowForm(false);
      loadData();
    } catch (error) {
      alert(error.response?.data || 'Failed to create schedule');
    }
  };

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Schedule Management</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Schedule'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h3>Add New Schedule</h3>
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
          <button type="submit" className="btn-primary">Create Schedule</button>
        </form>
      )}

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Route</th>
              <th>Bus</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Price</th>
              <th>Available Seats</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map(schedule => (
              <tr key={schedule.id}>
                <td>{schedule.id}</td>
                <td>{schedule.route?.origin} → {schedule.route?.destination}</td>
                <td>{schedule.bus?.plateNumber}</td>
                <td>{new Date(schedule.departureTime).toLocaleString()}</td>
                <td>{new Date(schedule.arrivalTime).toLocaleString()}</td>
                <td>₱{schedule.price}</td>
                <td>{schedule.availableSeats}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleManagement;