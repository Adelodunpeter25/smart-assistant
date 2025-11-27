import { useState, useEffect } from 'react';
import { api } from '@/services/api';

interface OverviewStats {
  tasks: number;
  events: number;
  timers: number;
  notes: number;
  loading: boolean;
}

export const useOverview = (): OverviewStats => {
  const [stats, setStats] = useState<OverviewStats>({
    tasks: 0,
    events: 0,
    timers: 0,
    notes: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [tasksRes, eventsRes, timersRes, notesRes] = await Promise.all([
          api.get('/tasks'),
          api.get('/calendar/events'),
          api.get('/timers'),
          api.get('/notes'),
        ]);

        setStats({
          tasks: tasksRes.data.data?.length || 0,
          events: eventsRes.data.data?.length || 0,
          timers: timersRes.data.data?.filter((t: any) => t.status === 'active').length || 0,
          notes: notesRes.data.data?.length || 0,
          loading: false,
        });
      } catch (error) {
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  return stats;
};
