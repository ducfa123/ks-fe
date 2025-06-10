import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RouterLink } from '../routers/routers';
import { isRedirectProtectedPath } from '../utils/redirectGuard';

interface AuthWrapperProps {
  children: React.ReactNode;
  requiredAuth?: boolean;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ 
  children, 
  requiredAuth = true 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get auth state from redux
  const clientAuth = useSelector((state: any) => state.authClient || {});
  const adminAuth = useSelector((state: any) => state.auth || {});
  const userAuth = useSelector((state: any) => state.user || {});
  
  // Check if any auth provider has the user logged in
  const isAuthenticated = 
    clientAuth.isLogin || 
    adminAuth.isLogin || 
    userAuth.isAuthenticated ||
    !!localStorage.getItem('token');
  
  useEffect(() => {
    // For survey pages, never redirect regardless of auth status
    if (isRedirectProtectedPath(location.pathname)) {
      return;
    }
    
    // For other pages that require auth, redirect to login if not authenticated
    if (requiredAuth && !isAuthenticated) {
      navigate(RouterLink.CLIENT_LOGIN);
    }
  }, [isAuthenticated, navigate, location.pathname, requiredAuth]);
  
  return <>{children}</>;
};

export default AuthWrapper;
