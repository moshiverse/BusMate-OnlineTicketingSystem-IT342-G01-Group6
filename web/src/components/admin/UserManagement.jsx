import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import BusMateLayout from '../layout/BusMateLayout';
import '../../styles/UserManagement.css';

const UserManagement = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await authAPI.updateRole(editingUser.id, formData.role);
      } else {
        await authAPI.createAdmin(formData);
      }
      resetForm();
      loadUsers();
    } catch (error) {
      alert(error.response?.data?.error || `Failed to ${editingUser ? 'update' : 'create'} user`);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: ''
    });
    setEditingUser(user);
    setShowForm(true);
  };

const handleDelete = async (userId) => {
  if (window.confirm('Are you sure you want to delete this user?')) {
    try {
      await authAPI.deleteUser(userId);
      loadUsers();
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data || error.message || 'Failed to delete user';
      alert(`Failed to delete user: ${errorMsg}`);
      console.error('Delete error:', error);
    }
  }
};  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', role: 'USER' });
    setShowForm(false);
    setEditingUser(null);
  };

  if (loading) {
    return (
      <BusMateLayout>
        <div className="user-management-page">
          <div className="user-management-content">
            <p style={{ textAlign: 'center', color: '#64748b', marginTop: '2rem' }}>Loading users...</p>
          </div>
        </div>
      </BusMateLayout>
    );
  }

  return (
    <BusMateLayout>
      <div className="user-management-page">
        <div className="user-management-content">
          {/* Page Header */}
          <div className="user-page-header">
            <div className="user-header-content">
              <button className="user-back-link" onClick={handleBackToDashboard}>
                ← Back to Dashboard
              </button>
              <h1>Manage Users</h1>
              <p>Create and manage system users and admins</p>
            </div>
            {currentUser?.role === 'SUPER_ADMIN' && (
              <button className="user-add-btn" onClick={() => setShowForm(!showForm)}>
                + Create Admin
              </button>
            )}
          </div>

          {/* Add User Form */}
          {showForm && currentUser?.role === 'SUPER_ADMIN' && (
            <div className="user-add-form-container">
              <form onSubmit={handleSubmit} className="user-add-form">
                <h3>{editingUser ? 'Edit User' : 'Create New Admin'}</h3>

                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={!!editingUser}
                  />
                </div>

                {!editingUser && (
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={formData.role || 'USER'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                    className="form-select"
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    {editingUser ? 'Update User' : 'Create Admin'}
                  </button>
                  <button type="button" className="btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Users Cards */}
          {users.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', marginTop: '2rem' }}>No users found. Create one to get started.</p>
          ) : (
            <div className="users-cards-container">
              {users.map(user => (
                <div key={user.id} className="user-card">
                  <div className="user-card-content">
                    <div className="user-detail">
                      <p className="detail-label">Name</p>
                      <p className="detail-value">{user.name}</p>
                    </div>
                    <div className="user-detail">
                      <p className="detail-label">Email</p>
                      <p className="detail-value">{user.email}</p>
                    </div>
                    <div className="user-detail">
                      <p className="detail-label">Role</p>
                      <div className="user-role-badge" data-role={user.role.toLowerCase()}>
                        {user.role}
                      </div>
                    </div>
                    <div className="user-detail">
                      <p className="detail-label">Joined</p>
                      <p className="detail-value">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="user-card-actions">
                    {currentUser?.role === 'SUPER_ADMIN' && user.id !== currentUser.id ? (
                      <>
                        <button
                          className="user-action-btn edit"
                          onClick={() => handleEdit(user)}
                          title="Edit"
                        >
                          ✎
                        </button>
                        <button
                          className="user-action-btn delete"
                          onClick={() => handleDelete(user.id)}
                          title="Delete"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="user-action-btn placeholder"
                          disabled
                          style={{ visibility: 'hidden' }}
                        >
                          ✎
                        </button>
                        <button
                          className="user-action-btn placeholder"
                          disabled
                          style={{ visibility: 'hidden' }}
                        >
                          ✕
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </BusMateLayout>
  );
};

export default UserManagement;
