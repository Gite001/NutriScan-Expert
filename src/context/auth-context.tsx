"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

// Mock user for bypass mode
const MOCK_USER = {
  uid: 'guest-user-123',
  displayName: 'Explorateur Invité',
  email: 'invite@nutriscan.expert',
  photoURL: 'https://picsum.photos/seed/guest/200/200',
};

interface AuthContextType {
  user: any;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user: firebaseUser, loading: firebaseLoading } = useUser();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Logic: If firebase is still loading, we wait. 
    // If firebase finishes and there is no user, we inject our Mock User to bypass login.
    if (!firebaseLoading) {
      setUser(firebaseUser || MOCK_USER);
      setLoading(false);
    }
  }, [firebaseUser, firebaseLoading]);

  const login = async () => {
    // Login disabled for now as per user request
    setUser(MOCK_USER);
    router.push('/');
  };

  const logout = async () => {
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
