import { useEffect, useState } from 'react'
import BookingSection from '../components/Dashboard/BookingSection'
import BusMateLayout from '../components/Layout/BusMateLayout'
import { tripsFallback } from '../components/Dashboard/dashboardData'
import { api } from '../services/api'

function BookingPage({ onSignOut }) {
  const [tripData, setTripData] = useState(tripsFallback)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    api
      .fetchTrips({ origin: 'Manila', destination: 'Baguio' })
      .then((payload) => {
        if (isMounted) setTripData(payload)
      })
      .catch(() => setTripData(tripsFallback))
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <BusMateLayout onSignOut={onSignOut}>
      {loading && <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '1rem' }}>Fetching trips…</p>}
      <BookingSection summary={tripData.summary} trips={tripData.trips} showBackLink={false} />
    </BusMateLayout>
  )
}

export default BookingPage

