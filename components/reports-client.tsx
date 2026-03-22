'use client';

import jsPDF from 'jspdf';
import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { LayoutShell } from '@/components/layout-shell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AnalyticsPayload } from '@/lib/types';
import { currency } from '@/lib/utils';

export function ReportsClient() {
  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null);

  useEffect(() => {
    fetch('/api/analytics?t=' + Date.now(), { cache: 'no-store' }) // ✅ force fresh data
      .then((res) => res.json())
      .then((data) => setAnalytics(data.analytics));
  }, []);

  const exportPdf = () => {
    if (!analytics) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Cloud Cost Report Summary', 14, 20);

    doc.setFontSize(12);
    doc.text(`Total monthly cost: ${currency.format(analytics.totalCost)}`, 14, 35);
    doc.text(
      `Highest spending service: ${
        analytics.highestSpendingService?.service ?? 'N/A'
      }`,
      14,
      45
    );

    doc.text('Weekly trends:', 14, 60);

    analytics.weeklyTrend.forEach((item, index) => {
      doc.text(
        `- ${item.label}: ${currency.format(item.cost)}`,
        18,
        72 + index * 10
      );
    });

    doc.save('cloud-cost-report.pdf');
  };

  return (
    <LayoutShell>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-blue-300">
              Reports
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white">
              Executive-ready cost summaries for reviews and presentations.
            </h2>
          </div>

          <Button onClick={exportPdf}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>

        {/* Cards */}
        {analytics && (
          <div className="grid gap-6 xl:grid-cols-3">

            {/* Total Cost */}
            <Card className="p-6 flex flex-col justify-between hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all">
              <div>
                <p className="text-sm text-muted">Total monthly cost</p>
                <h3 className="mt-4 text-4xl font-bold text-white">
                  {currency.format(analytics.totalCost)}
                </h3>
              </div>
            </Card>

            {/* Highest Service */}
            <Card className="p-6 flex flex-col justify-between hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all">
              <div>
                <p className="text-sm text-muted">
                  Highest spending service
                </p>

                <h3 className="mt-6 text-4xl font-bold text-white">
                  {analytics.highestSpendingService?.service ?? 'N/A'}
                </h3>

                <p className="mt-2 text-lg text-blue-300">
                  {currency.format(
                    analytics.highestSpendingService?.cost ?? 0
                  )}
                </p>
              </div>
            </Card>

            {/* Weekly Trend (Scrollable) */}
            <Card className="p-6 flex flex-col hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all">
              <p className="text-sm text-muted">Weekly trend overview</p>

              <div className="mt-4 space-y-3 max-h-[260px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-500/30 hover:scrollbar-thumb-blue-500/60">
                {analytics.weeklyTrend.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm"
                  >
                    <span className="text-muted">{item.label}</span>
                    <span className="font-semibold text-white">
                      {currency.format(item.cost)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        )}
      </div>
    </LayoutShell>
  );
}