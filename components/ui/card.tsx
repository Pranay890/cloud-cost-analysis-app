import * as React from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-white shadow-card backdrop-blur-sm transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5',
        className
      )}
      {...props}
    />
  );
}

