'use client';

import { StatusBadge, ToolBadge } from '@/components/ui/StatusBadge';
import { Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface RecentTask {
  id: string;
  title: string;
  model: string;
  type: 'bash' | 'browser' | 'file' | 'api' | 'telegram';
  status: 'running' | 'completed' | 'failed' | 'queued' | 'cancelled';
  duration: string;
  startedAt: string;
  steps: number;
}

const recentTasks: RecentTask[] = [
  { id: 'task-001', title: 'Scrape top 100 GitHub repos by stars', model: 'llama-3.3-70b', type: 'browser', status: 'running', duration: '4m 12s', startedAt: '10:15:51', steps: 3 },
  { id: 'task-002', title: 'Analyze Bitcoin price trends last 30 days', model: 'mistral-large', type: 'api', status: 'completed', duration: '2m 34s', startedAt: '09:57:22', steps: 5 },
  { id: 'task-003', title: 'Deploy Nginx config to /etc/nginx/sites-available', model: 'llama-3.3-70b', type: 'bash', status: 'completed', duration: '45s', startedAt: '09:20:11', steps: 4 },
  { id: 'task-004', title: 'Send weekly summary report via Telegram', model: 'mixtral-8x7b', type: 'telegram', status: 'completed', duration: '1m 08s', startedAt: '08:00:00', steps: 3 },
  { id: 'task-005', title: 'Fetch weather API for Riyadh next 7 days', model: 'gemma-3-27b', type: 'api', status: 'failed', duration: '12s', startedAt: '07:45:33', steps: 2 },
  { id: 'task-006', title: 'Compress all logs older than 30 days in /var/log', model: 'llama-3.3-70b', type: 'file', status: 'completed', duration: '3m 22s', startedAt: '07:30:00', steps: 6 },
  { id: 'task-007', title: 'Monitor CPU usage and alert if >85%', model: 'mistral-large', type: 'bash', status: 'queued', duration: '—', startedAt: 'Waiting', steps: 0 },
];

export default function RecentTasksFeed() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Recent Tasks</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Latest task executions</p>
        </div>
        <Link
          href="/task-history"
          className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
        >
          View all
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Task', 'Type', 'Model', 'Status', 'Steps', 'Duration', 'Started'].map((h) => (
                <th key={`head-${h}`} className="px-4 py-2.5 text-left text-2xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentTasks.map((task) => (
              <tr key={task.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors group">
                <td className="px-4 py-3 max-w-xs">
                  <p className="text-xs font-medium text-foreground truncate">{task.title}</p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <ToolBadge tool={task.type} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-2xs font-mono text-muted-foreground">{task.model}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={task.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-xs font-mono text-muted-foreground">{task.steps || '—'}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {task.duration}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-xs font-mono text-muted-foreground">{task.startedAt}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}