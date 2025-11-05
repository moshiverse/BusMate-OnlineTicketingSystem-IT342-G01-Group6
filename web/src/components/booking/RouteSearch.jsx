import { useState, useEffect } from 'react';
import { routesAPI, scheduleAPI } from '../../api/axios';

const RouteSearch = ({ onScheduleSelect }) => {
  const [routes, setRoutes] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [routesRes, schedulesRes] = await Promise.all([
        routesAPI.getAll(),
        scheduleAPI.getAll()
      ]);
      setRoutes(routesRes.data);
      setSchedules(schedulesRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchedules = selectedRoute
    ? schedules.filter(s => s.route?.id === parseInt(selectedRoute))
    : schedules;

  if (loading) return <div className="loading">Loading routes...</div>;

  return (
    <div className="route-search">
      <h2>Search Bus Routes</h2>
      
      <div className="search-filters">
        <div className="form-group">
          <label>Select Route</label>
          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="form-select"
          >
            <option value="">All Routes</option>
            {routes.map(route => (
              <option key={route.id} value={route.id}>
                {route.origin} → {route.destination}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="schedule-list">
        <h3>Available Schedules</h3>
        {filteredSchedules.length === 0 ? (
          <p>No schedules available</p>
        ) : (
          filteredSchedules.map(schedule => (
            <div key={schedule.id} className="schedule-card">
              <div className="schedule-info">
                <h4>{schedule.route?.origin} → {schedule.route?.destination}</h4>
                <p>Departure: {new Date(schedule.departureTime).toLocaleString()}</p>
                <p>Arrival: {new Date(schedule.arrivalTime).toLocaleString()}</p>
                <p>Price: ₱{schedule.price}</p>
                <p>Available Seats: {schedule.availableSeats}</p>
              </div>
              <button 
                className="btn-primary"
                onClick={() => onScheduleSelect(schedule)}
                disabled={schedule.availableSeats === 0}
              >
                {schedule.availableSeats === 0 ? 'Sold Out' : 'Select Seats'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RouteSearch;