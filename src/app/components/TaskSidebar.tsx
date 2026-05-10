'use client';

import { useState } from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Search, Plus, Clock, Filter, Folder,  } from 'lucide-react';

interface SidebarTask {
  id: string;
  title: string;
  status: 'running' | 'completed' | 'failed' | 'queued' | 'cancelled';
  timeAgo: string;
  model: string;
}

const sidebarTasks: SidebarTask[] = [
  { id: 'task-001', title: 'Scrape top 100 GitHub repos by stars', status: 'running', timeAgo: '2m ago', model: 'llama-3.3-70b' },
  { id: 'task-002', title: 'Analyze Bitcoin price trends last 30 days', status: 'completed', timeAgo: '18m ago', model: 'mistral-large' },
  { id: 'task-003', title: 'Deploy Nginx config to /etc/nginx/sites-available', status: 'completed', timeAgo: '1h ago', model: 'llama-3.3-70b' },
  { id: 'task-004', title: 'Send weekly summary report via Telegram', status: 'completed', timeAgo: '2h ago', model: 'mixtral-8x7b' },
  { id: 'task-005', title: 'Fetch weather API for Riyadh next 7 days', status: 'failed', timeAgo: '3h ago', model: 'gemma-3-27b' },
  { id: 'task-006', title: 'Compress all logs older than 30 days in /var/log', status: 'completed', timeAgo: '5h ago', model: 'llama-3.3-70b' },
  { id: 'task-007', title: 'Monitor CPU usage and alert if >85%', status: 'queued', timeAgo: 'Queued', model: 'mistral-large' },
  { id: 'task-008', title: 'Extract emails from 50 company websites', status: 'completed', timeAgo: 'Yesterday', model: 'llama-3.1-405b' },
  { id: 'task-009', title: 'Backup PostgreSQL database to S3', status: 'completed', timeAgo: 'Yesterday', model: 'llama-3.3-70b' },
  { id: 'task-010', title: 'Generate Python script for CSV data cleaning', status: 'completed', timeAgo: '2 days ago', model: 'qwen-2.5-72b' },
  { id: 'task-011', title: 'Check SSL certificate expiry for 12 domains', status: 'completed', timeAgo: '2 days ago', model: 'mistral-large' },
  { id: 'task-012', title: 'Translate README.md to Arabic', status: 'cancelled', timeAgo: '3 days ago', model: 'llama-3.3-70b' },
];

export default function TaskSidebar() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('task-001');
  const [filter, setFilter] = useState<'all' | 'running' | 'completed' | 'failed'>('all');

  const filtered = sidebarTasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || t.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="w-72 shrink-0 border-r border-border flex flex-col bg-card/50 h-full">
      {/* Header */}
      <div className="px-3 pt-4 pb-3 border-b border-border shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Tasks</h2>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-all duration-150 active:scale-95">
            <Plus className="w-3.5 h-3.5" />
            New
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs bg-muted/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-150"
          />
        </div>

        {/* Filter chips */}
        <div className="flex gap-1 mt-2 flex-wrap">
          {(['all', 'running', 'completed', 'failed'] as const).map((f) => (
            <button
              key={`filter-chip-${f}`}
              onClick={() => setFilter(f)}
              className={`px-2 py-0.5 rounded text-2xs font-medium transition-all duration-150 ${
                filter === f
                  ? 'bg-primary/20 text-primary' :'bg-muted/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto py-1">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Folder className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-xs font-medium text-muted-foreground">No tasks found</p>
            <p className="text-2xs text-muted-foreground mt-1">Try a different search or filter</p>
          </div>
        ) : (
          filtered.map((task) => (
            <button
              key={task.id}
              onClick={() => setSelectedId(task.id)}
              className={`w-full text-left px-3 py-2.5 border-b border-border/50 transition-all duration-150 group
                ${selectedId === task.id ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-muted/30 border-l-2 border-l-transparent'}
              `}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className={`text-xs font-medium leading-snug line-clamp-2 flex-1 ${selectedId === task.id ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                  {task.title}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <StatusBadge status={task.status} size="sm" />
                <span className="text-2xs text-muted-foreground font-mono flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {task.timeAgo}
                </span>
              </div>
              <p className="text-2xs text-muted-foreground mt-0.5 font-mono truncate">{task.model}</p>
            </button>
          ))
        )}
      </div>

      {/* Footer stats */}
      <div className="px-3 py-2.5 border-t border-border shrink-0 bg-card/80">
        <div className="flex items-center justify-between text-2xs text-muted-foreground">
          <span className="font-mono">{sidebarTasks.filter(t => t.status === 'completed').length} completed</span>
          <span className="font-mono">{sidebarTasks.filter(t => t.status === 'running').length} running</span>
          <span className="font-mono">{sidebarTasks.filter(t => t.status === 'failed').length} failed</span>
        </div>
      </div>
    </div>
  );
}