import { memo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ChatContainer } from '@/components/chat';
import { Card } from '@/components/ui/card';

const Chat = memo(() => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">AI Chat</h2>
          <p className="text-muted-foreground">Have a conversation with your smart assistant</p>
        </div>
        <Card glass>
          <ChatContainer />
        </Card>
      </div>
    </DashboardLayout>
  );
});

Chat.displayName = 'Chat';

export default Chat;
