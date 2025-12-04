import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { scheduleAPI, routesAPI, busAPI, seatAPI } from '../../api/axios';
import BusMateLayout from '../layout/BusMateLayout';
import '../../styles/ScheduleManagement.css';

const ScheduleManagement = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // Handle bus selection and auto-set available seats
  const handleBusChange = (busId) => {
    const selectedBus = buses.find(bus => bus.id === parseInt(busId));
    const capacity = selectedBus?.busType?.capacity || 40;
    
    setFormData({
      ...formData,
      busId: busId,
      availableSeats: capacity.toString()
    });
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
        alert('Schedule updated successfully!');
      } else {
        const response = await scheduleAPI.create(scheduleData);
        console.log('Schedule created:', response.data);
        
        // Auto-generate seats based on bus capacity (no need to pass rows/cols)
        try {
          const seatResponse = await seatAPI.generate(response.data.id);
          console.log('Seats generated:', seatResponse.data);
          alert(`Schedule created successfully! ${seatResponse.data.totalSeats || 'Seats'} generated.`);
        } catch (seatError) {
          console.error('Failed to generate seats:', seatError);
          alert(`Schedule created but failed to generate seats: ${seatError.response?.data?.message || seatError.message}`);
        }
      }

      resetForm();
      loadData();
    } catch (error) {
      const errorMsg = error.response?.data?.error 
        || error.response?.data?.message 
        || (typeof error.response?.data === 'string' ? error.response?.data : null)
        || error.message 
        || `Failed to ${editingSchedule ? 'update' : 'create'} schedule`;
      alert(errorMsg);
      console.error('Schedule error:', error);
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
        const errorMsg = error.response?.data?.error || error.response?.data || error.message || 'Failed to delete schedule';
        alert(`Failed to delete schedule: ${errorMsg}`);
        console.error('Delete error:', error);
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

  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  if (loading) {
    return (
      <BusMateLayout>
        <div className="schedule-management-page">
          <div className="schedule-management-content">
            <p style={{ textAlign: 'center', color: '#64748b', marginTop: '2rem' }}>Loading schedules...</p>
          </div>
        </div>
      </BusMateLayout>
    );
  }

  return (
    <BusMateLayout>
      <div className="schedule-management-page">
        <div className="schedule-management-content">
          {/* Page Header */}
          <div className="schedule-page-header">
            <div className="schedule-header-content">
              <button className="schedule-back-link" onClick={handleBackToDashboard}>
                ← Back to Dashboard
              </button>
              <h1>Manage Schedules</h1>
              <p>Add, edit, or remove bus schedules</p>
            </div>
            <button className="schedule-add-btn" onClick={() => setShowForm(!showForm)}>
              + Add Schedule
            </button>
          </div>

          {/* Add Schedule Form */}
          {showForm && (
            <div className="schedule-add-form-container">
              <form onSubmit={handleSubmit} className="schedule-add-form">
                <h3>{editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}</h3>

                <div className="form-group">
                  <label>Route</label>
                  <select
                    value={formData.routeId}
                    onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                    required
                    className="form-select"
                  >
                    <option value="">Select Route</option>
                    {routes.map(route => (
                      <option key={route.id} value={route.id}>
                        {route.origin} → {route.destination}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Bus</label>
                  <select
                    value={formData.busId}
                    onChange={(e) => handleBusChange(e.target.value)}
                    required
                    className="form-select"
                  >
                    <option value="">Select Bus</option>
                    {buses.filter(bus => bus.status === 'ACTIVE').map(bus => (
                      <option key={bus.id} value={bus.id}>
                        Plate: {bus.plateNo} - {bus.busType?.name} ({bus.busType?.capacity} seats)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Travel Date</label>
                  <input
                    type="date"
                    value={formData.travelDate}
                    onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Departure Time</label>
                  <input
                    type="datetime-local"
                    value={formData.departureTime}
                    onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Arrival Time</label>
                  <input
                    type="datetime-local"
                    value={formData.arrivalTime}
                    onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Enter price"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Available Seats (Auto-filled)</label>
                  <input
                    type="number"
                    value={formData.availableSeats}
                    readOnly
                    className="form-input"
                    style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                  />
                  <small style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                    Automatically set based on selected bus capacity
                  </small>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
                  </button>
                  <button type="button" className="btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Schedules Cards */}
          {schedules.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', marginTop: '2rem' }}>No schedules added yet. Click "Add Schedule" to create one.</p>
          ) : (
            <div className="schedules-cards-container">
              {schedules.map(schedule => {
                // Parse departure time - backend sends as "HH:mm:ss" or "HH:mm"
                let departureHours = '00';
                let departureMinutes = '00';
                
                if (schedule.departureTime) {
                  if (typeof schedule.departureTime === 'string') {
                    // If it's a time string like "18:25:00"
                    const timeParts = schedule.departureTime.split(':');
                    departureHours = timeParts[0] || '00';
                    departureMinutes = timeParts[1] || '00';
                  } else {
                    // If it's a Date object or timestamp
                    const departureTime = new Date(schedule.departureTime);
                    if (!isNaN(departureTime.getTime())) {
                      departureHours = String(departureTime.getHours()).padStart(2, '0');
                      departureMinutes = String(departureTime.getMinutes()).padStart(2, '0');
                    }
                  }
                }
                
                return (
                  <div key={schedule.id} className="schedule-card">
                    <div className="schedule-card-content">
                      <div className="schedule-card-section">
                        <div className="schedule-card-label">Route</div>
                        <div className="schedule-card-value">
                          {schedule.route?.origin} → {schedule.route?.destination}
                        </div>
                      </div>

                      <div className="schedule-card-section">
                        <div className="schedule-card-label">Bus</div>
                        <div className="schedule-card-value">{schedule.bus?.plateNumber}</div>
                        <div className="schedule-bus-badge">{schedule.bus?.busType?.name}</div>
                      </div>

                      <div className="schedule-card-section">
                        <div className="schedule-card-label">Date & Time</div>
                        <div className="schedule-card-value">{schedule.travelDate}</div>
                        <div className="schedule-card-time">
                          <span className="time-icon">🕐</span>
                          <span>{departureHours}:{departureMinutes}</span>
                        </div>
                      </div>

                      <div className="schedule-card-section">
                        <div className="schedule-card-label">Price</div>
                        <div className="schedule-card-price">₱{schedule.price}</div>
                        <div className="schedule-card-seats">{schedule.availableSeats} seats available</div>
                      </div>
                    </div>

                    <div className="schedule-card-actions">
                      <button
                        className="schedule-action-btn edit"
                        onClick={() => handleEdit(schedule)}
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        className="schedule-action-btn delete"
                        onClick={() => handleDelete(schedule.id)}
                        title="Delete"
                      >
                        ✕
                      </button>
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

export default ScheduleManagement;
