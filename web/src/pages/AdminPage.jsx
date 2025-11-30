import { useEffect, useState } from 'react'
import BusMateLayout from '../components/layout/BusMateLayout'
import { bookingAPI, busAPI, routesAPI, scheduleAPI } from '../api/axios'
import { formatCurrency } from '../utils/formatters'
import '../styles/AdminDashboard.css'


const AdminPage = ({ onSignOut }) => {
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

  return (
    <BusMateLayout onSignOut={onSignOut}>
      <section className="admin-dashboard-page">
        <header className="admin-dashboard-header">
          <div>
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
            onClick={() => window.location.href = '/admin/buses'}
            role="button"
            tabIndex={0}
          >
            <div className="action-icon">🚌</div>
            <h3>Manage Buses</h3>
            <p>Add, edit, or remove buses</p>
          </article>
          <article
            className="admin-action-card"
            onClick={() => window.location.href = '/admin/bus-types'}
            role="button"
            tabIndex={0}
          >
            <div className="action-icon">🚐</div>
            <h3>Bus Types</h3>
            <p>Manage bus categories</p>
          </article>
          <article
            className="admin-action-card"
            onClick={() => window.location.href = '/admin/routes'}
            role="button"
            tabIndex={0}
          >
            <div className="action-icon">🗺️</div>
            <h3>Manage Routes</h3>
            <p>Configure bus routes</p>
          </article>
          <article
            className="admin-action-card"
            onClick={() => window.location.href = '/admin/schedules'}
            role="button"
            tabIndex={0}
          >
            <div className="action-icon">📅</div>
            <h3>Manage Schedules</h3>
            <p>Set departure times</p>
          </article>
          <article
            className="admin-action-card"
            onClick={() => window.location.href = '/admin/users'}
            role="button"
            tabIndex={0}
          >
            <div className="action-icon">👥</div>
            <h3>User Management</h3>
            <p>View and manage users</p>
          </article>
        </section>

        <section className="admin-recent-bookings">
          <div className="admin-recent-header">
            <h2>Recent Bookings</h2>
            {/* Placeholder for future "View All" link */}
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
      </section>
    </BusMateLayout>
  )
}


export default AdminPage
