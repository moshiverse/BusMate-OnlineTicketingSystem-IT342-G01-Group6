import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BookingSection from '../components/Dashboard/BookingSection'
import SeatSelector from '../components/booking/SeatSelector'
import BookingConfirmation from '../components/booking/BookingConfirmation'
import BookingSuccess from '../components/booking/BookingSuccess'
import BusMateLayout from '../components/layout/BusMateLayout'
import { tripsFallback } from '../components/Dashboard/dashboardData'
import { routesAPI, scheduleAPI } from '../api/axios'
import { formatCurrency, formatDateLabel, formatDuration, formatTimeLabel } from '../utils/formatters'
import { useAuth } from '../context/AuthContext'
import '../styles/BookingFlow.css'

const parseAmenities = (amenities) => {
  if (!amenities) return []
  if (Array.isArray(amenities)) return amenities
  return amenities.split(',').map((item) => item.trim()).filter(Boolean)
}

const addMinutesToTime = (timeString, minutesToAdd) => {
  if (!timeString || !minutesToAdd) return timeString
  const [hour = 0, minute = 0] = timeString.split(':').map(Number)
  const temp = new Date()
  temp.setHours(hour, minute, 0, 0)
  temp.setMinutes(temp.getMinutes() + minutesToAdd)
  return `${String(temp.getHours()).padStart(2, '0')}:${String(temp.getMinutes()).padStart(2, '0')}`
}

function BookingPage({ onSignOut }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [routes, setRoutes] = useState([])
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRouteId, setSelectedRouteId] = useState('')
  const [travelDate, setTravelDate] = useState('')
  const [passengers, setPassengers] = useState(1)
  const [step, setStep] = useState('list') // list | seats | confirm | success
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [bookingResult, setBookingResult] = useState(null)

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      try {
        const [routesRes, schedulesRes] = await Promise.all([routesAPI.getAll(), scheduleAPI.getAll()])
        if (cancelled) return
        setRoutes(routesRes.data ?? [])
        setSchedules(schedulesRes.data ?? [])
        if (!selectedRouteId && routesRes.data?.length) {
          setSelectedRouteId(String(routesRes.data[0].id))
        }
      } catch (error) {
        console.error('Failed to load trips', error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const refreshSchedules = async () => {
    try {
      const response = await scheduleAPI.getAll()
      setSchedules(response.data ?? [])
    } catch (error) {
      console.error('Failed to refresh schedules', error)
    }
  }

  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      if (selectedRouteId && schedule.route?.id !== Number(selectedRouteId)) return false
      if (travelDate && schedule.travelDate !== travelDate) return false
      return true
    })
  }, [schedules, selectedRouteId, travelDate])

  const trips = filteredSchedules.map((schedule) => {
    const arrivalTimeRaw = addMinutesToTime(schedule.departureTime, schedule.route?.durationMinutes)
    return {
      id: schedule.id,
      tier: schedule.bus?.busType?.name ?? 'Standard',
      departureTime: formatTimeLabel(schedule.departureTime),
      arrivalTime: arrivalTimeRaw ? formatTimeLabel(arrivalTimeRaw) : '—',
      duration: formatDuration(schedule.route?.durationMinutes),
      price: formatCurrency(schedule.price),
      seats: `${schedule.availableSeats ?? 0} seats available`,
      amenities: parseAmenities(schedule.bus?.amenities),
      disabled: !schedule.availableSeats,
      rawSchedule: schedule,
    }
  })

  const selectedRoute = routes.find((route) => String(route.id) === String(selectedRouteId))
  const bookingSummary = {
    route: selectedRoute ? `${selectedRoute.origin} → ${selectedRoute.destination}` : 'Select a route',
    travelDate: travelDate ? formatDateLabel(travelDate) : 'Choose date',
    passengers: `${passengers} ${passengers > 1 ? 'People' : 'Person'}`,
    availableTrips: filteredSchedules.length,
    cover: tripsFallback.summary.cover,
  }

  const handleTripSelect = (schedule) => {
    setSelectedSchedule(schedule)
    setSelectedSeats([])
    setTotalAmount(0)
    setStep('seats')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSeatConfirm = (seats, amount) => {
    setSelectedSeats(seats)
    setTotalAmount(amount)
    setStep('confirm')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBookingComplete = async ({ bookingId, qrCode, referenceCode }) => {
    setBookingResult({
      bookingId,
      qrCode,
      referenceCode,
      schedule: selectedSchedule,
      seats: selectedSeats,
      amount: totalAmount,
      passengerName: user?.name,
    })
    setStep('success')
    await refreshSchedules()
  }

  const resetFlow = () => {
    setStep('list')
    setSelectedSchedule(null)
    setSelectedSeats([])
    setBookingResult(null)
  }

  return (
    <BusMateLayout onSignOut={onSignOut}>
      <section className="booking-flow">
        <div className="booking-filters">
          <label>
            Route
            <select value={selectedRouteId} onChange={(e) => setSelectedRouteId(e.target.value)}>
              {routes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.origin} → {route.destination}
                </option>
              ))}
            </select>
          </label>
          <label>
            Travel Date
            <input type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} />
          </label>
          <label>
            Passengers
            <input
              type="number"
              min="1"
              max="6"
              value={passengers}
              onChange={(e) => {
                const next = Number(e.target.value)
                if (Number.isNaN(next)) {
                  setPassengers(1)
                  return
                }
                setPassengers(Math.min(6, Math.max(1, next)))
              }}
            />
          </label>
          <div className="actions">
            <button type="button" className="btn-secondary" onClick={() => setTravelDate('')}>
              Clear Date
            </button>
          </div>
        </div>

        {step === 'list' && (
          <>
            {loading && <p style={{ textAlign: 'center', color: '#64748b' }}>Fetching trips…</p>}
            <BookingSection
              summary={bookingSummary}
              trips={trips}
              showBackLink={false}
              onSelectSchedule={handleTripSelect}
              loading={loading}
            />
          </>
        )}

        {step === 'seats' && selectedSchedule && (
          <SeatSelector
            schedule={selectedSchedule}
            onConfirm={handleSeatConfirm}
            onBack={() => setStep('list')}
            maxSeats={passengers}
          />
        )}

        {step === 'confirm' && selectedSchedule && (
          <BookingConfirmation
            schedule={selectedSchedule}
            selectedSeats={selectedSeats}
            amount={totalAmount}
            onComplete={handleBookingComplete}
            onCancel={() => setStep('seats')}
          />
        )}

        {step === 'success' && bookingResult && (
          <BookingSuccess
            details={bookingResult}
            onBookAgain={resetFlow}
            onViewBookings={() => navigate('/my-bookings')}
          />
        )}
      </section>
    </BusMateLayout>
  )
}

export default BookingPage

