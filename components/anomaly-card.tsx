'use client';

import { AlertTriangle, ArrowUpRight, ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { CostAnomaly } from '@/lib/types';
import { currency } from '@/lib/utils';

const severityStyles: Record<CostAnomaly['severity'], string> = {
  low: 'border-success/30 bg-success-light text-success',
  medium: 'border-warning/30 bg-warning-light text-warning',
  high: 'border-error/30 bg-error-light text-error',
};

export function AnomalyCard({ anomaly }: { anomaly: CostAnomaly }) {
  return (
    <Card className="relative overflow-hidden border-2 border-error/10 bg-white p-6 border-t-4 border-t-error">
      <div className="absolute inset-x-0 top-4 h-px bg-gradient-to-r from-transparent via-error/10 to-transparent" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
            {anomaly.scope === 'total' ? 'Portfolio Anomaly' : anomaly.service}
          </p>
          <h3 className="mt-3 text-lg font-bold text-foreground">{anomaly.summary}</h3>
        </div>

        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em] ${severityStyles[anomaly.severity]}`}
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          {anomaly.severity}
        </span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 hover:shadow-md transition-all">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-600 font-semibold">Observed</p>
          <p className="mt-2 text-xl font-bold text-foreground">{currency.format(anomaly.observedCost)}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 hover:shadow-md transition-all">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-600 font-semibold">Expected</p>
          <p className="mt-2 text-xl font-bold text-foreground">{currency.format(anomaly.expectedCost)}</p>
        </div>
        <div className="rounded-lg border border-error/20 bg-error/5 p-4 hover:shadow-md transition-all">
          <p className="text-xs uppercase tracking-[0.2em] text-error font-semibold">Deviation</p>
          <p className="mt-2 flex items-center gap-2 text-xl font-bold text-error">
            <ArrowUpRight className="h-4 w-4" />
            {currency.format(anomaly.deviation)}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm text-slate-600">
        <AlertTriangle className="h-4 w-4 text-error" />
        {anomaly.date} • {anomaly.deviationPct.toFixed(1)}% above baseline • z-score {anomaly.zScore.toFixed(1)}
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">{anomaly.probableCause}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{anomaly.recommendedAction}</p>
    </Card>
  );
}
