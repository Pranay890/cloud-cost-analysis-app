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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(37,99,235,0.08),transparent_18%),radial-gradient(circle_at_82%_8%,rgba(37,99,235,0.1),transparent_24%),radial-gradient(circle_at_72%_58%,rgba(22,163,74,0.06),transparent_22%)]" />
      <div className="pointer-events-none absolute left-1/2 top-20 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-white/35 blur-3xl" />

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

      <section className="relative border-y border-border bg-white py-24">
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
                className="rounded-lg border border-border bg-white p-7 shadow-card backdrop-blur-sm transition hover:shadow-card-hover"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary-light text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h4 className="mt-8 text-2xl font-bold text-foreground">{title}</h4>
                <p className="mt-4 text-base leading-7 text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1580px] px-6 py-24 sm:px-8 lg:px-10 2xl:max-w-[1680px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Why Fin-Analysis</p>
            <h3 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-foreground sm:text-5xl">
              A more attractive FinOps product surface with the right product depth underneath it.
            </h3>
          </div>
          <p className="max-w-xl text-base leading-7 text-muted">
            The visual style is premium and modern, but the platform value is still grounded in dashboarding,
            anomaly monitoring, recommendations, and reporting workflows.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {featureCards.map(({ eyebrow, title, body, icon: Icon }) => (
            <div
              key={title}
              className="rounded-lg border border-border bg-white p-7 shadow-card backdrop-blur-sm transition hover:shadow-card-hover"
            >
              <div className="flex items-center gap-3 text-primary">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-light">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">{eyebrow}</span>
              </div>
              <h4 className="mt-8 text-2xl font-bold leading-tight text-foreground">{title}</h4>
              <p className="mt-4 text-base leading-7 text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-[1580px] px-6 pb-24 sm:px-8 lg:px-10 2xl:max-w-[1680px]">
        <div className="overflow-hidden rounded-lg border border-border bg-white px-8 py-10 shadow-card sm:px-12 sm:py-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Next move</p>
              <h3 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-foreground">
                Launch the product view, then iterate on anomaly intelligence and the rest of the platform.
              </h3>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-7 py-4 text-base font-semibold text-white transition hover:bg-primary-hover"
              >
                Open Dashboard
              </Link>
              <Link
                href="/genai-optimization"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-7 py-4 text-base text-foreground transition hover:bg-slate-50"
              >
                See AI Workflow
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
