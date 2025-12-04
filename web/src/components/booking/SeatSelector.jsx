import React, { useState, useEffect } from 'react'
import { seatAPI } from '../../api/axios'
import { formatCurrency, formatDateLabel, formatTimeLabel } from '../../utils/formatters'

const SeatSelector = ({ schedule, onConfirm, onBack }) => {
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
      console.log('Schedule object:', schedule)
      console.log('Schedule ID:', schedule.id)
      console.log('Fetching seats from:', `/seats/schedule/${schedule.id}`)
      
      const response = await seatAPI.getBySchedule(schedule.id)
      console.log('Loaded seats:', response.data)
      console.log('Number of seats:', response.data?.length)
      console.log('Bus type:', schedule.bus?.busType)
      console.log('Bus capacity:', schedule.bus?.busType?.capacity)
      setSeats(response.data)
    } catch (error) {
      console.error('Failed to load seats:', error)
      console.error('Error response:', error.response)
      console.error('Error details:', error.response?.data)
      console.error('Error status:', error.response?.status)
      alert('Failed to load seats. Please make sure seats have been generated for this schedule.')
    } finally {
      setLoading(false)
    }
  }

  // Organize seats by rows
  const organizeSeats = () => {
    const rows = {}
    seats.forEach(seat => {
      const row = seat.rowIndex
      if (!rows[row]) rows[row] = []
      rows[row].push(seat)
    })
    
    // Sort seats within each row by column index
    Object.keys(rows).forEach(rowKey => {
      rows[rowKey].sort((a, b) => a.colIndex - b.colIndex)
    })
    
    return Object.keys(rows)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(rowKey => rows[rowKey])
  }

  const toggleSeat = (seatNumber, status) => {
    if (status !== 'AVAILABLE') return
    setSelectionError('')
    setSelectedSeats((prev) =>
      prev.includes(seatNumber) ? prev.filter((s) => s !== seatNumber) : [...prev, seatNumber],
    )
  }

  const totalAmount = selectedSeats.length * parseFloat(schedule.price)
  const departureLabel = `${formatDateLabel(schedule.travelDate)} at ${formatTimeLabel(schedule.departureTime)}`

  if (loading) return <div className="loading">Loading seats...</div>
  
  if (!seats || seats.length === 0) {
    return (
      <div className="seat-selector">
        <div className="selector-header">
          <button className="btn-secondary" onClick={onBack}>
            ← Back
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <h3>No Seats Available</h3>
          <p>Seats have not been generated for this schedule yet.</p>
          <p>Bus Type: {schedule.bus?.busType?.name} ({schedule.bus?.busType?.capacity} seats)</p>
        </div>
      </div>
    )
  }

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
        <div className="driver-section">🚐 Driver</div>
        <div className="bus-seats-container">
          {organizeSeats().map((row, rowIndex) => {
            const isLastRow = row.length === 5
            
            // Create seat elements with aisle gap for regular rows
            const seatElements = []
            row.forEach((seat, seatIndex) => {
              // Add aisle gap after 2nd seat in regular rows (4-seat rows)
              if (!isLastRow && seatIndex === 2) {
                seatElements.push(<div key={`aisle-${rowIndex}`} className="aisle-gap"></div>)
              }
              
              seatElements.push(
                <button
                  key={seat.id}
                  className={`seat ${seat.status.toLowerCase()} ${selectedSeats.includes(seat.seatNumber) ? 'selected' : ''}`}
                  onClick={() => toggleSeat(seat.seatNumber, seat.status)}
                  disabled={seat.status !== 'AVAILABLE'}
                >
                  {seat.seatNumber}
                </button>
              )
            })
            
            return (
              <div key={rowIndex} className={`seat-row ${isLastRow ? 'last-row' : ''}`}>
                {seatElements}
              </div>
            )
          })}
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
            <strong>Passengers:</strong> {selectedSeats.length}
          </p>
          <p>
            <strong>Price per Seat:</strong> {formatCurrency(schedule.price, { withCents: true })}
          </p>
          <h3>Total Amount: {formatCurrency(totalAmount, { withCents: true })}</h3>
        </div>
        <button
          className="btn-primary btn-large"
          onClick={() => onConfirm(selectedSeats, totalAmount)}
          disabled={selectedSeats.length === 0}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  )
}

export default SeatSelector