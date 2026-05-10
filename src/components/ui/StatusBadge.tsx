import React from 'react';

type StatusType = 'running' | 'completed' | 'failed' | 'queued' | 'cancelled';
type ToolType = 'bash' | 'browser' | 'file' | 'api' | 'telegram';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md';
}

interface ToolBadgeProps {
  tool: ToolType;
  size?: 'sm' | 'md';
}

const statusConfig: Record<StatusType, { label: string; className: string; dot: string }> = {
  running: { label: 'Running', className: 'status-running', dot: 'bg-amber-400' },
  completed: { label: 'Completed', className: 'status-completed', dot: 'bg-green-500' },
  failed: { label: 'Failed', className: 'status-failed', dot: 'bg-red-500' },
  queued: { label: 'Queued', className: 'status-queued', dot: 'bg-blue-500' },
  cancelled: { label: 'Cancelled', className: 'status-cancelled', dot: 'bg-zinc-500' },
};

const toolConfig: Record<ToolType, { label: string; className: string }> = {
  bash: { label: 'bash', className: 'tool-bash' },
  browser: { label: 'browser', className: 'tool-browser' },
  file: { label: 'file', className: 'tool-file' },
  api: { label: 'api', className: 'tool-api' },
  telegram: { label: 'telegram', className: 'tool-telegram' },
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClass = size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-2xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium font-mono ${sizeClass} ${config.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot} ${status === 'running' ? 'pulse-dot' : ''}`} />
      {config.label}
    </span>
  );
}

export function ToolBadge({ tool, size = 'sm' }: ToolBadgeProps) {
  const config = toolConfig[tool];
  const sizeClass = size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-2xs';
  return (
    <span className={`inline-flex items-center rounded font-mono font-medium ${sizeClass} ${config.className}`}>
      {config.label}
    </span>
  );
}