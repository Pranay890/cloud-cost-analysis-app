import { Database, MoonStar, Server, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Recommendation } from '@/lib/types';

const iconMap = {
  server: Server,
  moon: MoonStar,
  database: Database,
  sparkles: Sparkles,
};

export function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const Icon = iconMap[recommendation.icon];

  return (
    <Card className="p-5 transition duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-200">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{recommendation.title}</h3>
            <p className="mt-1 text-sm text-muted">{recommendation.description}</p>
          </div>
        </div>
        <Badge className="capitalize">{recommendation.severity}</Badge>
      </div>
      <p className="mt-4 text-sm font-medium text-emerald-200">{recommendation.impact}</p>
    </Card>
  );
}
