'use client';

import { useCallback, useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { AnomalyCard } from '@/components/anomaly-card';
import { LayoutShell } from '@/components/layout-shell';
import { Skeleton } from '@/components/skeleton';
import { Card } from '@/components/ui/card';
import { AnalyticsPayload } from '@/lib/types';
import { currency } from '@/lib/utils';

export function AnomalyDetectionClient() {
  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);

      const response = await fetch(`/api/analytics?t=${Date.now()}`, { cache: 'no-store' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load analytics');
      }

      setAnalytics(data.analytics ?? null);
    } catch (error) {
      console.error(error);
      setAnalytics(null);
      setLoadError('Unable to load anomaly data right now. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  return (
    <LayoutShell>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-white via-card to-white p-6 shadow-card">
          <div className="absolute inset-y-0 right-0 w-[40%] bg-[radial-gradient(circle_at_top,rgba(0,82,204,0.08),transparent_58%)]" />
          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.28em] text-primary font-semibold">Anomaly Detection</p>
              <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-foreground">
                Flagged cost spikes worth investigating.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
                Each alert compares observed cost against a trailing baseline so the platform explains
                what changed, how big the deviation is, and what to inspect next.
              </p>
            </div>

            {analytics && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted font-semibold">High severity</p>
                  <p className="mt-3 text-3xl font-bold text-foreground">
                    {analytics.anomalySummary.highSeverityCount}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted font-semibold">Potential impact</p>
                  <p className="mt-3 text-3xl font-bold text-foreground">
                    {currency.format(analytics.anomalySummary.totalPotentialImpact)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {loading ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-[340px] w-full" />
            ))}
          </div>
        ) : loadError || !analytics ? (
          <Card className="p-6">
            <h3 className="text-xl font-bold text-foreground">Anomaly view unavailable</h3>
            <p className="mt-2 text-sm text-muted">
              {loadError ?? 'No analytics data is available yet.'}
            </p>
          </Card>
        ) : analytics.anomalies.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {analytics.anomalies.map((anomaly) => (
              <AnomalyCard key={anomaly.id} anomaly={anomaly} />
            ))}
          </div>
        ) : (
          <Card className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">No anomalies detected</h3>
              <p className="mt-2 text-sm text-muted">
                This dataset does not currently contain unusual spikes against the rolling baseline.
              </p>
            </div>
          </Card>
        )}
      </div>
    </LayoutShell>
  );
}
