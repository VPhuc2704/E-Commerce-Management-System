import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for handling authentication
 * @returns {Object} Authentication methods and state
 */
const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if we have a token in localStorage
  const checkAuthStatus = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        // In a real app, you would validate the token with your backend
        // and get the user details
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        setUser(userData);
        return userData;
      } catch (err) {
        console.error('Failed to parse stored user data:', err);
        logout();
        return null;
      }
    }
    return null;
  };

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // Here you would make an API call to your backend
      // const response = await api.post('/login', { email, password });
      
      // Simulating API call for now
      // In a real app, replace this with actual API call
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email && password) {
            // Simulate successful login
            const userData = {
              id: '123',
              name: 'Test User',
              email,
              role: 'USER'
            };
            
            // Store auth data
            const token = 'fake-jwt-token-' + Math.random();
            localStorage.setItem('authToken', token);
            localStorage.setItem('userData', JSON.stringify(userData));
            
            setUser(userData);
            setLoading(false);
            resolve({ user: userData, token });
          } else {
            // Simulate failed login
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
      // Here you would make an API call to your backend
      // const response = await api.post('/register', userData);
      
      // Simulating API call for now
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Check if email is already registered (in a real app this would be done by your backend)
          if (userData.email === 'taken@example.com') {
            const error = new Error('Email is already registered');
            setError(error.message);
            setLoading(false);
            reject(error);
            return;
          }
          
          // Simulate successful registration
          const newUser = {
            id: 'new-' + Math.random().toString(36).substring(2, 9),
            name: userData.name,
            email: userData.email,
            role: 'USER'
          };
          
          setLoading(false);
          resolve({ user: newUser });
          
          // In a real app, you might want to automatically log in the user after registration
          // or redirect them to the login page
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
    navigate('/login');
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuthStatus,
    isAuthenticated: !!user
  };
};

export default useAuth;