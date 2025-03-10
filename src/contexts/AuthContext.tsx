import React, { createContext, useContext, ReactNode } from "react";
import { useAtom } from "jotai";
import { User } from "../models/user.model";
import atoms from "../atoms";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useAtom(atoms.tokenAtom);
  const [currentUser, setCurrentUser] = useAtom(atoms.currentUserAtom);

  let isAuthenticated = !!token;

  const login = (token: string, user: User) => {
    setToken(token);
    setCurrentUser(user);
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        currentUser,
        setCurrentUser,
        login,
        logout,
      }}
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
