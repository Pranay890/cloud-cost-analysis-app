export type BillingRecord = {
  id?: string;
  date: string;
  service_name: string;
  cost: number;
  region?: string;
};

export type FilterState = {
  startDate?: string;
  endDate?: string;
  service?: string;
};

export type SummaryMetric = {
  label: string;
  value: string;
  helper: string;
  change?: number;
};

export type AiInsight = {
  title: string;
  reasoning: string;
  estimatedSavings: string;
  anomaly?: string;
  priority: 'High' | 'Medium' | 'Low';
};

export type Recommendation = {
  id: string;
  title: string;
  description: string;
  impact: string;
  icon: 'server' | 'moon' | 'database' | 'sparkles';
  severity: 'high' | 'medium' | 'low';
};

export type AnalyticsPayload = {
  records: BillingRecord[];
  totalCost: number;
  avgDailyCost: number;
  forecastCost: number;
  costChangePct: number;
  dailyTrend: { date: string; cost: number }[];
  serviceBreakdown: { service: string; cost: number }[];
  costDistribution: { name: string; value: number }[];
  topServices: { service: string; cost: number }[];
  weeklyTrend: { label: string; cost: number }[];
  highestSpendingService: { service: string; cost: number } | null;
  dateRange: { min: string; max: string } | null;
};
