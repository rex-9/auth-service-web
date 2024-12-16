import React, { createContext, useContext, ReactNode } from "react";
import { useAtom } from "jotai";
import { IUser } from "../types/modelTypes";
import atoms from "../atoms";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  currentUser: IUser | null;
  setCurrentUser: (user: IUser | null) => void;
  login: (token: string, user: IUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useAtom(atoms.tokenAtom);
  const [currentUser, setCurrentUser] = useAtom(atoms.currentUserAtom);

  let isAuthenticated = !!token;

  const login = (token: string, user: IUser) => {
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
