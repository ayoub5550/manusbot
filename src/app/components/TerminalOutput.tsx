'use client';

import { useRef, useEffect } from 'react';
import { Terminal, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface TerminalOutputProps {
  lines: string[];
  isStreaming?: boolean;
  maxHeight?: string;
}

const lineColors: Record<string, string> = {
  '[INFO]': 'text-sky-400',
  '[ERROR]': 'text-red-400',
  '[WARN]': 'text-amber-400',
  '[SUCCESS]': 'text-green-400',
  '[PROGRESS]': 'text-purple-400',
  '$': 'text-primary',
};

function colorLine(line: string): { color: string; text: string } {
  for (const [prefix, color] of Object.entries(lineColors)) {
    if (line.startsWith(prefix) || line.startsWith('$ ')) {
      return { color, text: line };
    }
  }
  return { color: 'text-zinc-400', text: line };
}

export default function TerminalOutput({ lines, isStreaming = false, maxHeight = '200px' }: TerminalOutputProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleCopy = () => {
    navigator.clipboard.writeText(lines.join('\n'));
    toast.success('Terminal output copied');
  };

  return (
    <div className="border-t border-border terminal-bg">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3 text-muted-foreground" />
          <span className="text-2xs font-mono text-muted-foreground">terminal output</span>
          {isStreaming && (
            <span className="text-2xs font-mono text-primary flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot" />
              live
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
          title="Copy terminal output"
        >
          <Copy className="w-3 h-3" />
        </button>
      </div>
      <div className="overflow-y-auto p-3" style={{ maxHeight }}>
        <div className="space-y-0.5">
          {lines.map((line, i) => {
            const { color, text } = colorLine(line);
            return (
              <p key={`terminal-line-${i}`} className={`text-2xs font-mono leading-relaxed ${color}`}>
                {text}
              </p>
            );
          })}
          {isStreaming && (
            <p className="text-2xs font-mono text-primary streaming-cursor">{''}</p>
          )}
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}