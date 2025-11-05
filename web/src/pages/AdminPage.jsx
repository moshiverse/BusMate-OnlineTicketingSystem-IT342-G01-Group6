import { useState } from 'react';
import UserManagement from '../components/admin/UserManagement';
import BusManagement from '../components/admin/BusManagement';
import RouteManagement from '../components/admin/RouteManagement';
import ScheduleManagement from '../components/admin/ScheduleManagement';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1>Admin Dashboard</h1>
        
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`tab-btn ${activeTab === 'buses' ? 'active' : ''}`}
            onClick={() => setActiveTab('buses')}
          >
            Buses
          </button>
          <button
            className={`tab-btn ${activeTab === 'routes' ? 'active' : ''}`}
            onClick={() => setActiveTab('routes')}
          >
            Routes
          </button>
          <button
            className={`tab-btn ${activeTab === 'schedules' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedules')}
          >
            Schedules
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'buses' && <BusManagement />}
          {activeTab === 'routes' && <RouteManagement />}
          {activeTab === 'schedules' && <ScheduleManagement />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;