'use client';

import { ReactNode } from 'react';
import { Sidebar } from '@/components/sidebar';

export function LayoutShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[300px_1fr]">
      <Sidebar />
      <main className="min-h-screen px-4 py-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-[1560px] rounded-lg border border-border bg-white p-4 shadow-card sm:p-5 lg:p-7">
          {children}
        </div>
      </main>
    </div>
  );
}
