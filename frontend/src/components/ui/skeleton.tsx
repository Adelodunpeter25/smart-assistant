import { memo } from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = memo(({ className = '' }: SkeletonProps) => (
  <div className={`animate-pulse bg-muted rounded ${className}`} />
));

Skeleton.displayName = 'Skeleton';

export const CardSkeleton = memo(() => (
  <div className="glass rounded-lg p-6 space-y-3">
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <div className="flex gap-2 pt-2">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-6 w-16" />
    </div>
  </div>
));

CardSkeleton.displayName = 'CardSkeleton';
