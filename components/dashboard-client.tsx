'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { CsvUpload } from '@/components/csv-upload';
import { DistributionPieChart, ServiceBarChart, TrendLineChart } from '@/components/charts';
import { StatCard } from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/skeleton';
import { AnalyticsPayload } from '@/lib/types';
import { currency } from '@/lib/utils';

export function DashboardClient() {
  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    const response = await fetch('/api/analytics', { cache: 'no-store' });
    const data = await response.json();
    setAnalytics(data.analytics);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  const stats = useMemo(() => {
    if (!analytics) return [];
    return [
      {
        title: 'Total Cost',
        value: currency.format(analytics.totalCost),
        helper: 'Across all imported cloud billing records',
      },
      {
        title: 'Avg Daily Cost',
        value: currency.format(analytics.avgDailyCost),
        helper: 'Average spend per active billing day',
      },
      {
        title: 'Forecast Cost',
        value: currency.format(analytics.forecastCost),
        helper: '3-day moving average forecast',
      },
      {
        title: 'Cost Change %',
        value: `${analytics.costChangePct.toFixed(1)}%`,
        helper: 'Current period vs previous period',
        change: analytics.costChangePct,
      },
    ];
  }, [analytics]);

  if (loading || !analytics) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-36 w-full" />
          ))}
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <Skeleton className="h-[360px] w-full" />
          <Skeleton className="h-[360px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-grid bg-[size:28px_28px] bg-card/80 p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.25em] text-blue-300">Cloud Cost Analysis & Optimization Platform</p>
            <h2 className="mt-3 text-4xl font-semibold text-white">Monitor spend, surface anomalies, and turn optimization into action.</h2>
            <p className="mt-4 text-base text-muted">
              Upload AWS, Azure, or GCP billing exports to instantly explore dashboards, rule-based savings recommendations, and AI-generated FinOps insights.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={async () => {
              setResetting(true);
              await fetch('/api/reset', { method: 'POST' });
              await loadAnalytics();
              setResetting(false);
            }}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {resetting ? 'Resetting...' : 'Reset Data'}
            </Button>
            <Button onClick={() => window.location.assign('/genai-optimization')}>
              <Sparkles className="mr-2 h-4 w-4" /> Generate AI Insights
            </Button>
          </div>
        </div>
      </section>

      <CsvUpload onUploaded={loadAnalytics} />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <TrendLineChart data={analytics.dailyTrend} />
        <ServiceBarChart data={analytics.serviceBreakdown} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <DistributionPieChart data={analytics.costDistribution} />
        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-white">Top expensive services</h3>
              <p className="text-sm text-muted">Prioritize these areas for optimization review.</p>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            {analytics.topServices.map((service, index) => (
              <div key={service.service} className="flex items-center justify-between rounded-2xl border border-border px-4 py-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-blue-300">#{index + 1}</p>
                  <p className="mt-1 font-medium text-white">{service.service}</p>
                </div>
                <p className="font-semibold text-white">{currency.format(service.cost)}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
