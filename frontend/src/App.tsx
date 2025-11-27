import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState } from 'react';
import { useAuth } from '@/hooks';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';

const Landing = lazy(() => import('@/pages/landing/Landing'));
const About = lazy(() => import('@/pages/public/About'));
const Contact = lazy(() => import('@/pages/public/Contact'));
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));
const Chat = lazy(() => import('@/pages/dashboard/Chat'));
const NotFound = lazy(() => import('@/pages/public/NotFound'));

function App() {
  const { initAuth } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    const handleOpenLogin = () => setLoginOpen(true);
    const handleOpenRegister = () => setRegisterOpen(true);
    const handleOpenForgotPassword = () => setForgotPasswordOpen(true);
    
    window.addEventListener('openLogin', handleOpenLogin);
    window.addEventListener('openRegister', handleOpenRegister);
    window.addEventListener('openForgotPassword', handleOpenForgotPassword);
    
    return () => {
      window.removeEventListener('openLogin', handleOpenLogin);
      window.removeEventListener('openRegister', handleOpenRegister);
      window.removeEventListener('openForgotPassword', handleOpenForgotPassword);
    };
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Login 
        open={loginOpen} 
        onOpenChange={setLoginOpen}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />
      <Register 
        open={registerOpen} 
        onOpenChange={setRegisterOpen}
        onSwitchToLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />
      <ForgotPassword
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
        onBackToLogin={() => {
          setForgotPasswordOpen(false);
          setLoginOpen(true);
        }}
      />
    </BrowserRouter>
  );
}

export default App
