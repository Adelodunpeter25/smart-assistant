import { useState } from 'react';
import { api } from '@/services/api';
import type { Task, TaskCreate, TaskUpdate } from '@/types';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/tasks');
      const tasksData = Array.isArray(response.data.data) ? response.data.data : [];
      setTasks(tasksData);
      return tasksData;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch tasks');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (data: TaskCreate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/tasks', data);
      const newTask = response.data.data;
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: number, data: TaskUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/tasks/${id}`, data);
      const updatedTask = response.data.data;
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
      return updatedTask;
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
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (id: number) => {
    return updateTask(id, { status: 'completed' });
  };

  return { tasks, loading, error, getTasks, createTask, updateTask, deleteTask, completeTask };
}
