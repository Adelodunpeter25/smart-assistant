import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts';
import { Moon, Sun } from 'lucide-react';

export const Header = memo(() => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 w-full z-50 glass border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="text-xl font-bold">Smart Assistant</a>
        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="text-sm hover:text-primary transition-colors">Home</a>
          <a href="#about" className="text-sm hover:text-primary transition-colors">About</a>
          <a href="#contact" className="text-sm hover:text-primary transition-colors">Contact</a>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Button variant="ghost" size="sm" asChild>
            <a href="/login">Sign In</a>
          </Button>
          <Button size="sm" asChild>
            <a href="/register">Get Started</a>
          </Button>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
