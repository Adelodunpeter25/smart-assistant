import { memo, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Send } from 'lucide-react';
import { ChatTemplates } from './ChatTemplates';
import type { ChatTemplate } from './ChatTemplates';

interface ChatInputProps {
  onSend: (message: string, template?: ChatTemplate) => void;
  disabled?: boolean;
}

export const ChatInput = memo(({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ChatTemplate | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useKeyboardShortcuts([
    { key: '/', callback: () => inputRef.current?.focus() },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim(), selectedTemplate || undefined);
      setMessage('');
      setSelectedTemplate(null);
    }
  };

  return (
    <div>
      <ChatTemplates
        selected={selectedTemplate}
        onSelect={setSelectedTemplate}
        onCancel={() => setSelectedTemplate(null)}
      />
      <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        ref={inputRef}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        disabled={disabled}
        className="flex-1 px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <Button type="submit" size="icon" disabled={disabled || !message.trim()} className="h-12 w-12">
        <Send size={20} />
      </Button>
    </form>
    </div>
  );
});

ChatInput.displayName = 'ChatInput';
