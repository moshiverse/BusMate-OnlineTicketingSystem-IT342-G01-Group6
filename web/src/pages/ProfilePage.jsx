import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, bookingAPI } from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '' });
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Populate form when user becomes available
  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '' });
    }
  }, [user]);

  if (!user) return null;

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) return;
      try {
        const res = await bookingAPI.getUserBookings(user.id);
        setBookings(res.data);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      } finally {
        setLoadingBookings(false);
      }
    };
    fetchBookings();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!formData.name || formData.name.trim() === '') {
      alert('Name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const payload = { name: formData.name.trim() };
      const res = await authAPI.updateProfile(payload);
      // res.data should contain updated user object (controller returns safe map/dto)
      // update auth context so UI reflects change globally
      setUser(res.data);
      setIsEditing(false);
      alert('Profile updated');
    } catch (err) {
      console.error('Failed to update profile', err);
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const ok = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!ok) return;

    setLoading(true);
    try {
      await authAPI.deleteAccount();
      // clear client-side auth and navigate to login
      logout(); // this clears token and navigates to login in your context
      // If your logout does not navigate, do it here:
      // navigate('/login');
    } catch (err) {
      console.error('Failed to delete account', err);
      alert(err.response?.data?.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>My Profile</h1>

        <div className="profile-card">
          <div className="profile-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div className="profile-info">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Account Info</h3>
              <button
                className="btn-secondary"
                onClick={() => {
                  setIsEditing(prev => !prev);
                  // reset form to current name when toggling edit on
                  if (!isEditing) setFormData({ name: user.name || '' });
                }}
                disabled={loading}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditing ? (
              <form className="profile-edit-form" onSubmit={handleUpdateProfile}>
                <div className="info-row">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ marginTop: 12, display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    Save
                  </button>
                  
                  <button 
                    type="button"
                    className="btn-danger-small"
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    style={{ marginLeft: 'auto' }}
                  >
                    Delete Account
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="info-row">
                  <label>Name:</label>
                  <span>{user.name}</span>
                </div>
                <div className="info-row">
                  <label>Email:</label>
                  <span>{user.email}</span>
                </div>
                <div className="info-row">
                  <label>Role:</label>
                  <span className={`role-badge ${user.role?.toLowerCase()}`}>
                    {user.role}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="profile-section">
          <h2>My Bookings</h2>
          {loadingBookings ? (
            <p>Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="text-muted">No bookings yet</p>
          ) : (
            <div className="bookings-list">
                {bookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <span className="booking-id">Booking ID: {booking.id}</span>
                    <span className={`booking-status status-${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="booking-details">
                    <div>
                      <span className="booking-detail-label">Amount:</span>
                      <span className="booking-detail-value">₱{booking.amount}</span>
                    </div>
                    <div>
                      <span className="booking-detail-label">Date:</span>
                      <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;