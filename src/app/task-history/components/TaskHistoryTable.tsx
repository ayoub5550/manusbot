'use client';

import { useState, useMemo } from 'react';
import { StatusBadge, ToolBadge } from '@/components/ui/StatusBadge';
import TerminalOutput from '@/app/components/TerminalOutput';
import { Search, ChevronUp, ChevronDown, Trash2, Download, Eye, RotateCcw, Filter, X, Clock, Hash, Layers, Database, Calendar, Loader2, AlertCircle, FileText,  } from 'lucide-react';
import { toast } from 'sonner';

type TaskStatus = 'running' | 'completed' | 'failed' | 'queued' | 'cancelled';
type TaskType = 'bash' | 'browser' | 'file' | 'api' | 'telegram';

interface HistoryTask {
  id: string;
  title: string;
  type: TaskType;
  model: string;
  status: TaskStatus;
  steps: number;
  duration: string;
  durationMs: number;
  outputSize: string;
  startedAt: string;
  completedAt: string;
  terminalLines: string[];
}

const allTasks: HistoryTask[] = [
  { id: 'task-001', title: 'Scrape top 100 GitHub repos by stars', type: 'browser', model: 'llama-3.3-70b', status: 'running', steps: 4, duration: '4m 12s', durationMs: 252000, outputSize: '—', startedAt: '2026-05-10 10:15:51', completedAt: '—', terminalLines: ['$ python3 scrape_github.py', '[INFO] Fetching GitHub API...', '[INFO] Processing 67/100 repos...', '[PROGRESS] Writing CSV...'] },
  { id: 'task-002', title: 'Analyze Bitcoin price trends last 30 days', type: 'api', model: 'mistral-large', status: 'completed', steps: 5, duration: '2m 34s', durationMs: 154000, outputSize: '4.2 KB', startedAt: '2026-05-10 09:57:22', completedAt: '2026-05-10 09:59:56', terminalLines: ['$ curl https://api.coindesk.com/v1/bpi/historical/close.json', '[INFO] Fetched 30 days of BTC price data', '[INFO] Running statistical analysis...', '[SUCCESS] Report saved to /home/user/btc_analysis.json'] },
  { id: 'task-003', title: 'Deploy Nginx config to /etc/nginx/sites-available', type: 'bash', model: 'llama-3.3-70b', status: 'completed', steps: 4, duration: '45s', durationMs: 45000, outputSize: '1.1 KB', startedAt: '2026-05-10 09:20:11', completedAt: '2026-05-10 09:20:56', terminalLines: ['$ cp nginx.conf /etc/nginx/sites-available/default', '$ nginx -t', 'nginx: configuration file /etc/nginx/nginx.conf test is successful', '$ systemctl reload nginx', '[SUCCESS] Nginx reloaded successfully'] },
  { id: 'task-004', title: 'Send weekly summary report via Telegram', type: 'telegram', model: 'mixtral-8x7b', status: 'completed', steps: 3, duration: '1m 08s', durationMs: 68000, outputSize: '0.8 KB', startedAt: '2026-05-10 08:00:00', completedAt: '2026-05-10 08:01:08', terminalLines: ['[INFO] Generating weekly summary...', '[INFO] Sending to Telegram bot...', '[SUCCESS] Message delivered to chat_id: -1001234567890'] },
  { id: 'task-005', title: 'Fetch weather API for Riyadh next 7 days', type: 'api', model: 'gemma-3-27b', status: 'failed', steps: 2, duration: '12s', durationMs: 12000, outputSize: '—', startedAt: '2026-05-10 07:45:33', completedAt: '2026-05-10 07:45:45', terminalLines: ['$ curl https://api.openweathermap.org/data/2.5/forecast?q=Riyadh', '[ERROR] 401 Unauthorized — Invalid API key', '[ERROR] Task failed: Authentication error'] },
  { id: 'task-006', title: 'Compress all logs older than 30 days in /var/log', type: 'file', model: 'llama-3.3-70b', status: 'completed', steps: 6, duration: '3m 22s', durationMs: 202000, outputSize: '—', startedAt: '2026-05-10 07:30:00', completedAt: '2026-05-10 07:33:22', terminalLines: ['$ find /var/log -name "*.log" -mtime +30', '[INFO] Found 47 log files older than 30 days', '$ gzip -9 /var/log/syslog.1 ... (47 files)', '[SUCCESS] Compressed 47 files, saved 2.3 GB disk space'] },
  { id: 'task-007', title: 'Monitor CPU usage and alert if >85%', type: 'bash', model: 'mistral-large', status: 'queued', steps: 0, duration: '—', durationMs: 0, outputSize: '—', startedAt: 'Scheduled', completedAt: '—', terminalLines: [] },
  { id: 'task-008', title: 'Extract emails from 50 company websites', type: 'browser', model: 'llama-3.1-405b', status: 'completed', steps: 12, duration: '18m 44s', durationMs: 1124000, outputSize: '22.7 KB', startedAt: '2026-05-09 16:30:00', completedAt: '2026-05-09 16:48:44', terminalLines: ['$ python3 email_scraper.py --urls companies.txt', '[INFO] Processing 50 URLs...', '[INFO] 50/50 sites crawled', '[SUCCESS] Found 312 email addresses, saved to emails.csv'] },
  { id: 'task-009', title: 'Backup PostgreSQL database to S3', type: 'bash', model: 'llama-3.3-70b', status: 'completed', steps: 5, duration: '6m 12s', durationMs: 372000, outputSize: '—', startedAt: '2026-05-09 03:00:00', completedAt: '2026-05-09 03:06:12', terminalLines: ['$ pg_dump -U postgres myapp > /tmp/backup.sql', '[INFO] Dump size: 847 MB', '$ aws s3 cp /tmp/backup.sql s3://my-backups/2026-05-09/', '[SUCCESS] Backup uploaded to S3 successfully'] },
  { id: 'task-010', title: 'Generate Python script for CSV data cleaning', type: 'bash', model: 'qwen-2.5-72b', status: 'completed', steps: 3, duration: '1m 55s', durationMs: 115000, outputSize: '3.4 KB', startedAt: '2026-05-08 14:22:00', completedAt: '2026-05-08 14:23:55', terminalLines: ['[INFO] Generating data cleaning script...', '$ python3 clean_csv.py --input data.csv --output clean.csv', '[SUCCESS] Cleaned 10,432 rows, removed 847 duplicates'] },
  { id: 'task-011', title: 'Check SSL certificate expiry for 12 domains', type: 'api', model: 'mistral-large', status: 'completed', steps: 4, duration: '28s', durationMs: 28000, outputSize: '1.8 KB', startedAt: '2026-05-08 09:00:00', completedAt: '2026-05-08 09:00:28', terminalLines: ['[INFO] Checking SSL for 12 domains...', '[WARN] example.com — expires in 14 days', '[SUCCESS] 11/12 domains healthy, 1 warning sent via Telegram'] },
  { id: 'task-012', title: 'Translate README.md to Arabic', type: 'file', model: 'llama-3.3-70b', status: 'cancelled', steps: 1, duration: '8s', durationMs: 8000, outputSize: '—', startedAt: '2026-05-07 18:30:00', completedAt: '2026-05-07 18:30:08', terminalLines: ['[INFO] Reading README.md (2,847 tokens)...', '[INFO] Task cancelled by user'] },
];

