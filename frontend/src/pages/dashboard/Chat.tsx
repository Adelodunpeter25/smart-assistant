import { memo, useState } from 'react';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ChatContainer } from '@/components/chat';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { MoreVertical, Trash2 } from 'lucide-react';
import { useChat } from '@/hooks';

const Chat = memo(() => {
  const { clearMessages } = useChat();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleClearChat = async () => {
    await clearMessages();
    setConfirmOpen(false);
    toast.success('Chat history cleared!');
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] max-w-4xl mx-auto">
        <div className="mb-4 flex-shrink-0 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">AI Chat</h2>
            <p className="text-muted-foreground">Have a conversation with your smart assistant</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setConfirmOpen(true)} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Card glass className="flex-1 flex flex-col overflow-hidden border-2">
          <ChatContainer />
        </Card>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleClearChat}
        title="Clear Chat History"
        description="Are you sure you want to clear all chat messages? This action cannot be undone."
      />
    </DashboardLayout>
  );
});

Chat.displayName = 'Chat';

export default Chat;
