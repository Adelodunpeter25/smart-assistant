import { memo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StickyNote, CheckSquare, Calendar, Clock } from 'lucide-react';
import { useOverview } from '@/hooks';
import { Link } from 'react-router-dom';

const Dashboard = memo(() => {
  const { tasks, events, timers, notes, loading } = useOverview();

  const stats = [
    { icon: StickyNote, label: 'Notes', value: loading ? '...' : notes.toString(), color: 'text-blue-500' },
    { icon: CheckSquare, label: 'Tasks', value: loading ? '...' : tasks.toString(), color: 'text-green-500' },
    { icon: Calendar, label: 'Events', value: loading ? '...' : events.toString(), color: 'text-purple-500' },
    { icon: Clock, label: 'Timers', value: loading ? '...' : timers.toString(), color: 'text-orange-500' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold">Welcome back!</h2>
          <p className="text-muted-foreground mt-2">Here's what's happening with your assistant today.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} glass>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card glass>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No recent activity</p>
            </CardContent>
          </Card>

          <Card glass>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with your assistant</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/dashboard/chat" className="block p-3 rounded-lg hover:bg-accent transition-colors">
                <p className="font-medium">Start a conversation</p>
                <p className="text-sm text-muted-foreground">Chat with your AI assistant</p>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
