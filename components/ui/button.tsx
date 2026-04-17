import * as React from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
};

export function Button({ className, variant = 'default', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'default' &&
          'bg-primary text-white shadow-md hover:bg-primary-hover hover:shadow-lg hover:scale-105 active:scale-95',
        variant === 'secondary' && 'border border-border bg-white text-foreground hover:bg-slate-50 hover:shadow-md hover:scale-105 active:scale-95',
        variant === 'outline' &&
          'border border-border bg-white text-foreground hover:border-primary hover:bg-primary-light hover:shadow-md hover:scale-105 active:scale-95',
        variant === 'ghost' && 'text-muted hover:bg-slate-100 hover:text-foreground hover:scale-105 active:scale-95',
        className
      )}
      {...props}
    />
  );
}

