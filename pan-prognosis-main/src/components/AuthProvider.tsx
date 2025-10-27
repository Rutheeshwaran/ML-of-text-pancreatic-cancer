import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  name: string;
  role: "physician" | "nurse" | "technician" | "admin";
  department: string;
  lastLogin: Date;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  "dr.smith@hospital.com": {
    password: "demo123",
    user: {
      id: "1",
      email: "dr.smith@hospital.com",
      name: "Dr. Sarah Smith",
      role: "physician",
      department: "Oncology",
      lastLogin: new Date(),
    },
  },
  "nurse.johnson@hospital.com": {
    password: "demo123",
    user: {
      id: "2",
      email: "nurse.johnson@hospital.com",
      name: "Jennifer Johnson",
      role: "nurse",
      department: "Oncology",
      lastLogin: new Date(),
    },
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on app load
    const storedUser = localStorage.getItem("pancreatic-ai-user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("pancreatic-ai-user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = MOCK_USERS[email.toLowerCase()];
    
    if (mockUser && mockUser.password === password) {
      const updatedUser = { ...mockUser.user, lastLogin: new Date() };
      setUser(updatedUser);
      localStorage.setItem("pancreatic-ai-user", JSON.stringify(updatedUser));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${updatedUser.name}`,
      });
      
      setIsLoading(false);
      return true;
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pancreatic-ai-user");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};