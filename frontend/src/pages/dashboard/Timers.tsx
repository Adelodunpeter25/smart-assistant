import { memo, useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useTimers } from '@/hooks';
import { Plus, Trash2, Clock } from 'lucide-react';

const Timers = memo(() => {
  const { timers, loading, getTimers, createTimer, cancelTimer } = useTimers();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [duration, setDuration] = useState('');
  const [label, setLabel] = useState('');

  useEffect(() => {
    getTimers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!duration) return;
    setSubmitting(true);
    try {
      await createTimer({ duration_seconds: parseInt(duration) * 60, label });
      setDuration('');
      setLabel('');
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
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

        {loading && timers.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <Clock className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading timers...</p>
          </div>
        ) : timers.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <Clock className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No timers yet</p>
            <p className="text-sm text-muted-foreground mt-2">Create your first timer to get started</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {timers.map((timer) => (
              <Card key={timer.id} glass>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-medium">{timer.label || 'Timer'}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Trigger: {new Date(timer.trigger_time).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Status: {timer.status}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => { setDeleteId(timer.id); setConfirmOpen(true); }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Timer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Duration (minutes)</label>
              <Input
                type="number"
                placeholder="Enter duration in minutes"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Label</label>
              <Input
                placeholder="Enter label (optional)"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Timer'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={() => deleteId && cancelTimer(deleteId)}
        title="Cancel Timer"
        description="Are you sure you want to cancel this timer?"
      />
    </DashboardLayout>
  );
});

Timers.displayName = 'Timers';

export default Timers;
