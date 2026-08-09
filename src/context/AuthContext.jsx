import React, { createContext, useContext, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (emailOrPhone, password) => {
    setLoading(true);
    try {
      const response = await authService.loginUser(emailOrPhone, password);
      setUser(response.user);
      setToken(response.token);
      return response.user;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData) => {
    setLoading(true);
    try {
      const response = await authService.signupUser(formData);
      setUser(response.user);
      setToken(response.token);
      return response.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
