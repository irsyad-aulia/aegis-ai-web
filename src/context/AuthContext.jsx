import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // Check token on mount
    const savedToken = localStorage.getItem('aegisToken');
    const savedUser = localStorage.getItem('aegisUser');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsAuthLoading(false);
  }, []);

  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('aegisToken', newToken);
    localStorage.setItem('aegisUser', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('aegisToken');
    localStorage.removeItem('aegisUser');
  };

  const upgradeToPro = async () => {
    if (!user || !token) return;
    try {
      const res = await fetch('http://localhost:3000/api/user/upgrade', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const upgradedUser = { ...user, isPro: true };
        setUser(upgradedUser);
        localStorage.setItem('aegisUser', JSON.stringify(upgradedUser));
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthLoading, login, logout, upgradeToPro }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
