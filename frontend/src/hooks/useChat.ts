import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { idbService } from '@/services/indexeddb';
import { useAuthStore } from '@/stores';
import type { Message, ChatRequest, ChatResponse } from '@/types';

export function useChat() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadChatHistory();
    } else {
      setLoadingHistory(false);
    }
  }, [user?.id]);

  const loadChatHistory = async () => {
    if (!user?.id) return;
    setLoadingHistory(true);
    try {
      const history = await idbService.getChatHistory(user.id);
      setMessages(history);
    } catch (err) {
      console.error('Failed to load chat history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const sendMessage = async (message: string, template?: string) => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      role: 'user',
      timestamp: new Date().toISOString(),
      template,
    };
    setMessages(prev => [...prev, userMessage]);
    await idbService.saveChatMessage(user.id, userMessage);

    try {
      const response = await api.post<ChatResponse>('/chat', { message, template } as ChatRequest);
      
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

  const clearMessages = () => {
    console.log('clearMessages called, current messages:', messages.length);
    setMessages([]);
    console.log('setMessages([]) called');
    if (user?.id) {
      idbService.clearChatHistory(user.id).catch(err => 
        console.error('Failed to clear IndexedDB:', err)
      );
    }
  };

  return { messages, loading, loadingHistory, error, sendMessage, clearMessages };
}
