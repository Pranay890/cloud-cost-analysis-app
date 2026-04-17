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
} from 'recharts';
import { Card } from '@/components/ui/card';
import { CostAnomaly } from '@/lib/types';
import { currency } from '@/lib/utils';

const COLORS = ['#2563EB', '#EF4444', '#16A34A', '#F59E0B', '#06B6D4', '#14B8A6', '#8B5CF6', '#38BDF8'];

const tooltipStyle = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E2E8F0',
  borderRadius: '12px',
  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.14)',
  padding: '12px 16px',
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div style={tooltipStyle}>
        <p className="text-sm font-semibold text-foreground">
          {payload[0].payload.date}
        </p>
        <p className="text-sm font-bold text-primary mt-1">
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

  return (
    <Card className="relative h-[380px] overflow-hidden p-6">
      <div className="pointer-events-none absolute inset-x-6 top-0 h-20 rounded-full bg-primary/5 blur-2xl" />
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Cost Trends</p>
        <h3 className="mt-1 text-lg font-bold text-foreground">Daily Cost Analysis</h3>
        <p className="text-sm text-slate-600">Monitor spending patterns and identify anomalies in real-time.</p>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#E2E8F0" vertical={false} strokeDasharray="5 5" />
          <XAxis
            dataKey="date"
            stroke="#94A3B8"
            tick={{ fontSize: 12, fill: '#64748B' }}
            axisLine={{ stroke: '#E2E8F0' }}
          />
          <YAxis
            stroke="#94A3B8"
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            tick={{ fontSize: 12, fill: '#64748B' }}
            axisLine={{ stroke: '#E2E8F0' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="cost"
            stroke="#2563EB"
            strokeWidth={2.5}
            fill="url(#costGradient)"
            dot={false}
            activeDot={{ r: 6, fill: '#1D4ED8', stroke: '#FFFFFF', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="cost"
            stroke="#2563EB"
            strokeWidth={2.5}
            dot={({ cx, cy, payload }) => {
              if (!payload?.date || !anomalyDates.has(payload.date)) {
                return <g key={`line-dot-${payload?.date ?? 'empty'}`} />;
              }

              return (
                <circle
                  key={`anomaly-dot-${payload.date}`}
                  cx={cx}
                  cy={cy}
                  r={6}
                  fill="#EF4444"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />
              );
            }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function ServiceBarChart({ data }: { data: { service: string; cost: number }[] }) {
  return (
    <Card className="relative h-[420px] overflow-hidden p-6">
      <div className="pointer-events-none absolute right-6 top-0 h-20 w-40 rounded-full bg-primary/5 blur-2xl" />
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Service Breakdown</p>
        <h3 className="mt-1 text-lg font-bold text-foreground">Cost by Service</h3>
        <p className="text-sm text-slate-600">Compare spending across cloud services and resources.</p>
      </div>
      <ResponsiveContainer width="100%" height="82%">
        <BarChart data={data} margin={{ top: 10, right: 30, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#E2E8F0" vertical={false} strokeDasharray="5 5" />
          <XAxis
            dataKey="service"
            stroke="#94A3B8"
            tick={{ fontSize: 12, fill: '#64748B' }}
            axisLine={{ stroke: '#E2E8F0' }}
          />
          <YAxis
            stroke="#94A3B8"
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            tick={{ fontSize: 12, fill: '#64748B' }}
            axisLine={{ stroke: '#E2E8F0' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="cost"
            radius={[12, 12, 4, 4]}
            fill="#6D5EF7"
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
  return (
    <Card className="relative h-[420px] overflow-hidden p-6">
      <div className="pointer-events-none absolute left-6 top-0 h-20 w-40 rounded-full bg-accent/5 blur-2xl" />
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Distribution</p>
        <h3 className="mt-1 text-lg font-bold text-foreground">Cost Allocation</h3>
        <p className="text-sm text-slate-600">Understand the proportion of costs across services.</p>
      </div>
      <ResponsiveContainer width="100%" height="82%">
        <PieChart margin={{ top: 0, right: 0, bottom: 50, left: 0 }}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={2}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ paddingTop: '10px' }}
            iconType="circle"
            formatter={(value: any) => <span style={{ color: '#64748B', fontSize: '12px' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

