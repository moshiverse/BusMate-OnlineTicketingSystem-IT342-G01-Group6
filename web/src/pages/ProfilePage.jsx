import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>My Profile</h1>
        
        <div className="profile-card">
          <div className="profile-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          
          <div className="profile-info">
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
          </div>
        </div>

        <div className="profile-section">
          <h2>My Bookings</h2>
          <p className="text-muted">Your booking history will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;