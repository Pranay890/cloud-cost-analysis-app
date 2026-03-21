import * as React from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-xl border border-border bg-slate-950/70 px-4 text-sm text-foreground outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20',
        className
      )}
      {...props}
    />
  );
}
