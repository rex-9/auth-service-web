// src/contexts/AuthContext.tsx

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  ReactNode,
  useState,
  useEffect,
  useRef,
} from "react";
import { useAtom } from "jotai";
import { IUser } from "../models/user.model";
import atoms from "../atoms";
import { isTokenExpired } from "../helpers";
import { useLoading } from "./LoadingContext";
import UserController from "../modules/user/user.controller";
import { AnalyticsService } from "../services";

interface IAuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  currentUser: IUser | null;
  setCurrentUser: (user: IUser | null) => void;
  signin: (token: string, user: IUser) => void;
  signout: () => void;
  refreshCurrentUser: () => Promise<IUser | null>;
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
  const userRefreshRef = useRef<Promise<IUser | null> | null>(null);

  // Check if authenticated using token expiry from JWT
  const isAuthenticated = useMemo(() => {
    if (!token) return false;
    return !isTokenExpired(token);
  }, [token]);

  const signout = useCallback(() => {
    setToken(null);
    setCurrentUser(null);
    setGoogleChallengeToken(null);
    void AnalyticsService.setUserId(null);
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
      void AnalyticsService.setUserId(user.id);
    },
    [setToken, setCurrentUser, setGoogleChallengeToken],
  );

  const refreshCurrentUser = useCallback((): Promise<IUser | null> => {
    if (userRefreshRef.current) return userRefreshRef.current;

    const request = UserController.getCurrentUser()
      .then((user) => {
        if (user) setCurrentUser(user);
        return user;
      })
      .finally(() => {
        userRefreshRef.current = null;
      });

    userRefreshRef.current = request;
    return request;
  }, [setCurrentUser]);

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
