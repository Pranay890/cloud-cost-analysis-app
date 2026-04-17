'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowRight, RefreshCw, ShieldAlert, Sparkles, TrendingDown } from 'lucide-react';
import { DailyMetrics } from '@/components/daily-metrics';
import { DashboardEmptyState } from '@/components/dashboard-empty-state';
import { DistributionPieChart, ServiceBarChart, TrendLineChart } from '@/components/charts';
import { Skeleton } from '@/components/skeleton';
import { StatCard } from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAnalytics } from '@/lib/analytics-context';
import { AiInsight, AnalyticsPayload } from '@/lib/types';
import { currency } from '@/lib/utils';

export function DashboardClient() {
  const { setHasData } = useAnalytics();
  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [aiInsights, setAiInsights] = useState<AiInsight[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);

      const response = await fetch(`/api/analytics?t=${Date.now()}`, { cache: 'no-store' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load analytics');
      }

      const analyticsData = data.analytics ?? null;
      setAnalytics(analyticsData);
      setHasData(!!analyticsData);
    } catch (error) {
      console.error(error);
      setAnalytics(null);
      setHasData(false);
      setLoadError('Unable to load analytics right now. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [setHasData]);

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  const generateInsights = async () => {
    if (!analytics) return;

    try {
      setLoadingAI(true);

      const response = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total_cost: analytics.totalCost,
          services: analytics.serviceBreakdown.map((service) => ({
            name: service.service,
            cost: service.cost,
          })),
        }),
      });

      const data = await response.json();
      setAiInsights(data.insights || []);
    } catch (error) {
      console.error(error);
      setAiInsights([]);
    } finally {
      setLoadingAI(false);
    }
  };

  const resetData = async () => {
    setResetting(true);
    await fetch('/api/reset', { method: 'POST' });
    await loadAnalytics();
    setResetting(false);
  };

  const clearData = async () => {
    setResetting(true);
    await fetch('/api/clear', { method: 'POST' });
    await loadAnalytics();
    setResetting(false);
  };

  const stats = useMemo(() => {
    if (!analytics) return [];

    return [
      {
        title: 'Total Cost',
        value: currency.format(analytics.totalCost),
        helper: 'Across all imported records',
      },
      {
        title: 'Avg Daily Cost',
        value: currency.format(analytics.avgDailyCost),
        helper: 'Per active billing day',
      },
      {
        title: 'Forecast',
        value: currency.format(analytics.forecastCost),
        helper: '3-day moving avg',
      },
      {
        title: 'Anomalies',
        value: String(analytics.anomalySummary.totalAnomalies).padStart(2, '0'),
        helper: analytics.anomalySummary.latestAnomalyDate
          ? `${analytics.anomalySummary.highSeverityCount} high severity - latest ${analytics.anomalySummary.latestAnomalyDate}`
          : 'No unusual spikes detected',
      },
    ];
  }, [analytics]);

  if (!analytics) {
    if (loading) {
      return (
        <div className="space-y-6">
          <Skeleton className="h-40 w-full" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-32 w-full" />
            ))}
          </div>
        </div>
      );
    }

    return <DashboardEmptyState onUploadComplete={loadAnalytics} />;
  }

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-r from-slate-50 to-blue-50 px-8 py-8 shadow-md">
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -bottom-16 left-1/4 h-32 w-32 rounded-full bg-accent/6 blur-3xl" />
        <div className="absolute right-12 top-8 hidden h-24 w-24 rounded-full border border-white/60 bg-white/20 backdrop-blur-md lg:block" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 pb-2">
              <div className="h-1.5 w-8 rounded-full bg-primary" />
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">analytics</p>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
              Cost visibility & anomaly monitoring.
            </h1>
            <p className="mt-2 text-slate-600">Real-time insights into your multi-cloud spending patterns.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Multi-cloud</span>
              <span className="inline-flex items-center rounded-full border border-error/20 bg-error/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-error">Anomaly alerts</span>
              <span className="inline-flex items-center rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Optimization</span>
            </div>
          </div>

          <div className="flex flex-col items-end flex-shrink-0 w-full max-w-sm ml-auto mt-2 xl:mt-0">
            <div className="flex flex-col gap-3 w-full">
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={clearData} className="flex items-center gap-2 px-5 py-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>{resetting ? 'Clearing...' : 'Clear'}</span>
                </Button>
                <Button variant="outline" onClick={resetData} className="flex items-center gap-2 px-5 py-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>{resetting ? 'Resetting...' : 'Reset'}</span>
                </Button>
              </div>
              <Button
                onClick={generateInsights}
                className="flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold w-full justify-center shadow-lg hover:shadow-xl"
                style={{
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
                }}
              >
                <Sparkles className="h-5 w-5" />
                {loadingAI ? 'Analyzing...' : 'Generate AI Insights'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {loadError && (
        <Card className="border-error/20 bg-error/5 p-5 border-l-4 border-l-error">
          <p className="text-sm font-medium text-error">{loadError}</p>
        </Card>
      )}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section>
        <TrendLineChart data={analytics.dailyTrend} anomalies={analytics.anomalies} />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <DailyMetrics dailyTrend={analytics.dailyTrend} />

        <Card className="flex flex-col overflow-hidden p-6 border-t-4 border-t-error">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Anomaly Posture</p>
              <h3 className="mt-2 text-lg font-bold text-foreground">Detection Summary</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-error/10 text-error">
              <ShieldAlert className="h-6 w-6" />
            </div>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div className="flex min-h-[120px] flex-col justify-center rounded-lg border border-error/20 bg-error/5 p-5 hover:shadow-md transition-all">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-error">High Severity</p>
              <p className="mt-3 truncate text-4xl font-bold text-error">{analytics.anomalySummary.highSeverityCount}</p>
            </div>
            <div className="flex min-h-[120px] flex-col justify-center rounded-lg border border-warning/20 bg-warning/5 p-5 hover:shadow-md transition-all">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-warning">Potential Impact</p>
              <p className="mt-3 truncate text-2xl font-bold text-warning">
                {currency.format(analytics.anomalySummary.totalPotentialImpact)}
              </p>
            </div>
          </div>

          <div className="mb-6 space-y-3">
            {analytics.anomalies.length > 0 ? (
              analytics.anomalies.slice(0, 2).map((anomaly) => (
                <div
                  key={anomaly.id}
                  className="rounded-lg border border-error/20 bg-white px-5 py-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">
                      {anomaly.scope === 'service' ? anomaly.service : 'Portfolio spend'}
                    </p>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-error">{anomaly.date}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600">{anomaly.summary}</p>
                </div>
              ))
            ) : (
              <p className="rounded-lg border border-slate-200 bg-white px-4 py-5 text-center text-sm text-slate-600">
                No anomalies are currently flagged for this dataset.
              </p>
            )}
          </div>

          <Link href="/anomaly-detection" className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition hover:text-primary-hover">
            Open anomaly detection
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>

        <Card className="flex flex-col p-6 border-t-4 border-t-accent">
          <div className="mb-5 flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-primary" />
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Monthly Forecast</h4>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4 hover:shadow-md transition-all">
              <p className="text-xs font-medium text-slate-600">Projected Monthly</p>
              <p className="mt-3 text-lg font-bold text-foreground">
                {(() => {
                  const costs = analytics.dailyTrend.map((d) => d.cost);
                  const avg = costs.reduce((a, b) => a + b, 0) / costs.length;
                  return currency.format(avg * 30);
                })()}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 hover:shadow-md transition-all">
              <p className="text-xs font-medium text-slate-600">Daily Average</p>
              <p className="mt-3 text-lg font-bold text-accent">{currency.format(analytics.avgDailyCost)}</p>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted">
            <span className="text-foreground/70">Based on historical trends</span>
          </p>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DistributionPieChart data={analytics.costDistribution} />
        <ServiceBarChart data={analytics.serviceBreakdown} />
      </section>

      {aiInsights.length > 0 && (
        <section className="grid gap-6 md:grid-cols-3">
          {aiInsights.map((insight, index) => (
            <Card key={index} className="p-6 border-t-4 border-t-primary">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  insight.priority === 'High'
                    ? 'bg-error/10 text-error border border-error/20'
                    : insight.priority === 'Medium'
                      ? 'bg-warning/10 text-warning border border-warning/20'
                      : 'bg-success/10 text-success border border-success/20'
                }`}
              >
                {insight.priority}
              </span>

              <h3 className="mt-4 text-lg font-bold text-foreground">{insight.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{insight.reasoning}</p>
              <p className="mt-4 text-sm font-medium text-primary">{insight.estimatedSavings}</p>
              {insight.anomaly && <p className="mt-2 text-xs text-error">{insight.anomaly}</p>}
            </Card>
          ))}
        </section>
      )}

      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Reporting Period</p>
          <p className="mt-4 text-xl font-bold text-foreground">{analytics.dateRange?.min}</p>
          <p className="mt-1 text-xs text-slate-600">to {analytics.dateRange?.max}</p>
        </Card>

        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Primary Driver</p>
          <p className="mt-4 text-xl font-bold text-foreground">{analytics.highestSpendingService?.service ?? 'N/A'}</p>
          <p className="mt-1 text-xs font-medium text-accent">
            {currency.format(analytics.highestSpendingService?.cost ?? 0)}
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Cost Variance</p>
          <p className="mt-4 text-xl font-bold text-foreground">
            {(() => {
              const costs = analytics.dailyTrend.map((d) => d.cost);
              const avg = costs.reduce((a, b) => a + b, 0) / costs.length;
              const variance = costs.reduce((sum, cost) => sum + Math.pow(cost - avg, 2), 0) / costs.length;
              const stdDev = Math.sqrt(variance);
              const pct = ((stdDev / avg) * 100).toFixed(1);
              return `${pct}%`;
            })()}
          </p>
          <p className="mt-1 text-xs text-slate-600">Standard Deviation</p>
        </Card>
      </section>
    </div>
  );
}
