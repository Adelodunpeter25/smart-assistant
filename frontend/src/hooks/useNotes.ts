import { useState } from 'react';
import { api } from '@/services/api';
import type { Note, CreateNoteRequest, UpdateNoteRequest, ApiResponse } from '@/types';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Note[]>('/notes');
      setNotes(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch notes');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (data: CreateNoteRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<Note>('/notes', data);
      setNotes(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create note');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateNote = async (id: number, data: UpdateNoteRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put<Note>(`/notes/${id}`, data);
      setNotes(prev => prev.map(n => n.id === id ? response.data : n));
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update note');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete<ApiResponse>(`/notes/${id}`);
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete note');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchNotes = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Note[]>(`/notes/search?q=${query}`);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to search notes');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { notes, loading, error, getNotes, createNote, updateNote, deleteNote, searchNotes };
}
