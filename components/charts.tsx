'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  ReferenceDot,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { CostAnomaly } from '@/lib/types';
import { currency } from '@/lib/utils';

const COLORS = ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1'];

const tooltipStyle = {
  backgroundColor: '#0F172A',
  border: 'none',
  borderRadius: '12px',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  padding: '12px 16px',
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div style={tooltipStyle}>
        <p className="text-xs font-medium text-slate-400">
          {payload[0].payload.date || payload[0].payload.service || payload[0].payload.name}
        </p>
        <p className="text-sm font-bold text-white mt-1">
          {currency.format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export function TrendLineChart({
  data,
  anomalies = [],
}: {
  data: { date: string; cost: number }[];
  anomalies?: CostAnomaly[];
}) {
  const anomalyDates = new Set(
    anomalies.filter((anomaly) => anomaly.scope === 'total').map((anomaly) => anomaly.date)
  );

  // Get anomaly data points for visualization
  const anomalyPoints = data.filter((d) => anomalyDates.has(d.date));

  return (
    <Card className="relative h-[400px] overflow-hidden p-0 border-0 shadow-lg">
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Cost Trends</p>
            <h3 className="mt-1 text-lg font-bold text-slate-900">Daily Cost Analysis</h3>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-slate-500 font-medium">Spend</span>
            </div>
            {anomalyPoints.length > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-slate-500 font-medium">Anomaly</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.25}/>
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="transparent"
            tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="transparent"
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="cost"
            stroke="#3B82F6"
            strokeWidth={2.5}
            fill="url(#costGradient)"
            dot={false}
            activeDot={{ r: 6, fill: '#2563EB', stroke: '#FFFFFF', strokeWidth: 3 }}
          />
          {/* Render anomaly dots */}
          {anomalyPoints.map((point) => (
            <ReferenceDot
              key={`anomaly-${point.date}`}
              x={point.date}
              y={point.cost}
              r={6}
              fill="#EF4444"
              stroke="#FFFFFF"
              strokeWidth={3}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function ServiceBarChart({ data }: { data: { service: string; cost: number }[] }) {
  return (
    <Card className="relative h-[440px] overflow-hidden p-0 border-0 shadow-lg">
      <div className="px-6 pt-6 pb-2">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Service Breakdown</p>
        <h3 className="mt-1 text-lg font-bold text-slate-900">Cost by Service</h3>
      </div>
      <ResponsiveContainer width="100%" height="82%">
        <BarChart data={data} margin={{ top: 10, right: 30, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="service"
            stroke="transparent"
            tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="transparent"
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="cost"
            radius={[8, 8, 4, 4]}
            animationDuration={800}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function DistributionPieChart({ data }: { data: { name: string; value: number }[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className="relative h-[440px] overflow-hidden p-0 border-0 shadow-lg">
      <div className="px-6 pt-6 pb-2">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Distribution</p>
        <h3 className="mt-1 text-lg font-bold text-slate-900">Cost Allocation</h3>
      </div>
      <div className="flex h-[calc(100%-80px)]">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={3}
                animationDuration={800}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-48 pr-6 flex flex-col justify-center space-y-2.5">
          {data.slice(0, 5).map((item, index) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-600 truncate">{item.name}</p>
              </div>
              <p className="text-xs font-bold text-slate-800 flex-shrink-0">
                {((item.value / total) * 100).toFixed(0)}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
