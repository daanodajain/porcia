"use client";

import { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import api from "@/lib/api";
import { clearStoredCustomerToken, getStoredCustomerToken, setStoredCustomerToken } from "@/config/auth";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    clearStoredCustomerToken();
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await api.get("/customer/profile");
      setUser(response.data.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to fetch profile, logging out.", error);
      logout();
    }
  }, [logout]);

  useEffect(() => {
    const verifyToken = async () => {
      const token = getStoredCustomerToken();
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await fetchProfile();
      }
      setIsLoading(false);
    };
    verifyToken();
  }, [fetchProfile]);

  const login = async (token: string) => {
    setStoredCustomerToken(token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await fetchProfile();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
