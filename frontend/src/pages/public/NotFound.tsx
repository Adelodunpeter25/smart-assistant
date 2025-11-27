import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const NotFound = memo(() => {
  return (
    <div className="min-h-screen flex items-center justify-center liquid-gradient px-4">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-bold">Page Not Found</h2>
        <p className="text-xl text-muted-foreground max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button size="lg" asChild>
          <a href="/">
            <Home className="mr-2" size={18} />
            Back to Home
          </a>
        </Button>
      </div>
    </div>
  );
});

NotFound.displayName = 'NotFound';

export default NotFound;
