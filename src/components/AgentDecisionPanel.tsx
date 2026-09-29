import React from 'react';
import { 
  BrainCircuit, 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  History,
  ArrowRight,
  Database
} from 'lucide-react';
import { AgentDecisionResponse, HindsightMemory } from '../types/rescue.ts';

interface AgentDecisionPanelProps {
  decision: AgentDecisionResponse | null;
  onOpenWhyModal: () => void;
  onSelectMemoryDetail: (memory: HindsightMemory) => void;
  isProcessing: boolean;
}

export const AgentDecisionPanel: React.FC<AgentDecisionPanelProps> = ({
  decision,
  onOpenWhyModal,
  onSelectMemoryDetail,
  isProcessing,
}) => {
  if (isProcessing) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg text-center">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          <div className="font-tactical text-base uppercase tracking-wider text-amber-300">
            Querying Hindsight Memory Bank & Reasoning...
          </div>
          <div className="text-xs font-mono text-neutral-400 max-w-md">
            Recalling historical missions matching high gas, motion, thermal gradients, and structural risk...
          </div>
        </div>
      </div>
    );
  }

  if (!decision) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg text-center">
        <div className="py-12 space-y-3">
          <BrainCircuit className="w-10 h-10 text-neutral-600 mx-auto" />
          <div className="text-sm font-bold text-neutral-300 font-tactical uppercase">
            No Active Decision Generated
          </div>
          <p className="text-xs text-neutral-500 font-mono max-w-sm mx-auto">
            Select a scenario or tune sensors above, then click "RUN RESQ REASONING" to query Hindsight memory.
          </p>
        </div>
      </div>
    );
  }

  const { withMemory, safetyEvaluation } = decision;
  const isBlocked = safetyEvaluation.status === 'BLOCKED';
  const requiresOverride = safetyEvaluation.status === 'REQUIRES_OVERRIDE';

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 shadow-lg space-y-4">
      {/* Header & Prominent "WHY THIS DECISION?" Button */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="text-sm font-bold text-white font-tactical uppercase tracking-wider">
              RESQ Agent Decision
            </h2>
            <div className="text-[10px] font-mono text-neutral-400">
              GROUNDED IN HINDSIGHT EXPERIENTIAL MEMORY
            </div>
          </div>
        </div>

        {/* The Star "WHY THIS DECISION?" Button */}
        <button
          onClick={onOpenWhyModal}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-mono text-xs font-bold transition-all shadow-sm cursor-pointer hover:border-amber-400"
          title="Inspect the memory evidence, recalled precedent missions, and why this decision was made"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>WHY THIS DECISION?</span>
        </button>
      </div>

      {/* Primary Recommendation Banner */}
      <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-neutral-400 uppercase tracking-wider font-semibold">
            RECOMMENDED TACTICAL ACTION:
          </span>
          <span className="text-amber-400 font-bold">
            CONFIDENCE: {(withMemory.recommendation.confidence * 100).toFixed(0)}%
          </span>
        </div>

        <div className="text-base font-bold text-white font-tactical leading-snug tracking-wide text-amber-100">
          {withMemory.recommendation.action}
        </div>

        <p className="text-xs text-neutral-300 font-sans leading-relaxed pt-1">
          {withMemory.recommendation.reasoning}
        </p>

        <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono">
          <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-300">
            PROTOCOL: {withMemory.recommendation.suggestedProtocol}
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300">
            {withMemory.recalledMemories.length} RECALLED MISSIONS INFLUENCED DECISION
          </span>
        </div>
      </div>

      {/* Recalled Hindsight Memories Snippets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
          <span className="flex items-center gap-1.5 font-semibold">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            RECALLED HINDSIGHT EXPERIENCES ({withMemory.recalledMemories.length})
          </span>
          <span className="text-[11px] text-neutral-500">Click to inspect memory</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {withMemory.recalledMemories.map((mem) => {
            const isSuccess = mem.outcome === 'SURVIVOR_CONFIRMED';
            const isFalsePos = mem.outcome === 'FALSE_POSITIVE';

            return (
              <button
                key={mem.id}
                onClick={() => onSelectMemoryDetail(mem)}
                className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className="font-bold text-white group-hover:text-amber-300">{mem.id}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                    isSuccess ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30' :
                    isFalsePos ? 'bg-red-950/60 text-red-300 border border-red-500/30' :
                    'bg-neutral-800 text-neutral-300'
                  }`}>
                    {mem.outcome.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-300 line-clamp-2 leading-tight mb-1.5">
                  {mem.learnedLesson}
                </div>
                <div className="text-[10px] font-mono text-neutral-500 flex items-center justify-between">
                  <span>Gas {mem.sensorObservations.gasPpm} ppm</span>
                  <span className="text-amber-400/80">{mem.similarityScore || 90}% match</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Safety Controller Evaluation Section (Separated from LLM) */}
      <div className={`p-3 rounded-lg border ${
        isBlocked 
          ? 'bg-red-950/30 border-red-500/50 text-red-200' 
          : requiresOverride 
          ? 'bg-amber-950/30 border-amber-500/50 text-amber-200' 
          : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {isBlocked ? (
              <ShieldAlert className="w-4 h-4 text-red-400" />
            ) : requiresOverride ? (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            )}
            <span className="text-xs font-mono font-bold tracking-wider uppercase">
              SAFETY CONTROLLER STATUS:
            </span>
          </div>

          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
            isBlocked 
              ? 'bg-red-500 text-white' 
              : requiresOverride 
              ? 'bg-amber-500 text-neutral-950' 
              : 'bg-emerald-500 text-neutral-950'
          }`}>
            {safetyEvaluation.status}
          </span>
        </div>

        {/* Blocking explanation if triggered */}
        {safetyEvaluation.blockingReason && (
          <div className="text-xs font-mono font-semibold text-red-300 mb-2 p-2 bg-red-950/60 rounded border border-red-500/40">
            {safetyEvaluation.blockingReason}
          </div>
        )}

        {/* Rule checks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
          {safetyEvaluation.rulesChecked.map((rule) => (
            <div key={rule.id} className="p-1.5 bg-neutral-950/80 rounded border border-neutral-800">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="truncate">{rule.name}</span>
                {rule.passed ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-3 h-3 text-red-400 shrink-0" />
                )}
              </div>
              <div className="text-white font-semibold mt-0.5">
                {rule.metric} <span className="text-neutral-400 text-[9px]">({rule.threshold})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
