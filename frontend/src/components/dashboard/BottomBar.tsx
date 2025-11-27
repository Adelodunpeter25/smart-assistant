import { memo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, CheckSquare, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/stores';
import { useAuth } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Settings, LogOut } from 'lucide-react';

export const BottomBar = memo(() => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuthStore();
  const { logout } = useAuth();

  const mainItems = [
    { icon: Home, label: 'Overview', path: '/dashboard' },
    { icon: MessageSquare, label: 'Chat', path: '/dashboard/chat' },
    { icon: CheckSquare, label: 'Tasks', path: '/dashboard/tasks' },
  ];

  const menuItems = [
    { icon: Calendar, label: 'Calendar', path: '/dashboard/calendar' },
    { icon: Clock, label: 'Timers', path: '/dashboard/timers' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t z-40">
        <div className="flex items-center justify-around h-16">
          {mainItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 ${
                location.pathname === item.path ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-muted-foreground"
          >
            <Menu size={20} />
            <span className="text-xs">More</span>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            onClick={() => setMenuOpen(false)}
          />
          <div className="md:hidden fixed bottom-16 left-0 right-0 bg-background border-t z-[70] shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold">Menu</span>
              <button onClick={() => setMenuOpen(false)} className="p-2">
                <X size={20} />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
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
              <Button variant="ghost" className="w-full justify-start" onClick={() => { setMenuOpen(false); logout(); }}>
                <LogOut size={20} className="mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
});

BottomBar.displayName = 'BottomBar';
