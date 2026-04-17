import { AnalyticsPayload, BillingRecord, CostAnomaly } from '@/lib/types';

type CostPoint = { date: string; cost: number };

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

function weeklyBuckets(dailyTrend: CostPoint[]) {
  const buckets: { label: string; cost: number }[] = [];

  for (let index = 0; index < dailyTrend.length; index += 7) {
    const chunk = dailyTrend.slice(index, index + 7);
    const label = `${chunk[0]?.date ?? ''} to ${chunk[chunk.length - 1]?.date ?? ''}`;
    const cost = chunk.reduce((sum, item) => sum + item.cost, 0);
    buckets.push({ label, cost: Number(cost.toFixed(2)) });
  }

  return buckets;
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function stdDeviation(values: number[], mean: number) {
  if (values.length < 2) return 0;
  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function classifySeverity(deviationPct: number, zScore: number): CostAnomaly['severity'] {
  if (deviationPct >= 45 || zScore >= 2.8) return 'high';
  if (deviationPct >= 25 || zScore >= 2.1) return 'medium';
  return 'low';
}

function detectSeriesAnomalies(
  series: CostPoint[],
  scope: CostAnomaly['scope'],
  service?: string
) {
  const anomalies: CostAnomaly[] = [];
  const minHistory = 3;
  const historyWindow = 5;

  for (let index = minHistory; index < series.length; index += 1) {
    const point = series[index];
    const history = series.slice(Math.max(0, index - historyWindow), index).map((item) => item.cost);

    if (history.length < minHistory) continue;

    const expectedCost = average(history);
    const std = stdDeviation(history, expectedCost);
    const deviation = point.cost - expectedCost;
    const deviationPct = expectedCost > 0 ? (deviation / expectedCost) * 100 : 0;
    const zScore = std > 0 ? deviation / std : deviationPct > 30 ? 3 : 0;
    const absoluteGuardrail = Math.max(expectedCost * 0.18, 35);
    const threshold = expectedCost + Math.max(std * 1.75, absoluteGuardrail);

    if (point.cost <= threshold || deviationPct <= 15) continue;

    const severity = classifySeverity(deviationPct, zScore);
    const summary =
      scope === 'total'
        ? `Daily spend jumped ${deviationPct.toFixed(1)}% above the recent baseline.`
        : `${service} spend jumped ${deviationPct.toFixed(1)}% above its recent baseline.`;
    const probableCause =
      scope === 'total'
        ? 'Multiple services likely spiked together, which usually points to a release, workload expansion, or an unexpected usage surge.'
        : `${service} likely scaled unexpectedly or ran more on-demand capacity than usual.`;
    const recommendedAction =
      scope === 'total'
        ? 'Review the services contributing to this date, compare with the previous 5 days, and confirm whether the increase was planned.'
        : `Inspect ${service} usage for the flagged date, then validate rightsizing, scheduling, and discount coverage.`;

    anomalies.push({
      id: `${scope}-${service ?? 'all'}-${point.date}`,
      date: point.date,
      scope,
      service,
      observedCost: Number(point.cost.toFixed(2)),
      expectedCost: Number(expectedCost.toFixed(2)),
      deviation: Number(deviation.toFixed(2)),
      deviationPct: Number(deviationPct.toFixed(2)),
      zScore: Number(zScore.toFixed(2)),
      severity,
      summary,
      probableCause,
      recommendedAction,
    });
  }

  return anomalies;
}

function buildServiceTrendMap(records: BillingRecord[]) {
  const services = new Map<string, Map<string, number>>();

  for (const record of records) {
    const serviceSeries = services.get(record.service_name) ?? new Map<string, number>();
    serviceSeries.set(record.date, Number(((serviceSeries.get(record.date) ?? 0) + record.cost).toFixed(2)));
    services.set(record.service_name, serviceSeries);
  }

  return Array.from(services.entries()).map(([service, series]) => ({
    service,
    dailySeries: Array.from(series.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, cost]) => ({ date, cost })),
  }));
}

function detectAnomalies(records: BillingRecord[], dailyTrend: CostPoint[]) {
  const totalAnomalies = detectSeriesAnomalies(dailyTrend, 'total');
  const serviceAnomalies = buildServiceTrendMap(records)
    .flatMap(({ service, dailySeries }) => detectSeriesAnomalies(dailySeries, 'service', service))
    .filter((anomaly) => anomaly.deviation >= 20);

  return [...totalAnomalies, ...serviceAnomalies]
    .sort((a, b) => {
      const severityWeight = { high: 3, medium: 2, low: 1 };
      return (
        severityWeight[b.severity] - severityWeight[a.severity] ||
        b.deviation - a.deviation ||
        b.date.localeCompare(a.date)
      );
    })
    .slice(0, 6);
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
  const anomalies = detectAnomalies(records, dailyTrend);
  const highSeverityCount = anomalies.filter((anomaly) => anomaly.severity === 'high').length;
  const totalPotentialImpact = anomalies.reduce((sum, anomaly) => sum + anomaly.deviation, 0);

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
    anomalies,
    anomalySummary: {
      totalAnomalies: anomalies.length,
      highSeverityCount,
      totalPotentialImpact: Number(totalPotentialImpact.toFixed(2)),
      latestAnomalyDate: anomalies[0]?.date ?? null,
    },
  };
}
