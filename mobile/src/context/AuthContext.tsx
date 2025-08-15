import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

type AuthContextType = {
  token: string | null;
  isLoading: boolean;
  setToken: (token: string | null) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('auth_token');
      setTokenState(stored);
      setIsLoading(false);
    })();
  }, []);

  const setToken = async (newToken: string | null) => {
    if (newToken) await AsyncStorage.setItem('auth_token', newToken);
    else await AsyncStorage.removeItem('auth_token');
    setTokenState(newToken);
  };

  const signIn = async (email: string, password: string) => {
    try {
      const res = await api.post<{ access_token: string }>('/auth/login', { email, password });
      const accessToken = res.data?.access_token;
      if (!accessToken) throw new Error('No token in response');
      await setToken(accessToken);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Login failed. Please check your credentials.';
      throw new Error(msg);
    }
  };

  const signOut = async () => {
    await setToken(null);
  };

  const value = useMemo(
    () => ({ token, isLoading, setToken, signIn, signOut }),
    [token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

