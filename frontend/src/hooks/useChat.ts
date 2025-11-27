import { useState } from 'react';
import { api } from '@/services/api';
import type { ChatMessage, ChatRequest, ChatResponse } from '@/types';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (message: string) => {
    setLoading(true);
    setError(null);

    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await api.post<ChatResponse>('/chat', { message } as ChatRequest);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.data.response,
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
