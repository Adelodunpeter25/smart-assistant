import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores';
import { useAuth } from '@/hooks';
import { Login, Register } from '@/pages/auth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function Dashboard() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Welcome to Smart Assistant</p>
    </div>
  );
}

function App() {
  const { isAuthenticated } = useAuthStore();
  const { getMe } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token && !isAuthenticated) {
      getMe().catch(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      });
    }
  }, [isAuthenticated, getMe]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
