import { NavLink } from 'react-router-dom'
import styles from '../Dashboard/Dashboard.module.css'
import { footerLinks, paymentPartner } from '../Dashboard/dashboardData'

function BusMateLayout({ children, onSignOut }) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>🚍</span>
          <span>BusMate</span>
        </div>
        <nav className={styles.nav}>
          <NavLink to="/dashboard">Book Tickets</NavLink>
          <NavLink to="/routes">View Routes</NavLink>
          <NavLink to="/booking">My Bookings</NavLink>
        </nav>
        {onSignOut && (
          <button type="button" className={styles.avatar} onClick={onSignOut}>
            Sign out
          </button>
        )}
      </header>

      {children}

      <footer className={styles.footer}>
        <div>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>🚍</span>
            <span>BusMate</span>
          </div>
          <p>Your trusted partner for safe and comfortable intercity bus travel across the Philippines.</p>
        </div>
        {footerLinks.map((column) => (
          <div key={column.title}>
            <h4>{column.title}</h4>
            <ul>
              {column.items.map((item) => (
                <li key={item}>
                  <a href="#">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h4>Payment Partners</h4>
          <img src={paymentPartner} alt="GoTyme" />
        </div>
        <div className={styles.copyright}>
          © 2025 BusMate. All rights reserved. Made with ❤️ for Filipino travelers.
        </div>
      </footer>
    </div>
  )
}

export default BusMateLayout

