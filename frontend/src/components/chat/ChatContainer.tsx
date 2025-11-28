import { memo, useEffect, useRef } from 'react';
import { useChat } from '@/hooks';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { ScrollArea } from '@/components/ui/scroll-area';

export const ChatContainer = memo(({ maxMessages }: { maxMessages?: number }) => {
  const { messages, loading, loadingHistory, sendMessage } = useChat();
  const displayMessages = maxMessages ? messages.slice(-maxMessages) : messages;
  const messagesEndRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages.length, loading]);

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {loadingHistory ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading chat history...</p>
              </div>
            </div>
          ) : displayMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div className="space-y-2">
                <p className="text-lg font-medium">Start a conversation</p>
                <p className="text-sm text-muted-foreground">Ask me anything or request help with tasks</p>
              </div>
            </div>
          ) : (
            displayMessages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))
          )}
          {loading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <div className="p-4 border-t-2 flex-shrink-0">
        <ChatInput onSend={sendMessage} disabled={loading} />
      </div>
    </div>
  );
})

ChatContainer.displayName = 'ChatContainer';
