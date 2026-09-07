// src/contexts/AuthContext.tsx

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useAtom } from "jotai";
import { IUser } from "../models/user.model";
import atoms from "../atoms";
import { isTokenExpired } from "../helpers";
import UserService from "../modules/user/user.service";
import { useLoading } from "./LoadingContext";

interface IAuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  currentUser: IUser | null;
  setCurrentUser: (user: IUser | null) => void;
  signin: (token: string, user: IUser) => void;
  signout: () => void;
  refreshCurrentUser: () => Promise<void>;
  googleChallengeToken: string | null;
  setGoogleChallengeToken: (token: string | null) => void;
}

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useAtom(atoms.tokenAtom);
  const [currentUser, setCurrentUser] = useAtom(atoms.currentUserAtom);
  const [googleChallengeToken, setGoogleChallengeToken] = useState<
    string | null
  >(null);
  const { setLoading } = useLoading();

  // Check if authenticated using token expiry from JWT
  const isAuthenticated = useMemo(() => {
    if (!token) return false;
    return !isTokenExpired(token);
  }, [token]);

  const signout = useCallback(() => {
    setToken(null);
    setCurrentUser(null);
    setGoogleChallengeToken(null);
  }, [setToken, setCurrentUser, setGoogleChallengeToken]);

  // Update loading when token changes
  useEffect(() => {
    if (token !== undefined) {
      setLoading(false);
    }
  }, [setLoading, token]);

  useEffect(() => {
    if (!token || !isTokenExpired(token)) return;

    const timeoutId = window.setTimeout(() => {
      console.log("🔐 Token expired, signing out...");
      signout();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [signout, token]);

  // Also check expiry periodically (every 1 hour)
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      if (isTokenExpired(token)) {
        console.log("Token expired during session, signing out...");
        signout();
      }
    }, 3600000);

    return () => clearInterval(interval);
  }, [signout, token]);

  const signin = useCallback(
    (token: string, user: IUser) => {
      setToken(token);
      setCurrentUser(user);
      setGoogleChallengeToken(null);
    },
    [setToken, setCurrentUser, setGoogleChallengeToken],
  );

  const refreshCurrentUser = useCallback(async () => {
    if (!token || isTokenExpired(token)) return;

    const response = await UserService.getCurrentUser();
    if (response.data?.data.user) {
      setCurrentUser(response.data.data.user);
    }
  }, [setCurrentUser, token]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      token,
      currentUser,
      setCurrentUser,
      signin,
      signout,
      refreshCurrentUser,
      googleChallengeToken,
      setGoogleChallengeToken,
    }),
    [
      isAuthenticated,
      token,
      currentUser,
      setCurrentUser,
      signin,
      signout,
      refreshCurrentUser,
      googleChallengeToken,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): IAuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
