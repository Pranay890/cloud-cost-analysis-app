import * as React from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-foreground outline-none transition shadow-sm placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-md hover:border-slate-300',
        className
      )}
      {...props}
    />
  );
}

