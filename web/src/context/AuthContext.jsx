import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
  const response = await authAPI.login(credentials);
  localStorage.setItem("token", response.data.token);
  await checkAuth();
  return response.data;
};

const signup = async (data) => {
  const response = await authAPI.signup(data);
  localStorage.setItem("token", response.data.token);
  await checkAuth();
  return response.data;
};


const logout = () => {
  localStorage.removeItem("token");
  setUser(null);
  window.location.href = '/login';
};

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};