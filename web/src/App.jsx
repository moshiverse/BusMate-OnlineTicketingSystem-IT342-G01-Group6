import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import AuthPage from './components/AuthPage/AuthPage'
import Dashboard from './components/Dashboard/Dashboard'
import RoutesPage from './pages/RoutesPage'
import BookingPage from './pages/BookingPage'
import OAuthRedirectPage from './pages/OAuthRedirectPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import MyBookingsPage from './pages/MyBookingsPage'
import BusManagementPage from './components/admin/BusManagementPage'
import BusTypeManagement from './components/admin/BusTypeManagement'
import RouteManagement from './components/admin/RouteManagement'
import ScheduleManagement from './components/admin/ScheduleManagement'
import UserManagementPage from './pages/UserManagementPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { useAuth } from './context/AuthContext'

function App() {
  const { user, loading, checkAuth, logout } = useAuth()
  const navigate = useNavigate()

  const handleAuthSuccess = async () => {
    await checkAuth()
    navigate('/dashboard', { replace: true })
  }

  const handleSignOut = () => {
    logout()
    navigate('/', { replace: true })
  }

  if (loading) {
    return <div className="loading-page">Loading...</div>
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthPage onAuthenticated={handleAuthSuccess} />
          )
        }
      />
      <Route path="/oauth2/redirect" element={<OAuthRedirectPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard onSignOut={handleSignOut} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/routes"
        element={
          <ProtectedRoute>
            <RoutesPage onSignOut={handleSignOut} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking"
        element={
          <ProtectedRoute>
            <BookingPage onSignOut={handleSignOut} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookingsPage onSignOut={handleSignOut} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole={['ADMIN', 'SUPER_ADMIN']}>
            <AdminPage onSignOut={handleSignOut} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/buses"
        element={
          <ProtectedRoute requiredRole={['ADMIN', 'SUPER_ADMIN']}>
            <BusManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bus-types"
        element={
          <ProtectedRoute requiredRole={['ADMIN', 'SUPER_ADMIN']}>
            <BusTypeManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/routes"
        element={
          <ProtectedRoute requiredRole={['ADMIN', 'SUPER_ADMIN']}>
            <RouteManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/schedules"
        element={
          <ProtectedRoute requiredRole={['ADMIN', 'SUPER_ADMIN']}>
            <ScheduleManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requiredRole={['SUPER_ADMIN']}>
            <UserManagementPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} replace />} />
    </Routes>
  )
}

export default App

