'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, BrainCircuit, FileText, Home, Lightbulb } from 'lucide-react';
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
    <aside className="sticky top-0 flex h-screen w-full max-w-72 flex-col border-r border-blue-500/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 backdrop-blur-xl">

      {/* Top Section */}
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-blue-400">
            FinOps Studio
          </p>

          <h1 className="mt-3 text-2xl font-bold text-white">
            Cloud Cost Platform
          </h1>

          <p className="mt-2 text-sm text-muted">
            AI-powered analytics, cost visibility, and optimization insights.
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300',
                  active
                    ? 'bg-blue-500/15 text-white shadow-[0_0_20px_rgba(59,130,246,0.25)]'
                    : 'text-muted hover:bg-slate-800/60 hover:text-white'
                )}
              >
                {/* Active Left Glow Bar */}
                {active && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-blue-500"></span>
                )}

                <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile */}
      <div className="mt-auto flex items-center gap-3 rounded-2xl border border-blue-500/10 bg-slate-900/60 p-3 backdrop-blur">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-300 font-semibold">
          N
        </div>
        <div>
          <p className="text-sm font-medium text-white">User</p>
          <p className="text-xs text-muted">Active session</p>
        </div>
      </div>

    </aside>
  );
}