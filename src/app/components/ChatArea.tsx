'use client';

import { useState, useRef, useEffect } from 'react';
import ModelSelector, { nvidiaModels, NvidiaModel } from './ModelSelector';

import TerminalOutput from './TerminalOutput';
import { Send, Bot, User, ChevronDown, ChevronUp, Paperclip, RotateCcw, Copy, ThumbsUp, ThumbsDown, Loader2, Terminal, Globe, FileText, Code2, Zap,  } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface ExecutionStep {
  id: string;
  type: 'bash' | 'browser' | 'file' | 'api' | 'telegram';
  action: string;
  status: 'pending' | 'running' | 'done' | 'error';
  output?: string;
  duration?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  taskStatus?: 'running' | 'completed' | 'failed';
  steps?: ExecutionStep[];
  showTerminal?: boolean;
  terminalLines?: string[];
  isStreaming?: boolean;
}

const initialMessages: Message[] = [
  {
    id: 'msg-001',
    role: 'user',
    content: 'Scrape the top 100 GitHub repositories by stars and save them to a CSV file with columns: rank, name, stars, language, description, URL',
    timestamp: '10:18:01',
  },
  {
    id: 'msg-002',
    role: 'assistant',
    content: "I'll scrape the top 100 GitHub repositories by stars using the GitHub API and save the results to a CSV file. Let me break this down into steps.",
    timestamp: '10:18:03',
    taskStatus: 'running',
    isStreaming: false,
    steps: [
      { id: 'step-001', type: 'bash', action: 'pip install requests pandas', status: 'done', output: 'Successfully installed requests-2.31.0 pandas-2.1.4', duration: '3.2s' },
      { id: 'step-002', type: 'api', action: 'GET https://api.github.com/search/repositories?q=stars:>1&sort=stars&per_page=100', status: 'done', output: 'Fetched 100 repositories (rate limit: 29/30 remaining)', duration: '1.8s' },
      { id: 'step-003', type: 'bash', action: 'python3 /tmp/parse_repos.py', status: 'running', output: 'Processing repositories... 67/100 complete', duration: '...' },
      { id: 'step-004', type: 'file', action: 'Write /home/user/github_top100.csv', status: 'pending' },
    ],
    terminalLines: [
      '$ pip install requests pandas',
      'Collecting requests...',
      'Successfully installed requests-2.31.0 pandas-2.1.4',
      '$ python3 /tmp/fetch_github.py',
      '[INFO] Authenticating with GitHub API...',
      '[INFO] Fetching page 1/1 (100 repos per page)...',
      '[INFO] Rate limit: 29 requests remaining',
      '[INFO] Processing repository data...',
      '[INFO] freeCodeCamp/freeCodeCamp — 393,211 ⭐',
      '[INFO] EbookFoundation/free-programming-books — 321,445 ⭐',
      '[INFO] jwasham/coding-interview-university — 307,892 ⭐',
      '[INFO] kamranahmedse/developer-roadmap — 295,670 ⭐',
      '[PROGRESS] 67/100 repositories processed...',
    ],
    showTerminal: true,
  },
];

const toolIcons: Record<string, React.ElementType> = {
  bash: Terminal,
  browser: Globe,
  file: FileText,
  api: Code2,
  telegram: Zap,
};

const toolColors: Record<string, string> = {
  bash: 'text-purple-400',
  browser: 'text-sky-400',
  file: 'text-orange-400',
  api: 'text-pink-400',
  telegram: 'text-emerald-400',
};

