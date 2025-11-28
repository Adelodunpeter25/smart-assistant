import { memo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = memo(({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isInitialized } = useAuthStore();
  
  if (!isInitialized) {
    return null;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
});

ProtectedRoute.displayName = 'ProtectedRoute';
