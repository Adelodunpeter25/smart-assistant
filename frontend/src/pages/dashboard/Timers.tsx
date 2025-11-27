import { memo, useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTimers } from '@/hooks';
import { Plus, Trash2 } from 'lucide-react';

const Timers = memo(() => {
  const { timers, loading, getTimers, createTimer, cancelTimer } = useTimers();
  const [open, setOpen] = useState(false);
  const [duration, setDuration] = useState('');
  const [label, setLabel] = useState('');

  useEffect(() => {
    getTimers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!duration) return;
    await createTimer({ duration_seconds: parseInt(duration) * 60, label });
    setDuration('');
    setLabel('');
    setOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Timers</h2>
            <p className="text-muted-foreground mt-2">Manage your timers</p>
          </div>
          <Button onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Timer
          </Button>
        </div>

        <Card glass>
          <CardHeader>
            <CardTitle>Your Timers</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && timers.length === 0 ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : timers.length === 0 ? (
              <p className="text-muted-foreground">No timers yet</p>
            ) : (
              <div className="space-y-2">
                {timers.map((timer) => (
                  <div key={timer.id} className="flex items-start justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <p className="font-medium">{timer.label || 'Timer'}</p>
                      <p className="text-sm text-muted-foreground">
                        Trigger: {new Date(timer.trigger_time).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Status: {timer.status}</p>
                    </div>
                    {timer.status === 'active' && (
                      <Button size="sm" variant="ghost" onClick={() => cancelTimer(timer.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Timer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              type="number"
              placeholder="Duration (minutes)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <Input
              placeholder="Label (optional)"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
            <Button type="submit" disabled={loading}>
              Create Timer
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
});

Timers.displayName = 'Timers';

export default Timers;
