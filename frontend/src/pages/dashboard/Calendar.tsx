import { memo, useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useCalendar } from '@/hooks';
import { Plus, Trash2 } from 'lucide-react';

const Calendar = memo(() => {
  const { events, loading, getEvents, createEvent, deleteEvent } = useCalendar();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    getEvents();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startTime) return;
    await createEvent({
      title,
      description,
      start_time: new Date(startTime).toISOString(),
      end_time: endTime ? new Date(endTime).toISOString() : undefined,
    });
    setTitle('');
    setDescription('');
    setStartTime('');
    setEndTime('');
    setOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Calendar</h2>
            <p className="text-muted-foreground mt-2">Manage your events</p>
          </div>
          <Button onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>

        <Card glass>
          <CardHeader>
            <CardTitle>Your Events</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && events.length === 0 ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : events.length === 0 ? (
              <p className="text-muted-foreground">No events yet</p>
            ) : (
              <div className="space-y-2">
                {events.map((event) => (
                  <div key={event.id} className="flex items-start justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <p className="font-medium">{event.title}</p>
                      {event.description && <p className="text-sm text-muted-foreground">{event.description}</p>}
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(event.start_time).toLocaleString()}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => { setDeleteId(event.id); setConfirmOpen(true); }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
            <DialogTitle>Create Event</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <Input
              type="datetime-local"
              placeholder="End time (optional)"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
            <Button type="submit" disabled={loading}>
              Create Event
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={() => deleteId && deleteEvent(deleteId)}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone."
      />
    </DashboardLayout>
  );
});

Calendar.displayName = 'Calendar';

export default Calendar;
