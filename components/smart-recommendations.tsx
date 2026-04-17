import { Lightbulb, Target, TrendingDown, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { currency } from '@/lib/utils';

interface SmartRecommendationsProps {
  dailyTrend: { date: string; cost: number }[];
  anomalies: any[];
  serviceBreakdown: { service: string; cost: number }[];
}

export function SmartRecommendations({
  dailyTrend,
  anomalies,
  serviceBreakdown,
}: SmartRecommendationsProps) {
  // Calculate projected monthly cost
  const dailyCosts = dailyTrend.map((d) => d.cost);
  const avgDailyCost =
    dailyCosts.reduce((a, b) => a + b, 0) / dailyCosts.length;
  const projectedMonthly = avgDailyCost * 30;

  // Calculate potential savings from top service
  const topService = serviceBreakdown[0];
  const potentialSavings = topService ? topService.cost * 0.15 : 0; // 15% reduction potential

  // Calculate efficiency score (0-100)
  const anomalyFactor = anomalies.length > 5 ? 20 : anomalies.length > 2 ? 10 : 0;
  const volatilityFactor = (() => {
    const avg = avgDailyCost;
    const variance =
      dailyCosts.reduce((sum, cost) => sum + Math.pow(cost - avg, 2), 0) /
      dailyCosts.length;
    const stdDev = Math.sqrt(variance);
    const pct = (stdDev / avg) * 100;
    return pct > 25 ? 25 : pct > 15 ? 15 : 5;
  })();

  const efficiencyScore = Math.max(
    0,
    100 - anomalyFactor - volatilityFactor
  );

  // Scorecard color and message
  const getScoreStatus = (score: number) => {
    if (score >= 85) return { color: 'emerald', label: 'Excellent', emoji: '🚀' };
    if (score >= 70) return { color: 'amber', label: 'Good', emoji: '✅' };
    if (score >= 50) return { color: 'orange', label: 'Fair', emoji: '⚠️' };
    return { color: 'rose', label: 'Review needed', emoji: '🔴' };
  };

  const scoreStatus = getScoreStatus(efficiencyScore);
  const colorMap = {
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-300' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-300' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-300' },
    rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-300' },
  };

  const colors = colorMap[scoreStatus.color as keyof typeof colorMap];

  return (
    <div className="space-y-4">
      {/* Efficiency Score Card */}
      <Card
        className={`border ${colors.border} ${colors.bg} p-5 overflow-hidden relative`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/5 to-transparent rounded-full blur-2xl" />
        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Cost efficiency score
            </p>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-4xl font-bold text-foreground">{efficiencyScore}</span>
              <span className={`text-sm font-semibold ${colors.text}`}>
                / 100 {scoreStatus.emoji}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Status: <span className={colors.text}>{scoreStatus.label}</span>
            </p>
          </div>
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-full border-2 ${colors.border} ${colors.bg}`}
          >
            <div className="text-center">
              <Zap className={`h-8 w-8 mx-auto ${colors.text}`} />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2 w-full bg-border rounded-full overflow-hidden">
          <div
            className={`h-full bg-primary rounded-full transition-all duration-500`}
            style={{ width: `${efficiencyScore}%` }}
          />
        </div>
      </Card>

      {/* Quick Opportunities */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-warning" />
          <h4 className="text-sm uppercase tracking-[0.24em] text-muted font-semibold">
            Optimization opportunity
          </h4>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-primary/20 bg-primary-light p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Minimize {topService?.service || 'top services'}
                </p>
                <p className="mt-1 text-xs text-muted">
                  Represents {((topService?.cost || 0) / (dailyTrend.reduce((sum, d) => sum + d.cost, 0) / dailyTrend.length / 30) * 100).toFixed(0)}% of monthly spend
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-primary font-semibold">Est. savings</p>
                <p className="text-lg font-bold text-primary">
                  {currency.format(potentialSavings)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-success/20 bg-success-light p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Control cost spikes</p>
                <p className="mt-1 text-xs text-muted">
                  Set alerts for deviations beyond daily average
                </p>
              </div>
              <Target className="h-5 w-5 text-success flex-shrink-0" />
            </div>
          </div>
        </div>
      </Card>

      {/* Forecast Card */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="h-5 w-5 text-primary" />
          <h4 className="text-sm uppercase tracking-[0.24em] text-muted font-semibold">
            Monthly forecast
          </h4>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-xs text-muted font-medium">Projected monthly</p>
            <p className="mt-2 text-xl font-bold text-foreground">
              {currency.format(projectedMonthly)}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-xs text-muted font-medium">Daily average</p>
            <p className="mt-2 text-xl font-bold text-accent">
              {currency.format(avgDailyCost)}
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted">
          💡 <span className="text-muted/70">Based on last 60 days of spending patterns</span>
        </p>
      </Card>
    </div>
  );
}
