import { memo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare, X, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatContainer } from '@/components/chat';

export const FloatingChat = memo(() => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);

  if (location.pathname === '/dashboard/chat') {
    return null;
  }

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 md:bottom-8 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <MessageSquare className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <div className={`fixed ${minimized ? 'bottom-24 md:bottom-8' : 'bottom-24 md:bottom-8'} right-6 z-50 transition-all`}>
      {minimized ? (
        <Button
          onClick={() => setMinimized(false)}
          className="h-14 px-6 rounded-full shadow-lg"
        >
          <MessageSquare className="w-5 h-5 mr-2" />
          <span>Chat</span>
        </Button>
      ) : (
        <div className="glass rounded-lg shadow-2xl w-[380px] h-[600px] flex flex-col border">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">AI Chat</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => setMinimized(true)}>
                <Minus className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatContainer maxMessages={2} />
          </div>
        </div>
      )}
    </div>
  );
});

FloatingChat.displayName = 'FloatingChat';
