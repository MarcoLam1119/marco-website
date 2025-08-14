// AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(undefined);
AuthContext.displayName = 'AuthContext';

const STORAGE_KEY = 'login_token';

export function AuthProvider({ children }) {
  const [loginToken, setLoginToken] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  // Persist token changes
  useEffect(() => {
    try {
      if (loginToken) localStorage.setItem(STORAGE_KEY, loginToken);
      else localStorage.removeItem(STORAGE_KEY);
    } catch (e){
        console.log(e)
    }
  }, [loginToken]);

  // Cross-tab sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setLoginToken(e.newValue || '');
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const saveToken = (token) => {
    setLoginToken(String(token || '').trim());
  };

  const removeToken = () => setLoginToken('');

  const value = useMemo(
    () => ({
      loginToken,
      isAuthenticated: Boolean(loginToken),
      saveToken,
      removeToken,
    }),
    [loginToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}