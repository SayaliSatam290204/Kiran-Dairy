import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          
          // Validate that user has required fields
          if (parsedUser && parsedUser.id && parsedUser.role) {
            setUser(parsedUser);
          } else {
            console.warn('Invalid user object structure:', parsedUser);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        } catch (error) {
          console.error('Failed to parse user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        // No token or user data, clear both to stay in sync
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Watch for storage changes (e.g., logout from another tab or interceptor)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        // If token was cleared or user data is missing, logout
        if (!token || !userData) {
          console.log('Storage cleared - logging out');
          setUser(null);
        } else {
          try {
            const parsedUser = JSON.parse(userData);
            if (parsedUser && parsedUser.id && parsedUser.role) {
              setUser(parsedUser);
            } else {
              console.warn('Invalid user object structure:', parsedUser);
              setUser(null);
            }
          } catch (error) {
            console.error('Failed to parse user data:', error);
            setUser(null);
          }
        }
      }
    };

    // Listen for storage events (from other tabs/windows or interceptor)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (userData, token) => {
    // Ensure user object has all required fields
    const safeUser = {
      id: userData.id,
      name: userData.name,
      email: userData.email || null,
      phone: userData.phone || null,
      role: userData.role, // CRITICAL: role must be present
      shopId: userData.shopId || null,
      isActive: userData.isActive !== false
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(safeUser));
    setUser(safeUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedUserData) => {
    const updatedUser = {
      ...user,
      ...updatedUserData
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
