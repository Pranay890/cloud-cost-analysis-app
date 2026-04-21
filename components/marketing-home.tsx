import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  BadgeDollarSign,
  BrainCircuit,
  Cloud,
  LayoutDashboard,
  Radar,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { UserNavButton } from '@/components/user-nav-button';

const challengeCards = [
  {
    title: 'Hidden Cost Drift',
    body: 'Costs change quietly across providers, regions, and services until the monthly bill is already locked in.',
    icon: Activity,
  },
  {
    title: 'Slow Detection Loops',
    body: 'Teams often discover spikes after finance reviews instead of during the day the anomaly begins.',
    icon: Radar,
  },
  {
    title: 'Too Much Manual Triage',
    body: 'Analysts waste time stitching exports together instead of acting on a clear, prioritized view of spend risk.',
    icon: BrainCircuit,
  },
];

const featureCards = [
  {
    eyebrow: 'Unified Visibility',
    title: 'See spend, trend shifts, and service concentration in one calm workspace.',
    body: 'Fin-Analysis combines dashboards, reporting, and anomaly monitoring into a single product surface built for finance and engineering together.',
    icon: LayoutDashboard,
  },
  {
    eyebrow: 'Smart Monitoring',
    title: 'Catch unusual cloud behavior with explainable anomaly detection.',
    body: 'We flag deviations against rolling baselines, score severity, and show the expected cost, observed spike, and next action in plain language.',
    icon: BadgeDollarSign,
  },
  {
    eyebrow: 'Action-Ready Insights',
    title: 'Move from spend visibility to optimization decisions faster.',
    body: 'Recommendations, AI summaries, and exportable reports help teams explain what changed and what to do next without a messy workflow.',
    icon: ShieldCheck,
  },
];

const cloudBadges = ['AWS', 'GCP', 'Azure', 'FinOps'];

