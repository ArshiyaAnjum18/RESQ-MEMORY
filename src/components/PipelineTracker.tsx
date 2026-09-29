import React from 'react';
import { 
  Eye, 
  Search, 
  Sparkles, 
  BrainCircuit, 
  ShieldCheck, 
  UserCheck, 
  Trophy, 
  ArrowRight,
  Database
} from 'lucide-react';

export type PipelineStage = 
  | 'SENSE'
  | 'RECALL'
  | 'REFLECT'
  | 'DECIDE'
  | 'SAFETY_CHECK'
  | 'HUMAN_DECISION'
  | 'OUTCOME'
  | 'RETAIN';

interface PipelineTrackerProps {
  currentStage: PipelineStage;
  recalledCount: number;
  retainedCount: number;
  safetyStatus: string;
  humanStatus: string;
}

const STAGES: Array<{
  id: PipelineStage;
  label: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  isHindsight?: boolean;
}> = [
  { id: 'SENSE', label: '1. SENSE', sub: 'Sensors + FLIR', icon: Eye },
  { id: 'RECALL', label: '2. RECALL', sub: 'Hindsight Query', icon: Search, isHindsight: true },
  { id: 'REFLECT', label: '3. REFLECT', sub: 'Reason Precedents', icon: Sparkles, isHindsight: true },
  { id: 'DECIDE', label: '4. DECIDE', sub: 'Agent Recommendation', icon: BrainCircuit },
  { id: 'SAFETY_CHECK', label: '5. SAFETY', sub: 'Deterministic Gate', icon: ShieldCheck },
  { id: 'HUMAN_DECISION', label: '6. HUMAN', sub: 'Approve / Override', icon: UserCheck },
  { id: 'OUTCOME', label: '7. OUTCOME', sub: 'Ground Truth Result', icon: Trophy },
  { id: 'RETAIN', label: '8. RETAIN', sub: 'Hindsight Ingest', icon: Database, isHindsight: true },
];

export const PipelineTracker: React.FC<PipelineTrackerProps> = ({
  currentStage,
  recalledCount,
  safetyStatus,
  humanStatus,
}) => {
  const currentIndex = STAGES.findIndex((s) => s.id === currentStage);

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-3 shadow-md mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400">
            Experiential Loop:
          </span>
          <span className="text-xs font-mono text-amber-400 font-bold">
            {STAGES[currentIndex]?.label} — {STAGES[currentIndex]?.sub}
          </span>
        </div>
        <div className="text-[11px] font-mono text-neutral-500">
          {recalledCount > 0 && `Recalled: ${recalledCount} past missions | `}
          Safety: <span className={safetyStatus === 'ALLOWED' ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>{safetyStatus}</span> | 
          Human: <span className="text-neutral-300">{humanStatus}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isCurrent = stage.id === currentStage;
          const isPassed = idx < currentIndex;

          let badgeColor = 'bg-neutral-950/60 border-neutral-800 text-neutral-500';
          if (isCurrent) {
            badgeColor = stage.isHindsight
              ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-950/50'
              : 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-950/50';
          } else if (isPassed) {
            badgeColor = 'bg-neutral-800/80 border-neutral-700 text-neutral-300';
          }

          return (
            <div
              key={stage.id}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all ${badgeColor} relative`}
            >
              <div className="flex items-center gap-1 mb-1">
                <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'animate-pulse' : ''}`} />
                {stage.isHindsight && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                    HINDSIGHT
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold font-mono tracking-tight leading-tight">
                {stage.label.split('. ')[1]}
              </span>
              <span className="text-[9px] text-neutral-400 truncate max-w-full">
                {stage.sub}
              </span>

              {idx < STAGES.length - 1 && (
                <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                  <ArrowRight className="w-2.5 h-2.5 text-neutral-600" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
