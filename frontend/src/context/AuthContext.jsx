import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API_URL = 'http://localhost:5001/api/auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('civic_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('civic_token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    localStorage.setItem('civic_token', res.data.token);
    localStorage.setItem('civic_user', JSON.stringify(res.data.user));
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (name, email, password, ward) => {
    const res = await axios.post(`${API_URL}/register`, { name, email, password, ward });
    localStorage.setItem('civic_token', res.data.token);
    localStorage.setItem('civic_user', JSON.stringify(res.data.user));
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('civic_token');
    localStorage.removeItem('civic_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return { user: null, token: null, login: async () => {}, register: async () => {}, logout: () => {} };
  }
  return context;
};