export function MarketingHome() {
  return (
    <main className="relative overflow-hidden text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(37,99,235,0.08),transparent_18%),radial-gradient(circle_at_82%_8%,rgba(37,99,235,0.1),transparent_24%),radial-gradient(circle_at_72%_58%,rgba(22,163,74,0.06),transparent_22%),radial-gradient(circle_at_20%_60%,rgba(37,99,235,0.06),transparent_24%),radial-gradient(circle_at_80%_80%,rgba(22,163,74,0.04),transparent_20%)]" />
      <div className="pointer-events-none absolute left-1/2 top-20 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-white/35 blur-3xl" />
      <div className="pointer-events-none absolute left-[-10%] top-[35%] h-[40rem] w-[40rem] rounded-full bg-primary/5 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-5%] top-[65%] h-[35rem] w-[35rem] rounded-full bg-success/5 blur-[120px]" />

      <section className="relative mx-auto max-w-[1580px] px-6 pb-16 pt-7 sm:px-8 lg:px-10 2xl:max-w-[1680px]">
        <header className="flex items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-primary">Fin-Analysis</p>
            <div className="mt-4 inline-flex max-w-fit -translate-x-3 items-center gap-2 rounded-full border border-primary/20 bg-primary-light px-4 py-2 text-[11px] font-medium uppercase tracking-[0.32em] text-primary sm:text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              Cost clarity without dashboard chaos
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <Link href="/dashboard" className="text-sm text-muted transition hover:text-foreground">
              Platform
            </Link>
            <UserNavButton />
          </div>
        </header>

        <div className="relative mt-10 grid gap-8 xl:grid-cols-[minmax(0,0.84fr)_680px] xl:items-center 2xl:grid-cols-[minmax(0,0.82fr)_720px]">
          <div className="max-w-[620px]">
            <h2 className="mt-12 max-w-[9ch] text-[2.9rem] font-bold leading-[0.95] tracking-[-0.06em] text-foreground sm:text-[3.7rem] lg:text-[4.2rem] 2xl:text-[4.5rem]">
              Build better cloud decisions.
            </h2>

            <p className="mt-8 max-w-[44ch] text-[0.98rem] leading-8 text-muted sm:text-[1.02rem]">
              SaaS-style FinOps workspace for sharper visibility, anomaly detection, and optimization workflows across AWS, GCP, and Azure.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
              >
                Explore Platform
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/recommendations"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-6 py-3 text-sm text-foreground transition hover:bg-slate-50"
              >
                View Optimization Flow
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {cloudBadges.map((badge) => (
                <div
                  key={badge}
                  className="rounded-full border border-primary/20 bg-primary-light px-4 py-2 text-[0.95rem] font-medium text-primary"
                >
                  {badge}
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[680px] xl:mx-0 2xl:max-w-[720px]">
            <div className="absolute -left-6 top-6 h-24 w-24 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -right-4 bottom-12 h-28 w-28 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-lg border border-border bg-white p-5 shadow-card backdrop-blur-md sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Product preview</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">Cloud cost command center</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-light text-primary">
                  <Cloud className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-full border border-border bg-card-alt px-4 py-2 text-sm text-muted">Spend analytics</div>
                <div className="rounded-full border border-border bg-card-alt px-4 py-2 text-sm text-muted">Multi-cloud</div>
                <div className="rounded-full border border-border bg-card-alt px-4 py-2 text-sm text-muted">Forecasting</div>
              </div>

              <div className="mt-6 rounded-lg border border-border bg-white p-5">
                <div className="flex items-center justify-between text-sm text-muted">
                  <span>Cost monitoring overview</span>
                  <span>Last 30 days</span>
                </div>

                <div className="mt-5 rounded-lg border border-border bg-white p-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-muted">
                    <span>Spend trend</span>
                    <span>Forecast</span>
                  </div>

                  <div className="relative mt-5 h-52 overflow-hidden rounded-lg border border-border bg-white">
                    <svg viewBox="0 0 560 240" className="absolute inset-0 h-full w-full" aria-hidden="true">
                      <defs>
                        <linearGradient id="heroArea" x1="0%" x2="0%" y1="0%" y2="100%">
                          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.16" />
                          <stop offset="100%" stopColor="#2563EB" stopOpacity="0.03" />
                        </linearGradient>
                        <linearGradient id="heroLine" x1="0%" x2="100%" y1="0%" y2="0%">
                          <stop offset="0%" stopColor="#2563EB" />
                          <stop offset="55%" stopColor="#2563EB" />
                          <stop offset="100%" stopColor="#16A34A" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0 198 C48 188, 72 166, 110 154 S190 116, 240 128 S318 176, 364 144 S450 86, 560 74 L560 240 L0 240 Z"
                        fill="url(#heroArea)"
                      />
                      <path
                        d="M0 198 C48 188, 72 166, 110 154 S190 116, 240 128 S318 176, 364 144 S450 86, 560 74"
                        fill="none"
                        stroke="url(#heroLine)"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <circle cx="364" cy="144" r="6" fill="#2563EB" />
                      <circle cx="560" cy="74" r="6" fill="#16A34A" />
                    </svg>

                    <div className="absolute left-4 top-4 rounded-lg border border-border bg-white px-3 py-2 shadow-card">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Monthly spend</p>
                      <p className="mt-1 text-lg font-bold text-foreground">$42.8k</p>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-border bg-white px-3 py-3 shadow-card">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Coverage</p>
                        <p className="mt-2 text-sm font-medium text-foreground">AWS, GCP, Azure</p>
                      </div>
                      <div className="rounded-lg border border-border bg-white px-3 py-3 shadow-card">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Top service</p>
                        <p className="mt-2 text-sm font-medium text-foreground">EC2 - 34%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Core pain points</p>
            <h3 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-foreground sm:text-5xl">
              The challenges of cloud cost optimization
            </h3>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {challengeCards.map(({ title, body, icon: Icon }) => (
              <div
                key={title}
                className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/60 p-8 shadow-card backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                <div className="relative z-10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary shadow-sm border border-primary/10">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="mt-8 text-2xl font-bold text-foreground">{title}</h4>
                  <p className="mt-4 text-base leading-7 text-muted">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1580px] px-6 py-24 sm:px-8 lg:px-10 2xl:max-w-[1680px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Platform Capabilities</p>
            <h3 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-foreground sm:text-5xl">
              Everything you need to optimize your cloud spend.
            </h3>
          </div>
          <p className="max-w-xl text-base leading-7 text-muted">
            Move from visibility to action with powerful tools designed to catch anomalies, allocate costs, and surface immediate savings opportunities.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/60 p-8 shadow-card backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl md:col-span-2">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl transition-all group-hover:bg-primary/20" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <LayoutDashboard className="h-6 w-6" />
                </div>
                <h4 className="mt-6 text-2xl font-bold text-foreground">Unified Visibility</h4>
                <p className="mt-2 max-w-md text-base leading-relaxed text-muted">
                  See your spend, trend shifts, and service concentration in one calm workspace. We combine dashboards and reporting so you never miss a beat.
                </p>
              </div>
              <div className="mt-8 flex-1 overflow-hidden rounded-t-xl border-x border-t border-border bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-border bg-slate-50/80 px-4 py-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                     <div className="space-y-1.5">
                       <div className="h-3 w-20 rounded bg-slate-100" />
                       <div className="h-5 w-28 rounded bg-primary-light/50" />
                     </div>
                     <div className="flex h-6 w-16 items-center justify-center rounded-full bg-success-light/50 px-2">
                       <span className="text-[10px] font-bold text-success">-12%</span>
                     </div>
                  </div>
                  <div className="relative mt-6 h-36 w-full overflow-hidden rounded-lg border border-border bg-white shadow-inner">
                    <div className="absolute inset-0 flex flex-col justify-between px-2 py-4">
                      <div className="border-b border-dashed border-slate-200" />
                      <div className="border-b border-dashed border-slate-200" />
                      <div className="border-b border-dashed border-slate-200" />
                      <div className="border-b border-dashed border-slate-200" />
                    </div>
                    <div className="absolute left-[70%] top-[15%] z-10 -translate-x-1/2 -translate-y-full rounded bg-foreground px-2 py-1 text-[9px] font-medium text-background shadow-lg after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-foreground">
                      $12,450
                    </div>
                    <div className="absolute bottom-0 left-[70%] top-[15%] w-px bg-primary/30" />
                    <svg viewBox="0 0 400 120" className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="miniArea" x1="0%" x2="0%" y1="0%" y2="100%">
                          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0 100 C40 90, 60 50, 100 60 S160 90, 200 70 S280 20, 320 30 S380 70, 400 60 L400 120 L0 120 Z"
                        fill="url(#miniArea)"
                      />
                      <path
                        d="M0 100 C40 90, 60 50, 100 60 S160 90, 200 70 S280 20, 320 30 S380 70, 400 60"
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <circle cx="100" cy="60" r="3" fill="#fff" stroke="#2563EB" strokeWidth="2" />
                      <circle cx="200" cy="70" r="3" fill="#fff" stroke="#2563EB" strokeWidth="2" />
                      <circle cx="280" cy="20" r="3" fill="#fff" stroke="#2563EB" strokeWidth="2" />
                      <circle cx="320" cy="30" r="4.5" fill="#fff" stroke="#2563EB" strokeWidth="2.5" className="animate-pulse shadow-md" />
                      <circle cx="400" cy="60" r="3" fill="#fff" stroke="#2563EB" strokeWidth="2" />
                    </svg>
                    <div className="absolute bottom-1 left-0 right-0 flex justify-between px-4 text-[8px] font-semibold text-slate-400">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/60 p-8 shadow-card backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-success/10 blur-3xl transition-all group-hover:bg-success/20" />
            <div className="relative z-10 flex h-full flex-col">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-light text-success">
                <BadgeDollarSign className="h-6 w-6" />
              </div>
              <h4 className="mt-6 text-2xl font-bold text-foreground">Smart Monitoring</h4>
              <p className="mt-2 text-base leading-relaxed text-muted">
                Catch unusual cloud behavior instantly. We flag deviations against rolling baselines and score severity.
              </p>
              <div className="mt-8 flex-1 space-y-3 rounded-xl border border-border bg-slate-50/50 p-4 shadow-inner">
                <div className="flex items-center justify-between rounded-lg border border-error/20 bg-error-light/30 p-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-error/10 text-error">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">EC2 Spike Detected</p>
                      <p className="text-[10px] font-medium text-error">+45% vs expected baseline</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-error">+$450</span>
                </div>
                
                <div className="flex items-center justify-between rounded-lg border border-warning/20 bg-warning-light/30 p-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning/10 text-warning">
                      <Cloud className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">RDS Storage Drift</p>
                      <p className="text-[10px] font-medium text-warning">Unattached volumes</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-warning">+$120</span>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/60 p-8 shadow-card backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-warning/10 blur-3xl transition-all group-hover:bg-warning/20" />
            <div className="relative z-10 flex h-full flex-col">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning-light text-warning">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h4 className="mt-6 text-2xl font-bold text-foreground">Action-Ready Insights</h4>
              <p className="mt-2 text-base leading-relaxed text-muted">
                Move from visibility to optimization decisions faster. Recommendations and AI summaries help teams explain changes.
              </p>
               <div className="mt-8 flex-1 rounded-xl border border-border bg-slate-50/50 p-4 shadow-inner">
                <div className="space-y-3">
                   <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-white p-2.5 shadow-sm">
                     <div className="flex h-6 w-6 items-center justify-center rounded bg-primary-light/50 text-primary"><BrainCircuit className="h-3 w-3" /></div>
                     <div className="flex-1">
                       <div className="h-2 w-24 rounded bg-slate-200" />
                       <div className="mt-1.5 h-1.5 w-32 rounded bg-slate-100" />
                     </div>
                     <div className="text-[10px] font-bold text-success">Save $8k</div>
                   </div>
                   <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-white p-2.5 shadow-sm">
                     <div className="flex h-6 w-6 items-center justify-center rounded bg-primary-light/50 text-primary"><Activity className="h-3 w-3" /></div>
                     <div className="flex-1">
                       <div className="h-2 w-20 rounded bg-slate-200" />
                       <div className="mt-1.5 h-1.5 w-24 rounded bg-slate-100" />
                     </div>
                     <div className="text-[10px] font-bold text-success">Save $2k</div>
                   </div>
                   
                   <div className="mt-4 inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary-hover">
                     View recommendations <ArrowRight className="h-3 w-3" />
                   </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/60 p-8 shadow-card backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl md:col-span-2 lg:col-span-2">
            <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-secondary/10 blur-3xl transition-all group-hover:bg-secondary/20" />
            <div className="relative z-10 flex h-full flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="max-w-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-light/20 text-secondary">
                  <Cloud className="h-6 w-6" />
                </div>
                <h4 className="mt-6 text-2xl font-bold text-foreground">Multi-Cloud Native</h4>
                <p className="mt-2 text-base leading-relaxed text-muted">
                  Seamlessly analyze costs across AWS, Google Cloud, and Azure. Standardize your FinOps reporting in one unified dashboard.
                </p>
              </div>
              <div className="flex flex-1 gap-4 lg:justify-end">
                 <div className="flex w-24 flex-col items-center gap-2 rounded-2xl border border-border bg-white p-4 shadow-sm">
                   <div className="text-sm font-bold text-foreground">AWS</div>
                   <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[65%] bg-primary" /></div>
                   <div className="text-[10px] text-muted">65% spend</div>
                 </div>
                 <div className="flex w-24 translate-y-4 flex-col items-center gap-2 rounded-2xl border border-border bg-white p-4 shadow-sm">
                   <div className="text-sm font-bold text-foreground">GCP</div>
                   <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[20%] bg-success" /></div>
                   <div className="text-[10px] text-muted">20% spend</div>
                 </div>
                 <div className="flex w-24 flex-col items-center gap-2 rounded-2xl border border-border bg-white p-4 shadow-sm">
                   <div className="text-sm font-bold text-foreground">Azure</div>
                   <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[15%] bg-secondary" /></div>
                   <div className="text-[10px] text-muted">15% spend</div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto my-24 max-w-[1580px] px-6 sm:px-8 lg:px-10 2xl:max-w-[1680px]">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-primary px-8 py-20 text-center shadow-2xl sm:px-16 sm:py-28 lg:px-24">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-10 blur-[100px]" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-secondary opacity-40 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent opacity-30 blur-[80px]" />
          
          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
              Ready to take control of your cloud spend?
            </h2>
            <p className="mt-6 text-lg leading-8 text-primary-light sm:text-xl">
              Stop guessing and start optimizing. Join forward-thinking engineering teams leveraging Fin-Analysis to catch anomalies before they impact the bottom line.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-bold text-primary shadow-lg transition hover:scale-105 hover:bg-slate-50 hover:shadow-xl"
              >
                Open Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/genai-optimization"
                className="inline-flex items-center justify-center rounded-full border border-primary-light/30 bg-primary-light/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-md transition hover:bg-primary-light/20"
              >
                See AI Workflow
              </Link>
            </div>
            <p className="mt-8 text-sm text-primary-light/80">
              No credit card required for early access preview.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
