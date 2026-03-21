'use client';

import { useEffect, useMemo, useState } from 'react';
import { LayoutShell } from '@/components/layout-shell';
import { FilterBar } from '@/components/filter-bar';
import { ServiceBarChart, TrendLineChart } from '@/components/charts';
import { Card } from '@/components/ui/card';
import { AnalyticsPayload, FilterState } from '@/lib/types';
import { currency } from '@/lib/utils';

export function CostAnalysisClient() {
  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null);
  const [filters, setFilters] = useState<FilterState>({ service: 'All Services' });

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);
    if (filters.service && filters.service !== 'All Services') params.set('service', filters.service);

    fetch(`/api/analytics?${params.toString()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => setAnalytics(data.analytics));
  }, [filters]);

  const services = useMemo(() => {
    return Array.from(new Set(analytics?.records.map((record) => record.service_name) ?? [])).sort();
  }, [analytics]);

  return (
    <LayoutShell>
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-blue-300">Cost Analysis</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Deep dive into service and time-based cloud spend.</h2>
        </div>

        <FilterBar
          filters={filters}
          services={services}
          onChange={setFilters}
          onReset={() => setFilters({ service: 'All Services' })}
        />

        {analytics && (
          <>
            <div className="grid gap-4 xl:grid-cols-2">
              <TrendLineChart data={analytics.dailyTrend} />
              <ServiceBarChart data={analytics.serviceBreakdown} />
            </div>

            <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
              <Card className="p-5">
                <h3 className="text-lg font-semibold text-white">Top 5 expensive services</h3>
                <div className="mt-4 space-y-3">
                  {analytics.topServices.map((item, index) => (
                    <div key={item.service} className="flex items-center justify-between rounded-2xl border border-border px-4 py-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-blue-300">#{index + 1}</p>
                        <p className="mt-1 text-white">{item.service}</p>
                      </div>
                      <p className="font-semibold text-white">{currency.format(item.cost)}</p>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-5">
                <h3 className="text-lg font-semibold text-white">Cost by date</h3>
                <div className="mt-4 space-y-3">
                  {analytics.dailyTrend.map((item) => (
                    <div key={item.date} className="flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm">
                      <span className="text-muted">{item.date}</span>
                      <span className="font-semibold text-white">{currency.format(item.cost)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </LayoutShell>
  );
}
