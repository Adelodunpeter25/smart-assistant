import { memo } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} glass className="transition-all hover:scale-[1.05] hover:shadow-2xl cursor-pointer p-2">
              <CardHeader className="space-y-4">
                <feature.icon className="w-14 h-14 text-primary" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4">
          <div className="flex gap-6 px-4">
            {features.map((feature) => (
              <Card key={feature.title} glass className="w-[70vw] flex-shrink-0 snap-center p-2">
                <CardHeader className="space-y-6 py-8">
                  <feature.icon className="w-16 h-16 text-primary" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

Features.displayName = 'Features';
