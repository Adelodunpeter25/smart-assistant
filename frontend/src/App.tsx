import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { useAuth } from '@/hooks';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { InstallPrompt } from '@/components/common/InstallPrompt';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';

const Landing = lazy(() => import('@/pages/landing/Landing'));
const About = lazy(() => import('@/pages/public/About'));
const Contact = lazy(() => import('@/pages/public/Contact'));
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));
const Chat = lazy(() => import('@/pages/dashboard/Chat'));
const Tasks = lazy(() => import('@/pages/dashboard/Tasks'));
const Notes = lazy(() => import('@/pages/dashboard/Notes'));
const Calendar = lazy(() => import('@/pages/dashboard/Calendar'));
const Timers = lazy(() => import('@/pages/dashboard/Timers'));
const Settings = lazy(() => import('@/pages/dashboard/Settings'));
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
      <Toaster position="top-right" richColors closeButton />
      <InstallPrompt />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/dashboard/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/dashboard/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
          <Route path="/dashboard/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          <Route path="/dashboard/timers" element={<ProtectedRoute><Timers /></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
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
