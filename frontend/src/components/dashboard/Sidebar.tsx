import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores';
import { useAuth } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Home, MessageSquare, CheckSquare, Calendar, Clock, Settings, LogOut } from 'lucide-react';

export const Sidebar = memo(() => {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Overview', path: '/dashboard' },
    { icon: MessageSquare, label: 'Chat', path: '/dashboard/chat' },
    { icon: CheckSquare, label: 'Tasks', path: '/dashboard/tasks' },
    { icon: Calendar, label: 'Calendar', path: '/dashboard/calendar' },
    { icon: Clock, label: 'Timers', path: '/dashboard/timers' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 glass border-r flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <img src="/icon.svg" alt="Smart Assistant" className="w-8 h-8" />
          <span className="font-bold text-lg">Smart Assistant</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors ${
              location.pathname === item.path ? 'bg-accent' : ''
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start" onClick={logout}>
          <LogOut size={20} className="mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';
