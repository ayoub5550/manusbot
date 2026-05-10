'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Terminal, Globe, FileText, Code2, Zap, Loader2 } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface Step {
  id: string;
  type: 'bash' | 'browser' | 'file' | 'api' | 'telegram';
  action: string;
  status: 'pending' | 'running' | 'done' | 'error';
  output?: string;
  duration?: string;
}

interface ExecutionStepsProps {
  steps: Step[];
}

const toolIcons: Record<string, React.ElementType> = {
  bash: Terminal,
  browser: Globe,
  file: FileText,
  api: Code2,
  telegram: Zap,
};

export default function ExecutionSteps({ steps }: ExecutionStepsProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-1">
      {steps.map((step) => {
        const Icon = toolIcons[step.type] || Terminal;
        const isExpanded = expanded[step.id];
        return (
          <div key={step.id} className="rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => step.output && setExpanded((p) => ({ ...p, [step.id]: !p[step.id] }))}
              className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-muted/30 transition-colors"
            >
              <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="flex-1 text-xs font-mono text-foreground truncate">{step.action}</span>
              {step.duration && <span className="text-2xs font-mono text-muted-foreground shrink-0">{step.duration}</span>}
              {step.status === 'running' && <Loader2 className="w-3 h-3 text-warning animate-spin shrink-0" />}
              {step.status === 'done' && <span className="text-xs text-primary shrink-0">✓</span>}
              {step.status === 'error' && <span className="text-xs text-danger shrink-0">✗</span>}
              {step.output && (
                isExpanded ? <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" /> : <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
              )}
            </button>
            {isExpanded && step.output && (
              <div className="px-3 pb-2 border-t border-border bg-black/20">
                <pre className="text-2xs font-mono text-muted-foreground whitespace-pre-wrap mt-2">{step.output}</pre>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}