import { useState, useEffect } from 'react';
import { seatAPI } from '../../api/axios';

const SeatSelector = ({ schedule, onConfirm, onBack }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSeats();
  }, [schedule.id]);

  const loadSeats = async () => {
    try {
      const response = await seatAPI.getBySchedule(schedule.id);
      setSeats(response.data);
    } catch (error) {
      console.error('Failed to load seats:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seatNumber, status) => {
    if (status !== 'AVAILABLE') return;
    
    setSelectedSeats(prev => 
      prev.includes(seatNumber)
        ? prev.filter(s => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const totalAmount = selectedSeats.length * parseFloat(schedule.price);

  if (loading) return <div className="loading">Loading seats...</div>;

  return (
    <div className="seat-selector">
      <div className="selector-header">
        <button className="btn-secondary" onClick={onBack}>← Back</button>
        <h2>Select Your Seats</h2>
      </div>

      <div className="route-summary">
        <h3>{schedule.route?.origin} → {schedule.route?.destination}</h3>
        <p>{new Date(schedule.departureTime).toLocaleString()}</p>
      </div>

      <div className="seat-legend">
        <span className="legend-item">
          <div className="seat-box available"></div> Available
        </span>
        <span className="legend-item">
          <div className="seat-box selected"></div> Selected
        </span>
        <span className="legend-item">
          <div className="seat-box reserved"></div> Reserved
        </span>
      </div>

      <div className="bus-layout">
        <div className="driver-section">🚗 Driver</div>
        <div className="seat-grid">
          {seats.map(seat => (
            <button
              key={seat.id}
              className={`seat ${seat.status.toLowerCase()} ${
                selectedSeats.includes(seat.seatNumber) ? 'selected' : ''
              }`}
              onClick={() => toggleSeat(seat.seatNumber, seat.status)}
              disabled={seat.status !== 'AVAILABLE'}
            >
              {seat.seatNumber}
            </button>
          ))}
        </div>
      </div>

      <div className="booking-summary">
        <div className="summary-details">
          <p><strong>Selected Seats:</strong> {selectedSeats.join(', ') || 'None'}</p>
          <p><strong>Number of Seats:</strong> {selectedSeats.length}</p>
          <p><strong>Price per Seat:</strong> ₱{schedule.price}</p>
          <h3>Total Amount: ₱{totalAmount.toFixed(2)}</h3>
        </div>
        <button
          className="btn-primary btn-large"
          onClick={() => onConfirm(selectedSeats, totalAmount)}
          disabled={selectedSeats.length === 0}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default SeatSelector;