type SortKey = 'startedAt' | 'duration' | 'steps' | 'status';
type SortDir = 'asc' | 'desc';

export default function TaskHistoryTable() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<TaskType | 'all'>('all');
  const [modelFilter, setModelFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('startedAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [deleting, setDeleting] = useState(false);

  const uniqueModels = Array.from(new Set(allTasks.map((t) => t.model)));

  const filtered = useMemo(() => {
    let result = allTasks.filter((t) => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchType = typeFilter === 'all' || t.type === typeFilter;
      const matchModel = modelFilter === 'all' || t.model === modelFilter;
      return matchSearch && matchStatus && matchType && matchModel;
    });

    result.sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      if (sortKey === 'startedAt') { aVal = a.startedAt; bVal = b.startedAt; }
      if (sortKey === 'duration') { aVal = a.durationMs; bVal = b.durationMs; }
      if (sortKey === 'steps') { aVal = a.steps; bVal = b.steps; }
      if (sortKey === 'status') { aVal = a.status; bVal = b.status; }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [search, statusFilter, typeFilter, modelFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
    setCurrentPage(1);
  };

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSelect = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === paginated.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginated.map((t) => t.id)));
    }
  };

  const handleBulkDelete = () => {
    setDeleting(true);
    // Backend integration point: DELETE /api/tasks with { ids: Array.from(selectedRows) }
    setTimeout(() => {
      setDeleting(false);
      toast.success(`${selectedRows.size} tasks deleted`);
      setSelectedRows(new Set());
    }, 800);
  };

  const handleExport = () => {
    // Backend integration point: GET /api/tasks/export?ids=...&format=csv
    toast.success('Export started', { description: 'CSV will download shortly' });
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronDown className="w-3 h-3 text-muted-foreground/40" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-primary" />
      : <ChevronDown className="w-3 h-3 text-primary" />;
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setTypeFilter('all');
    setModelFilter('all');
    setCurrentPage(1);
  };

  const hasFilters = search || statusFilter !== 'all' || typeFilter !== 'all' || modelFilter !== 'all';

  return (
    <div className="space-y-4">
      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks by name or ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-3 py-2 text-sm bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-150"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as TaskStatus | 'all'); setCurrentPage(1); }}
          className="px-3 py-2 text-sm bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="running">Running</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="queued">Queued</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value as TaskType | 'all'); setCurrentPage(1); }}
          className="px-3 py-2 text-sm bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
        >
          <option value="all">All Types</option>
          <option value="bash">bash</option>
          <option value="browser">browser</option>
          <option value="file">file</option>
          <option value="api">api</option>
          <option value="telegram">telegram</option>
        </select>

        {/* Model Filter */}
        <select
          value={modelFilter}
          onChange={(e) => { setModelFilter(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 text-sm bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
        >
          <option value="all">All Models</option>
          {uniqueModels.map((m) => (
            <option key={`model-opt-${m}`} value={m}>{m}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground transition-all duration-150"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}

        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <span>{filtered.length} tasks</span>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedRows.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent/5 border border-accent/20 slide-up">
          <span className="text-sm font-medium text-foreground">{selectedRows.size} selected</span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground transition-all duration-150"
            >
              <Download className="w-3.5 h-3.5" />Export CSV
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-danger/10 border border-danger/30 text-xs font-medium text-danger hover:bg-danger/20 transition-all duration-150 active:scale-95 disabled:opacity-50"
            >
              {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              {deleting ? 'Deleting...' : `Delete ${selectedRows.size}`}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginated.length && paginated.length > 0}
                    onChange={toggleSelectAll}
                    className="w-3.5 h-3.5 rounded border-border accent-primary cursor-pointer"
                    aria-label="Select all rows"
                  />
                </th>
                <th className="px-4 py-3 text-left text-2xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap w-28">
                  <div className="flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    ID
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-2xs font-semibold uppercase tracking-wider text-muted-foreground min-w-64">
                  Task Name
                </th>
                <th className="px-4 py-3 text-left text-2xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-2xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  Model
                </th>
                <th className="px-4 py-3 text-left text-2xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  <button
                    onClick={() => toggleSort('status')}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Status
                    <SortIcon col="status" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-2xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  <button
                    onClick={() => toggleSort('steps')}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <Layers className="w-3 h-3" />
                    Steps
                    <SortIcon col="steps" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-2xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  <button
                    onClick={() => toggleSort('duration')}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <Clock className="w-3 h-3" />
                    Duration
                    <SortIcon col="duration" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-2xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <Database className="w-3 h-3" />
                    Output
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-2xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  <button
                    onClick={() => toggleSort('startedAt')}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <Calendar className="w-3 h-3" />
                    Started
                    <SortIcon col="startedAt" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-2xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <FileText className="w-10 h-10 text-muted-foreground/40" />
                      <p className="text-sm font-medium text-muted-foreground">No tasks found</p>
                      <p className="text-xs text-muted-foreground">
                        {hasFilters ? 'Try adjusting your search or filters' : 'Tasks will appear here once ManusBot executes them'}
                      </p>
                      {hasFilters && (
                        <button
                          onClick={clearFilters}
                          className="mt-1 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground transition-all duration-150"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((task) => (
                  <>
                    <tr
                      key={task.id}
                      className={`border-b border-border/50 transition-all duration-150 group
                        ${selectedRows.has(task.id) ? 'bg-accent/5' : 'hover:bg-muted/20'}
                        ${expandedRows[task.id] ? 'bg-muted/10' : ''}
                      `}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(task.id)}
                          onChange={() => toggleSelect(task.id)}
                          className="w-3.5 h-3.5 rounded border-border accent-primary cursor-pointer"
                          aria-label={`Select task ${task.id}`}
                        />
                      </td>

                      {/* ID */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-2xs font-mono text-muted-foreground">{task.id}</span>
                      </td>

                      {/* Title */}
                      <td className="px-4 py-3 max-w-xs">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleRow(task.id)}
                            className="text-left group/title"
                            aria-label={expandedRows[task.id] ? 'Collapse task details' : 'Expand task details'}
                          >
                            <p className="text-xs font-medium text-foreground group-hover/title:text-primary transition-colors line-clamp-2 leading-snug">
                              {task.title}
                            </p>
                          </button>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <ToolBadge tool={task.type} />
                      </td>

                      {/* Model */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-2xs font-mono text-muted-foreground">{task.model}</span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={task.status} />
                      </td>

                      {/* Steps */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs font-mono text-muted-foreground tabular-nums">
                          {task.steps > 0 ? task.steps : '—'}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs font-mono text-muted-foreground tabular-nums flex items-center gap-1">
                          <Clock className="w-3 h-3 shrink-0" />
                          {task.duration}
                        </span>
                      </td>

                      {/* Output Size */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs font-mono text-muted-foreground">{task.outputSize}</span>
                      </td>

                      {/* Started At */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs font-mono text-muted-foreground">{task.startedAt}</span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <button
                            onClick={() => toggleRow(task.id)}
                            className="relative group/btn p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-150"
                            aria-label="View execution log"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-2xs bg-secondary text-foreground rounded border border-border whitespace-nowrap opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-opacity z-50">
                              View logs
                            </span>
                          </button>
                          {(task.status === 'failed' || task.status === 'cancelled') && (
                            <button
                              onClick={() => toast.success('Task re-queued', { description: task.title.slice(0, 40) + '...' })}
                              className="relative group/btn p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-150"
                              aria-label="Retry task"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-2xs bg-secondary text-foreground rounded border border-border whitespace-nowrap opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-opacity z-50">
                                Retry task
                              </span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              // Backend integration point: DELETE /api/tasks/:id
                              toast.success('Task deleted');
                            }}
                            className="relative group/btn p-1.5 rounded-md text-muted-foreground hover:text-danger hover:bg-danger/10 transition-all duration-150"
                            aria-label="Delete task — this cannot be undone"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="absolute bottom-full right-0 mb-1 px-2 py-1 text-2xs bg-secondary text-foreground rounded border border-border whitespace-nowrap opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-opacity z-50">
                              Delete task
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Row — Execution Log */}
                    {expandedRows[task.id] && (
                      <tr key={`${task.id}-expanded`} className="border-b border-border bg-black/20">
                        <td colSpan={11} className="px-6 py-4">
                          <div className="space-y-3">
                            {/* Task Meta */}
                            <div className="flex flex-wrap items-center gap-4 text-xs">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <span className="font-semibold text-foreground">Task ID:</span>
                                <span className="font-mono">{task.id}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <span className="font-semibold text-foreground">Model:</span>
                                <span className="font-mono">{task.model}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <span className="font-semibold text-foreground">Started:</span>
                                <span className="font-mono">{task.startedAt}</span>
                              </div>
                              {task.completedAt !== '—' && (
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <span className="font-semibold text-foreground">Completed:</span>
                                  <span className="font-mono">{task.completedAt}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <span className="font-semibold text-foreground">Duration:</span>
                                <span className="font-mono">{task.duration}</span>
                              </div>
                              {task.outputSize !== '—' && (
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <span className="font-semibold text-foreground">Output:</span>
                                  <span className="font-mono">{task.outputSize}</span>
                                </div>
                              )}
                            </div>

                            {/* Status-specific alerts */}
                            {task.status === 'failed' && (
                              <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-danger/5 border border-danger/20">
                                <AlertCircle className="w-3.5 h-3.5 text-danger mt-0.5 shrink-0" />
                                <div>
                                  <p className="text-xs font-semibold text-danger">Task Failed</p>
                                  <p className="text-2xs text-muted-foreground mt-0.5">
                                    Check terminal output below for error details. Use the retry button to re-queue this task.
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Terminal Output */}
                            {task.terminalLines.length > 0 ? (
                              <div className="rounded-xl overflow-hidden border border-border">
                                <TerminalOutput
                                  lines={task.terminalLines}
                                  isStreaming={task.status === 'running'}
                                  maxHeight="160px"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-muted/30 border border-border">
                                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Task is queued — no execution logs yet</span>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-muted/10">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Rows per page:</span>
            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="px-2 py-1 text-xs bg-card border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={`perpage-${n}`} value={n}>{n}</option>
              ))}
            </select>
            <span className="text-xs font-mono text-muted-foreground">
              {((currentPage - 1) * perPage) + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
              aria-label="First page"
            >
              «
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
              aria-label="Previous page"
            >
              ‹
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page: number;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <button
                  key={`page-btn-${page}`}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-md text-xs font-mono transition-all duration-150
                    ${currentPage === page
                      ? 'bg-primary/10 text-primary font-semibold border border-primary/30' :'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }
                  `}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
              aria-label="Next page"
            >
              ›
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
              aria-label="Last page"
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}