'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, BrainCircuit, Compass, FileText, Home, Lightbulb, Lock, Radar } from 'lucide-react';
import { useState } from 'react';
import { UserProfileModal } from '@/components/user-profile-modal';
import { useAnalytics } from '@/lib/analytics-context';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

const navigation = [
  { href: '/', label: 'Home', icon: Compass },
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/anomaly-detection', label: 'Anomaly Detection', icon: Radar },
  { href: '/cost-analysis', label: 'Cost Analysis', icon: BarChart3 },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/recommendations', label: 'Recommendations', icon: Lightbulb },
  { href: '/genai-optimization', label: 'GenAI Optimization', icon: BrainCircuit },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { hasData } = useAnalytics();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const userInitial = user ? user.name.charAt(0).toUpperCase() : 'N';

  return (
    <aside className="sticky top-0 flex h-screen w-full max-w-72 flex-col border-r border-border bg-white p-6 backdrop-blur-xl relative overflow-hidden">
      {/* Blue fade background theme matching home page */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(37,99,235,0.08),transparent_18%),radial-gradient(circle_at_82%_8%,rgba(37,99,235,0.1),transparent_24%),radial-gradient(circle_at_72%_58%,rgba(22,163,74,0.06),transparent_22%),radial-gradient(circle_at_20%_60%,rgba(37,99,235,0.06),transparent_24%),radial-gradient(circle_at_80%_80%,rgba(22,163,74,0.04),transparent_20%)] z-0" />
      <div className="pointer-events-none absolute left-[-10%] top-[35%] h-[40rem] w-[40rem] rounded-full bg-primary/5 blur-[120px] z-0" />
      <div className="pointer-events-none absolute right-[-5%] top-[65%] h-[35rem] w-[35rem] rounded-full bg-success/5 blur-[120px] z-0" />

      <div className="relative z-10 space-y-8 flex-1 flex flex-col">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Fin-Analysis</p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">FinOps Platform</h1>
          <p className="mt-2 max-w-[18rem] text-sm leading-6 text-muted">
            AI-powered cost analytics and optimization.
          </p>
        </div>

        <nav className="space-y-2 rounded-lg border border-border bg-white p-3 shadow-card backdrop-blur-sm">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            const isDataPage = href !== '/' && href !== '/dashboard';
            const isDisabled = isDataPage && !hasData;

            return (
              <div key={href} title={isDisabled ? 'Upload data first' : undefined}>
                {isDisabled ? (
                  <div
                    className={cn(
                      'group relative flex cursor-not-allowed items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium opacity-40 transition-all duration-300'
                    )}
                  >
                    <Lock className="h-4 w-4" />
                    {label}
                  </div>
                ) : (
                  <Link
                    href={href}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
                      active
                        ? 'bg-primary-light text-primary shadow-sm border-l-2 border-primary'
                        : 'text-foreground/70 hover:bg-slate-50 hover:text-foreground'
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-primary" />
                    )}

                    <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    {label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <button
        onClick={() => setIsUserModalOpen(true)}
        className="relative z-10 mt-auto flex w-full items-center gap-3 rounded-lg border border-border bg-white p-3.5 shadow-card transition-all duration-200 hover:bg-slate-50 hover:shadow-card-hover"
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white font-semibold">
          {userInitial}
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-foreground">{user?.name || 'User'}</p>
          <p className="text-xs text-muted">Active session</p>
        </div>
      </button>

      <UserProfileModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} />
    </aside>
  );
}
