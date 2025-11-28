import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { wsService } from '@/services/websocket';
import { playNotificationSound } from '@/utils/sound';
import type { Notification } from '@/types';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unsubscribe = wsService.onMessage((data) => {
      if (data.type === 'notification') {
        const newNotification: Notification = {
          id: Date.now(),
          user_id: 0,
          message: data.message,
          is_read: false,
          created_at: new Date().toISOString(),
          title: data.title || 'Notification',
        };
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
        playNotificationSound();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getNotifications = async () => {
    try {
      const response = await api.get<Notification[]>('/notifications');
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.is_read).length);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      throw err;
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      throw err;
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      throw err;
    }
  };

  return { notifications, unreadCount, getNotifications, markAsRead, markAllAsRead };
}
