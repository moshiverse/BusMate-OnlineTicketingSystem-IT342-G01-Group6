import { useEffect, useState } from 'react'
import RoutesExplorerSection from '../components/Dashboard/RoutesExplorerSection'
import BusMateLayout from '../components/layout/BusMateLayout'
import { routesFallback } from '../components/Dashboard/dashboardData'
import { routesAPI, scheduleAPI } from '../api/axios'
import { formatCurrency, formatDuration } from '../utils/formatters'

const buildRouteCards = (routes = [], schedules = []) => {
  const scheduleStats = schedules.reduce((acc, schedule) => {
    const routeId = schedule.route?.id
    if (!routeId) return acc
    const entry = acc[routeId] ?? { count: 0, minPrice: Number.MAX_SAFE_INTEGER }
    entry.count += 1
    const priceNum = Number(schedule.price)
    if (!Number.isNaN(priceNum)) entry.minPrice = Math.min(entry.minPrice, priceNum)
    acc[routeId] = entry
    return acc
  }, {})

  return routes.map((route) => {
    const entry = scheduleStats[route.id]
    return {
      id: route.id,
      from: route.origin,
      to: route.destination,
      distance: route.distanceKm ? `${route.distanceKm} km` : '—',
      duration: route.durationMinutes ? formatDuration(route.durationMinutes) : '—',
      price:
        entry && entry.minPrice !== Number.MAX_SAFE_INTEGER ? formatCurrency(entry.minPrice) : 'Coming soon',
      extras: entry ? [`🚌 ${entry.count} trips scheduled`] : [],
      badge: entry && entry.count >= 3 ? 'Popular' : undefined,
    }
  })
}

function RoutesPage({ onSignOut }) {
  const [popularRoutes, setPopularRoutes] = useState(routesFallback.popularRoutes)
  const [allRoutes, setAllRoutes] = useState(routesFallback.allRoutes)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fetchRoutes = async () => {
      try {
        const [routesRes, schedulesRes] = await Promise.all([routesAPI.getAll(), scheduleAPI.getAll()])
        if (cancelled) return
        const hydrated = buildRouteCards(routesRes.data ?? [], schedulesRes.data ?? [])
        setAllRoutes(hydrated)
        setPopularRoutes(hydrated.slice(0, 4))
      } catch (error) {
        console.error('Failed to load routes', error)
        setAllRoutes(routesFallback.allRoutes)
        setPopularRoutes(routesFallback.popularRoutes)
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
      <RoutesExplorerSection popularRoutes={popularRoutes} allRoutes={allRoutes} showBackLink={false} />
    </BusMateLayout>
  )
}

export default RoutesPage

