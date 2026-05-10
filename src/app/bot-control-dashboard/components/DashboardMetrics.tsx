'use client';

import {
  Wifi,
  CheckCircle2,
  XCircle,
  Zap,
  Clock,
  Activity,
  Cpu,
  ListOrdered,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  trend?: { value: string; up: boolean };
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'accent';
  featured?: boolean;
  alert?: boolean;
}

function MetricCard({ title, value, subtitle, icon: Icon, trend, variant = 'default', featured = false, alert = false }: MetricCardProps) {
  const variantStyles: Record<string, string> = {
    default: 'border-border',
    success: 'border-primary/30 card-glow-green',
    danger: 'border-danger/30 card-glow-red',
    warning: 'border-warning/30 card-glow-amber',
    accent: 'border-accent/30 card-glow-blue',
  };

  const iconBg: Record<string, string> = {
    default: 'bg-muted/60 text-muted-foreground',
    success: 'bg-primary/10 text-primary',
    danger: 'bg-danger/10 text-danger',
    warning: 'bg-warning/10 text-warning',
    accent: 'bg-accent/10 text-accent',
  };

  return (
    <div className={`bg-card rounded-xl border p-4 transition-all duration-200 hover:border-opacity-60 ${variantStyles[variant]} ${featured ? 'row-span-2' : ''}`}>
      {alert && (
        <div className="flex items-center gap-1.5 mb-3 px-2 py-1 rounded-md bg-danger/10 border border-danger/20">
          <AlertTriangle className="w-3 h-3 text-danger" />
          <span className="text-2xs text-danger font-medium">Attention needed</span>
        </div>
      )}
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg[variant]}`}>
          <Icon className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-2xs font-mono font-semibold ${trend.up ? 'text-primary' : 'text-danger'}`}>
            {trend.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.value}
          </div>
        )}
      </div>
      <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">{title}</p>
      <p className={`font-bold tabular-nums text-foreground ${featured ? 'text-4xl' : 'text-2xl'}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
    </div>
  );
}

export default function DashboardMetrics() {
  // Backend integration point: GET /api/bot/metrics for live data
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {/* Row 1: 4 cards */}
      <MetricCard
        title="Bot Uptime"
        value="99.7%"
        subtitle="18d 4h 32m continuous"
        icon={Wifi}
        variant="success"
        trend={{ value: '+0.2%', up: true }}
      />
      <MetricCard
        title="Tasks Today"
        value="47"
        subtitle="+12 vs yesterday"
        icon={CheckCircle2}
        variant="accent"
        trend={{ value: '+34%', up: true }}
      />
      <MetricCard
        title="Failed Tasks"
        value="3"
        subtitle="6.4% failure rate"
        icon={XCircle}
        variant="danger"
        alert={true}
        trend={{ value: '+2', up: false }}
      />
      <MetricCard
        title="Queue Depth"
        value="2"
        subtitle="Tasks waiting to run"
        icon={ListOrdered}
        variant="warning"
      />

      {/* Row 2: 4 cards */}
      <MetricCard
        title="Active Task"
        value="1"
        subtitle="GitHub scraper — 4m 12s"
        icon={Activity}
        variant="success"
      />
      <MetricCard
        title="API Calls Used"
        value="1,284"
        subtitle="716 remaining today"
        icon={Zap}
        variant="accent"
        trend={{ value: '64%', up: false }}
      />
      <MetricCard
        title="Avg Duration"
        value="3m 47s"
        subtitle="Per task completion"
        icon={Clock}
        variant="default"
        trend={{ value: '-22s', up: true }}
      />
      <MetricCard
        title="Container RAM"
        value="30%"
        subtitle="1.2 GB / 4 GB used"
        icon={Cpu}
        variant="default"
      />
    </div>
  );
}