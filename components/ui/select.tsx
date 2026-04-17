import * as React from 'react';
import { cn } from '@/lib/utils';

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-foreground outline-none transition shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-md hover:border-slate-300',
        className
      )}
      {...props}
    />
  );
}

