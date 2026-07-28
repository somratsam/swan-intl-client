'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { TUser } from '@/types';

type AuthContextType = {
  user: TUser | null;
  token: string | null;
  isAdmin: boolean;
  login: (token: string, user: TUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAdmin: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('swan_token');
    const storedUser = localStorage.getItem('swan_user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('swan_token');
        localStorage.removeItem('swan_user');
      }
    }
  }, []);

  const loginFn = (newToken: string, newUser: TUser) => {
    localStorage.setItem('swan_token', newToken);
    localStorage.setItem('swan_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logoutFn = () => {
    localStorage.removeItem('swan_token');
    localStorage.removeItem('swan_user');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const handleUnauthorized = () => logoutFn();
    window.addEventListener('swan:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('swan:unauthorized', handleUnauthorized);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin: user?.role === 'admin',
        login: loginFn,
        logout: logoutFn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
