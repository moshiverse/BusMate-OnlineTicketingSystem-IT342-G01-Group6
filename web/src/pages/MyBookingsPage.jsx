import { useEffect, useMemo, useState } from 'react'
import BusMateLayout from '../components/layout/BusMateLayout'
import { useAuth } from '../context/AuthContext'
import { bookingAPI } from '../api/axios'
import { formatCurrency, formatDateLabel, formatTimeLabel, mergeDateTime } from '../utils/formatters'
import { downloadTicketPDF } from '../utils/ticketPDF'
import '../styles/MyBookingsPage.css'

const tabs = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past' },
  { id: 'cancelled', label: 'Cancelled' },
]

const classifyBooking = (booking) => {
  if (booking.status === 'CANCELLED') return 'cancelled'
  const departure = mergeDateTime(booking.schedule?.travelDate, booking.schedule?.departureTime)
  if (departure && departure < new Date()) {
    return 'past'
  }
  return 'upcoming'
}

const toQrUrl = (text) =>
  text ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}` : null

function MyBookingsPage({ onSignOut }) {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [activeTab, setActiveTab] = useState('upcoming')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fetchBookings = async () => {
      if (!user?.id) return
      try {
        const response = await bookingAPI.getUserBookings(user.id)
        if (!cancelled) {
          setBookings(response.data ?? [])
        }
      } catch (error) {
        console.error('Failed to fetch bookings', error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchBookings()
    return () => {
      cancelled = true
    }
  }, [user])

  const grouped = useMemo(() => {
    return bookings.reduce(
      (acc, booking) => {
        const bucket = classifyBooking(booking)
        acc[bucket].push(booking)
        return acc
      },
      { upcoming: [], past: [], cancelled: [] },
    )
  }, [bookings])

  const currentBookings = grouped[activeTab] ?? []

  const handleViewQR = (qrCodeText) => {
    const qrUrl = toQrUrl(qrCodeText)
    if (qrUrl) {
      window.open(qrUrl, '_blank')
    }
  }

  const handleDownloadPDF = async (booking) => {
    try {
      await downloadTicketPDF(booking)
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  return (
    <BusMateLayout onSignOut={onSignOut}>
      <section className="my-bookings">
        <div className="profile-banner">
          <div className="profile-chip">{user?.name?.charAt(0)?.toUpperCase() ?? 'U'}</div>
          <div>
            <p className="eyebrow">Traveler</p>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </div>
          <div className="stats-pill">
            <p>Total Trips</p>
            <strong>{bookings.length}</strong>
          </div>
        </div>

        <div className="booking-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={activeTab === tab.id ? 'active' : ''}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label} ({grouped[tab.id].length})
            </button>
          ))}
        </div>

        {loading ? (
          <p className="muted">Loading your bookings…</p>
        ) : currentBookings.length === 0 ? (
          <div className="empty-state">
            <p>No {activeTab} trips yet.</p>
            <small>Book a trip to see it appear here.</small>
          </div>
        ) : (
          <div className="bookings-grid">
            {currentBookings.map((booking) => {
              const schedule = booking.schedule
              const routeLabel = `${schedule.route?.origin} → ${schedule.route?.destination}`
              const departure = `${formatDateLabel(schedule.travelDate)} · ${formatTimeLabel(schedule.departureTime)}`
              const seatNumbers =
                booking.bookingSeats?.map((seat) => seat.seatNumber) ?? booking.seatNumbers ?? []
              return (
                <article key={booking.id} className="booking-card">
                  <header>
                    <div>
                      <p className="eyebrow">Booking ID</p>
                      <h3>BM-{String(booking.id).padStart(6, '0')}</h3>
                    </div>
                    <span className={`status-pill ${booking.status.toLowerCase()}`}>{booking.status}</span>
                  </header>
                  <div className="booking-body">
                    <div>
                      <p className="eyebrow">Route</p>
                      <h4>{routeLabel}</h4>
                    </div>
                    <div>
                      <p className="eyebrow">Travel Date</p>
                      <h4>{departure}</h4>
                    </div>
                    <div>
                      <p className="eyebrow">Seats</p>
                      <h4>{seatNumbers.length ? seatNumbers.join(', ') : 'See e-ticket'}</h4>
                    </div>
                    <div>
                      <p className="eyebrow">Amount Paid</p>
                      <h4>{formatCurrency(booking.amount, { withCents: true })}</h4>
                    </div>
                  </div>
                  <footer>
                    {booking.qrCodeText && (
                      <button 
                        type="button" 
                        className="btn-secondary" 
                        onClick={() => handleViewQR(booking.qrCodeText)}
                      >
                        View QR
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => handleDownloadPDF(booking)}
                    >
                      Download PDF
                    </button>
                    {booking.status === 'CONFIRMED' && activeTab === 'upcoming' && (
                      <button type="button" className="btn-danger" disabled>
                        Cancel Trip
                      </button>
                    )}
                  </footer>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </BusMateLayout>
  )
}

export default MyBookingsPage