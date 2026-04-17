import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AiInsight } from '@/lib/types';

export function AiInsightCard({ insight }: { insight: AiInsight }) {
  return (
    <Card className="p-6 border-t-4 border-t-primary">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-foreground">{insight.title}</h3>
        <Badge
          className={`capitalize ${
            insight.priority === 'High'
              ? 'border-error/20 bg-error/5 text-error'
              : insight.priority === 'Medium'
                ? 'border-warning/20 bg-warning/5 text-warning'
                : 'border-success/20 bg-success/5 text-success'
          }`}
        >
          {insight.priority}
        </Badge>
      </div>
      <ul className="mt-5 space-y-3 text-sm text-slate-600">
        <li><span className="font-semibold text-foreground">Reasoning:</span> {insight.reasoning}</li>
        <li><span className="font-semibold text-foreground">Estimated savings:</span> {insight.estimatedSavings}</li>
        {insight.anomaly && <li><span className="font-semibold text-foreground">Anomaly watch:</span> {insight.anomaly}</li>}
      </ul>
    </Card>
  );
}

