import React, { createContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User, signOut, getIdToken } from 'firebase/auth';
import app, { auth } from '../pages/auth/firebase';
import { NavigateFunction } from 'react-router-dom';

interface AuthState {
  user: User | null;
  isLoaded: boolean;
  sessionId: string | null;
  idToken: string | null;
}

interface AuthContextType extends AuthState {
  routerPush: (to: string) => void;
  routerReplace: (to: string) => void;
  signOut: () => Promise<void>;
}

const initialAuthState: AuthState = {
  user: null,
  isLoaded: false,
  sessionId: null,
  idToken: null,
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  navigate: NavigateFunction;
}

export function AuthProvider({ children, navigate }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      let idToken = null;
      if (user) {
        try {
          idToken = await getIdToken(user);
        } catch (error) {
          console.error("Error fetching idToken:", error);
        }
      }
      setAuthState({
        user,
        isLoaded: true,
        sessionId: user ? Math.random().toString(36).substr(2, 9) : null,
        idToken,
      });
    });

    return () => unsubscribe();
  }, []);

  const routerPush = (to: string) => navigate(to);
  const routerReplace = (to: string) => navigate(to, { replace: true });
  const value = {
    ...authState,
    routerPush,
    routerReplace,
    signOut: () => signOut(auth)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
