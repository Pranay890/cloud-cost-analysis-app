import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

  return (
    <Card className="p-5 transition duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{title}</p>
          <h3 className="mt-3 text-3xl font-semibold text-white">{value}</h3>
          <p className="mt-2 text-sm text-muted">{helper}</p>
        </div>
        {typeof change === 'number' && (
          <Badge className={positive ? 'text-emerald-200 bg-emerald-500/10 border-emerald-400/20' : 'text-rose-200 bg-rose-500/10 border-rose-400/20'}>
            {positive ? <ArrowDownRight className="mr-1 h-3 w-3" /> : <ArrowUpRight className="mr-1 h-3 w-3" />}
            {Math.abs(change).toFixed(1)}%
          </Badge>
        )}
      </div>
    </Card>
  );
}
