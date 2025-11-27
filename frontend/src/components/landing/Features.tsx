import { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Calendar, CheckSquare, Clock, Mail, Search } from 'lucide-react';

const features = [
  { icon: MessageSquare, title: 'AI Chat', description: 'Natural language conversations with intelligent responses' },
  { icon: CheckSquare, title: 'Task Management', description: 'Create, organize, and complete tasks effortlessly' },
  { icon: Calendar, title: 'Calendar Events', description: 'Schedule and manage your events seamlessly' },
  { icon: Clock, title: 'Timers & Alarms', description: 'Set reminders and never miss important moments' },
  { icon: Mail, title: 'Email Integration', description: 'Send emails directly through voice commands' },
  { icon: Search, title: 'Web Search', description: 'Get instant answers from the web' },
];

export const Features = memo(() => {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold">Powerful Features</h2>
          <p className="text-xl text-muted-foreground">Everything you need to stay productive</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} glass className="transition-all hover:scale-[1.02] hover:shadow-xl cursor-pointer">
              <CardHeader>
                <feature.icon className="w-10 h-10 text-primary mb-2 transition-transform group-hover:scale-110" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
});

Features.displayName = 'Features';
