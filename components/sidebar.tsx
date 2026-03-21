'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, BrainCircuit, FileText, Home, Lightbulb, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/cost-analysis', label: 'Cost Analysis', icon: BarChart3 },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/recommendations', label: 'Recommendations', icon: Lightbulb },
  { href: '/genai-optimization', label: 'GenAI Optimization', icon: BrainCircuit },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-full max-w-72 flex-col justify-between border-r border-border bg-slate-950/70 p-6 backdrop-blur-xl">
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-blue-300">FinOps Studio</p>
          <h1 className="mt-3 text-2xl font-semibold text-white">Cloud Cost Platform</h1>
          <p className="mt-2 text-sm text-muted">AI-powered analytics, cost visibility, and optimization insights.</p>
        </div>

        <nav className="space-y-2">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all',
                  active
                    ? 'bg-blue-500/15 text-white shadow-glow'
                    : 'text-muted hover:bg-slate-900 hover:text-white'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-500/20 p-2 text-blue-200">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Demo ready</p>
            <p className="text-xs text-blue-100/80">Works with sample data, CSV uploads, and API fallbacks.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
