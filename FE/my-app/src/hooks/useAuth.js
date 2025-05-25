import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Giả lập cơ sở dữ liệu tài khoản
const mockAccounts = [
  { email: 'user@example.com', password: 'user123', name: 'Regular User', role: 'USER', id: 'user-001' },
  { email: 'admin@example.com', password: 'admin123', name: 'Admin User', role: 'ADMIN', id: 'admin-001' },
];

/**
 * Custom hook for handling authentication
 * @returns {Object} Authentication methods and state
 */
const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('authToken');
    return token ? JSON.parse(localStorage.getItem('userData') || '{}') : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if we have a token in localStorage
  const checkAuthStatus = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const shouldUpdate = JSON.stringify(user) !== JSON.stringify(userData);
        if (shouldUpdate) {
          setUser(userData);
        }
        return userData;
      } catch (err) {
        console.error('Failed to parse stored user data:', err);
        logout();
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const currentUser = checkAuthStatus();
    if (currentUser && ['/login', '/'].includes(window.location.pathname)) {
      navigate('/home', { replace: true });
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Tìm tài khoản trong mockAccounts
          const account = mockAccounts.find(
            (acc) => acc.email === email && acc.password === password
          );

          if (account) {
            const userData = {
              id: account.id,
              name: account.name,
              email: account.email,
              role: account.role,
            };
            const token = 'fake-jwt-token-' + Math.random();
            localStorage.setItem('authToken', token);
            localStorage.setItem('userData', JSON.stringify(userData));
            setUser(userData);
            setLoading(false);
            navigate('/home', { replace: true });
            resolve({ user: userData, token });
          } else {
            const error = new Error('Invalid credentials');
            setError(error.message);
            setLoading(false);
            reject(error);
          }
        }, 1000);
      });
    } catch (err) {
      setError(err.message || 'Login failed');
      setLoading(false);
      throw err;
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Kiểm tra email đã tồn tại
          if (mockAccounts.some((acc) => acc.email === userData.email)) {
            const error = new Error('Email is already registered');
            setError(error.message);
            setLoading(false);
            reject(error);
            return;
          }

          const newUser = {
            id: 'new-' + Math.random().toString(36).substring(2, 9),
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: 'USER', // Mặc định là USER khi đăng ký
          };

          // Thêm vào mockAccounts (trong thực tế, bạn sẽ gửi API để lưu vào DB)
          mockAccounts.push(newUser);

          setLoading(false);
          resolve({ user: newUser });
          navigate('/login');
        }, 1000);
      });
    } catch (err) {
      setError(err.message || 'Registration failed');
      setLoading(false);
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    navigate('/', { replace: true });
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuthStatus,
    isAuthenticated: !!user,
  };
};

export default useAuth;