import { useState } from 'react';
import { api } from '@/services/api';
import type { CalendarEvent, CalendarEventCreate, ApiResponse } from '@/types';

export function useCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/calendar/events');
      const eventsData = Array.isArray(response.data.data) ? response.data.data : [];
      setEvents(eventsData);
      return eventsData;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch events');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (data: CalendarEventCreate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/calendar/events', data);
      const newEvent = response.data.data;
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete<ApiResponse>(`/calendar/events/${id}`);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { events, loading, error, getEvents, createEvent, deleteEvent };
}
