import React, { createContext, useContext, useState, ReactNode } from "react";
import { localStorageService } from "../services";
import { IUser } from "../types/modelTypes";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  currentUser: IUser | null;
  login: (token: string, user: IUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() => {
    // Check local storage for token
    return localStorageService.getItem<string>("token");
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!token;
  });

  const [currentUser, setCurrentUser] = useState<IUser | null>(() => {
    // Check local storage for current user
    return localStorageService.getItem<IUser>("user");
  });

  const login = (token: string, user: IUser) => {
    localStorageService.setItem<string>("token", token);
    localStorageService.setItem<IUser>("user", user);
    setToken(token);
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorageService.removeItem("token");
    localStorageService.removeItem("user");
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
