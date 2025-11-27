import { useState } from 'react';
import { api } from '@/services/api';
import type { Timer } from '@/types';

export function useTimers() {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTimers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/timers');
      const timersData = Array.isArray(response.data.data) ? response.data.data : [];
      setTimers(timersData);
      return timersData;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch timers');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createTimer = async (data: { duration_seconds: number; label?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/timers/timer', data);
      const newTimer = response.data.data;
      setTimers(prev => [...prev, newTimer]);
      return newTimer;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create timer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createAlarm = async (data: { trigger_time: string; label?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/timers/alarm', data);
      const newAlarm = response.data.data;
      setTimers(prev => [...prev, newAlarm]);
      return newAlarm;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create alarm');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelTimer = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/timers/${id}`);
      setTimers(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to cancel timer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { timers, loading, error, getTimers, createTimer, createAlarm, cancelTimer };
}
