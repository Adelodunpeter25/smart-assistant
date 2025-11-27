import { memo } from 'react';
import { Sidebar, TopBar, BottomBar } from '@/components/dashboard';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = memo(({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      <main className="md:ml-64 pt-16 pb-20 md:pb-6 p-6">
        {children}
      </main>
      <BottomBar />
    </div>
  );
});

DashboardLayout.displayName = 'DashboardLayout';
