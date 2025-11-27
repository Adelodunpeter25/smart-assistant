import { memo } from 'react';
import { useTheme } from '@/contexts';
import { useNotifications } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Bell, Moon, Sun } from 'lucide-react';

export const TopBar = memo(() => {
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();

  return (
    <header className="fixed top-0 left-64 right-0 h-16 glass border-b flex items-center justify-between px-6 z-40">
      <div className="flex-1">
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          )}
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
      </div>
    </header>
  );
});

TopBar.displayName = 'TopBar';
