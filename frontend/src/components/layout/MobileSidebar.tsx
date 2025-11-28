import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores';
import { useAuth } from '@/hooks';

export const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 rounded-md hover:bg-accent"
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={close} />
          <div className="fixed top-0 left-0 h-screen w-72 bg-white dark:bg-gray-900 border-r z-50 md:hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <span className="font-bold">Menu</span>
              <button onClick={close} className="p-2 hover:bg-accent rounded-md">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4 overflow-y-auto" style={{ height: 'calc(100% - 65px)' }}>
              <Link to="/" onClick={close} className="block py-2 hover:text-primary">Home</Link>
              <Link to="/about" onClick={close} className="block py-2 hover:text-primary">About</Link>
              <Link to="/contact" onClick={close} className="block py-2 hover:text-primary">Contact</Link>
              
              <div className="pt-4 border-t space-y-3">
                {isAuthenticated ? (
                  <>
                    <div className="p-3 border rounded-lg flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => { close(); navigate('/dashboard'); }}>
                      <LayoutDashboard className="mr-2" size={18} />
                      Dashboard
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => { close(); logout(); }}>
                      <LogOut className="mr-2" size={18} />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => { close(); window.dispatchEvent(new Event('openLogin')); }}>
                      Sign In
                    </Button>
                    <Button size="sm" className="w-full" onClick={() => { close(); window.dispatchEvent(new Event('openRegister')); }}>
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
