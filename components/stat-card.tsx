import { ArrowDownRight, ArrowUpRight, DollarSign, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const iconMap: Record<string, React.ReactNode> = {
  'Total Cost': <DollarSign className="h-5 w-5" />,
  'Avg Daily Cost': <Activity className="h-5 w-5" />,
  'Forecast': <TrendingUp className="h-5 w-5" />,
  'Anomalies': <AlertTriangle className="h-5 w-5" />,
};

const accentMap: Record<string, { gradient: string; iconBg: string; iconColor: string; barColor: string }> = {
  'Total Cost': {
    gradient: 'from-blue-500/10 via-transparent to-transparent',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    barColor: 'bg-blue-600',
  },
  'Avg Daily Cost': {
    gradient: 'from-emerald-500/10 via-transparent to-transparent',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    barColor: 'bg-emerald-600',
  },
  'Forecast': {
    gradient: 'from-violet-500/10 via-transparent to-transparent',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    barColor: 'bg-violet-600',
  },
  'Anomalies': {
    gradient: 'from-red-500/10 via-transparent to-transparent',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    barColor: 'bg-red-600',
  },
};

export function StatCard({
  title,
  value,
  helper,
  change,
}: {
  title: string;
  value: string;
  helper: string;
  change?: number;
}) {
  const positive = (change ?? 0) <= 0;
  const accent = accentMap[title] || accentMap['Total Cost'];
  const icon = iconMap[title] || <DollarSign className="h-5 w-5" />;

  return (
    <Card className="relative overflow-hidden p-0 group hover:shadow-lg">
      <div className={`absolute inset-0 bg-gradient-to-br ${accent.gradient} pointer-events-none`} />
      <div className={`absolute inset-x-0 top-0 h-1 ${accent.barColor}`} />
      <div className="relative p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-4">
              <div className={`p-2 rounded-lg ${accent.iconBg} ${accent.iconColor}`}>
                {icon}
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{title}</p>
            </div>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900">{value}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{helper}</p>
          </div>
          {typeof change === 'number' && (
            <Badge className={`mt-1 ${positive ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
              {positive ? <ArrowDownRight className="mr-1 h-3 w-3" /> : <ArrowUpRight className="mr-1 h-3 w-3" />}
              {Math.abs(change).toFixed(1)}%
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
