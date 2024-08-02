import React, { createContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User ,signOut} from 'firebase/auth';
import app, { auth } from '../pages/auth/firebase';
import { NavigateFunction } from 'react-router-dom';
// Define the shape of our auth state
//have to extract user from mongo later so it should be come Iuser type
interface AuthState {
  user: User | null;
  isLoaded: boolean;
  sessionId: string | null;
}
interface AuthContextType extends AuthState {
  routerPush: (to: string) => void;
  routerReplace: (to: string) => void;
  signOut: () => Promise<void>;
}

// Provide an initial value for the context
const initialAuthState: AuthState = {
  user: null,
  isLoaded: false,
  sessionId: null
};

// Create and export the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
interface AuthProviderProps {
  children: React.ReactNode;
  navigate: NavigateFunction;

}

export function AuthProvider({ children, navigate }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthState({
        user,
        isLoaded: true,
        sessionId: user ? Math.random().toString(36).substr(2, 9) : null
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

