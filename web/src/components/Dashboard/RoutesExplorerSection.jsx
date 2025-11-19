import RouteCard from '../RouteCard/RouteCard'
import styles from './Dashboard.module.css'

function RoutesExplorerSection({ popularRoutes, allRoutes, showBackLink = false }) {
  return (
    <section className={styles.routesExplorer}>
      {showBackLink && (
        <button type="button" className={styles.backLink} onClick={() => window.history.back()}>
          ← Back
        </button>
      )}
      <p className={styles.sectionTag}>🗺️ Routes</p>
      <h2>All Routes</h2>
      <p className={styles.sectionSubtitle}>
        Explore our extensive network of intercity bus routes across the Philippines.
      </p>

      <div className={styles.searchBar}>
        <span>🔍</span>
        <input type="text" placeholder="Search by city name (e.g., Manila, Baguio, Cebu)..." />
      </div>

      <div className={styles.routesGroup}>
        <div className={styles.routesGroupHeader}>
          <div>
            <p className={styles.sectionTag}>🔥 Popular Routes</p>
          </div>
          <span className={styles.groupHint}>Updated daily</span>
        </div>
        <div className={styles.routesScroller}>
          {popularRoutes.map((route) => (
            <RouteCard key={`${route.from}-${route.to}`} {...route} />
          ))}
        </div>
      </div>

      <div className={styles.routesGroup}>
        <div className={styles.routesGroupHeader}>
          <h3>All Available Routes</h3>
          <span className={styles.groupHint}>{allRoutes.length} routes</span>
        </div>
        <div className={styles.allRoutesGrid}>
          {allRoutes.map((route) => (
            <RouteCard key={`${route.from}-${route.to}`} {...route} variant="compact" />
          ))}
        </div>
      </div>

      <div className={styles.missingBanner}>
        <div>
          <h4>Can’t find your route?</h4>
          <p>
            We’re constantly expanding our network. Contact support or use the search feature to discover upcoming trips.
          </p>
        </div>
        <button type="button">Search Trips</button>
      </div>
    </section>
  )
}

export default RoutesExplorerSection

