import React, { createContext, useState, useContext } from 'react';
import { authRepo } from '../../api/features/AuthRepo';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authRepo.login(email, password);
      const userData = response.metadata.user;
      setUser(userData);
      setToken(response.metadata.token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', response.metadata.token);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, phone, password) => {
    try {
      setLoading(true);
      const response = await authRepo.signup(name, email, phone, password);
      setUser(response.metadata.user);
      localStorage.setItem('user', JSON.stringify(response.metadata.user));
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}