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
} from 'recharts';
import { Card } from '@/components/ui/card';
import { currency } from '@/lib/utils';

const COLORS = ['#60a5fa', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#14b8a6'];

export function TrendLineChart({ data }: { data: { date: string; cost: number }[] }) {
  return (
    <Card className="h-[360px] p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Daily Cost Trend</h3>
        <p className="text-sm text-muted">Track daily billing patterns and usage spikes.</p>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid stroke="#1f2940" vertical={false} />
          <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
          <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value}`} />
          <Tooltip formatter={(value: number) => currency.format(value)} />
          <Legend />
          <Line type="monotone" dataKey="cost" stroke="#60a5fa" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function ServiceBarChart({ data }: { data: { service: string; cost: number }[] }) {
  return (
    <Card className="h-[360px] p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Service-wise Cost</h3>
        <p className="text-sm text-muted">Compare cost contribution by cloud product.</p>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid stroke="#1f2940" vertical={false} />
          <XAxis dataKey="service" stroke="#94a3b8" tick={{ fontSize: 12 }} />
          <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value}`} />
          <Tooltip formatter={(value: number) => currency.format(value)} />
          <Bar dataKey="cost" radius={[12, 12, 0, 0]} fill="#8b5cf6" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function DistributionPieChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <Card className="h-[360px] p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Cost Distribution</h3>
        <p className="text-sm text-muted">Understand how cost is split across services.</p>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={3}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => currency.format(value)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
