import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const Hero = memo(() => {
  return (
    <section className="min-h-screen flex items-center justify-center liquid-gradient">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Your AI-Powered
          <br />
          <span className="text-primary">Smart Assistant</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Automate tasks, manage your schedule, and boost productivity with intelligent conversation and seamless integrations.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <a href="/register">
              Get Started <ArrowRight className="ml-2" size={18} />
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="/login">Sign In</a>
          </Button>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';
