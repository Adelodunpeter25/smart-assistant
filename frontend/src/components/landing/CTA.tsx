import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const CTA = memo(() => {
  return (
    <section className="py-24 px-4 liquid-gradient">
      <div className="max-w-4xl mx-auto">
        <Card glass className="p-12 text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to get started?</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of users boosting their productivity with AI
          </p>
          <Button size="lg" asChild>
            <a href="/register">Create Free Account</a>
          </Button>
        </Card>
      </div>
    </section>
  );
});

CTA.displayName = 'CTA';
