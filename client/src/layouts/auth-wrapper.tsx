// AuthProviderWrapper.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';


const AuthProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  return <AuthProvider navigate={navigate}>{children}</AuthProvider>;
};

export default AuthProviderWrapper;
