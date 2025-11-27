import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts';
import { useAuthStore } from '@/stores';
import { useAuth } from '@/hooks';
import { Moon, Sun, LayoutDashboard, LogOut } from 'lucide-react';
import { MobileSidebar } from '@/components/layout/MobileSidebar';

export const Header = memo(() => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 w-full z-50 glass border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img src="/icon.svg" alt="Smart Assistant" className="w-8 h-8" />
          <span className="text-xl font-bold">Smart Assistant</span>
        </a>
        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="text-sm hover:text-primary transition-colors">Home</a>
          <a href="/about" className="text-sm hover:text-primary transition-colors">About</a>
          <a href="/contact" className="text-sm hover:text-primary transition-colors">Contact</a>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                    {user?.name?.charAt(0).toUpperCase()}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <LayoutDashboard className="mr-2" size={16} />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2" size={16} />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => window.dispatchEvent(new Event('openLogin'))}>
                  Sign In
                </Button>
                <Button size="sm" onClick={() => window.dispatchEvent(new Event('openRegister'))}>
                  Get Started
                </Button>
              </>
            )}
          </div>
          <MobileSidebar />
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
