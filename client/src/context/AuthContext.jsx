import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        setAdmin(res.data.admin);
      } catch (error) {
        localStorage.removeItem('admin_token');
        setToken(null);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, admin: adminData } = res.data;

    localStorage.setItem('admin_token', newToken);
    setToken(newToken);
    setAdmin(adminData);

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setAdmin(null);
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!admin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};