import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RouteCard from '../RouteCard/RouteCard'
import BusMateLayout from '../Layout/BusMateLayout'
import styles from './Dashboard.module.css'
import { api } from '../../services/api'
import { heroBackground, ctaBackground, dashboardFallback } from './dashboardData'

function Dashboard({ onSignOut }) {
  const [data, setData] = useState(dashboardFallback)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    api
      .fetchDashboard()
      .then((payload) => {
        if (isMounted) setData(payload)
      })
      .catch(() => {
        setData(dashboardFallback)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const hero = data.hero ?? dashboardFallback.hero
  const features = data.features ?? dashboardFallback.features
  const popularRoutes = data.popularRoutes ?? dashboardFallback.popularRoutes
  const stats = data.stats ?? dashboardFallback.stats

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
          <button type="button">Book Your Ticket Now</button>
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

