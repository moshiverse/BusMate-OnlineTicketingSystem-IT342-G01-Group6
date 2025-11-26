import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import RouteCard from '../RouteCard/RouteCard'
import BusMateLayout from '../Layout/BusMateLayout'
import styles from './Dashboard.module.css'
import { routesAPI, scheduleAPI } from '../../api/axios'
import { heroBackground, ctaBackground, dashboardFallback } from './dashboardData'
import { formatCurrency, formatDuration } from '../../utils/formatters'

function Dashboard({ onSignOut }) {
  const navigate = useNavigate()
  const [popularRoutes, setPopularRoutes] = useState(dashboardFallback.popularRoutes)
  const [stats, setStats] = useState(dashboardFallback.stats)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchDashboard = async () => {
      try {
        const [routesRes, schedulesRes] = await Promise.all([routesAPI.getAll(), scheduleAPI.getAll()])
        if (!isMounted) return
        const schedules = schedulesRes.data ?? []
        const routes = routesRes.data ?? []
        const routeStats = schedules.reduce((acc, schedule) => {
          const routeId = schedule.route?.id
          if (!routeId) return acc
          if (!acc[routeId]) {
            acc[routeId] = {
              count: 0,
              minPrice: Number.MAX_SAFE_INTEGER,
            }
          }
          const entry = acc[routeId]
          entry.count += 1
          const price = Number(schedule.price)
          if (!Number.isNaN(price)) {
            entry.minPrice = Math.min(entry.minPrice, price)
          }
          return acc
        }, {})

        const hydratedRoutes = routes.map((route) => {
          const statsForRoute = routeStats[route.id]
          return {
            id: route.id,
            from: route.origin,
            to: route.destination,
            distance: route.distanceKm ? `${route.distanceKm} km` : '—',
            duration: route.durationMinutes ? formatDuration(route.durationMinutes) : '—',
            price:
              statsForRoute && statsForRoute.minPrice !== Number.MAX_SAFE_INTEGER
                ? formatCurrency(statsForRoute.minPrice)
                : null,
            extras: statsForRoute ? [`🚌 ${statsForRoute.count} trips scheduled`] : [],
          }
        })

        setPopularRoutes(hydratedRoutes.slice(0, 3))

        const totalSeats = schedules.reduce((sum, sched) => sum + (sched.availableSeats ?? 0), 0)
        setStats([
          { value: `${schedules.length}`, label: 'Upcoming Trips' },
          { value: `${routes.length}`, label: 'Routes Available' },
          { value: `${totalSeats}`, label: 'Seats Live' },
        ])
      } catch (error) {
        console.error('Failed to sync dashboard data', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchDashboard()
    return () => {
      isMounted = false
    }
  }, [])

  const hero = dashboardFallback.hero
  const features = dashboardFallback.features

  return (
    <BusMateLayout onSignOut={onSignOut}>
      <section className={styles.hero} style={{ backgroundImage: `url(${heroBackground})` }}>
        <div className={styles.heroContent}>
          <p className={styles.heroBadge}>{hero.badge}</p>
          <h1>
            {hero.title} <span>{hero.highlightedText}</span> with BusMate
          </h1>
          <p className={styles.heroSubtitle}>{hero.description}</p>
        </div>
        <form className={styles.heroCard}>
          <label>
            <span>From</span>
            <button type="button">Origin</button>
          </label>
          <label>
            <span>To</span>
            <button type="button">Destination</button>
          </label>
          <label>
            <span>Date</span>
            <input type="text" placeholder="dd/mm/yyyy" />
          </label>
          <label>
            <span>Passengers</span>
            <button type="button">1</button>
          </label>
          <button type="button" className={styles.searchButton}>
            Search
          </button>
        </form>
      </section>

      <section className={styles.features}>
        <p className={styles.sectionTag}>✨ Premium Features</p>
        <h2>Why Choose BusMate?</h2>
        <p className={styles.sectionSubtitle}>
          Experience hassle-free bus travel with our modern booking platform
        </p>
        <div className={styles.cardGrid}>
          {features.map((card) => (
            <article key={card.title} className={styles.card}>
              <div className={styles.cardIcon}>{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.routes}>
        <p className={styles.sectionTag}>🔥 Trending Now</p>
        <h2>Popular Routes</h2>
        <p className={styles.sectionSubtitle}>Frequently traveled destinations across the Philippines</p>
        {loading && <p className={styles.loading}>Syncing live availability…</p>}
        <Link to="/routes" className={styles.outlineButton}>
          View All Routes
        </Link>
        <div className={styles.routeGrid}>
          {popularRoutes.map((route) => (
            <RouteCard
              key={`${route.from}-${route.to}`}
              {...route}
              price={route.price}
              extras={route.extras}
              variant="compact"
            />
          ))}
        </div>
      </section>

      <section className={styles.cta} style={{ backgroundImage: `url(${ctaBackground})` }}>
        <h2>Ready to Start Your Journey?</h2>
        <p>Join thousands of travelers who rely on BusMate for stress-free intercity trips.</p>
        <div className={styles.ctaButtons}>
          <button type="button" onClick={() => navigate('/booking')}>
            Book Your Ticket Now
          </button>
          <Link to="/routes" className={styles.ctaOutline}>
            View All Routes
          </Link>
        </div>
        <div className={styles.stats}>
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className={styles.statValue}>{stat.value}</p>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

    </BusMateLayout>
  )
}

export default Dashboard

