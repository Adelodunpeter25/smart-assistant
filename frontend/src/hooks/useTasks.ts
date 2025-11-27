import { useState } from 'react';
import { api } from '@/services/api';
import type { Task, CreateTaskRequest, UpdateTaskRequest, ApiResponse } from '@/types';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Task[]>('/tasks');
      setTasks(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch tasks');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (data: CreateTaskRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<Task>('/tasks', data);
      setTasks(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: number, data: UpdateTaskRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put<Task>(`/tasks/${id}`, data);
      setTasks(prev => prev.map(t => t.id === id ? response.data : t));
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete<ApiResponse>(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (id: number) => {
    return updateTask(id, { completed: true });
  };

  return { tasks, loading, error, getTasks, createTask, updateTask, deleteTask, completeTask };
}
