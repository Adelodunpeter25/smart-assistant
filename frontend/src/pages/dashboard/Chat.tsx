import { memo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ChatContainer } from '@/components/chat';
import { Card } from '@/components/ui/card';

const Chat = memo(() => {
  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] max-w-4xl mx-auto">
        <div className="mb-4 flex-shrink-0">
          <h2 className="text-3xl font-bold">AI Chat</h2>
          <p className="text-muted-foreground">Have a conversation with your smart assistant</p>
        </div>
        <Card glass className="flex-1 flex flex-col overflow-hidden">
          <ChatContainer />
        </Card>
      </div>
    </DashboardLayout>
  );
});

Chat.displayName = 'Chat';

export default Chat;
