import { ArrowDownRight, ArrowUpRight, TrendingUp, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { currency } from '@/lib/utils';

interface DailyMetricsProps {
  dailyTrend: { date: string; cost: number }[];
}

export function DailyMetrics({ dailyTrend }: DailyMetricsProps) {
  const costs = dailyTrend.map((d) => d.cost);

  const maxCost = Math.max(...costs);
  const minCost = Math.min(...costs);
  const avgCost = costs.reduce((a, b) => a + b, 0) / costs.length;

  const maxDate = dailyTrend.find((d) => d.cost === maxCost)?.date || '';
  const minDate = dailyTrend.find((d) => d.cost === minCost)?.date || '';

  const variance = costs.reduce((sum, cost) => sum + Math.pow(cost - avgCost, 2), 0) / costs.length;
  const volatility = Math.sqrt(variance);
  const volatilityValue = (volatility / avgCost) * 100;
  const volatilityPct = volatilityValue.toFixed(1);

  const recentAvg = costs.slice(-3).reduce((a, b) => a + b, 0) / Math.min(3, costs.length);
  const earlierAvg = costs.slice(0, 3).reduce((a, b) => a + b, 0) / Math.min(3, costs.length);
  const trendChange = ((recentAvg - earlierAvg) / earlierAvg) * 100;
  const isIncreasing = trendChange > 0;

  return (
    <Card className="flex flex-col overflow-hidden p-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Daily Metrics</p>
          <h3 className="mt-2 text-lg font-bold text-foreground">Performance Summary</h3>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <TrendingUp className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 hover:shadow-md transition-all">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Peak Spending</p>
          <p className="mt-3 text-2xl font-bold text-foreground">{currency.format(maxCost)}</p>
          <p className="mt-1 text-xs text-slate-600">{maxDate}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 hover:shadow-md transition-all">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Lowest Spending</p>
          <p className="mt-3 text-2xl font-bold text-foreground">{currency.format(minCost)}</p>
          <p className="mt-1 text-xs text-slate-600">{minDate}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 hover:shadow-md transition-all">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Daily Average</p>
          <p className="mt-3 text-2xl font-bold text-foreground">{currency.format(avgCost)}</p>
          <p className="mt-1 text-xs text-slate-600">Range: {currency.format(maxCost - minCost)}</p>
        </div>

        <div
          className={`rounded-lg border p-4 transition-all hover:shadow-md ${
            isIncreasing ? 'border-error/20 bg-error/5' : 'border-accent/20 bg-accent/5'
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Recent Trend</p>
          <div className="mt-3 flex items-center gap-2">
            {isIncreasing ? (
              <ArrowUpRight className="h-5 w-5 text-error" />
            ) : (
              <ArrowDownRight className="h-5 w-5 text-accent" />
            )}
            <p className={`text-2xl font-bold ${isIncreasing ? 'text-error' : 'text-accent'}`}>
              {Math.abs(trendChange).toFixed(1)}%
            </p>
          </div>
          <p className="mt-1 text-xs text-slate-600">vs earlier period</p>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-slate-200 bg-white px-5 py-4 hover:shadow-md transition-all">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-warning" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Cost Volatility</p>
        </div>
        <p className="mt-2 text-xl font-bold text-foreground">{volatilityPct}%</p>
        <p className="mt-1 text-xs text-slate-600">
          {volatilityValue > 20 ? 'High variability detected' : 'Spending patterns are stable'}
        </p>
      </div>
    </Card>
  );
}
