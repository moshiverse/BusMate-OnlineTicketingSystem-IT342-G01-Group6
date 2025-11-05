import { useState } from 'react';
import RouteSearch from '../components/booking/RouteSearch';
import SeatSelector from '../components/booking/SeatSelector';
import BookingConfirmation from '../components/booking/BookingConfirmation';

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [amount, setAmount] = useState(0);
  const [bookingResult, setBookingResult] = useState(null);

  const handleScheduleSelect = (schedule) => {
    setSelectedSchedule(schedule);
    setStep(2);
  };

  const handleSeatConfirm = (seats, totalAmount) => {
    setSelectedSeats(seats);
    setAmount(totalAmount);
    setStep(3);
  };

  const handleBookingComplete = (result) => {
    setBookingResult(result);
    setStep(4);
  };

  const resetBooking = () => {
    setStep(1);
    setSelectedSchedule(null);
    setSelectedSeats([]);
    setAmount(0);
    setBookingResult(null);
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Select Route</span>
          </div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Choose Seats</span>
          </div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Payment</span>
          </div>
          <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
            <span className="step-number">4</span>
            <span className="step-label">Confirmation</span>
          </div>
        </div>

        <div className="booking-content">
          {step === 1 && <RouteSearch onScheduleSelect={handleScheduleSelect} />}
          
          {step === 2 && (
            <SeatSelector
              schedule={selectedSchedule}
              onConfirm={handleSeatConfirm}
              onBack={() => setStep(1)}
            />
          )}
          
          {step === 3 && (
            <BookingConfirmation
              schedule={selectedSchedule}
              selectedSeats={selectedSeats}
              amount={amount}
              onComplete={handleBookingComplete}
            />
          )}
          
          {step === 4 && (
            <div className="booking-success">
              <div className="success-icon">✅</div>
              <h2>Booking Confirmed!</h2>
              <div className="booking-details">
                <p><strong>Booking ID:</strong> {bookingResult.bookingId}</p>
                <p><strong>QR Code:</strong> {bookingResult.qrCode}</p>
                <p><strong>Route:</strong> {selectedSchedule.route?.origin} → {selectedSchedule.route?.destination}</p>
                <p><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
                <p><strong>Total Paid:</strong> ₱{amount.toFixed(2)}</p>
              </div>
              <div className="qr-code-placeholder">
                <p>📱 Show this QR code at boarding</p>
                <div className="qr-display">{bookingResult.qrCode}</div>
              </div>
              <button className="btn-primary" onClick={resetBooking}>
                Book Another Ticket
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
