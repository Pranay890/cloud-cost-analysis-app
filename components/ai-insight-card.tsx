import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AiInsight } from '@/lib/types';

export function AiInsightCard({ insight }: { insight: AiInsight }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
        <Badge>{insight.priority}</Badge>
      </div>
      <ul className="mt-4 space-y-3 text-sm text-slate-200">
        <li><span className="font-semibold text-white">Reasoning:</span> {insight.reasoning}</li>
        <li><span className="font-semibold text-white">Estimated savings:</span> {insight.estimatedSavings}</li>
        {insight.anomaly && <li><span className="font-semibold text-white">Anomaly watch:</span> {insight.anomaly}</li>}
      </ul>
    </Card>
  );
}
