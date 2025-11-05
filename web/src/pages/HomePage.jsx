import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>🚌 Welcome to BusMate</h1>
          <p className="hero-subtitle">Your reliable bus booking platform</p>
          <p className="hero-description">
            Book bus tickets easily, select your preferred seats, and travel comfortably
          </p>
          <div className="hero-actions">
            <Link to="/booking" className="btn-primary btn-large">
              Book a Ticket Now
            </Link>
            {!user && (
              <Link to="/signup" className="btn-secondary btn-large">
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>
      
      <section className="features">
        <h2>Why Choose BusMate?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎫</div>
            <h3>Easy Booking</h3>
            <p>Book your bus tickets in just a few clicks with our intuitive interface</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💺</div>
            <h3>Seat Selection</h3>
            <p>Choose your preferred seat from real-time availability</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Secure Payment</h3>
            <p>Multiple payment options with secure transaction processing</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Digital Tickets</h3>
            <p>Get your tickets instantly with QR codes for easy boarding</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <h3>Multiple Routes</h3>
            <p>Travel to various destinations across the region</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h3>Flexible Schedules</h3>
            <p>Multiple departure times to fit your travel plans</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Start Your Journey?</h2>
        <p>Join thousands of satisfied travelers who trust BusMate</p>
        <Link to="/booking" className="btn-primary btn-large">
          Book Your Ticket
        </Link>
      </section>
    </div>
  );
};

export default HomePage;