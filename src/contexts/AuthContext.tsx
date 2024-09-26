import React, { createContext, useContext, useState, ReactNode } from "react";
import LocalStorageService from "../services/LocalStorageService";
import { User } from "../models";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check local storage for token
    return !!LocalStorageService.getItem<string>("token");
  });

  const login = (token: string, user: User) => {
    LocalStorageService.setItem<string>("token", token);
    LocalStorageService.setItem<User>("user", user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    LocalStorageService.removeItem("token");
    LocalStorageService.removeItem("user");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
