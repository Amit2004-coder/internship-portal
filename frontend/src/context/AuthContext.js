import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const Ctx = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user + token on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem('ip_user');
    const token = localStorage.getItem('token');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    setLoading(false);
  }, []);

  // ✅ LOGIN FIXED
  const login = (data) => {
    const userData = data.user || data;

    setUser(userData);

    // store user
    localStorage.setItem('ip_user', JSON.stringify(userData));

    // IMPORTANT: store token separately
    if (data.token) {
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    }
  };

  // ✅ LOGOUT FIXED
  const logout = () => {
    setUser(null);
    localStorage.removeItem('ip_user');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <Ctx.Provider value={{ user, login, logout, loading }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => useContext(Ctx);