export default function ChatArea() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<NvidiaModel>(nvidiaModels[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTerminalMap, setShowTerminalMap] = useState<Record<string, boolean>>({ 'msg-002': true });
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = () => {
    if (!input.trim() || isSubmitting) return;
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSubmitting(true);

    // Backend integration point: POST /api/tasks with { prompt: input, model: selectedModel.id }
    setTimeout(() => {
      const assistantMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `Understood. I'll execute this task using ${selectedModel.displayName}. Initializing execution environment...`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        taskStatus: 'running',
        isStreaming: true,
        steps: [
          { id: `step-new-001`, type: 'bash', action: 'Initializing execution environment', status: 'running' },
        ],
        terminalLines: ['$ Initializing ManusBot execution environment...', '[INFO] Loading task context...'],
        showTerminal: true,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setShowTerminalMap((prev) => ({ ...prev, [assistantMsg.id]: true }));
      setIsSubmitting(false);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleTerminal = (msgId: string) => {
    setShowTerminalMap((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-border bg-card/50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">Task Chat</h1>
            <p className="text-2xs text-muted-foreground">ManusBot · Bunny Magic Container · Ubuntu 22.04</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ModelSelector selected={selectedModel} onSelect={setSelectedModel} />
          <button className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-150" title="New conversation">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 fade-in ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center mt-0.5
              ${msg.role === 'user' ? 'bg-accent/20' : 'bg-primary/10'}
            `}>
              {msg.role === 'user'
                ? <User className="w-4 h-4 text-accent" />
                : <Bot className="w-4 h-4 text-primary" />
              }
            </div>

            {/* Bubble */}
            <div className={`flex-1 max-w-3xl ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
              {/* Header row */}
              <div className={`flex items-center gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <span className="text-2xs font-mono text-muted-foreground">{msg.timestamp}</span>
                {msg.taskStatus && <StatusBadge status={msg.taskStatus} size="sm" />}
              </div>

              {/* Content */}
              <div className={`rounded-xl px-4 py-3 text-sm leading-relaxed
                ${msg.role === 'user' ?'bg-accent/10 border border-accent/20 text-foreground' :'bg-card border border-border text-foreground'
                }
                ${msg.isStreaming ? 'streaming-cursor' : ''}
              `}>
                {msg.content}
              </div>

              {/* Execution Steps */}
              {msg.steps && msg.steps.length > 0 && (
                <div className="w-full bg-card border border-border rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-semibold text-foreground">Execution Steps</span>
                      <span className="text-2xs font-mono text-muted-foreground">
                        {msg.steps.filter(s => s.status === 'done').length}/{msg.steps.length} done
                      </span>
                    </div>
                    {msg.terminalLines && (
                      <button
                        onClick={() => toggleTerminal(msg.id)}
                        className="flex items-center gap-1 text-2xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Terminal className="w-3 h-3" />
                        {showTerminalMap[msg.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                  <div className="p-3 space-y-1.5">
                    {msg.steps.map((step) => {
                      const ToolIcon = toolIcons[step.type] || Terminal;
                      return (
                        <div key={step.id} className={`flex items-start gap-2.5 px-3 py-2 rounded-lg border transition-all duration-150
                          ${step.status === 'running' ? 'border-warning/30 bg-warning/5' : ''}
                          ${step.status === 'done' ? 'border-border bg-muted/20' : ''}
                          ${step.status === 'pending' ? 'border-border/50 bg-transparent opacity-50' : ''}
                          ${step.status === 'error' ? 'border-danger/30 bg-danger/5' : ''}
                        `}>
                          <div className={`mt-0.5 shrink-0 ${toolColors[step.type]}`}>
                            <ToolIcon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-mono text-foreground truncate">{step.action}</p>
                            {step.output && (
                              <p className="text-2xs text-muted-foreground mt-0.5 font-mono truncate">{step.output}</p>
                            )}
                          </div>
                          <div className="shrink-0 flex items-center gap-1.5">
                            {step.duration && (
                              <span className="text-2xs font-mono text-muted-foreground">{step.duration}</span>
                            )}
                            {step.status === 'running' && <Loader2 className="w-3 h-3 text-warning animate-spin" />}
                            {step.status === 'done' && <span className="text-2xs text-primary">✓</span>}
                            {step.status === 'error' && <span className="text-2xs text-danger">✗</span>}
                            {step.status === 'pending' && <span className="text-2xs text-muted-foreground">·</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Terminal Output */}
                  {msg.terminalLines && showTerminalMap[msg.id] && (
                    <TerminalOutput lines={msg.terminalLines} />
                  )}
                </div>
              )}

              {/* Message actions */}
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-1">
                  <button className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors" title="Copy response">
                    <Copy className="w-3 h-3" />
                  </button>
                  <button className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors" title="Good response">
                    <ThumbsUp className="w-3 h-3" />
                  </button>
                  <button className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors" title="Bad response">
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isSubmitting && (
          <div className="flex gap-3 fade-in">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5 shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
              <span className="text-xs text-muted-foreground font-mono">Initializing agent...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="px-5 py-4 border-t border-border bg-card/30 shrink-0">
        <div className="flex items-end gap-3 bg-muted/40 border border-border rounded-xl px-4 py-3 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all duration-150">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe a task for ManusBot... (e.g. 'Check disk usage and send report via Telegram')"
            rows={1}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none leading-relaxed max-h-32 overflow-y-auto"
            style={{ minHeight: '24px' }}
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-150" title="Attach file">
              <Paperclip className="w-4 h-4" />
            </button>
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || isSubmitting}
              className={`p-2 rounded-lg transition-all duration-150 active:scale-95
                ${input.trim() && !isSubmitting
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
                }
              `}
              title="Send task (Enter)"
            >
              {isSubmitting
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Send className="w-4 h-4" />
              }
            </button>
          </div>
        </div>
        <p className="text-2xs text-muted-foreground mt-2 text-center">
          <span className="font-mono">{selectedModel.displayName}</span> · Press <kbd className="px-1 py-0.5 rounded bg-muted text-2xs font-mono">Enter</kbd> to send · <kbd className="px-1 py-0.5 rounded bg-muted text-2xs font-mono">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}