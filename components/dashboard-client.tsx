'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { 
  ArrowRight, 
  RefreshCw, 
  ShieldAlert, 
  Sparkles, 
  BarChart3, 
  CalendarDays, 
  Cpu,
  Layers,
  TrendingDown
} from 'lucide-react';
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
    <div className="space-y-8">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 px-8 py-8 shadow-md">
        {/* Decorative Elements */}
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-500/8 blur-3xl" />
        <div className="absolute -bottom-16 left-1/4 h-32 w-32 rounded-full bg-violet-500/6 blur-3xl" />
        <div className="absolute right-12 top-8 hidden h-24 w-24 rounded-full border border-blue-200/40 bg-blue-50/30 backdrop-blur-md lg:block" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 pb-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">Live Dashboard</p>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
              Cloud Cost Intelligence
            </h1>
            <p className="mt-2 text-slate-500 max-w-lg">Real-time insights into your multi-cloud spending patterns, anomaly detection, and optimization opportunities.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                <Layers className="h-3 w-3 mr-1.5" /> Multi-cloud
              </span>
              <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-red-700">
                <ShieldAlert className="h-3 w-3 mr-1.5" /> Anomaly alerts
              </span>
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                <Sparkles className="h-3 w-3 mr-1.5" /> AI-Powered
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end flex-shrink-0 w-full max-w-xs ml-auto mt-2 xl:mt-0">
            <div className="flex flex-col gap-3 w-full">
              <div className="flex gap-2 w-full">
                <Button variant="outline" onClick={clearData} className="flex items-center gap-2 flex-1 justify-center">
                  <RefreshCw className={`h-3.5 w-3.5 ${resetting ? 'animate-spin' : ''}`} />
                  <span className="text-xs">{resetting ? 'Clearing...' : 'Clear'}</span>
                </Button>
                <Button variant="outline" onClick={resetData} className="flex items-center gap-2 flex-1 justify-center">
                  <RefreshCw className={`h-3.5 w-3.5 ${resetting ? 'animate-spin' : ''}`} />
                  <span className="text-xs">{resetting ? 'Resetting...' : 'Reset'}</span>
                </Button>
              </div>
              <Button
                onClick={generateInsights}
                className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold w-full justify-center shadow-lg hover:shadow-xl"
                style={{ boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)' }}
              >
                <Sparkles className="h-4 w-4" />
                {loadingAI ? 'Analyzing...' : 'Generate AI Insights'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {loadError && (
        <Card className="border-red-200 bg-red-50 p-5 border-l-4 border-l-red-500">
          <p className="text-sm font-medium text-red-700">{loadError}</p>
        </Card>
      )}

      {/* Stat Cards */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      {/* Cost Trend Chart */}
      <section>
        <TrendLineChart data={analytics.dailyTrend} anomalies={analytics.anomalies} />
      </section>

      {/* Three-column row: Daily Metrics, Anomalies, Forecast */}
      <section className="grid gap-6 xl:grid-cols-3">
        <DailyMetrics dailyTrend={analytics.dailyTrend} />

        <Card className="flex flex-col overflow-hidden p-6 border-t-4 border-t-red-500">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Anomaly Posture</p>
              <h3 className="mt-2 text-lg font-bold text-slate-900">Detection Summary</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-red-600 border border-red-100">
              <ShieldAlert className="h-6 w-6" />
            </div>
          </div>

          <div className="mb-5 grid gap-4 sm:grid-cols-2">
            <div className="flex min-h-[100px] flex-col justify-center rounded-xl border border-red-100 bg-red-50 p-5 transition-all hover:shadow-md">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">High Severity</p>
              <p className="mt-2 text-4xl font-extrabold text-red-700">{analytics.anomalySummary.highSeverityCount}</p>
            </div>
            <div className="flex min-h-[100px] flex-col justify-center rounded-xl border border-amber-100 bg-amber-50 p-5 transition-all hover:shadow-md">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">Potential Impact</p>
              <p className="mt-2 text-2xl font-extrabold text-amber-700">
                {currency.format(analytics.anomalySummary.totalPotentialImpact)}
              </p>
            </div>
          </div>

          <div className="mb-5 space-y-3 flex-1">
            {analytics.anomalies.length > 0 ? (
              analytics.anomalies.slice(0, 2).map((anomaly) => (
                <div
                  key={anomaly.id}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition-all hover:shadow-md hover:border-red-200"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-slate-900">
                      {anomaly.scope === 'service' ? anomaly.service : 'Portfolio spend'}
                    </p>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-red-100 text-red-700">{anomaly.date}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">{anomaly.summary}</p>
                </div>
              ))
            ) : (
              <p className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-5 text-center text-sm text-slate-500">
                No anomalies are currently flagged for this dataset.
              </p>
            )}
          </div>

          <Link href="/anomaly-detection" className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 transition hover:text-blue-800 group">
            Open anomaly detection
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Card>

        <Card className="flex flex-col p-6 border-t-4 border-t-emerald-500">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Monthly Forecast</p>
              <h3 className="mt-2 text-lg font-bold text-slate-900">Projected Costs</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <TrendingDown className="h-6 w-6" />
            </div>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md transition-all">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Projected Monthly</p>
              <p className="mt-3 text-xl font-extrabold text-slate-900">
                {(() => {
                  const costs = analytics.dailyTrend.map((d) => d.cost);
                  const avg = costs.reduce((a, b) => a + b, 0) / costs.length;
                  return currency.format(avg * 30);
                })()}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md transition-all">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Daily Average</p>
              <p className="mt-3 text-xl font-extrabold text-emerald-700">{currency.format(analytics.avgDailyCost)}</p>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            <span className="text-slate-500">Based on historical trends</span>
          </p>
        </Card>
      </section>

      {/* Charts Row */}
      <section className="grid gap-6 xl:grid-cols-2">
        <DistributionPieChart data={analytics.costDistribution} />
        <ServiceBarChart data={analytics.serviceBreakdown} />
      </section>

      {/* AI Insights Section */}
      {aiInsights.length > 0 && (
        <section>
          <div className="mb-5 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">AI-Generated Insights</h3>
              <p className="text-xs text-slate-500">Powered by machine learning analysis</p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {aiInsights.map((insight, index) => (
              <Card key={index} className="relative overflow-hidden p-0 border-0 shadow-lg">
                <div className={`h-1.5 ${insight.priority === 'High'
                  ? 'bg-gradient-to-r from-red-500 to-rose-500'
                  : insight.priority === 'Medium'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  }`} />
                <div className="p-6">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${insight.priority === 'High'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : insight.priority === 'Medium'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                  >
                    {insight.priority} Priority
                  </span>

                  <h3 className="mt-4 text-lg font-bold text-slate-900">{insight.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">{insight.reasoning}</p>
                  <p className="mt-4 text-sm font-bold text-blue-600">{insight.estimatedSavings}</p>
                  {insight.anomaly && <p className="mt-2 text-xs text-red-600 font-medium">{insight.anomaly}</p>}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Bottom Info Row */}
      <section className="grid gap-5 xl:grid-cols-3">
        <Card className="relative overflow-hidden p-0 border-0 shadow-lg group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent pointer-events-none" />
          <div className="relative p-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="h-4 w-4 text-blue-500" />
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Reporting Period</p>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{analytics.dateRange?.min}</p>
            <p className="mt-1 text-sm text-slate-500">to {analytics.dateRange?.max}</p>
          </div>
        </Card>

        <Card className="relative overflow-hidden p-0 border-0 shadow-lg group">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-transparent pointer-events-none" />
          <div className="relative p-6">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="h-4 w-4 text-violet-500" />
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Primary Driver</p>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{analytics.highestSpendingService?.service ?? 'N/A'}</p>
            <p className="mt-1 text-sm font-bold text-violet-600">
              {currency.format(analytics.highestSpendingService?.cost ?? 0)}
            </p>
          </div>
        </Card>

        <Card className="relative overflow-hidden p-0 border-0 shadow-lg group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent pointer-events-none" />
          <div className="relative p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-amber-500" />
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Cost Variance</p>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">
              {(() => {
                const costs = analytics.dailyTrend.map((d) => d.cost);
                const avg = costs.reduce((a, b) => a + b, 0) / costs.length;
                const variance = costs.reduce((sum, cost) => sum + Math.pow(cost - avg, 2), 0) / costs.length;
                const stdDev = Math.sqrt(variance);
                const pct = ((stdDev / avg) * 100).toFixed(1);
                return `${pct}%`;
              })()}
            </p>
            <p className="mt-1 text-sm text-slate-500">Standard Deviation</p>
          </div>
        </Card>
      </section>
    </div>
  );
}
