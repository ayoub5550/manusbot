'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Play, RefreshCw, Trash2, Send, Loader2,  } from 'lucide-react';
import Modal from '@/components/ui/Modal';

export default function QuickActions() {
  const [restarting, setRestarting] = useState(false);
  const [clearModal, setClearModal] = useState(false);
  const [testModal, setTestModal] = useState(false);
  const [testCommand, setTestCommand] = useState('echo "ManusBot is alive! $(date)"');

  const handleRestart = () => {
    setRestarting(true);
    // Backend integration point: POST /api/bot/restart
    setTimeout(() => {
      setRestarting(false);
      toast?.success('Bot restarted successfully', { description: 'Container restarted in 3.2s' });
    }, 2000);
  };

  const handleClearQueue = () => {
    setClearModal(false);
    // Backend integration point: DELETE /api/tasks/queue
    toast?.success('Task queue cleared', { description: '2 queued tasks removed' });
  };

  const handleRunTest = () => {
    setTestModal(false);
    // Backend integration point: POST /api/tasks/test with { command: testCommand }
    toast?.success('Test task dispatched', { description: `Running: ${testCommand?.slice(0, 40)}...` });
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={handleRestart}
          disabled={restarting}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-150 active:scale-95 disabled:opacity-50"
        >
          {restarting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          {restarting ? 'Restarting...' : 'Restart Bot'}
        </button>
        <button
          onClick={() => setClearModal(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-danger hover:border-danger/30 transition-all duration-150 active:scale-95"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Queue
        </button>
        <button
          onClick={() => setTestModal(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/30 text-xs font-medium text-primary hover:bg-primary/20 transition-all duration-150 active:scale-95"
        >
          <Play className="w-3.5 h-3.5" />
          Run Test
        </button>
      </div>
      {/* Clear Queue Modal */}
      <Modal open={clearModal} onClose={() => setClearModal(false)} title="Clear Task Queue" size="sm">
        <p className="text-sm text-muted-foreground mb-4">
          This will remove all <span className="text-foreground font-semibold">2 queued tasks</span> from the queue. Running tasks will not be affected.
        </p>
        <div className="flex gap-2 justify-end">
          <button onClick={() => setClearModal(false)} className="px-3 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground transition-all duration-150">
            Cancel
          </button>
          <button onClick={handleClearQueue} className="px-3 py-2 rounded-lg bg-danger/10 border border-danger/30 text-xs font-medium text-danger hover:bg-danger/20 transition-all duration-150 active:scale-95">
            Clear Queue
          </button>
        </div>
      </Modal>
      {/* Test Task Modal */}
      <Modal open={testModal} onClose={() => setTestModal(false)} title="Run Test Task" size="md">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Bash Command
              <span className="text-muted-foreground font-normal ml-2">Run directly in container</span>
            </label>
            <input
              type="text"
              value={testCommand}
              onChange={(e) => setTestCommand(e?.target?.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-muted/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <button onClick={() => setTestModal(false)} className="px-3 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground transition-all duration-150">
              Cancel
            </button>
            <button onClick={handleRunTest} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 border border-primary/30 text-xs font-medium text-primary hover:bg-primary/20 transition-all duration-150 active:scale-95">
              <Send className="w-3.5 h-3.5" />
              Dispatch Task
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}