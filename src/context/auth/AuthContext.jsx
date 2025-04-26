import React, { createContext, useState, useContext, useEffect } from 'react';
import { authRepo } from '../../api/features/AuthRepo';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          console.log('Fetching current user with token:', token);
          const userData = await authRepo.getCurrentUser();
          console.log('Current user data:', userData);
          setUser(userData.metadata.user);
        } catch (err) {
          console.error('Failed to fetch current user:', err);
        } finally {
          setInitialLoading(false);
        }
      } else {
        setInitialLoading(false);
      }
    };
  
    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authRepo.login(email, password);
      const userData = response.metadata.user;
      setUser(userData);
      setToken(response.metadata.token);
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
      const newToken = response.metadata.token;
      setToken(newToken);
      localStorage.setItem('token', newToken);
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
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  if (initialLoading) {
    return <div>Loading...</div>; // Hoặc một component loading khác
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}