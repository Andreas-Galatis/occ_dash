import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('pc_access_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = () => {
    const PC_APP_ID = import.meta.env.VITE_PC_APP_ID;
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scopes = 'people check_ins services';
    
    const authUrl = new URL('https://api.planningcenteronline.com/oauth/authorize');
    authUrl.searchParams.append('client_id', PC_APP_ID);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', scopes);

    window.location.href = authUrl.toString();
  };

  const logout = () => {
    localStorage.removeItem('pc_access_token');
    localStorage.removeItem('pc_refresh_token');
    localStorage.removeItem('pc_token_expiry');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}