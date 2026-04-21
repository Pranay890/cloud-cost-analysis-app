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
    <Card className="flex flex-col overflow-hidden p-6 border-t-4 border-t-blue-500">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Daily Metrics</p>
          <h3 className="mt-2 text-lg font-bold text-slate-900">Performance Summary</h3>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
          <TrendingUp className="h-6 w-6" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition-all">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Peak Spending</p>
          <p className="mt-2 text-xl font-extrabold text-slate-900">{currency.format(maxCost)}</p>
          <p className="mt-1 text-xs text-slate-400">{maxDate}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition-all">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Lowest Spending</p>
          <p className="mt-2 text-xl font-extrabold text-slate-900">{currency.format(minCost)}</p>
          <p className="mt-1 text-xs text-slate-400">{minDate}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition-all">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Daily Average</p>
          <p className="mt-2 text-xl font-extrabold text-slate-900">{currency.format(avgCost)}</p>
          <p className="mt-1 text-xs text-slate-400">Range: {currency.format(maxCost - minCost)}</p>
        </div>

        <div
          className={`rounded-xl border p-4 transition-all hover:shadow-md ${isIncreasing ? 'border-red-200 bg-red-50' : 'border-emerald-200 bg-emerald-50'
            }`}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Recent Trend</p>
          <div className="mt-2 flex items-center gap-1.5">
            {isIncreasing ? (
              <ArrowUpRight className="h-5 w-5 text-red-600" />
            ) : (
              <ArrowDownRight className="h-5 w-5 text-emerald-600" />
            )}
            <p className={`text-xl font-extrabold ${isIncreasing ? 'text-red-700' : 'text-emerald-700'}`}>
              {Math.abs(trendChange).toFixed(1)}%
            </p>
          </div>
          <p className="mt-1 text-xs text-slate-400">vs earlier period</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white px-5 py-4 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Cost Volatility</p>
          </div>
          <p className="text-xl font-extrabold text-slate-900">{volatilityPct}%</p>
        </div>
        <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${volatilityValue > 20 ? 'bg-red-500' : volatilityValue > 10 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            style={{ width: `${Math.min(volatilityValue * 2, 100)}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs text-slate-400">
          {volatilityValue > 20 ? 'High variability detected' : 'Spending patterns are stable'}
        </p>
      </div>
    </Card>
  );
}
