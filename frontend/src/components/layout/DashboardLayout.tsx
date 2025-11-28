import { memo, useState } from 'react';
import { Sidebar, TopBar, BottomBar, FloatingChat } from '@/components/dashboard';
import { CommandPalette } from '@/components/ui/command-palette';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = memo(({ children }: DashboardLayoutProps) => {
  const [commandOpen, setCommandOpen] = useState(false);

  useKeyboardShortcuts([
    { key: 'k', ctrl: true, callback: () => setCommandOpen(true) },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      <main className="md:ml-64 pt-20 pb-20 md:pb-6 p-6">
        {children}
      </main>
      <BottomBar />
      <FloatingChat />
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
});

DashboardLayout.displayName = 'DashboardLayout';
