import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-dashboard-page">
      {/* Header Section */}
      <div className="admin-dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage your bus operations</p>
        </div>
        <button className="btn btn-outlined">Back to Home</button>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon bookings-icon"></div>
          <div>
            <div className="label">Total Bookings</div>
            <h2>1,247</h2>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon buses-icon"></div>
          <div>
            <div className="label">Active Buses</div>
            <h2>23</h2>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon routes-icon"></div>
          <div>
            <div className="label">Total Routes</div>
            <h2>15</h2>
          </div>
        </div>
        <div className="admin-stat-card revenue">
          <div className="stat-icon revenue-icon"></div>
          <div>
            <div className="label">Revenue (MTD)</div>
            <h2>₱487,500</h2>
          </div>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="admin-actions-grid">
        <button 
          className="admin-action-card"
          onClick={() => handleNavigate('/admin/buses')}
        >
          <div className="action-icon buses-icon-large"></div>
          <h3>Manage Buses</h3>
          <p>Add, edit, or remove buses</p>
        </button>
        <button 
          className="admin-action-card"
          onClick={() => handleNavigate('/admin/routes')}
        >
          <div className="action-icon routes-icon-large"></div>
          <h3>Manage Routes</h3>
          <p>Configure bus routes</p>
        </button>
        <button 
          className="admin-action-card"
          onClick={() => handleNavigate('/admin/schedules')}
        >
          <div className="action-icon schedules-icon-large"></div>
          <h3>Manage Schedules</h3>
          <p>Set departure times</p>
        </button>
        <button 
          className="admin-action-card"
          onClick={() => handleNavigate('/admin/reports')}
        >
          <div className="action-icon reports-icon-large"></div>
          <h3>Reports</h3>
          <p>View analytics & reports</p>
        </button>
      </div>

      {/* Recent Bookings Section */}
      <div className="admin-recent-bookings">
        <div className="admin-recent-header">
          <h2>Recent Bookings</h2>
          <button className="btn btn-outlined btn-small">View All</button>
        </div>
        
        <div className="admin-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Route</th>
                <th>Passenger</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>BK-001</td>
                <td>Manila → Baguio</td>
                <td>Juan Dela Cruz</td>
                <td>2</td>
                <td className="amount">₱1,300</td>
                <td><span className="status-pill status-confirmed">confirmed</span></td>
              </tr>
              <tr>
                <td>BK-002</td>
                <td>Cebu → Bohol</td>
                <td>Maria Santos</td>
                <td>1</td>
                <td className="amount">₱450</td>
                <td><span className="status-pill status-confirmed">confirmed</span></td>
              </tr>
              <tr>
                <td>BK-003</td>
                <td>Manila → Iloilo</td>
                <td>Pedro Reyes</td>
                <td>3</td>
                <td className="amount">₱3,600</td>
                <td><span className="status-pill status-cancelled">cancelled</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

      {/* Recent Bookings Section */}
      <div className="admin-recent-bookings">
        <div className="admin-recent-header">
          <h2>Recent Bookings</h2>
          <button className="btn btn-outlined btn-small">View All</button>
        </div>
        
        <div className="admin-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Route</th>
                <th>Passenger</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>BK-001</td>
                <td>Manila → Baguio</td>
                <td>Juan Dela Cruz</td>
                <td>2</td>
                <td className="amount">₱1,300</td>
                <td><span className="status-pill status-confirmed">confirmed</span></td>
              </tr>
              <tr>
                <td>BK-002</td>
                <td>Cebu → Bohol</td>
                <td>Maria Santos</td>
                <td>1</td>
                <td className="amount">₱450</td>
                <td><span className="status-pill status-confirmed">confirmed</span></td>
              </tr>
              <tr>
                <td>BK-003</td>
                <td>Manila → Iloilo</td>
                <td>Pedro Reyes</td>
                <td>3</td>
                <td className="amount">₱3,600</td>
                <td><span className="status-pill status-cancelled">cancelled</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;