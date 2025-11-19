import TripCard from '../TripCard/TripCard'
import styles from './Dashboard.module.css'

function BookingSection({ summary, trips, showBackLink = true }) {
  return (
    <section className={styles.booking}>
      {showBackLink && (
        <button type="button" className={styles.backLink} onClick={() => window.history.back()}>
          ← Back
        </button>
      )}
      <div className={styles.itinerary} style={{ backgroundImage: `url(${summary.cover})` }}>
        <div>
          <p>Route</p>
          <h3>{summary.route}</h3>
        </div>
        <div>
          <p>Travel Date</p>
          <h3>{summary.travelDate}</h3>
        </div>
        <div>
          <p>Passengers</p>
          <h3>{summary.passengers}</h3>
        </div>
        <span className={styles.tripBadge}>{summary.availableTrips} Trips Available</span>
      </div>
      <div className={styles.bookingHeader}>
        <h2>Available Trips</h2>
        <span>{summary.availableTrips} options found</span>
      </div>
      <div className={styles.tripList}>
        {trips.map((trip) => (
          <TripCard key={trip.id} {...trip} />
        ))}
      </div>
    </section>
  )
}

export default BookingSection

