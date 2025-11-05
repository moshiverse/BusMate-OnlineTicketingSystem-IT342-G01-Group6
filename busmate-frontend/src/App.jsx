import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Bookings from './pages/Bookings';
import Buses from './pages/Buses';
import Schedules from './pages/Schedules';
import Payments from './pages/Payments';
import RoutesPage from './pages/RoutesPage';
import Seats from './pages/Seats';

function Navbar() {
  return (
    <nav style={{ marginBottom: '20px' }}>
      <Link to="/dashboard">Dashboard</Link> |{' '}
      <Link to="/profile">Profile</Link> |{' '}
      <Link to="/bookings">Bookings</Link> |{' '}
      <Link to="/buses">Buses</Link> |{' '}
      <Link to="/schedules">Schedules</Link> |{' '}
      <Link to="/payments">Payments</Link> |{' '}
      <Link to="/routes">Routes</Link> |{' '}
      <Link to="/seats">Seats</Link>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/buses" element={<Buses />} />
        <Route path="/schedules" element={<Schedules />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/seats" element={<Seats />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
