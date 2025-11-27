import { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Users, Zap } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To empower individuals and teams with AI-powered tools that simplify daily tasks and boost productivity.',
  },
  {
    icon: Users,
    title: 'Our Vision',
    description: 'A world where everyone has access to intelligent personal assistants that make life easier and more efficient.',
  },
  {
    icon: Zap,
    title: 'Our Values',
    description: 'Innovation, simplicity, and user-first design. We believe technology should work for you, not the other way around.',
  },
];

export const AboutContent = memo(() => {
  return (
    <section className="min-h-screen py-24 px-4 liquid-gradient">
      <div className="max-w-5xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">About Smart Assistant</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're building the future of personal productivity with AI-powered assistance that understands and adapts to your needs.
          </p>
        </div>

        <Card glass className="p-8">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Our Story</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Smart Assistant was born from a simple idea: everyone deserves a personal assistant that helps them stay organized, 
              productive, and focused on what matters most. We combine cutting-edge AI technology with intuitive design to create 
              a tool that feels natural and effortless to use.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Whether you're managing tasks, scheduling events, setting reminders, or searching for information, Smart Assistant 
              is here to help you accomplish more with less effort. Our AI understands natural language, learns from your preferences, 
              and provides intelligent suggestions to make your life easier.
            </p>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value) => (
            <Card key={value.title} glass className="transition-all hover:scale-[1.02] hover:shadow-xl">
              <CardHeader className="space-y-4">
                <value.icon className="w-12 h-12 text-primary" />
                <CardTitle className="text-xl">{value.title}</CardTitle>
                <CardDescription className="text-base">{value.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card glass className="p-8">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Why Choose Us?</h2>
            <ul className="space-y-4 text-lg text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Free forever - No hidden costs or premium tiers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Privacy-focused - Your data is encrypted and never shared</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Cross-platform - Works on desktop, mobile, and tablet</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>AI-powered - Natural language understanding and intelligent automation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Always improving - Regular updates with new features and enhancements</span>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </section>
  );
});

AboutContent.displayName = 'AboutContent';
