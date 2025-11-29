import { useState } from 'react'
import PayMongoPayment from './PayMongoPayment'
import { bookingAPI } from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency, formatDateLabel, formatTimeLabel } from '../../utils/formatters'

const BookingConfirmation = ({ schedule, selectedSeats, amount, onComplete, onCancel }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [booking, setBooking] = useState(null)
  const [showPayment, setShowPayment] = useState(false)

  // Step 1: Create the booking first (in PENDING status)
  const handleCreateBooking = async () => {
    setLoading(true)
    setError('')

    try {
      const bookingResponse = await bookingAPI.create({
        userId: user.id,
        scheduleId: schedule.id,
        amount,
        seatNumbers: selectedSeats,
      })

      setBooking(bookingResponse.data)
      setShowPayment(true) // Show PayMongo payment UI
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data || 'Failed to create booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Handle successful payment from PayMongo
  const handlePaymentSuccess = (result) => {
    onComplete({
      bookingId: result.bookingId || booking?.id,
      qrCode: result.qrCode,
      referenceCode: result.referenceCode,
    })
  }

  // Cancel payment and go back to seat selection
  const handlePaymentCancel = () => {
    setShowPayment(false)
    setBooking(null)
    onCancel?.()
  }

  const tripLabel = `${schedule.route?.origin} → ${schedule.route?.destination}`
  const departureLabel = `${formatDateLabel(schedule.travelDate)} · ${formatTimeLabel(schedule.departureTime)}`

  // If showing payment UI
  if (showPayment && booking) {
    return (
      <PayMongoPayment
        bookingId={booking.id}
        amount={amount}
        schedule={schedule}
        selectedSeats={selectedSeats}
        onSuccess={handlePaymentSuccess}
        onCancel={handlePaymentCancel}
      />
    )
  }

  // Initial booking summary view
  return (
    <div className="booking-confirmation">
      <div className="payment-card">
        <header>
          <h3>Confirm Your Booking</h3>
          <p>Review your trip details before proceeding to payment</p>
        </header>

        <div className="total-amount">
          <span>Total Amount</span>
          <strong>{formatCurrency(amount, { withCents: true })}</strong>
        </div>

        <div className="trip-overview">
          <div>
            <p className="eyebrow">Route</p>
            <h4>{tripLabel}</h4>
          </div>
          <div>
            <p className="eyebrow">Departure</p>
            <h4>{departureLabel}</h4>
          </div>
          <div>
            <p className="eyebrow">Seats</p>
            <h4>{selectedSeats.join(', ')}</h4>
          </div>
          <div>
            <p className="eyebrow">Passengers</p>
            <h4>{selectedSeats.length} {selectedSeats.length > 1 ? 'persons' : 'person'}</h4>
          </div>
        </div>

        <div className="price-breakdown">
          <div className="price-row">
            <span>Price per seat</span>
            <span>{formatCurrency(schedule.price, { withCents: true })}</span>
          </div>
          <div className="price-row">
            <span>Number of seats</span>
            <span>× {selectedSeats.length}</span>
          </div>
          <div className="price-row total">
            <span>Total</span>
            <strong>{formatCurrency(amount, { withCents: true })}</strong>
          </div>
        </div>

        <div className="payment-methods-preview">
          <p>Available Payment Methods:</p>
          <div className="method-icons">
            <span title="Credit/Debit Card">💳</span>
            <span title="GCash">📱</span>
            <span title="GrabPay">🚗</span>
            <span title="Maya">💚</span>
          </div>
        </div>

        <div className="secure-note">🔒 All payments are secured by PayMongo with 256-bit encryption</div>

        {error && <div className="error-message">{error}</div>}

        <div className="confirmation-actions">
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => onCancel?.()} 
            disabled={loading}
          >
            Back to Seats
          </button>
          <button 
            className="btn-primary btn-large" 
            onClick={handleCreateBooking} 
            disabled={loading}
          >
            {loading ? 'Creating Booking...' : 'Proceed to Payment'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmation