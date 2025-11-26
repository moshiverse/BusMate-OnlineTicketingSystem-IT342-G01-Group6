import styles from './TripCard.module.css'

function TripCard({
  id,
  tier,
  departureTime,
  arrivalTime,
  duration,
  price,
  seats,
  amenities = [],
  onSelect,
  disabled = false,
  ctaLabel = 'Select Seats →',
}) {
  return (
    <article className={styles.card}>
      <div className={styles.meta}>
        <div className={styles.busIcon}>🚌</div>
        <div>
          <span className={styles.badge}>{tier}</span>
          <p className={styles.busLabel}>Bus • {id}</p>
        </div>
      </div>

      <div className={styles.schedule}>
        <div>
          <p className={styles.label}>Departure</p>
          <p className={styles.time}>{departureTime}</p>
        </div>
        <div className={styles.duration}>
          <span />
          <p>{duration}</p>
          <span />
        </div>
        <div>
          <p className={styles.label}>Arrival</p>
          <p className={styles.time}>{arrivalTime}</p>
        </div>
      </div>

      <div className={styles.amenities}>
        {amenities.map((item) => (
          <span key={`${id}-${item}`}>{item}</span>
        ))}
      </div>

      <div className={styles.bookingRow}>
        <div>
          <p className={styles.label}>Price per seat</p>
          <p className={styles.price}>{price}</p>
          <p className={styles.seats}>{seats}</p>
        </div>
        <button type="button" onClick={onSelect} disabled={disabled || !onSelect}>
          {disabled ? 'Sold Out' : ctaLabel}
        </button>
      </div>
    </article>
  )
}

export default TripCard

