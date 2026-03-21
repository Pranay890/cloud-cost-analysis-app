import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BillingRecord, FilterState, Recommendation } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

export const percentage = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1,
});

export function normalizeRecord(record: Record<string, unknown>): BillingRecord | null {
  const date = String(record.date ?? '').trim();
  const service_name = String(record.service_name ?? record.service ?? '').trim();
  const region = String(record.region ?? '').trim();
  const costValue = Number(record.cost ?? 0);

  if (!date || !service_name || Number.isNaN(costValue)) {
    return null;
  }

  return {
    date,
    service_name,
    cost: Number(costValue.toFixed(2)),
    region: region || undefined,
  };
}

export function filterRecords(records: BillingRecord[], filters?: FilterState) {
  return records.filter((record) => {
    if (filters?.startDate && record.date < filters.startDate) return false;
    if (filters?.endDate && record.date > filters.endDate) return false;
    if (
      filters?.service &&
      filters.service !== 'All Services' &&
      record.service_name !== filters.service
    ) {
      return false;
    }
    return true;
  });
}

export function buildRuleBasedRecommendations(records: BillingRecord[]): Recommendation[] {
  const totalCost = records.reduce((sum, record) => sum + record.cost, 0);
  const serviceTotals = records.reduce<Record<string, number>>((acc, record) => {
    acc[record.service_name] = (acc[record.service_name] ?? 0) + record.cost;
    return acc;
  }, {});

  const recommendations: Recommendation[] = [];
  const ec2Cost = Object.entries(serviceTotals)
    .filter(([name]) => /ec2|compute engine|virtual machines/i.test(name))
    .reduce((sum, [, cost]) => sum + cost, 0);
  const storageCost = Object.entries(serviceTotals)
    .filter(([name]) => /s3|storage|blob/i.test(name))
    .reduce((sum, [, cost]) => sum + cost, 0);
  const lowVolumeServices = Object.entries(serviceTotals).filter(([, cost]) => cost < totalCost * 0.03);

  if (totalCost > 0 && ec2Cost / totalCost > 0.4) {
    recommendations.push({
      id: 'reserved-instances',
      title: 'Shift steady compute workloads to Reserved Instances',
      description:
        'Compute-related spend is above 40% of total cloud cost. Reserved pricing or committed use discounts can reduce sustained VM workloads.',
      impact: 'Potential savings: 20% to 45% on baseline compute usage.',
      icon: 'server',
      severity: 'high',
    });
  }

  if (lowVolumeServices.length >= 4) {
    recommendations.push({
      id: 'idle-resources',
      title: 'Investigate idle and fragmented resources',
      description:
        'Several services have low but persistent cost footprints, which often signals idle instances, unattached disks, or underutilized environments.',
      impact: 'Potential savings: 10% to 18% by scheduling shutdowns and cleanup automation.',
      icon: 'moon',
      severity: 'medium',
    });
  }

  if (totalCost > 0 && storageCost / totalCost > 0.25) {
    recommendations.push({
      id: 'storage-lifecycle',
      title: 'Apply storage lifecycle policies',
      description:
        'Storage costs are materially high. Lifecycle management can move cold data to lower-cost tiers and clean stale snapshots.',
      impact: 'Potential savings: 15% to 35% on object and block storage.',
      icon: 'database',
      severity: 'medium',
    });
  }

  if (recommendations.length === 0 && totalCost > 0) {
    recommendations.push({
      id: 'baseline-governance',
      title: 'Maintain optimization momentum with governance checks',
      description:
        'Current cost mix looks balanced. Keep anomaly alerts, tagging hygiene, and rightsizing reviews to prevent silent spend growth.',
      impact: 'Protects savings and reduces future cost drift.',
      icon: 'sparkles',
      severity: 'low',
    });
  }

  return recommendations;
}
