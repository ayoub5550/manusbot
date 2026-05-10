'use client';

import { Server, Cpu, RefreshCw, Wifi, Clock, Box } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface MetricRowProps {
  label: string;
  value: string;
  percent?: number;
  color?: string;
}

function MetricRow({ label, value, percent, color = 'bg-primary' }: MetricRowProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-mono font-semibold text-foreground">{value}</span>
      </div>
      {percent !== undefined && (
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${color}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default function ContainerHealth() {
  // Backend integration point: GET /api/container/health for live Docker stats
  return (
    <div className="bg-card border border-border rounded-xl p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Server className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Container Health</h3>
            <p className="text-2xs text-muted-foreground">Bunny Magic Docker</p>
          </div>
        </div>
        <button className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-150" title="Refresh container stats">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Status Banner */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20 mb-4">
        <span className="w-2 h-2 rounded-full bg-primary pulse-dot shrink-0" />
        <span className="text-xs font-medium text-primary">Container Running</span>
        <span className="text-2xs font-mono text-muted-foreground ml-auto">ubuntu:22.04</span>
      </div>

      {/* Resource Metrics */}
      <div className="space-y-3 flex-1">
        <MetricRow label="CPU Usage" value="12.4%" percent={12} color="bg-primary" />
        <MetricRow label="RAM" value="1.2 GB / 4 GB" percent={30} color="bg-accent" />
        <MetricRow label="Disk I/O" value="84 MB/s" percent={42} color="bg-purple-500" />
        <MetricRow label="Storage" value="8.3 GB / 50 GB" percent={17} color="bg-orange-500" />
        <MetricRow label="Network In" value="2.4 MB/s" />
        <MetricRow label="Network Out" value="0.8 MB/s" />
      </div>

      {/* Info Grid */}
      <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-2">
        {[
          { icon: Clock, label: 'Uptime', value: '18d 4h 32m' },
          { icon: Box, label: 'Image', value: 'ubuntu:22.04' },
          { icon: Cpu, label: 'vCPUs', value: '4 cores' },
          { icon: Wifi, label: 'Region', value: 'EU-West-1' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={`container-stat-${item.label}`} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-muted/30">
              <Icon className="w-3 h-3 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-2xs text-muted-foreground">{item.label}</p>
                <p className="text-2xs font-mono font-semibold text-foreground truncate">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}