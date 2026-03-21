import * as React from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
};

export function Button({ className, variant = 'default', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'default' &&
          'bg-primary text-slate-950 shadow-glow hover:-translate-y-0.5 hover:bg-blue-300',
        variant === 'secondary' && 'bg-slate-800 text-foreground hover:bg-slate-700',
        variant === 'outline' &&
          'border border-border bg-transparent text-foreground hover:border-blue-400 hover:bg-slate-900',
        variant === 'ghost' && 'text-muted hover:bg-slate-900 hover:text-foreground',
        className
      )}
      {...props}
    />
  );
}
