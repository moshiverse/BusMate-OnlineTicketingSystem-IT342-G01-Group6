import { useState, useEffect } from 'react';
import { authAPI } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await authAPI.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await authAPI.createAdmin(formData);
      setFormData({ name: '', email: '', password: '' });
      setShowCreateAdmin(false);
      loadUsers();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create admin');
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await authAPI.updateRole(userId, newRole);
      loadUsers();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update role');
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>User Management</h2>
        {currentUser?.role === 'SUPER_ADMIN' && (
          <button
            className="btn-primary"
            onClick={() => setShowCreateAdmin(!showCreateAdmin)}
          >
            {showCreateAdmin ? 'Cancel' : 'Create Admin'}
          </button>
        )}
      </div>

      {showCreateAdmin && (
        <form className="admin-form" onSubmit={handleCreateAdmin}>
          <h3>Create New Admin</h3>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button type="submit" className="btn-primary">Create Admin</button>
        </form>
      )}

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              {currentUser?.role === 'SUPER_ADMIN' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                {currentUser?.role === 'SUPER_ADMIN' && (
                  <td>
                    {user.role !== 'SUPER_ADMIN' && (
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                        className="role-select"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
