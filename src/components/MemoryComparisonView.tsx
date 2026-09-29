import React from 'react';
import { 
  GitCompare, 
  AlertTriangle, 
  CheckCircle2, 
  Brain, 
  Database, 
  Flame, 
  Thermometer, 
  Radio, 
  ShieldAlert,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { AgentDecisionResponse } from '../types/rescue.ts';

interface MemoryComparisonViewProps {
  decision: AgentDecisionResponse | null;
  onSimulateSimilarIncident: () => void;
  isProcessing: boolean;
}

export const MemoryComparisonView: React.FC<MemoryComparisonViewProps> = ({
  decision,
  onSimulateSimilarIncident,
  isProcessing,
}) => {
  if (!decision) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center max-w-4xl mx-auto my-6 space-y-4">
        <GitCompare className="w-12 h-12 text-neutral-600 mx-auto" />
        <h3 className="text-lg font-tactical font-bold text-white uppercase tracking-wider">
          Memory Comparison Standby
        </h3>
        <p className="text-xs text-neutral-400 font-mono max-w-md mx-auto">
          Run a mission in the Command Center or click below to launch the comparative demonstration.
        </p>
        <button
          onClick={onSimulateSimilarIncident}
          disabled={isProcessing}
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-tactical font-bold text-xs uppercase tracking-wider cursor-pointer"
        >
          {isProcessing ? 'PROCESSING...' : 'RUN BEFORE VS AFTER DEMONSTRATION'}
        </button>
      </div>
    );
  }

  const { withoutMemory, withMemory, sensorState, missionId, zone } = decision;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white font-tactical uppercase tracking-wider">
                The Core Differentiator: Memory In Action
              </h2>
            </div>
            <p className="text-xs text-neutral-400 mt-1 font-mono">
              Live side-by-side contrast of decision-making for Mission <strong className="text-white">{missionId}</strong> in <strong className="text-amber-300">{zone}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-neutral-400 bg-neutral-950 px-2.5 py-1 rounded border border-neutral-800">
              Atmosphere: Gas <strong className="text-amber-400">{sensorState.gasPpm} ppm</strong> | Therm: <strong className="text-red-400">{(sensorState.thermalConfidence * 100).toFixed(0)}%</strong>
            </span>
          </div>
        </div>

        <div className="pt-3 text-xs text-neutral-300 leading-relaxed font-sans">
          Without persistent memory, an AI agent treats every emergency as a sterile, isolated event—falling victim to repeating identical false alarms or unsafe penetrations. With Hindsight, RESQ recalls specific precedent missions, balances successes against failure cases, and calibrates its behavior accordingly.
        </div>
      </div>

      {/* Side-by-Side Dual Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT COLUMN: WITHOUT HINDSIGHT */}
        <div className="bg-neutral-900 border border-red-500/30 rounded-xl p-5 shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-500/60" />

          <div className="space-y-3">
            {/* Column Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase">
                <AlertTriangle className="w-4 h-4" />
                <span>WITHOUT MEMORY (ISOLATED AGENT)</span>
              </div>
              <span className="text-[10px] font-mono bg-red-950/60 text-red-300 border border-red-500/30 px-2 py-0.5 rounded">
                NAIVE HEURISTIC
              </span>
            </div>

            <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-1">
              <div className="text-[10px] font-mono text-neutral-500">INPUT SCOPE</div>
              <div className="text-xs font-mono text-neutral-300">
                Only the immediate sensor telemetry: Gas {sensorState.gasPpm} ppm, Motion {sensorState.motionDetected ? 'True' : 'False'}, Thermal {sensorState.thermalConfidence}.
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-4 rounded-lg bg-red-950/20 border border-red-500/30 space-y-2">
              <div className="text-[10px] font-mono text-red-400 uppercase font-semibold">
                AGENT RECOMMENDATION:
              </div>
              <div className="text-sm font-bold text-white font-tactical text-red-100">
                "{withoutMemory.recommendation.action}"
              </div>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed pt-1">
                {withoutMemory.recommendation.reasoning}
              </p>
            </div>

            {/* Fatal Flaw / Risk */}
            <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-1.5">
              <div className="text-xs font-mono font-bold text-red-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>OPERATIONAL VULNERABILITY:</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                {withoutMemory.flawExplanation}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-800 text-[11px] font-mono text-neutral-500 flex items-center justify-between">
            <span>Historical Memory Used: <strong>0 missions</strong></span>
            <span className="text-red-400">High Risk of Repeat Failure</span>
          </div>
        </div>

        {/* RIGHT COLUMN: WITH HINDSIGHT */}
        <div className="bg-neutral-900 border border-emerald-500/40 rounded-xl p-5 shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />

          <div className="space-y-3">
            {/* Column Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>WITH HINDSIGHT PERSISTENT MEMORY</span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                EMPIRICALLY GROUNDED
              </span>
            </div>

            <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-1">
              <div className="text-[10px] font-mono text-neutral-400">RECALLED PRECEDENT MISSIONS</div>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {withMemory.recalledMemories.map((m) => (
                  <span key={m.id} className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-amber-300">
                    {m.id} ({m.outcome.replace('_', ' ')})
                  </span>
                ))}
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <div className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                CALIBRATED RESQ RECOMMENDATION:
              </div>
              <div className="text-sm font-bold text-white font-tactical text-emerald-100">
                "{withMemory.recommendation.action}"
              </div>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed pt-1">
                {withMemory.recommendation.reasoning}
              </p>
            </div>

            {/* Learned Doctrine */}
            <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-1.5">
              <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>PREVIOUS FAILURES AVERTED BY MEMORY:</span>
              </div>
              <ul className="text-xs text-neutral-300 leading-relaxed font-sans list-disc list-inside space-y-0.5">
                {withMemory.previousFailuresAverted.map((fa, i) => (
                  <li key={i}>{fa}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-800 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
            <span>Historical Memory Used: <strong className="text-amber-300">{withMemory.recalledMemories.length} missions</strong></span>
            <span className="text-emerald-400 font-semibold">Safe Standoff Verified</span>
          </div>
        </div>
      </div>

      {/* Synthesis Banner */}
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
        <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>SYNTHESIZED DIFFERENCE: HOW THE AGENT EVOLVED</span>
        </div>
        <p className="text-xs text-neutral-300 font-sans leading-relaxed">
          {withMemory.whyChangedExplanation}
        </p>
      </div>
    </div>
  );
};
