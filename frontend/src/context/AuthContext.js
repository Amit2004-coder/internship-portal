import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const Ctx = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('ip_user');
    if (saved) {
      const u = JSON.parse(saved);
      setUser(u);
      axios.defaults.headers.common['Authorization'] = `Bearer ${u.token}`;
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    setUser(data);
    localStorage.setItem('ip_user', JSON.stringify(data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ip_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return <Ctx.Provider value={{ user, login, logout, loading }}>{children}</Ctx.Provider>;
};

export const useAuth = () => useContext(Ctx);
