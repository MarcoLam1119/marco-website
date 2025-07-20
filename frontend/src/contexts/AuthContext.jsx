// AuthContext.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Store token in state
  const [loginToken, setLoginToken] = useState(localStorage.getItem('login_token') || '');

  // Update token and localStorage
  const saveToken = (token) => {
    setLoginToken(token);
    localStorage.setItem('login_token', token);
  };

  const removeToken = () => {
    setLoginToken('');
    localStorage.removeItem('login_token');
  };

  return (
    <AuthContext.Provider value={{ loginToken, saveToken, removeToken }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy usage
export function useAuth() {
  return useContext(AuthContext);
}