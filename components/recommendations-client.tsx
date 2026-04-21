'use client';

import { useEffect, useState } from 'react';
import { LayoutShell } from '@/components/layout-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Recommendation } from '@/lib/types';
import { Server, MoonStar, Database, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Activity, ShieldCheck, Zap } from 'lucide-react';

const iconMap = {
  server: Server,
  moon: MoonStar,
  database: Database,
  sparkles: Sparkles,
};

const severityConfig = {
  high: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'High Priority', badge: 'bg-red-100 text-red-800 border border-red-200' },
  medium: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Medium Priority', badge: 'bg-amber-100 text-amber-800 border border-amber-200' },
  low: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Low Priority', badge: 'bg-blue-100 text-blue-800 border border-blue-200' },
};

export function RecommendationsClient() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/recommendations', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setRecommendations(data.recommendations);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <LayoutShell>
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      </LayoutShell>
    );
  }

  const highPriorityCount = recommendations.filter(r => r.severity === 'high').length;
  // Mock logic for a health score based on the number of recommendations
  const healthScore = Math.max(0, 100 - (highPriorityCount * 15) - (recommendations.length * 5));

  return (
    <LayoutShell>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-blue-600 text-white shadow-sm rounded-xl">
            <Zap className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Optimization Advisor</h2>
        </div>
        <p className="text-slate-500 text-lg max-w-2xl ml-[3.25rem]">
          AI-driven recommendations to reduce waste, improve performance, and optimize your cloud infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content - Recommendation List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-slate-400" />
              Actionable Insights
              <span className="ml-2 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">{recommendations.length}</span>
            </h3>
            <div className="text-sm font-medium text-slate-500">Sorted by Priority</div>
          </div>

          <div className="space-y-4">
            {/* Sort by high to low */}
            {[...recommendations].sort((a, b) => {
              const order = { high: 0, medium: 1, low: 2 };
              return order[a.severity] - order[b.severity];
            }).map((rec) => {
              const Icon = iconMap[rec.icon] || Sparkles;
              const config = severityConfig[rec.severity];

              return (
                <Card key={rec.id} className="overflow-hidden transition-all duration-200 hover:shadow-md border border-slate-200 group">
                  <div className="flex flex-col sm:flex-row h-full">
                    <div className={`w-2 sm:w-1.5 flex-shrink-0 ${config.bg} border-r ${config.border}`} />
                    <div className="p-5 sm:p-6 flex-1 flex flex-col sm:flex-row gap-5 sm:items-start bg-white">
                      <div className={`p-3.5 rounded-xl flex-shrink-0 flex items-center justify-center ${config.bg} ${config.color} border ${config.border}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 w-full">
                        <div className="flex items-center mb-2">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-widest flex-shrink-0 ${config.badge}`}>
                            {config.label}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-700 transition-colors mb-2">
                          {rec.title}
                        </h4>
                        <p className="text-slate-600 text-sm leading-relaxed max-w-2xl mb-5">
                          {rec.description}
                        </p>
                        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            {rec.impact}
                          </p>
                          <Button variant="ghost" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 font-semibold px-4 transition-colors">
                            Review Action <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Sidebar - Health & Stats */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-7 border-slate-200 shadow-sm bg-gradient-to-b from-white to-slate-50/80">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-8 text-center">Infrastructure Health</h3>
            
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="relative">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle cx="80" cy="80" r="70" className="stroke-slate-100" strokeWidth="12" fill="none" />
                  <circle 
                    cx="80" cy="80" r="70" 
                    className={`stroke-current ${healthScore > 80 ? 'text-emerald-500' : healthScore > 50 ? 'text-amber-500' : 'text-red-500'}`} 
                    strokeWidth="12" fill="none" 
                    strokeDasharray={439.8} 
                    strokeDashoffset={439.8 - (439.8 * healthScore) / 100}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">{healthScore}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Score</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-200/60">
              <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" /> High Priority
                </span>
                <span className="font-bold text-slate-900 bg-red-100 text-red-700 px-2 py-0.5 rounded">{highPriorityCount}</span>
              </div>
              <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Active Policies
                </span>
                <span className="font-bold text-slate-900 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">12</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-slate-200 shadow-sm bg-white">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-5">Why Optimize?</h3>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <div className="mt-1 p-1.5 bg-blue-50 text-blue-600 rounded border border-blue-100 flex-shrink-0">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <span className="leading-relaxed pt-0.5">Applying these recommendations can prevent up to <strong className="text-slate-900">15%</strong> in monthly cost drift.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 p-1.5 bg-emerald-50 text-emerald-600 rounded border border-emerald-100 flex-shrink-0">
                  <Server className="h-3.5 w-3.5" />
                </div>
                <span className="leading-relaxed pt-0.5">Rightsizing ensures maximum application performance with <strong className="text-slate-900">zero idle waste</strong>.</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </LayoutShell>
  );
}
