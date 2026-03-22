'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { CsvUpload } from '@/components/csv-upload';
import { DistributionPieChart, ServiceBarChart, TrendLineChart } from '@/components/charts';
import { StatCard } from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/skeleton';
import { AnalyticsPayload, AiInsight } from '@/lib/types';
import { currency } from '@/lib/utils';

export function DashboardClient() {
  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  // ✅ FIXED: ARRAY TYPE
  const [aiInsights, setAiInsights] = useState<AiInsight[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    const response = await fetch('/api/analytics?t=' + Date.now(), { cache: 'no-store' });
    const data = await response.json();
    setAnalytics(data.analytics);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  // ✅ FIXED AI FUNCTION
  const generateInsights = async () => {
    if (!analytics) return;

    try {
      setLoadingAI(true);

      const res = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total_cost: analytics.totalCost,
          services: analytics.serviceBreakdown.map((s) => ({
            name: s.service,
            cost: s.cost,
          })),
        }),
      });

      const data = await res.json();
      setAiInsights(data.insights || []);
    } catch (err) {
      console.error(err);
      setAiInsights([]);
    } finally {
      setLoadingAI(false);
    }
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
        title: 'Change',
        value: `${analytics.costChangePct.toFixed(1)}%`,
        helper: 'Vs previous period',
        change: analytics.costChangePct,
      },
    ];
  }, [analytics]);

  if (loading || !analytics) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">Dashboard</h2>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={async () => {
              setResetting(true);
              await fetch('/api/reset', { method: 'POST' });
              await loadAnalytics();
              setResetting(false);
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {resetting ? 'Resetting...' : 'Reset Data'}
          </Button>

          <Button onClick={generateInsights}>
            <Sparkles className="mr-2 h-4 w-4" />
            {loadingAI ? 'Analyzing...' : 'Generate Insights'}
          </Button>
        </div>
      </div>

      {/* 🔥 FIXED AI UI */}
      {aiInsights.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {aiInsights.map((insight, index) => (
            <Card
              key={index}
              className="p-5 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all"
            >
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  insight.priority === 'High'
                    ? 'bg-red-500/20 text-red-300'
                    : insight.priority === 'Medium'
                    ? 'bg-yellow-500/20 text-yellow-300'
                    : 'bg-green-500/20 text-green-300'
                }`}
              >
                {insight.priority}
              </span>

              <h3 className="mt-3 text-lg font-semibold text-white">
                {insight.title}
              </h3>

              <p className="mt-2 text-sm text-muted">
                {insight.reasoning}
              </p>

              <p className="mt-2 text-sm text-blue-300">
                💰 {insight.estimatedSavings}
              </p>

              <p className="mt-2 text-xs text-red-300">
                ⚠ {insight.anomaly}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* CSV Upload */}
      <CsvUpload onUploaded={loadAnalytics} />

      {/* Stats */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      {/* Charts */}
      <section className="grid gap-4 xl:grid-cols-2">
        <TrendLineChart data={analytics.dailyTrend} />
        <ServiceBarChart data={analytics.serviceBreakdown} />
      </section>

      {/* Bottom */}
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <DistributionPieChart data={analytics.costDistribution} />

        <Card className="p-5">
          <h3 className="text-lg font-semibold text-white">
            Top expensive services
          </h3>

          <div className="mt-5 space-y-4">
            {analytics.topServices.map((service, index) => (
              <div
                key={service.service}
                className="flex items-center justify-between rounded-2xl border border-border px-4 py-3"
              >
                <div>
                  <p className="text-xs text-blue-400">#{index + 1}</p>
                  <p className="text-white">{service.service}</p>
                </div>
                <p className="font-semibold text-white">
                  {currency.format(service.cost)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>

    </div>
  );
}