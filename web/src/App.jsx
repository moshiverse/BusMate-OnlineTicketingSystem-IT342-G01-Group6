import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import AuthPage from './components/AuthPage/AuthPage'
import Dashboard from './components/Dashboard/Dashboard'
import RoutesPage from './pages/RoutesPage'
import BookingPage from './pages/BookingPage'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
    navigate('/dashboard', { replace: true })
  }

  const handleSignOut = () => {
    setIsAuthenticated(false)
    navigate('/', { replace: true })
  }

  return (
    <Routes>
      <Route path="/" element={<AuthPage onAuthenticated={handleAuthSuccess} />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard onSignOut={handleSignOut} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/routes"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <RoutesPage onSignOut={handleSignOut} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <BookingPage onSignOut={handleSignOut} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/'} replace />} />
    </Routes>
  )
}

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

export default App

