import { useState } from 'react';
import { bookingAPI } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const BookingConfirmation = ({ schedule, selectedSeats, amount, onComplete }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState('');

  const handleConfirmBooking = async () => {
    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create booking
      const bookingResponse = await bookingAPI.create({
        userId: user.id,
        scheduleId: schedule.id,
        amount: amount,
        seatNumbers: selectedSeats
      });

      // Simulate payment confirmation
      const providerRef = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      await bookingAPI.confirm(bookingResponse.data.id, {
        providerRef: providerRef,
        amount: amount
      });

      onComplete({
        bookingId: bookingResponse.data.id,
        qrCode: bookingResponse.data.qrCodeText
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-confirmation">
      <h2>Confirm Your Booking</h2>

      <div className="confirmation-details">
        <div className="detail-section">
          <h3>Trip Details</h3>
          <p><strong>Route:</strong> {schedule.route?.origin} → {schedule.route?.destination}</p>
          <p><strong>Departure:</strong> {new Date(schedule.departureTime).toLocaleString()}</p>
          <p><strong>Arrival:</strong> {new Date(schedule.arrivalTime).toLocaleString()}</p>
        </div>

        <div className="detail-section">
          <h3>Seat Selection</h3>
          <p><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
          <p><strong>Number of Passengers:</strong> {selectedSeats.length}</p>
        </div>

        <div className="detail-section">
          <h3>Payment Details</h3>
          <p><strong>Price per Seat:</strong> ₱{schedule.price}</p>
          <p><strong>Total Amount:</strong> ₱{amount.toFixed(2)}</p>
        </div>

        <div className="detail-section">
          <h3>Payment Method</h3>
          <div className="payment-methods">
            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="gcash"
                checked={paymentMethod === 'gcash'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>GCash</span>
            </label>
            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="paymaya"
                checked={paymentMethod === 'paymaya'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>PayMaya</span>
            </label>
            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Credit/Debit Card</span>
            </label>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="confirmation-actions">
        <button
          className="btn-primary btn-large"
          onClick={handleConfirmBooking}
          disabled={loading || !paymentMethod}
        >
          {loading ? 'Processing...' : `Pay ₱${amount.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;