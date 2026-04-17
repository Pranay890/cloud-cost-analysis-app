import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

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

  // Determine accent color based on title
  const getAccentColor = () => {
    if (title.includes('Anomal')) return '#EF4444';
    if (title.includes('Forecast') || title.includes('Avg')) return '#16A34A';
    return '#2563EB';
  };

  const accentColor = getAccentColor();

  return (
    <Card className="relative overflow-hidden p-6 group">
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: accentColor }} />
      <div className="pointer-events-none absolute inset-x-6 top-0 h-24 rounded-full bg-primary/5 blur-2xl" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</p>
          <h3 className="mt-4 text-4xl font-bold tracking-tight text-foreground">{value}</h3>
          <p className="mt-2 max-w-[24ch] text-sm leading-6 text-slate-600">{helper}</p>
        </div>
        {typeof change === 'number' && (
          <Badge className={positive ? 'border-accent/30 bg-accent/10 text-accent' : 'border-error/30 bg-error/10 text-error'}>
            {positive ? <ArrowDownRight className="mr-1 h-3 w-3" /> : <ArrowUpRight className="mr-1 h-3 w-3" />}
            {Math.abs(change).toFixed(1)}%
          </Badge>
        )}
      </div>
    </Card>
  );
}

