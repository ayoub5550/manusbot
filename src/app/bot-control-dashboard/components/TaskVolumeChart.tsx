'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { date: 'Apr 27', completed: 18, failed: 2, queued: 1 },
  { date: 'Apr 28', completed: 24, failed: 1, queued: 3 },
  { date: 'Apr 29', completed: 31, failed: 4, queued: 2 },
  { date: 'Apr 30', completed: 28, failed: 3, queued: 0 },
  { date: 'May 1', completed: 19, failed: 1, queued: 2 },
  { date: 'May 2', completed: 22, failed: 0, queued: 1 },
  { date: 'May 3', completed: 35, failed: 5, queued: 4 },
  { date: 'May 4', completed: 41, failed: 2, queued: 2 },
  { date: 'May 5', completed: 38, failed: 3, queued: 1 },
  { date: 'May 6', completed: 52, failed: 1, queued: 3 },
  { date: 'May 7', completed: 44, failed: 6, queued: 2 },
  { date: 'May 8', completed: 29, failed: 2, queued: 0 },
  { date: 'May 9', completed: 36, failed: 1, queued: 2 },
  { date: 'May 10', completed: 44, failed: 3, queued: 2 },
];

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2.5 shadow-xl text-xs">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((p) => (
        <div key={`tooltip-${p.name}`} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-muted-foreground capitalize">{p.name}</span>
          </div>
          <span className="font-mono font-semibold text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function TaskVolumeChart() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Task Volume — Last 14 Days</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Daily completed, failed, and queued tasks</p>
        </div>
        <div className="flex items-center gap-3 text-2xs font-mono">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary" />completed</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-danger" />failed</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradFailed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--danger)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="completed" stroke="var(--primary)" strokeWidth={2} fill="url(#gradCompleted)" name="completed" />
          <Area type="monotone" dataKey="failed" stroke="var(--danger)" strokeWidth={2} fill="url(#gradFailed)" name="failed" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}