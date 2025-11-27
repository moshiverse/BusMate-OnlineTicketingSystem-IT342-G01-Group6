import { formatCurrency, formatDateLabel, formatTimeLabel } from '../../utils/formatters'

const BookingSuccess = ({ details, onBookAgain, onViewBookings }) => {
  const { bookingId, qrCode, referenceCode, schedule, seats = [], amount, passengerName } = details
  const routeLabel = `${schedule.route?.origin} → ${schedule.route?.destination}`
  const travelDate = `${formatDateLabel(schedule.travelDate)} ${formatTimeLabel(schedule.departureTime)}`
  const qrSrc = qrCode
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrCode)}`
    : null

  return (
    <div className="booking-success">
      <div className="success-alert">
        <span role="img" aria-label="confetti">
          ✨
        </span>
        Payment Successful
      </div>

      <div className="boarding-pass">
        <header>
          <div>
            <p className="eyebrow">Booking ID</p>
            <h3>{bookingId}</h3>
          </div>
          <span className="status-pill confirmed">CONFIRMED</span>
        </header>

        <div className="pass-grid">
          <div>
            <p className="eyebrow">Passenger</p>
            <h4>{passengerName || 'You'}</h4>
          </div>
          <div>
            <p className="eyebrow">Route</p>
            <h4>{routeLabel}</h4>
          </div>
          <div>
            <p className="eyebrow">Travel Date</p>
            <h4>{travelDate}</h4>
          </div>
          <div>
            <p className="eyebrow">Seats</p>
            <h4>{seats.join(', ')}</h4>
          </div>
          <div>
            <p className="eyebrow">Total Paid</p>
            <h4>{formatCurrency(amount, { withCents: true })}</h4>
          </div>
          <div>
            <p className="eyebrow">Reference Code</p>
            <h4>{referenceCode}</h4>
          </div>
        </div>

        <div className="qr-section">
          {qrSrc ? <img src={qrSrc} alt="E-ticket QR code" /> : <div className="qr-placeholder" />}
          <p>Present this QR code at the terminal for contactless boarding</p>
        </div>

        <div className="important-info">
          <p>Important Information</p>
          <ul>
            <li>Please arrive at the terminal at least 30 minutes before departure</li>
            <li>Bring a valid government-issued ID for verification</li>
            <li>Cancellations must be made at least 24 hours before departure</li>
          </ul>
        </div>
      </div>

      <div className="success-actions">
        <button className="btn-secondary" onClick={onBookAgain}>
          Book Another Trip
        </button>
        <button className="btn-primary" onClick={onViewBookings}>
          View All Bookings
        </button>
      </div>
    </div>
  )
}

export default BookingSuccess

