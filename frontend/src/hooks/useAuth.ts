import { useState } from 'react';
import { api } from '@/services/api';
import { wsService } from '@/services/websocket';
import { useAuthStore } from '@/stores';
import type { LoginRequest, RegisterRequest, TokenResponse, User } from '@/types';

export function useAuth() {
  const { user, setUser, logout: clearUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<TokenResponse>('/auth/signup', data);
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      await getMe();
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<TokenResponse>('/auth/login', data);
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      await getMe();
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      clearUser();
      wsService.disconnect();
    }
  };

  const getMe = async () => {
    setLoading(true);
    try {
      const response = await api.get<User>('/auth/me');
      setUser(response.data);
      const token = localStorage.getItem('access_token');
      if (token) wsService.connect(token);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to get user');
      clearUser();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const initAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        await getMe();
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
  };

  return { user, loading, error, register, login, logout, getMe, initAuth };
}
