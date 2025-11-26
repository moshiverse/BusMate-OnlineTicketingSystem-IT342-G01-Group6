import { useEffect, useMemo, useState } from 'react'
import BusMateLayout from '../components/layout/BusMateLayout'
import UserManagement from '../components/admin/UserManagement'
import BusManagement from '../components/admin/BusManagement'
import RouteManagement from '../components/admin/RouteManagement'
import ScheduleManagement from '../components/admin/ScheduleManagement'
import BusTypeManagement from '../components/admin/BusTypeManagement'
import { bookingAPI, busAPI, routesAPI, scheduleAPI } from '../api/axios'
import { formatCurrency } from '../utils/formatters'
import '../styles/AdminDashboard.css'

const AdminPage = ({ onSignOut }) => {
  const [activeSection, setActiveSection] = useState(null) // null | 'users' | 'bus-types' | 'buses' | 'routes' | 'schedules'
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBuses: 0,
    totalRoutes: 0,
    revenueMtd: 0,
  })
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const fetchDashboard = async () => {
      try {
        const [busesRes, routesRes, schedulesRes, bookingsRes] = await Promise.all([
          busAPI.getAll(),
          routesAPI.getAll(),
          scheduleAPI.getAll(),
          bookingAPI.getAll(),
        ])

        if (cancelled) return

        const buses = busesRes.data ?? []
        const routes = routesRes.data ?? []
        const schedules = schedulesRes.data ?? []
        const bookings = bookingsRes.data ?? []

        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        const revenueMtd = bookings
          .filter(
            (b) =>
              b.status === 'CONFIRMED' &&
              b.createdAt &&
              new Date(b.createdAt) >= startOfMonth,
          )
          .reduce((sum, b) => sum + Number(b.amount || 0), 0)

        setStats({
          totalBookings: bookings.length,
          activeBuses: buses.filter((b) => b.status === 'ACTIVE').length,
          totalRoutes: routes.length,
          revenueMtd,
          upcomingTrips: schedules.length,
        })

        const sortedBookings = [...bookings]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)

        setRecentBookings(sortedBookings)
      } catch (error) {
        console.error('Failed to load admin dashboard', error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchDashboard()
    return () => {
      cancelled = true
    }
  }, [])

  const managementSectionTitle = useMemo(() => {
    switch (activeSection) {
      case 'users':
        return 'Manage Users'
      case 'bus-types':
        return 'Manage Bus Types'
      case 'buses':
        return 'Manage Buses'
      case 'routes':
        return 'Manage Routes'
      case 'schedules':
        return 'Manage Schedules'
      default:
        return ''
    }
  }, [activeSection])

  const renderManagementSection = () => {
    if (!activeSection) return null

    return (
      <section className="admin-panel">
        <div className="admin-panel-header">
          <button type="button" className="btn-secondary" onClick={() => setActiveSection(null)}>
            ← Back to Dashboard
          </button>
          <h2>{managementSectionTitle}</h2>
        </div>

        <div className="admin-panel-body">
          {activeSection === 'users' && <UserManagement />}
          {activeSection === 'bus-types' && <BusTypeManagement />}
          {activeSection === 'buses' && <BusManagement />}
          {activeSection === 'routes' && <RouteManagement />}
          {activeSection === 'schedules' && <ScheduleManagement />}
        </div>
      </section>
    )
  }

  return (
    <BusMateLayout onSignOut={onSignOut}>
      <section className="admin-dashboard-page">
        <header className="admin-dashboard-header">
          <div>
            <button
              type="button"
              className="admin-back-link"
              onClick={() => window.history.back()}
            >
              ← Back to Home
            </button>
            <h1>Admin Dashboard</h1>
            <p>Manage your bus operations</p>
          </div>
        </header>

        <section className="admin-stats-grid">
          <article className="admin-stat-card">
            <p className="label">Total Bookings</p>
            <h2>{stats.totalBookings}</h2>
          </article>
          <article className="admin-stat-card">
            <p className="label">Active Buses</p>
            <h2>{stats.activeBuses}</h2>
          </article>
          <article className="admin-stat-card">
            <p className="label">Total Routes</p>
            <h2>{stats.totalRoutes}</h2>
          </article>
          <article className="admin-stat-card revenue">
            <p className="label">Revenue (MTD)</p>
            <h2>{formatCurrency(stats.revenueMtd, { withCents: false })}</h2>
          </article>
        </section>

        <section className="admin-actions-grid">
          <article
            className="admin-action-card"
            onClick={() => setActiveSection('bus-types')}
            role="button"
            tabIndex={0}
          >
            <h3>Manage Bus Types</h3>
            <p>Define different types of buses</p>
          </article>
          <article
            className="admin-action-card"
            onClick={() => setActiveSection('buses')}
            role="button"
            tabIndex={0}
          >
            <h3>Manage Buses</h3>
            <p>Add, edit, or remove buses from your fleet</p>
          </article>
          <article
            className="admin-action-card"
            onClick={() => setActiveSection('routes')}
            role="button"
            tabIndex={0}
          >
            <h3>Manage Routes</h3>
            <p>Configure bus routes</p>
          </article>
          <article
            className="admin-action-card"
            onClick={() => setActiveSection('schedules')}
            role="button"
            tabIndex={0}
          >
            <h3>Manage Schedules</h3>
            <p>Set departure times</p>
          </article>
          <article
            className="admin-action-card"
            onClick={() => setActiveSection('users')}
            role="button"
            tabIndex={0}
          >
            <h3>User Management</h3>
            <p>View and manage user accounts</p>
          </article>
        </section>

        <section className="admin-recent-bookings">
          <div className="admin-recent-header">
            <h2>Recent Bookings</h2>
            {/* Placeholder for future “View All” link */}
          </div>
          {loading ? (
            <p className="admin-loading">Syncing bookings…</p>
          ) : recentBookings.length === 0 ? (
            <div className="admin-empty">No bookings have been made yet.</div>
          ) : (
            <div className="admin-table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Route</th>
                    <th>Passenger</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{`BOOKING-${booking.id}`}</td>
                      <td>
                        {booking.schedule?.route?.origin} →{' '}
                        {booking.schedule?.route?.destination}
                      </td>
                      <td>{booking.user?.name || booking.user?.email}</td>
                      <td>{formatCurrency(booking.amount, { withCents: true })}</td>
                      <td>
                        <span className={`status-pill status-${booking.status?.toLowerCase()}`}>
                          {booking.status?.toLowerCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {renderManagementSection()}
      </section>
    </BusMateLayout>
  )
}

export default AdminPage