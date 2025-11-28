import { memo, useEffect, useRef } from 'react';
import { useChat } from '@/hooks';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';

export const ChatContainer = memo(() => {
  const { messages, loading, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div className="space-y-2">
                <p className="text-lg font-medium">Start a conversation</p>
                <p className="text-sm text-muted-foreground">Ask me anything or request help with tasks</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))
          )}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></span>
              </div>
              <div className="glass rounded-lg p-4">
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <div className="p-4 border-t-2 flex-shrink-0">
        <ChatInput onSend={sendMessage} disabled={loading} />
      </div>
    </div>
  );
});

ChatContainer.displayName = 'ChatContainer';
