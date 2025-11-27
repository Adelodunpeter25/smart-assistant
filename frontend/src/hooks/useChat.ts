import { useState } from 'react';
import { api } from '@/services/api';
import type { Message, ChatRequest, ChatResponse } from '@/types';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (message: string) => {
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
      
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send message');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return { messages, loading, error, sendMessage, clearMessages };
}
