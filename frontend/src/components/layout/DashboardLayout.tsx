import { memo } from 'react';
import { Sidebar, TopBar } from '@/components/dashboard';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = memo(({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      <main className="ml-64 pt-16 p-6">
        {children}
      </main>
    </div>
  );
});

DashboardLayout.displayName = 'DashboardLayout';
