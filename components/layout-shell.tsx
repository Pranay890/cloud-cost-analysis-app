'use client';

import { ReactNode } from 'react';
import { Sidebar } from '@/components/sidebar';

export function LayoutShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <main className="min-h-screen px-4 py-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}
