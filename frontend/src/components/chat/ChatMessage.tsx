import { memo } from 'react';
import { Bot, User } from 'lucide-react';
import type { Message as ChatMessageType } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = memo(({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <Bot size={18} className="text-primary-foreground" />
        </div>
      )}
      <div className={`max-w-[70%] rounded-lg p-4 ${isUser ? 'bg-primary text-primary-foreground' : 'glass'}`}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        {message.tool_calls && message.tool_calls.length > 0 && (
          <div className="mt-2 pt-2 border-t border-current/20">
            <p className="text-xs opacity-70">Used tools: {message.tool_calls.join(', ')}</p>
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
          <User size={18} />
        </div>
      )}
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';
