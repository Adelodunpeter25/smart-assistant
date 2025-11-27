import { useState } from 'react';
import { api } from '@/services/api';
import type { Timer, CreateTimerRequest, CreateAlarmRequest, ApiResponse } from '@/types';

export function useTimers() {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTimers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Timer[]>('/timers');
      setTimers(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch timers');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createTimer = async (data: CreateTimerRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<Timer>('/timers/timer', data);
      setTimers(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create timer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createAlarm = async (data: CreateAlarmRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<Timer>('/timers/alarm', data);
      setTimers(prev => [...prev, response.data]);
      return response.data;
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
      await api.delete<ApiResponse>(`/timers/${id}`);
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
