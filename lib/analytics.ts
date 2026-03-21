import { BillingRecord, AnalyticsPayload } from '@/lib/types';

function groupCostByDate(records: BillingRecord[]) {
  return Object.entries(
    records.reduce<Record<string, number>>((acc, record) => {
      acc[record.date] = (acc[record.date] ?? 0) + record.cost;
      return acc;
    }, {})
  )
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, cost]) => ({ date, cost: Number(cost.toFixed(2)) }));
}

function groupCostByService(records: BillingRecord[]) {
  return Object.entries(
    records.reduce<Record<string, number>>((acc, record) => {
      acc[record.service_name] = (acc[record.service_name] ?? 0) + record.cost;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .map(([service, cost]) => ({ service, cost: Number(cost.toFixed(2)) }));
}

function weeklyBuckets(dailyTrend: { date: string; cost: number }[]) {
  const buckets: { label: string; cost: number }[] = [];

  for (let index = 0; index < dailyTrend.length; index += 7) {
    const chunk = dailyTrend.slice(index, index + 7);
    const label = `${chunk[0]?.date ?? ''} → ${chunk[chunk.length - 1]?.date ?? ''}`;
    const cost = chunk.reduce((sum, item) => sum + item.cost, 0);
    buckets.push({ label, cost: Number(cost.toFixed(2)) });
  }

  return buckets;
}

export function buildAnalytics(records: BillingRecord[]): AnalyticsPayload {
  const totalCost = records.reduce((sum, record) => sum + record.cost, 0);
  const dailyTrend = groupCostByDate(records);
  const serviceBreakdown = groupCostByService(records);
  const avgDailyCost = dailyTrend.length ? totalCost / dailyTrend.length : 0;
  const movingAverageWindow = dailyTrend.slice(-3);
  const forecastCost = movingAverageWindow.length
    ? movingAverageWindow.reduce((sum, item) => sum + item.cost, 0) / movingAverageWindow.length
    : 0;
  const previousPeriod = dailyTrend.slice(0, Math.floor(dailyTrend.length / 2));
  const currentPeriod = dailyTrend.slice(Math.floor(dailyTrend.length / 2));
  const previousAvg = previousPeriod.length
    ? previousPeriod.reduce((sum, item) => sum + item.cost, 0) / previousPeriod.length
    : 0;
  const currentAvg = currentPeriod.length
    ? currentPeriod.reduce((sum, item) => sum + item.cost, 0) / currentPeriod.length
    : 0;
  const costChangePct = previousAvg ? ((currentAvg - previousAvg) / previousAvg) * 100 : 0;

  return {
    records,
    totalCost: Number(totalCost.toFixed(2)),
    avgDailyCost: Number(avgDailyCost.toFixed(2)),
    forecastCost: Number(forecastCost.toFixed(2)),
    costChangePct: Number(costChangePct.toFixed(2)),
    dailyTrend,
    serviceBreakdown,
    costDistribution: serviceBreakdown.map((item) => ({ name: item.service, value: item.cost })),
    topServices: serviceBreakdown.slice(0, 5),
    weeklyTrend: weeklyBuckets(dailyTrend),
    highestSpendingService: serviceBreakdown[0] ?? null,
    dateRange: dailyTrend.length
      ? { min: dailyTrend[0].date, max: dailyTrend[dailyTrend.length - 1].date }
      : null,
  };
}
