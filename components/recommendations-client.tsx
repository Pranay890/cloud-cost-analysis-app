'use client';

import { useEffect, useState } from 'react';
import { LayoutShell } from '@/components/layout-shell';
import { RecommendationCard } from '@/components/recommendation-card';
import { Card } from '@/components/ui/card';
import { Recommendation } from '@/lib/types';

export function RecommendationsClient() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    fetch('/api/recommendations', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => setRecommendations(data.recommendations));
  }, []);

  return (
    <LayoutShell>
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-blue-300">Recommendations</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Rule-based optimization actions built for quick wins.</h2>
        </div>
        <Card className="p-5 text-sm text-muted">
          Recommendation logic covers compute commitment opportunities, idle-resource cleanup, storage lifecycle tuning, and governance fallback guidance.
        </Card>
        <div className="grid gap-4 xl:grid-cols-2">
          {recommendations.map((recommendation) => (
            <RecommendationCard key={recommendation.id} recommendation={recommendation} />
          ))}
        </div>
      </div>
    </LayoutShell>
  );
}
