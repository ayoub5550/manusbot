'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Zap, Star } from 'lucide-react';

export interface NvidiaModel {
  id: string;
  name: string;
  displayName: string;
  provider: string;
  contextWindow: string;
  speed: 'fast' | 'medium' | 'slow';
  recommended?: boolean;
}

export const nvidiaModels: NvidiaModel[] = [
  { id: 'meta/llama-3.1-405b-instruct', name: 'llama-3.1-405b', displayName: 'Llama 3.1 405B', provider: 'Meta', contextWindow: '128K', speed: 'slow', recommended: true },
  { id: 'meta/llama-3.3-70b-instruct', name: 'llama-3.3-70b', displayName: 'Llama 3.3 70B', provider: 'Meta', contextWindow: '128K', speed: 'fast', recommended: true },
  { id: 'meta/llama-3.1-70b-instruct', name: 'llama-3.1-70b', displayName: 'Llama 3.1 70B', provider: 'Meta', contextWindow: '128K', speed: 'fast' },
  { id: 'mistralai/mistral-large-2-instruct', name: 'mistral-large', displayName: 'Mistral Large 2', provider: 'Mistral', contextWindow: '128K', speed: 'medium', recommended: true },
  { id: 'mistralai/mixtral-8x7b-instruct-v0.1', name: 'mixtral-8x7b', displayName: 'Mixtral 8x7B', provider: 'Mistral', contextWindow: '32K', speed: 'fast' },
  { id: 'mistralai/mixtral-8x22b-instruct-v0.1', name: 'mixtral-8x22b', displayName: 'Mixtral 8x22B', provider: 'Mistral', contextWindow: '64K', speed: 'medium' },
  { id: 'google/gemma-3-27b-it', name: 'gemma-3-27b', displayName: 'Gemma 3 27B', provider: 'Google', contextWindow: '128K', speed: 'fast' },
  { id: 'qwen/qwen2.5-72b-instruct', name: 'qwen-2.5-72b', displayName: 'Qwen 2.5 72B', provider: 'Alibaba', contextWindow: '128K', speed: 'fast', recommended: true },
  { id: 'qwen/qwen2.5-coder-32b-instruct', name: 'qwen-2.5-coder-32b', displayName: 'Qwen 2.5 Coder 32B', provider: 'Alibaba', contextWindow: '32K', speed: 'fast' },
  { id: 'deepseek-ai/deepseek-r1', name: 'deepseek-r1', displayName: 'DeepSeek R1', provider: 'DeepSeek', contextWindow: '128K', speed: 'slow', recommended: true },
  { id: 'deepseek-ai/deepseek-r1-distill-llama-70b', name: 'deepseek-r1-70b', displayName: 'DeepSeek R1 70B', provider: 'DeepSeek', contextWindow: '64K', speed: 'medium' },
  { id: 'nvidia/llama-3.1-nemotron-70b-instruct', name: 'nemotron-70b', displayName: 'Nemotron 70B', provider: 'NVIDIA', contextWindow: '128K', speed: 'medium', recommended: true },
  { id: 'nvidia/nemotron-4-340b-instruct', name: 'nemotron-340b', displayName: 'Nemotron 340B', provider: 'NVIDIA', contextWindow: '4K', speed: 'slow' },
  { id: 'microsoft/phi-3-medium-128k-instruct', name: 'phi-3-medium', displayName: 'Phi-3 Medium 128K', provider: 'Microsoft', contextWindow: '128K', speed: 'fast' },
  { id: 'microsoft/phi-3-mini-128k-instruct', name: 'phi-3-mini', displayName: 'Phi-3 Mini 128K', provider: 'Microsoft', contextWindow: '128K', speed: 'fast' },
  { id: 'databricks/dbrx-instruct', name: 'dbrx', displayName: 'DBRX Instruct', provider: 'Databricks', contextWindow: '32K', speed: 'medium' },
  { id: 'nv-mistralai/mistral-nemo-12b-instruct', name: 'mistral-nemo-12b', displayName: 'Mistral NeMo 12B', provider: 'NVIDIA+Mistral', contextWindow: '128K', speed: 'fast' },
  { id: 'upstage/solar-10.7b-instruct', name: 'solar-10.7b', displayName: 'Solar 10.7B', provider: 'Upstage', contextWindow: '4K', speed: 'fast' },
  { id: 'seallms/seallm-7b-v2.5', name: 'seallm-7b', displayName: 'SeaLLM 7B v2.5', provider: 'SeaLLMs', contextWindow: '8K', speed: 'fast' },
  { id: 'writer/palmyra-x-004', name: 'palmyra-x-004', displayName: 'Palmyra X 004', provider: 'Writer', contextWindow: '128K', speed: 'medium' },
];

const speedColors: Record<string, string> = {
  fast: 'text-primary',
  medium: 'text-warning',
  slow: 'text-muted-foreground',
};

interface ModelSelectorProps {
  selected: NvidiaModel;
  onSelect: (model: NvidiaModel) => void;
}

export default function ModelSelector({ selected, onSelect }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = nvidiaModels.filter(
    (m) =>
      m.displayName.toLowerCase().includes(search.toLowerCase()) ||
      m.provider.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/40 text-xs font-medium text-foreground hover:bg-muted/70 transition-all duration-150 active:scale-95"
      >
        <Zap className="w-3.5 h-3.5 text-primary" />
        <span className="font-mono">{selected.displayName}</span>
        <span className="text-2xs text-muted-foreground">{selected.provider}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden fade-in">
          <div className="p-2 border-b border-border">
            <input
              type="text"
              placeholder="Search models..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-muted/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto max-h-72">
            {filtered.map((model) => (
              <button
                key={model.id}
                onClick={() => { onSelect(model); setOpen(false); setSearch(''); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-muted/40 transition-all duration-100 border-b border-border/50 last:border-0
                  ${selected.id === model.id ? 'bg-primary/5' : ''}
                `}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {model.recommended && <Star className="w-3 h-3 text-warning shrink-0 fill-warning" />}
                  {!model.recommended && <span className="w-3 h-3 shrink-0" />}
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{model.displayName}</p>
                    <p className="text-2xs text-muted-foreground">{model.provider}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-2xs font-mono text-muted-foreground">{model.contextWindow}</span>
                  <span className={`text-2xs font-mono font-semibold ${speedColors[model.speed]}`}>
                    {model.speed}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="px-3 py-2 border-t border-border bg-muted/20">
            <p className="text-2xs text-muted-foreground">
              <span className="text-warning">★</span> Recommended · {nvidiaModels.length} models via NVIDIA API
            </p>
          </div>
        </div>
      )}
    </div>
  );
}