'use client';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useEffect, useState } from 'react';
import { Download, FileText, TrendingUp, TrendingDown, AlertCircle, Calendar, Loader2 } from 'lucide-react';
import { LayoutShell } from '@/components/layout-shell';
import { Button } from '@/components/ui/button';
import { AnalyticsPayload } from '@/lib/types';
import { currency } from '@/lib/utils';

export function ReportsClient() {
  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetch('/api/analytics?t=' + Date.now(), { cache: 'no-store' }) // force fresh data
      .then((res) => res.json())
      .then((data) => setAnalytics(data.analytics));
  }, []);

  const exportPdf = async () => {
    if (!analytics) return;
    setIsExporting(true);

    try {
      const element = document.getElementById('report-document');
      if (!element) return;

      const canvas = await html2canvas(element, { 
        scale: 2, // High resolution
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [element.offsetWidth, element.offsetHeight]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, element.offsetWidth, element.offsetHeight);
      pdf.save(`Cloud-Cost-Executive-Report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!analytics) {
    return (
      <LayoutShell>
        <div className="flex flex-col items-center justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-800" />
          <p className="mt-4 text-slate-500 font-medium">Compiling Report Document...</p>
        </div>
      </LayoutShell>
    );
  }

  const isIncrease = analytics.costChangePct > 0;

  return (
    <LayoutShell>
      <div className="flex justify-between items-end mb-8 max-w-5xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Report Generator</h2>
          <p className="text-slate-500 text-sm mt-1">Formal document view of your cloud expenditure</p>
        </div>
        <Button 
          onClick={exportPdf} 
          disabled={isExporting}
          className="bg-slate-900 hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed text-white shadow-md transition-all px-5 py-2.5 rounded-lg flex items-center font-semibold"
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {isExporting ? 'Generating PDF...' : 'Download as PDF'}
        </Button>
      </div>

      {/* Document / Folio Container */}
      <div id="report-document" className="max-w-5xl mx-auto bg-white shadow-[0_15px_50px_-12px_rgba(0,0,0,0.12)] border border-slate-200 rounded-sm overflow-hidden mb-12">
        
        {/* Document Header */}
        <div className="bg-slate-950 px-10 py-10 text-white border-b-[6px] border-slate-700">
          <div className="flex items-center gap-3 mb-5 opacity-80">
            <FileText className="h-5 w-5" />
            <span className="text-sm font-bold tracking-[0.25em] uppercase">Executive Folio</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4 text-white">
            Cloud Operations &<br />Financial Report
          </h1>
          <div className="flex items-center gap-8 text-sm text-slate-300 mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="font-medium tracking-wide">GENERATED: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}</span>
            </div>
            <div className="font-medium tracking-wide">
              <span>PERIOD: CURRENT MONTH</span>
            </div>
          </div>
        </div>

        {/* Document Body */}
        <div className="p-10 md:p-14 space-y-12">

          {/* Section 1: Narrative Summary */}
          <section>
            <h3 className="text-2xl font-serif font-bold text-slate-900 border-b-2 border-slate-900 pb-3 mb-5 uppercase tracking-widest">
              I. Executive Overview
            </h3>
            <p className="text-xl text-slate-800 leading-loose text-justify font-serif">
              During the current billing period, total cloud infrastructure expenditure reached <strong className="text-black">{currency.format(analytics.totalCost)}</strong>. 
              This represents a <strong className={isIncrease ? "text-red-700" : "text-green-700"}>
                {Math.abs(analytics.costChangePct)}% {isIncrease ? "increase" : "decrease"}
              </strong> compared to the previous period. 
              Based on current consumption rates, the forecasted end-of-month spend is projected to be <strong className="text-black">{currency.format(analytics.forecastCost)}</strong>.
              The daily burn rate currently averages <strong className="text-black">{currency.format(analytics.avgDailyCost)}</strong>. 
              Overall financial health indicates that active monitoring and continuous optimization efforts must be maintained to align with budgetary constraints.
            </p>
          </section>

          {/* Section 2: Key Financial Metrics (Tabular) */}
          <section>
            <h3 className="text-2xl font-serif font-bold text-slate-900 border-b-2 border-slate-900 pb-3 mb-6 uppercase tracking-widest">
              II. Financial Highlights
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1.5">
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Total Spend</p>
                <p className="text-2xl lg:text-3xl font-bold text-slate-900 font-sans tracking-tight">{currency.format(analytics.totalCost)}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Forecasted</p>
                <p className="text-2xl lg:text-3xl font-bold text-slate-900 font-sans tracking-tight">{currency.format(analytics.forecastCost)}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Daily Average</p>
                <p className="text-2xl lg:text-3xl font-bold text-slate-900 font-sans tracking-tight">{currency.format(analytics.avgDailyCost)}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">MoM Variance</p>
                <div className={`flex items-center gap-1 text-2xl lg:text-3xl font-bold font-sans tracking-tight ${isIncrease ? 'text-red-700' : 'text-green-700'}`}>
                  {isIncrease ? <TrendingUp className="h-6 w-6 stroke-[3]" /> : <TrendingDown className="h-6 w-6 stroke-[3]" />}
                  {Math.abs(analytics.costChangePct)}%
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Cost Center Breakdown (Formal Table) */}
          <section>
            <h3 className="text-2xl font-serif font-bold text-slate-900 border-b-2 border-slate-900 pb-3 mb-6 uppercase tracking-widest">
              III. Top Cost Centers
            </h3>
            <div className="overflow-hidden border border-slate-300">
              <table className="w-full text-left text-base">
                <thead className="bg-slate-100 border-b-2 border-slate-300">
                  <tr>
                    <th className="px-6 py-3 font-bold text-slate-800 uppercase tracking-wider text-sm">Service Name</th>
                    <th className="px-6 py-3 font-bold text-slate-800 uppercase tracking-wider text-sm text-right">Total Cost</th>
                    <th className="px-6 py-3 font-bold text-slate-800 uppercase tracking-wider text-sm text-right">% of Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {analytics.topServices.slice(0, 8).map((item) => {
                    const percentage = ((item.cost / analytics.totalCost) * 100).toFixed(1);
                    return (
                      <tr key={item.service} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3.5 font-semibold text-slate-900">{item.service}</td>
                        <td className="px-6 py-3.5 text-right text-slate-800 font-sans tracking-tight font-medium">{currency.format(item.cost)}</td>
                        <td className="px-6 py-3.5 text-right text-slate-600 font-medium">
                          <div className="flex items-center justify-end gap-4">
                            <span className="w-12 text-right">{percentage}%</span>
                            <div className="w-20 h-2 bg-slate-200 rounded-sm overflow-hidden hidden sm:block">
                              <div 
                                className="h-full bg-slate-700" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {analytics.highestSpendingService && (
              <p className="mt-4 text-sm text-slate-600 font-serif italic text-justify">
                * Note: <strong className="text-slate-900">{analytics.highestSpendingService.service}</strong> remains the primary cost driver, representing the largest portion of the infrastructure bill. It is recommended to perform a detailed utilization review on this service.
              </p>
            )}
          </section>

          {/* Section 4: Incident & Anomaly Log */}
          <section>
            <h3 className="text-2xl font-serif font-bold text-slate-900 border-b-2 border-slate-900 pb-3 mb-6 uppercase tracking-widest">
              IV. Incident & Anomaly Log
            </h3>
            {analytics.anomalies.length > 0 ? (
              <div className="space-y-5">
                <p className="text-lg text-slate-800 font-serif leading-loose text-justify mb-5">
                  The system detected <strong className="text-red-700 text-xl">{analytics.anomalySummary.totalAnomalies}</strong> potential billing anomalies during this period. The following high-priority incidents require immediate technical review.
                </p>
                {analytics.anomalies.slice(0, 5).map((anomaly) => (
                  <div key={anomaly.id} className="flex gap-4 p-5 border-l-4 border-red-700 bg-red-50/30">
                    <AlertCircle className="h-6 w-6 text-red-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-bold text-red-800">{anomaly.summary}</span>
                        <span className="text-xs px-2.5 py-0.5 bg-red-100 text-red-800 font-bold tracking-widest uppercase border border-red-200">
                          {anomaly.severity} SEVERITY
                        </span>
                      </div>
                      <p className="text-base text-slate-800 font-serif leading-relaxed mb-3">
                        Observed cost of <strong className="text-red-700 font-sans text-lg">{currency.format(anomaly.observedCost)}</strong> against expected <strong className="text-slate-900 font-sans text-lg">{currency.format(anomaly.expectedCost)}</strong> (<strong className="text-red-700">{anomaly.deviationPct}% deviation</strong>).
                      </p>
                      <p className="text-base text-slate-800 font-medium">
                        <strong className="text-slate-900 uppercase tracking-wide text-sm">Action Required:</strong> {anomaly.recommendedAction}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 border-l-4 border-slate-300 bg-slate-50 text-slate-700 text-lg font-serif italic text-justify">
                No significant cost anomalies were detected during this billing period. Spending patterns are stable and align with historical expectations.
              </div>
            )}
          </section>

        </div>
        
        {/* Document Footer */}
        <div className="bg-slate-100 px-10 py-6 border-t-2 border-slate-300 flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
          <span>Confidential</span>
          <span>For Internal Review Only</span>
        </div>
      </div>
    </LayoutShell>
  );
}