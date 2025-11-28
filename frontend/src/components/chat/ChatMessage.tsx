import { memo, useState } from 'react';
import { Bot, User, ExternalLink, Copy, Trash2, Check, Search, FileText, CheckSquare, Timer, Calculator, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Message as ChatMessageType } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
  onDelete?: (id: string) => void;
}

const parseMessageWithLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts: Array<{ type: 'text' | 'link'; content: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    // Remove trailing punctuation from URL
    let url = match[0];
    while (url.endsWith('.') || url.endsWith(',') || url.endsWith(')') || url.endsWith(';')) {
      url = url.slice(0, -1);
    }
    parts.push({ type: 'link', content: url });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return parts.length > 0 ? parts : [{ type: 'text', content: text }];
};

const templateIcons: Record<string, any> = {
  search_web: Search,
  save_note: FileText,
  create_task: CheckSquare,
  set_timer: Timer,
  calculate: Calculator,
  convert_currency: DollarSign,
};

const templateLabels: Record<string, string> = {
  search_web: 'Search Web',
  save_note: 'Save Note',
  create_task: 'Create Task',
  set_timer: 'Set Timer',
  calculate: 'Calculate',
  convert_currency: 'Convert Currency',
};

export const ChatMessage = memo(({ message, onDelete }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  const messageParts = parseMessageWithLinks(message.content);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success('Message copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(message.id);
      toast.success('Message deleted!');
    }
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <Bot size={18} className="text-primary-foreground" />
        </div>
      )}
      <div className={`max-w-[70%] rounded-lg p-4 group relative ${isUser ? 'bg-primary text-primary-foreground' : 'glass'}`}>
        {isUser && message.template && (
          <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-current/20">
            {(() => {
              const Icon = templateIcons[message.template];
              return Icon ? <Icon className="w-3.5 h-3.5 opacity-70" /> : null;
            })()}
            <span className="text-xs opacity-70">{templateLabels[message.template]}</span>
          </div>
        )}
        <div className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className={`h-6 w-6 p-0 shadow-md ${isUser ? 'bg-background text-foreground hover:bg-accent' : 'bg-background hover:bg-accent'}`}
            onClick={handleCopy}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </Button>
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              className={`h-6 w-6 p-0 shadow-md ${isUser ? 'bg-background text-foreground hover:bg-destructive hover:text-destructive-foreground' : 'bg-background hover:bg-destructive hover:text-destructive-foreground'}`}
              onClick={handleDelete}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
        <div className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere">
          {messageParts.map((part, idx) => (
            part.type === 'link' ? (
              <Button
                key={idx}
                size="sm"
                className="inline-flex items-center gap-1 mx-1 my-0.5 h-7 text-xs bg-blue-500 text-white hover:bg-blue-600"
                onClick={() => window.open(part.content, '_blank', 'noopener,noreferrer')}
              >
                Visit <ExternalLink className="w-3 h-3" />
              </Button>
            ) : (
              <span key={idx}>{part.content}</span>
            )
          ))}
        </div>
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
