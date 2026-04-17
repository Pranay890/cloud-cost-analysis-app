import * as React from 'react';
import { cn } from '@/lib/utils';

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200',
        'border-blue-200 bg-blue-50 text-primary shadow-sm hover:shadow-md hover:-translate-y-0.5',
        className
      )}
      {...props}
    />
  );
}

