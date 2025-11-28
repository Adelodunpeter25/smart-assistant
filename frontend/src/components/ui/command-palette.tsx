import { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useTasks, useNotes, useCalendar, useTimers } from '@/hooks';
import { CheckSquare, StickyNote, Calendar, Clock, Plus, Search } from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const itemClassName = "flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground";
const groupClassName = "text-xs font-semibold text-foreground px-2 py-1.5 mt-2";

export const CommandPalette = memo(({ open, onOpenChange }: CommandPaletteProps) => {
  const navigate = useNavigate();
  const { tasks } = useTasks();
  const { notes } = useNotes();
  const { events } = useCalendar();
  const { timers } = useTimers();
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!open) setSearch('');
  }, [open]);

  const handleAction = (action: () => void) => {
    action();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-xl overflow-hidden">
        <DialogTitle className="sr-only">Search and Command Palette</DialogTitle>
        <Command className="rounded-lg border-none" shouldFilter={true}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search or type a command..."
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-[500px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            <Command.Group heading="Quick Actions" className={groupClassName}>
              <Command.Item onSelect={() => handleAction(() => navigate('/dashboard/tasks'))} className={itemClassName}>
                <Plus className="w-4 h-4" />
                <span>Create Task</span>
              </Command.Item>
              <Command.Item onSelect={() => handleAction(() => navigate('/dashboard/notes'))} className={itemClassName}>
                <Plus className="w-4 h-4" />
                <span>Create Note</span>
              </Command.Item>
              <Command.Item onSelect={() => handleAction(() => navigate('/dashboard/calendar'))} className={itemClassName}>
                <Plus className="w-4 h-4" />
                <span>Create Event</span>
              </Command.Item>
              <Command.Item onSelect={() => handleAction(() => navigate('/dashboard/timers'))} className={itemClassName}>
                <Plus className="w-4 h-4" />
                <span>Create Timer</span>
              </Command.Item>
            </Command.Group>

            {tasks.length > 0 && (
              <Command.Group heading="Tasks" className={groupClassName}>
                {tasks.slice(0, 5).map((task) => (
                  <Command.Item
                    key={task.id}
                    value={task.title}
                    onSelect={() => handleAction(() => navigate('/dashboard/tasks'))}
                    className={itemClassName}
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span className="truncate">{task.title}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {notes.length > 0 && (
              <Command.Group heading="Notes" className={groupClassName}>
                {notes.slice(0, 5).map((note) => (
                  <Command.Item
                    key={note.id}
                    value={note.content}
                    onSelect={() => handleAction(() => navigate('/dashboard/notes'))}
                    className={itemClassName}
                  >
                    <StickyNote className="w-4 h-4" />
                    <span className="truncate">{note.content.slice(0, 50)}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {events.length > 0 && (
              <Command.Group heading="Events" className={groupClassName}>
                {events.slice(0, 5).map((event) => (
                  <Command.Item
                    key={event.id}
                    value={event.title}
                    onSelect={() => handleAction(() => navigate('/dashboard/calendar'))}
                    className={itemClassName}
                  >
                    <Calendar className="w-4 h-4" />
                    <span className="truncate">{event.title}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {timers.length > 0 && (
              <Command.Group heading="Timers" className={groupClassName}>
                {timers.slice(0, 5).map((timer) => (
                  <Command.Item
                    key={timer.id}
                    value={timer.label || 'Timer'}
                    onSelect={() => handleAction(() => navigate('/dashboard/timers'))}
                    className={itemClassName}
                  >
                    <Clock className="w-4 h-4" />
                    <span className="truncate">{timer.label || 'Timer'}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
});

CommandPalette.displayName = 'CommandPalette';
