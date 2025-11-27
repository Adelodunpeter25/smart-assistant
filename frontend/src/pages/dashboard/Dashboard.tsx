import { memo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, CheckSquare, Calendar, Clock } from 'lucide-react';

const Dashboard = memo(() => {
  const stats = [
    { icon: MessageSquare, label: 'Chat Messages', value: '0', color: 'text-blue-500' },
    { icon: CheckSquare, label: 'Tasks', value: '0', color: 'text-green-500' },
    { icon: Calendar, label: 'Events', value: '0', color: 'text-purple-500' },
    { icon: Clock, label: 'Active Timers', value: '0', color: 'text-orange-500' },
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
              <a href="/dashboard/chat" className="block p-3 rounded-lg hover:bg-accent transition-colors">
                <p className="font-medium">Start a conversation</p>
                <p className="text-sm text-muted-foreground">Chat with your AI assistant</p>
              </a>
              <a href="/dashboard/tasks" className="block p-3 rounded-lg hover:bg-accent transition-colors">
                <p className="font-medium">Create a task</p>
                <p className="text-sm text-muted-foreground">Add a new task to your list</p>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
