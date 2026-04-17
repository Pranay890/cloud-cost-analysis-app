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
    <Card className="p-6 transition duration-200 hover:shadow-card-hover border-t-4 border-t-primary">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-3 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">{recommendation.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{recommendation.description}</p>
          </div>
        </div>
        <Badge className="capitalize border-primary/20 bg-primary/5 text-primary">{recommendation.severity}</Badge>
      </div>
      <p className="mt-4 text-sm font-medium text-accent">{recommendation.impact}</p>
    </Card>
  );
}
