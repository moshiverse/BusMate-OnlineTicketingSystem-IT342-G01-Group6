import { useEffect, useState } from 'react'
import RoutesExplorerSection from '../components/Dashboard/RoutesExplorerSection'
import BusMateLayout from '../components/layout/BusMateLayout'
import { routesAPI, scheduleAPI } from '../api/axios'
import { formatCurrency, formatDuration } from '../utils/formatters'

const buildRouteCards = (routes = [], schedules = []) => {
  const scheduleStats = schedules.reduce((acc, schedule) => {
    const routeId = schedule.route?.id
    if (!routeId) return acc
    const entry = acc[routeId] ?? { count: 0, minPrice: Number.MAX_SAFE_INTEGER, firstSchedule: null }
    entry.count += 1
    const priceNum = Number(schedule.price)
    if (!Number.isNaN(priceNum)) entry.minPrice = Math.min(entry.minPrice, priceNum)
    if (!entry.firstSchedule) entry.firstSchedule = schedule
    acc[routeId] = entry
    return acc
  }, {})

  // Only return routes that have schedules (trips available)
  return routes
    .filter((route) => scheduleStats[route.id]) // Only routes with schedules
    .map((route) => {
      const entry = scheduleStats[route.id]
      return {
        id: route.id,
        from: route.origin,
        to: route.destination,
        distance: route.distanceKm ? `${route.distanceKm} km` : '—',
        duration: route.durationMinutes ? formatDuration(route.durationMinutes) : '—',
        price: formatCurrency(entry.minPrice),
        extras: [`🚌 ${entry.count} trips scheduled`],
        badge: entry.count >= 3 ? 'Popular' : undefined,
        rawSchedule: entry.firstSchedule,
      }
    })
}

function RoutesPage({ onSignOut }) {
  const [popularRoutes, setPopularRoutes] = useState([])
  const [allRoutes, setAllRoutes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fetchRoutes = async () => {
      try {
        const [routesRes, schedulesRes] = await Promise.all([routesAPI.getAll(), scheduleAPI.getAll()])
        if (cancelled) return
        const hydrated = buildRouteCards(routesRes.data ?? [], schedulesRes.data ?? [])
        setAllRoutes(hydrated)
        // Popular routes are the first 4 with most schedules
        setPopularRoutes(hydrated.slice(0, 4))
      } catch (error) {
        console.error('Failed to load routes', error)
        // Don't use fallback - show empty state instead
        setAllRoutes([])
        setPopularRoutes([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchRoutes()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <BusMateLayout onSignOut={onSignOut}>
      {loading && <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '1rem' }}>Loading routes…</p>}
      {!loading && allRoutes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
          <p>No routes available yet. Check back soon!</p>
        </div>
      )}
      {allRoutes.length > 0 && (
        <RoutesExplorerSection popularRoutes={popularRoutes} allRoutes={allRoutes} showBackLink={false} />
      )}
    </BusMateLayout>
  )
}

export default RoutesPage

