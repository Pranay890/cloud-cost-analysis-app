'use client';

import { useEffect, useState } from 'react';
import { BrainCircuit } from 'lucide-react';
import { AiInsightCard } from '@/components/ai-insight-card';
import { LayoutShell } from '@/components/layout-shell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AiInsight, AnalyticsPayload } from '@/lib/types';

export function GenAiClient() {
  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null);
  const [insights, setInsights] = useState<AiInsight[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/analytics', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => setAnalytics(data.analytics));
  }, []);

  const generateInsights = async () => {
    if (!analytics) return;
    setLoading(true);
    const response = await fetch('/api/ai-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        total_cost: analytics.totalCost,
        services: analytics.serviceBreakdown.map((item) => ({ name: item.service, cost: item.cost })),
      }),
    });

    const data = await response.json();
    setInsights(data.insights);
    setLoading(false);
  };

  return (
    <LayoutShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-blue-300">GenAI Optimization</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Generate FinOps guidance with OpenAI or Gemini-backed insights.</h2>
          </div>
          <Button onClick={generateInsights} disabled={loading || !analytics}>
            <BrainCircuit className="mr-2 h-4 w-4" />
            {loading ? 'Generating...' : 'Generate AI Insights'}
          </Button>
        </div>

        <Card className="p-5 text-sm text-muted">
          Structured usage is sent to the AI layer, which suggests optimizations, explains reasoning, estimates savings, and flags anomalies. If no AI key is configured, the app returns polished demo-safe fallback insights.
        </Card>

        <div className="grid gap-4 xl:grid-cols-3">
          {insights.map((insight) => (
            <AiInsightCard key={insight.title} insight={insight} />
          ))}
        </div>
      </div>
    </LayoutShell>
  );
}
