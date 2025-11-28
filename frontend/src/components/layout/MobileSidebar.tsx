import { memo, useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores';
import { useAuth } from '@/hooks';

export const MobileSidebar = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleDashboardClick = useCallback(() => {
    setIsOpen(false);
    navigate('/dashboard');
  }, [navigate]);

  const handleLogoutClick = useCallback(() => {
    setIsOpen(false);
    logout();
  }, [logout]);

  const handleLoginClick = useCallback(() => {
    setIsOpen(false);
    window.dispatchEvent(new Event('openLogin'));
  }, []);

  const handleRegisterClick = useCallback(() => {
    setIsOpen(false);
    window.dispatchEvent(new Event('openRegister'));
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      <div
        className={`fixed inset-0 bg-black/50 z-[60] md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />
      <div
        className={`fixed top-0 right-0 bottom-0 w-64 bg-card border-l z-[70] md:hidden shadow-2xl overflow-y-auto transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-bold">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-md hover:bg-accent transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-4">
          <Link to="/" className="text-sm hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link to="/about" className="text-sm hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
            About
          </Link>
          <Link to="/contact" className="text-sm hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
            Contact
          </Link>
          <div className="pt-4 space-y-2">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-3 border rounded-lg mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                      {user?.name?.trim().charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleDashboardClick}>
                  <LayoutDashboard className="mr-2" size={18} />
                  Dashboard
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleLogoutClick}>
                  <LogOut className="mr-2" size={18} />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="w-full" onClick={handleLoginClick}>
                  Sign In
                </Button>
                <Button size="sm" className="w-full" onClick={handleRegisterClick}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </>
  );
});

MobileSidebar.displayName = 'MobileSidebar';
