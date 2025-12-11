import { useEffect, useRef, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import styles from '../Dashboard/Dashboard.module.css'
import { footerLinks, paymentPartner } from '../Dashboard/dashboardData'
import { useAuth } from '../../context/AuthContext'

function BusMateLayout({ children, onSignOut }) {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickAway = (event) => {
      if (!menuRef.current) return
      if (!menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickAway)
    } else {
      document.removeEventListener('mousedown', handleClickAway)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickAway)
    }
  }, [menuOpen])

  const initials =
    user?.name?.charAt(0).toUpperCase() ??
    user?.email?.charAt(0).toUpperCase() ??
    'U'

  const roleBadgeClass =
    user?.role === 'SUPER_ADMIN'
      ? styles.roleBadgeSuperAdmin
      : user?.role === 'ADMIN'
      ? styles.roleBadgeAdmin
      : ''

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut()
    } else {
      logout()
    }
    setMenuOpen(false)
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/dashboard" className={styles.brand}>
          <span className={styles.brandIcon}>🚍</span>
          <span>BusMate</span>
        </Link>
        <nav className={styles.nav}>
          <NavLink to="/booking">Book Tickets</NavLink>
          <NavLink to="/routes">View Routes</NavLink>
          <NavLink to="/my-bookings">My Bookings</NavLink>
          {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && <NavLink to="/admin">Dashboard</NavLink>}
        </nav>
        <div className={styles.userMenu} ref={menuRef}>
          <button
            type="button"
            className={styles.userButton}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className={styles.userBadge}>{initials}</span>
            <span className={styles.userMeta}>
              <strong>{user?.name || 'Traveler'}</strong>
              <small>{user?.email}</small>
            </span>
          </button>
          {menuOpen && (
            <div className={styles.userDropdown}>
              <div className={styles.userDetails}>
                <p className={styles.userName}>{user?.name}</p>
                <p className={styles.userEmail}>{user?.email}</p>
                <span className={`${styles.roleBadge} ${roleBadgeClass}`}>
                  {user?.role}
                </span>
              </div>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>
                View Profile
              </Link>
              {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                <Link to="/admin" onClick={() => setMenuOpen(false)}>
                  Admin Dashboard
                </Link>
              )}
              <button type="button" onClick={handleSignOut}>
                Sign out
              </button>
            </div>
          )}
        </div>
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
                <li key={item.label}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className={styles.copyright}>
          © 2025 BusMate. All rights reserved. Made with ❤️ for Filipino travelers.
        </div>
      </footer>
    </div>
  )
}

export default BusMateLayout

