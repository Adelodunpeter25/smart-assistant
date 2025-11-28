import { memo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StickyNote, CheckSquare, Calendar, Clock, Plus, Settings } from 'lucide-react';
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

        <Card glass>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/dashboard/chat" className="block p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-accent transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">AI Chat</p>
                    <p className="text-sm text-muted-foreground">Start conversation</p>
                  </div>
                </div>
              </Link>
              
              <Link to="/dashboard/tasks" className="block p-4 rounded-lg border-2 border-border hover:border-green-500 hover:bg-accent transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                    <Plus className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">New Task</p>
                    <p className="text-sm text-muted-foreground">Create a task</p>
                  </div>
                </div>
              </Link>
              
              <Link to="/dashboard/notes" className="block p-4 rounded-lg border-2 border-border hover:border-blue-500 hover:bg-accent transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <Plus className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">New Note</p>
                    <p className="text-sm text-muted-foreground">Create a note</p>
                  </div>
                </div>
              </Link>
              
              <Link to="/dashboard/calendar" className="block p-4 rounded-lg border-2 border-border hover:border-purple-500 hover:bg-accent transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                    <Plus className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium">New Event</p>
                    <p className="text-sm text-muted-foreground">Schedule event</p>
                  </div>
                </div>
              </Link>
              
              <Link to="/dashboard/timers" className="block p-4 rounded-lg border-2 border-border hover:border-orange-500 hover:bg-accent transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                    <Plus className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-medium">Set Timer</p>
                    <p className="text-sm text-muted-foreground">Create timer</p>
                  </div>
                </div>
              </Link>
              
              <Link to="/dashboard/settings" className="block p-4 rounded-lg border-2 border-border hover:border-foreground hover:bg-accent transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                    <Settings className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Settings</p>
                    <p className="text-sm text-muted-foreground">Manage account</p>
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
