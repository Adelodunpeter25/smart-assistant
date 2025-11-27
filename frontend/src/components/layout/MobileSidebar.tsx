import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores';
import { useAuth } from '@/hooks';

export const MobileSidebar = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[60] md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-64 bg-background border-l z-[70] md:hidden shadow-2xl">
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
              <a href="/" className="text-sm hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                Home
              </a>
              <a href="/about" className="text-sm hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                About
              </a>
              <a href="/contact" className="text-sm hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                Contact
              </a>
              <div className="pt-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 border rounded-lg mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{user?.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => { setIsOpen(false); navigate('/dashboard'); }}>
                      <LayoutDashboard className="mr-2" size={18} />
                      Dashboard
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => { setIsOpen(false); logout(); }}>
                      <LogOut className="mr-2" size={18} />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => { setIsOpen(false); window.dispatchEvent(new Event('openLogin')); }}>
                      Sign In
                    </Button>
                    <Button size="sm" className="w-full" onClick={() => { setIsOpen(false); window.dispatchEvent(new Event('openRegister')); }}>
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
});

MobileSidebar.displayName = 'MobileSidebar';
