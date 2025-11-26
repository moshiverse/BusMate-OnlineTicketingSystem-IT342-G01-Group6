import { useMemo, useState } from 'react'
import { bookingAPI } from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency, formatDateLabel, formatTimeLabel } from '../../utils/formatters'

const BookingConfirmation = ({ schedule, selectedSeats, amount, onComplete, onCancel }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentMethod] = useState('gotyme')

  const referenceCode = useMemo(
    () => `BM-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 90 + 10)}`,
    [],
  )

  const handleConfirmBooking = async () => {
    setLoading(true)
    setError('')

    try {
      const bookingResponse = await bookingAPI.create({
        userId: user.id,
        scheduleId: schedule.id,
        amount,
        seatNumbers: selectedSeats,
      })

      await bookingAPI.confirm(bookingResponse.data.id, {
        providerRef: referenceCode,
        amount,
      })

      onComplete({
        bookingId: bookingResponse.data.id,
        qrCode: bookingResponse.data.qrCodeText,
        referenceCode,
      })
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const tripLabel = `${schedule.route?.origin} → ${schedule.route?.destination}`
  const departureLabel = `${formatDateLabel(schedule.travelDate)} · ${formatTimeLabel(schedule.departureTime)}`

  return (
    <div className="booking-confirmation">
      <div className="payment-card">
        <header>
          <h3>GoTyme Payment</h3>
          <p>Complete your payment to confirm your booking</p>
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
        </div>

        <div className="instruction-list">
          <p>Follow these steps to complete your payment:</p>
          <ol>
            <li>Open your GoTyme Bank app</li>
            <li>Select “Pay Bills” or “Send Money”</li>
            <li>Enter the amount: {formatCurrency(amount, { withCents: true })}</li>
            <li>Use reference: {referenceCode}</li>
          </ol>
        </div>

        <div className="demo-note">
          <span role="img" aria-label="Info">
            💡
          </span>
          This is a demo. In production, you’ll be redirected to the actual GoTyme payment gateway.
        </div>

        <div className="secure-note">🔒 Your payment is secured with 256-bit SSL encryption</div>

        {error && <div className="error-message">{error}</div>}

        <div className="confirmation-actions">
          <button type="button" className="btn-secondary" onClick={() => onCancel?.()} disabled={loading}>
            Cancel
          </button>
          <button className="btn-primary btn-large" onClick={handleConfirmBooking} disabled={loading || !paymentMethod}>
            {loading ? 'Processing...' : `Confirm Payment`}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmation