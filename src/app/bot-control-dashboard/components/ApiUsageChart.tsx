'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const data = [
  { model: 'Llama 3.3 70B', calls: 412 },
  { model: 'Mistral Large', calls: 287 },
  { model: 'Nemotron 70B', calls: 198 },
  { model: 'DeepSeek R1', calls: 156 },
  { model: 'Qwen 2.5 72B', calls: 124 },
  { model: 'Mixtral 8x7B', calls: 67 },
  { model: 'Gemma 3 27B', calls: 24 },
  { model: 'Llama 3.1 405B', calls: 16 },
];

const barColors = [
  'var(--primary)',
  'var(--accent)',
  '#a78bfa',
  '#38bdf8',
  '#fb923c',
  '#f472b6',
  '#34d399',
  '#fbbf24',
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2.5 shadow-xl text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      <p className="font-mono text-muted-foreground">{payload[0]?.value} API calls</p>
    </div>
  );
}

export default function ApiUsageChart() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-foreground">API Calls by Model</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Total 1,284 calls today</p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
          <XAxis type="number" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="model" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} tickLine={false} axisLine={false} width={90} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="calls" radius={[0, 4, 4, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-model-${index}`} fill={barColors[index % barColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}