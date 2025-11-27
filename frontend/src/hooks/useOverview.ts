import { useState, useEffect } from 'react';
import { useTasks } from './useTasks';
import { useCalendar } from './useCalendar';
import { useTimers } from './useTimers';
import { useNotes } from './useNotes';

interface OverviewStats {
  tasks: number;
  events: number;
  timers: number;
  notes: number;
  loading: boolean;
}

export const useOverview = (): OverviewStats => {
  const { tasks, loading: tasksLoading } = useTasks();
  const { events, loading: eventsLoading } = useCalendar();
  const { timers, loading: timersLoading } = useTimers();
  const { notes, loading: notesLoading } = useNotes();

  const [stats, setStats] = useState<OverviewStats>({
    tasks: 0,
    events: 0,
    timers: 0,
    notes: 0,
    loading: true,
  });

  useEffect(() => {
    const loading = tasksLoading || eventsLoading || timersLoading || notesLoading;
    
    setStats({
      tasks: tasks?.length || 0,
      events: events?.length || 0,
      timers: timers?.filter(t => t.status === 'active').length || 0,
      notes: notes?.length || 0,
      loading,
    });
  }, [tasks, events, timers, notes, tasksLoading, eventsLoading, timersLoading, notesLoading]);

  return stats;
};
