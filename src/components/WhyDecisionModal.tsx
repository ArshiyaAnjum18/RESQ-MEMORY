import React from 'react';
import { 
  HelpCircle, 
  X, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  ShieldAlert,
  Flame,
  Thermometer,
  Radio,
  FileText
} from 'lucide-react';
import { AgentDecisionResponse, HindsightMemory } from '../types/rescue.ts';

interface WhyDecisionModalProps {
  decision: AgentDecisionResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectMemory: (mem: HindsightMemory) => void;
}

export const WhyDecisionModal: React.FC<WhyDecisionModalProps> = ({
  decision,
  isOpen,
  onClose,
  onSelectMemory,
}) => {
  if (!isOpen || !decision) return null;

  const { sensorState, withMemory, withoutMemory } = decision;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-3xl w-full p-6 shadow-2xl my-8 space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-tactical uppercase tracking-wider">
                Why Did RESQ Decide This?
              </h2>
              <div className="text-xs font-mono text-neutral-400">
                EXPLAINABLE MEMORY EVIDENCE CHAIN & REASONING GROUNDING
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. CURRENT EVIDENCE */}
        <div className="space-y-2">
          <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>01. CURRENT EVIDENCE (TELEMETRY)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-500 block text-[10px]">ATMOSPHERIC GAS</span>
              <span className="text-sm font-bold text-amber-400">{sensorState.gasPpm} ppm</span>
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-500 block text-[10px]">THERMAL CONFIDENCE</span>
              <span className="text-sm font-bold text-red-400">{(sensorState.thermalConfidence * 100).toFixed(0)}%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-500 block text-[10px]">PIR MOTION</span>
              <span className="text-sm font-bold text-neutral-200">{sensorState.motionDetected ? 'DETECTED' : 'CLEAR'}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-500 block text-[10px]">STRUCTURAL RISK</span>
              <span className="text-sm font-bold text-amber-300">{sensorState.structuralRisk}</span>
            </div>
          </div>
        </div>

        {/* 2. HINDSIGHT MEMORIES RETRIEVED */}
        <div className="space-y-2">
          <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              02. RECALLED HINDSIGHT MEMORIES ({withMemory.recalledMemories.length} EXPERIENCES)
            </span>
            <span className="text-[10px] text-neutral-500 font-normal">Indexed in Hindsight Bank</span>
          </div>

          <div className="space-y-2">
            {withMemory.recalledMemories.map((mem) => {
              const isConfirmed = mem.outcome === 'SURVIVOR_CONFIRMED';
              const isFalse = mem.outcome === 'FALSE_POSITIVE';

              return (
                <div
                  key={mem.id}
                  onClick={() => {
                    onClose();
                    onSelectMemory(mem);
                  }}
                  className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 cursor-pointer transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white text-sm">{mem.id}: {mem.situation}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isConfirmed ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                      isFalse ? 'bg-red-950 text-red-300 border border-red-500/40' :
                      'bg-neutral-800 text-neutral-300'
                    }`}>
                      {mem.outcome}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-300 font-sans leading-relaxed">
                    <strong>Lesson:</strong> {mem.learnedLesson}
                  </div>
                  {mem.humanCorrection && (
                    <div className="text-[11px] font-mono text-red-300/90 bg-red-950/30 p-1.5 rounded">
                      <strong>Human Correction:</strong> {mem.humanCorrection}
                    </div>
                  )}
                  <div className="text-[10px] font-mono text-neutral-500 flex items-center gap-3">
                    <span>Gas: {mem.sensorObservations.gasPpm} ppm</span>
                    <span>Thermal: {(mem.sensorObservations.thermalConfidence * 100).toFixed(0)}%</span>
                    <span>Motion: {mem.sensorObservations.motionDetected ? 'Yes' : 'No'}</span>
                    <span className="text-amber-400">Match score: {mem.similarityScore || 92}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. LEARNED PATTERNS & PREVIOUS FAILURES AVERTED */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-1.5">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              LEARNED PATTERN APPLIED
            </span>
            <ul className="text-neutral-300 text-[11px] space-y-1 list-disc list-inside">
              {withMemory.learnedPatternsApplied.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-1.5">
            <span className="text-red-400 font-bold flex items-center gap-1.5 text-xs">
              <AlertTriangle className="w-3.5 h-3.5" />
              PREVIOUS FAILURE AVERTED
            </span>
            <ul className="text-neutral-300 text-[11px] space-y-1 list-disc list-inside">
              {withMemory.previousFailuresAverted.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4. THE DIFFERENCE MEMORY MADE */}
        <div className="p-3.5 bg-amber-950/20 border border-amber-500/40 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300">
            <span>CONCLUSION: WHY MEMORY CHANGED THIS DECISION</span>
          </div>

          <div className="text-xs text-neutral-200 leading-relaxed font-sans">
            {withMemory.whyChangedExplanation}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
            <div className="p-2 rounded bg-neutral-950 border border-neutral-800 text-neutral-400">
              <span className="text-red-400 block font-semibold mb-0.5">WITHOUT MEMORY:</span>
              <span>"{withoutMemory.recommendation.action}"</span>
            </div>
            <div className="p-2 rounded bg-neutral-950 border border-amber-500/30 text-amber-200">
              <span className="text-emerald-400 block font-semibold mb-0.5">WITH HINDSIGHT:</span>
              <span>"{withMemory.recommendation.action}"</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs font-semibold cursor-pointer"
          >
            Close Explanation
          </button>
        </div>
      </div>
    </div>
  );
};
