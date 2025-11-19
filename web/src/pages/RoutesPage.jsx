import { useEffect, useState } from 'react'
import RoutesExplorerSection from '../components/Dashboard/RoutesExplorerSection'
import BusMateLayout from '../components/Layout/BusMateLayout'
import { routesFallback } from '../components/Dashboard/dashboardData'
import { api } from '../services/api'

function RoutesPage({ onSignOut }) {
  const [routesData, setRoutesData] = useState(routesFallback)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    api
      .fetchRoutes()
      .then((payload) => {
        if (isMounted) setRoutesData(payload)
      })
      .catch(() => setRoutesData(routesFallback))
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <BusMateLayout onSignOut={onSignOut}>
      {loading && <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '1rem' }}>Loading routes…</p>}
      <RoutesExplorerSection
        popularRoutes={routesData.popularRoutes}
        allRoutes={routesData.allRoutes}
        showBackLink={false}
      />
    </BusMateLayout>
  )
}

export default RoutesPage

