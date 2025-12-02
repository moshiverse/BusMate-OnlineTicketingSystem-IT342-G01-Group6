import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authAPI } from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token");
    
    // Don't make API call if no token exists
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.getMe();
      setUser(response.data);
    } catch (error) {
      // Token exists but is invalid/expired - clean it up
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem("token", response.data.token);
      await checkAuth();
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (data) => {
    try {
      const response = await authAPI.signup(data);
      localStorage.setItem("token", response.data.token);
      await checkAuth();
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, signup, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};