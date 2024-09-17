
import React, { createContext, useEffect, useState, useCallback } from 'react';
import { getAuth, onAuthStateChanged, User, signOut, getIdToken } from 'firebase/auth';
import axios from 'axios';
import app, { auth } from '../lib/firebase';
import { NavigateFunction } from 'react-router-dom';

interface AuthState {
  user: User | null;
  isLoaded: boolean;
  sessionId: string | null;
  idToken: string | null;
  isOnboarded: boolean | undefined;
}

interface AuthContextType extends AuthState {
  routerPush: (to: string) => void;
  routerReplace: (to: string) => void;
  signOut: () => Promise<void>;
  updateOnboardingStatus: (status: boolean) => void;
  checkOnboardingStatus: () => Promise<void>;
}

const initialAuthState: AuthState = {
  user: null,
  isLoaded: false,
  sessionId: null,
  idToken: null,
  isOnboarded: undefined,
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  navigate: NavigateFunction;
}

export function AuthProvider({ children, navigate }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  const checkOnboardingStatus = useCallback(async () => {
    if (authState.user) {
      try {
        const idToken = await getIdToken(authState.user);
        const response = await axios.get(`http://localhost:8080/api/user/${authState.user.uid}/onboarded`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        setAuthState(prevState => ({ ...prevState, isOnboarded: response.data.onboarded }));
      } catch (error) {
        console.error("Error fetching onboarding status:", error);
        setAuthState(prevState => ({ ...prevState, isOnboarded: false }));
      }
    }
  }, [authState.user]);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      let idToken = null;

      if (user) {
        try {
          idToken = await getIdToken(user);
        } catch (error) {
          console.error("Error getting ID token:", error);
        }
      }

      setAuthState({
        user,
        isLoaded: true,
        sessionId: user ? Math.random().toString(36).substr(2, 9) : null,
        idToken,
        isOnboarded: undefined,
      });

      if (user) {
        checkOnboardingStatus();
      }
    });

    return () => unsubscribe();
  }, [checkOnboardingStatus]);

  const updateOnboardingStatus = (status: boolean) => {
    setAuthState(prevState => ({ ...prevState, isOnboarded: status }));
  };

  const routerPush = (to: string) => navigate(to);
  const routerReplace = (to: string) => navigate(to, { replace: true });
  
  const value = {
    ...authState,
    routerPush,
    routerReplace,
    signOut: () => signOut(auth),
    updateOnboardingStatus,
    checkOnboardingStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}