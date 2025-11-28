import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { idbService } from '@/services/indexeddb';
import { useAuthStore } from '@/stores';
import type { Message, ChatRequest, ChatResponse } from '@/types';

export function useChat() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadChatHistory();
    }
  }, [user?.id]);

  const loadChatHistory = async () => {
    if (!user?.id) return;
    try {
      const history = await idbService.getChatHistory(user.id);
      setMessages(history);
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  };

  const sendMessage = async (message: string) => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      role: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    await idbService.saveChatMessage(user.id, userMessage);

    try {
      const response = await api.post<ChatResponse>('/chat', { message } as ChatRequest);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.response,
        isUser: false,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        tool_calls: response.data.tool_calls,
      };
      setMessages(prev => [...prev, assistantMessage]);
      await idbService.saveChatMessage(user.id, assistantMessage);
      
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send message');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = async () => {
    if (user?.id) {
      await idbService.clearChatHistory(user.id);
    }
    setMessages([]);
  };

  return { messages, loading, error, sendMessage, clearMessages };
}
