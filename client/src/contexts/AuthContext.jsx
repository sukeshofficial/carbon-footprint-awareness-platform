import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';

const AuthContext = createContext(null);

const safeRoutes = new Set(['/dashboard', '/profile', '/history', '/settings', '/planner']);

/**
 * Validates if a path is in the safe allowlist.
 * Defaults to /dashboard if invalid.
 */
function getSafeRedirect(path) {
  if (!path) return '/dashboard';
  // Check if it's a relative path starting with /
  if (path.startsWith('/') && !path.startsWith('//')) {
    const baseRoute = path.split('?')[0];
    return safeRoutes.has(baseRoute) ? path : '/dashboard';
  }
  return '/dashboard';
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        setUser(response.data.data.user);
      } catch (error) {
        console.error('CheckAuth failed:', error);
        localStorage.removeItem('accessToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password, rememberMe = false) => {
    const response = await api.post('/auth/login', { email, password, rememberMe });
    const { user, accessToken } = response.data.data;
    localStorage.setItem('accessToken', accessToken);
    setUser(user);
    return user;
  };

  const signup = async (userData) => {
    await api.post('/auth/signup', userData);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  const forgotPassword = async (email) => {
    await api.post('/auth/forgot-password', { email });
  };

  const resetPassword = async (token, password) => {
    await api.post(`/auth/reset-password/${token}`, { password });
  };

  const loginWithGoogle = async () => {
    try {
      const response = await api.get('/auth/google');
      if (response.data.url) {
        const targetUrl = response.data.url;
        const isInternal = targetUrl.startsWith('/') || targetUrl.startsWith(globalThis.location.origin);

        if (isInternal) {
          globalThis.location.href = targetUrl;
        } else {
          // Blocked unsafe redirect — redirect to safe default
          globalThis.location.href = '/dashboard';
        }
      }
    } catch (error) {
      console.error('Google login initialization failed:', error);
      throw error;
    }
  };

  const updateMe = async (data) => {
    const response = await api.patch('/auth/me', data);
    const updatedUser = response.data.data.user;
    setUser(updatedUser);
    return updatedUser;
  };

  const value = React.useMemo(
    () => ({
      user,
      loading,
      login,
      signup,
      logout,
      forgotPassword,
      resetPassword,
      loginWithGoogle,
      updateMe,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
