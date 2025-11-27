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

        const tasksData = Array.isArray(tasksRes.data.data) ? tasksRes.data.data : [];
        const eventsData = Array.isArray(eventsRes.data.data) ? eventsRes.data.data : [];
        const timersData = Array.isArray(timersRes.data.data) ? timersRes.data.data : [];
        const notesData = Array.isArray(notesRes.data.data) ? notesRes.data.data : [];

        setStats({
          tasks: tasksData.length,
          events: eventsData.length,
          timers: timersData.filter((t: any) => t.status === 'active').length,
          notes: notesData.length,
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
