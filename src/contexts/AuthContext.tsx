import React, { createContext, useContext, useState, ReactNode } from "react";
import LocalStorageService from "../services/LocalStorageService";
import { User } from "../models";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  currentUser: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() => {
    // Check local storage for token
    return LocalStorageService.getItem<string>("token");
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!token;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Check local storage for current user
    return LocalStorageService.getItem<User>("user");
  });

  const login = (token: string, user: User) => {
    LocalStorageService.setItem<string>("token", token);
    LocalStorageService.setItem<User>("user", user);
    setToken(token);
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    LocalStorageService.removeItem("token");
    LocalStorageService.removeItem("user");
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, currentUser, login, logout }}
    >
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
