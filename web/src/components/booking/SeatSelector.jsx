import { useState, useEffect } from 'react'
import { seatAPI } from '../../api/axios'
import { formatCurrency, formatDateLabel, formatTimeLabel } from '../../utils/formatters'

const SeatSelector = ({ schedule, onConfirm, onBack, maxSeats = 1 }) => {
  const [seats, setSeats] = useState([])
  const [selectedSeats, setSelectedSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectionError, setSelectionError] = useState('')

  useEffect(() => {
    loadSeats()
    setSelectedSeats([])
    setSelectionError('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule.id])

  const loadSeats = async () => {
    try {
      const response = await seatAPI.getBySchedule(schedule.id)
      setSeats(response.data)
    } catch (error) {
      console.error('Failed to load seats:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSeat = (seatNumber, status) => {
    if (status !== 'AVAILABLE') return
    if (!selectedSeats.includes(seatNumber) && selectedSeats.length >= maxSeats) {
      setSelectionError(`You can only select ${maxSeats} seat${maxSeats > 1 ? 's' : ''}.`)
      return
    }
    setSelectionError('')
    setSelectedSeats((prev) =>
      prev.includes(seatNumber) ? prev.filter((s) => s !== seatNumber) : [...prev, seatNumber],
    )
  }

  const totalAmount = selectedSeats.length * parseFloat(schedule.price)
  const departureLabel = `${formatDateLabel(schedule.travelDate)} at ${formatTimeLabel(schedule.departureTime)}`

  if (loading) return <div className="loading">Loading seats...</div>

  return (
    <div className="seat-selector">
      <div className="selector-header">
        <button className="btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <div>
          <p className="eyebrow">Step 2 of 3</p>
          <h2>Select Your Seats</h2>
        </div>
      </div>

      <div className="route-summary">
        <div>
          <p className="eyebrow">Route</p>
          <h3>
            {schedule.route?.origin} → {schedule.route?.destination}
          </h3>
        </div>
        <div>
          <p className="eyebrow">Departure</p>
          <h3>{departureLabel}</h3>
        </div>
        <div>
          <p className="eyebrow">Available Seats</p>
          <h3>{schedule.availableSeats}</h3>
        </div>
      </div>

  <div className="seat-wrapper">
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
        <div className="driver-section">Driver</div>
        <div className="seat-grid">
          {seats.map((seat) => (
            <button
              key={seat.id}
              className={`seat ${seat.status.toLowerCase()} ${selectedSeats.includes(seat.seatNumber) ? 'selected' : ''}`}
              onClick={() => toggleSeat(seat.seatNumber, seat.status)}
              disabled={seat.status !== 'AVAILABLE'}
            >
              {seat.seatNumber}
            </button>
          ))}
        </div>
      </div>
      </div>

      {selectionError && <p className="selection-error">{selectionError}</p>}

      <div className="booking-summary">
        <div className="summary-details">
          <p>
            <strong>Selected Seats:</strong> {selectedSeats.join(', ') || 'None'}
          </p>
          <p>
            <strong>Passengers:</strong> {maxSeats}
          </p>
          <p>
            <strong>Price per Seat:</strong> {formatCurrency(schedule.price, { withCents: true })}
          </p>
          <h3>Total Amount: {formatCurrency(totalAmount, { withCents: true })}</h3>
        </div>
        <button
          className="btn-primary btn-large"
          onClick={() => onConfirm(selectedSeats, totalAmount)}
          disabled={selectedSeats.length !== maxSeats}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  )
}

export default SeatSelector