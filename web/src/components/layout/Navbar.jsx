import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">🚌 BusMate</Link>
        
        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/booking" className="nav-link">Book Ticket</Link>
          
          {user ? (
            <>
              {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                <Link to="/admin" className="nav-link">Admin</Link>
              )}
              <Link to="/profile" className="nav-link">Profile</Link>
              <button onClick={logout} className="nav-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-btn">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;