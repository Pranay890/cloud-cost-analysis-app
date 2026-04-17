'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const normalizedEmail = email.toLowerCase().trim();
    console.log('🔐 Login attempt:', { email: normalizedEmail });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Login error:', data.error);
        throw new Error(data.error || 'Login failed');
      }

      console.log('✅ Login successful:', data.user);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error: any) {
      console.error('❌ Login exception:', error);
      throw error;
    }
  };

  const signup = async (email: string, name: string, password: string, confirmPassword: string) => {
    if (!email || !name || !password) {
      throw new Error('All fields are required');
    }

    const normalizedEmail = email.toLowerCase().trim();
    console.log('📝 Signup attempt:', { email: normalizedEmail, name });

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, name, password, confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Signup error:', data.error);
        throw new Error(data.error || 'Signup failed');
      }

      console.log('✅ Signup successful:', data.user);
      // Clear old session on successful signup
      localStorage.removeItem('user');
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error: any) {
      console.error('❌ Signup exception:', error);
      throw error;
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
