import { useNavigate } from 'react-router-dom'
import styles from './RouteCard.module.css'

function RouteCard({
  id,
  from,
  to,
  distance,
  duration,
  price,
  extra,
  extras,
  badge,
  variant = 'default',
  rawSchedule,
}) {
  const navigate = useNavigate()
  const pillData = extras ?? extra ?? []

  const handleBookNow = () => {
    if (rawSchedule) {
      // Navigate directly to seat selection with schedule data
      navigate('/booking', { state: { selectedSchedule: rawSchedule, step: 'seats' } })
    } else {
      // Fallback to booking page if no schedule info
      navigate('/booking')
    }
  }
  return (
    <article className={`${styles.card} ${variant === 'compact' ? styles.compact : ''}`}>
      <div className={styles.topRow}>
        <div>
          <p className={styles.label}>From</p>
          <p className={styles.value}>{from}</p>
        </div>
        <div className={styles.connector} aria-hidden="true">
          <span>✈️</span>
        </div>
        <div>
          <p className={styles.label}>To</p>
          <p className={styles.value}>{to}</p>
        </div>
        {badge && <span className={styles.badge}>{badge}</span>}
      </div>

      <div className={styles.meta}>
        <div>
          <p className={styles.label}>Distance</p>
          <p className={styles.metaValue}>{distance}</p>
        </div>
        <div>
          <p className={styles.label}>Duration</p>
          <p className={styles.metaValue}>{duration}</p>
        </div>
      </div>

      {price && (
        <div className={styles.priceRow}>
          <p className={styles.label}>Starting from</p>
          <p className={styles.price}>{price}</p>
        </div>
      )}

      {pillData.length > 0 && (
        <div className={styles.extra}>
          {pillData.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      )}

      <button type="button" className={styles.bookButton} onClick={handleBookNow}>
        Book Now
      </button>
    </article>
  )
}

export default RouteCard

