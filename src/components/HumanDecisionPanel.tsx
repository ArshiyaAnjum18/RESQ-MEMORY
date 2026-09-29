import React, { useState } from 'react';
import { 
  UserCheck, 
  Check, 
  X, 
  Database, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { 
  AgentDecisionResponse, 
  HumanDecisionType, 
  MissionOutcomeType, 
  HindsightMemory 
} from '../types/rescue.ts';

interface HumanDecisionPanelProps {
  decision: AgentDecisionResponse | null;
  onRetainExperience: (completedMemory: HindsightMemory) => Promise<void>;
  isRetaining: boolean;
  retainedSuccessId: string | null;
  onRunNextMission: () => void;
}

export const HumanDecisionPanel: React.FC<HumanDecisionPanelProps> = ({
  decision,
  onRetainExperience,
  isRetaining,
  retainedSuccessId,
  onRunNextMission,
}) => {
  const [humanDecision, setHumanDecision] = useState<HumanDecisionType>('PENDING');
  const [humanCorrection, setHumanCorrection] = useState<string>('');
  const [outcome, setOutcome] = useState<MissionOutcomeType>('SURVIVOR_CONFIRMED');
  const [learnedLesson, setLearnedLesson] = useState<string>('');
  const [showOverrideModal, setShowOverrideModal] = useState<boolean>(false);

  // Auto-fill default lesson based on current mission
  React.useEffect(() => {
    if (decision) {
      setHumanDecision('PENDING');
      setHumanCorrection('');
      if (decision.sensorState.gasPpm >= 600 && decision.sensorState.thermalConfidence >= 0.85) {
        setOutcome('SURVIVOR_CONFIRMED');
        setLearnedLesson('Standoff thermal dwell in volatile gas confirmed survivor while preventing chassis spark hazard.');
      } else if (decision.sensorState.motionDetected && decision.sensorState.thermalConfidence < 0.4) {
        setOutcome('FALSE_POSITIVE');
        setLearnedLesson('Verified motion false alarm from wind-blown debris; saved tactical rescue squad deployment.');
      } else {
        setOutcome('SURVIVOR_CONFIRMED');
        setLearnedLesson('Methodical sensor verification enabled safe approach in compromised sector.');
      }
    }
  }, [decision?.missionId]);

  if (!decision) return null;

  const handleApprove = () => {
    setHumanDecision('APPROVED');
    setShowOverrideModal(false);
  };

  const handleRejectClick = () => {
    setShowOverrideModal(true);
  };

  const handleConfirmOverride = () => {
    setHumanDecision('REJECTED');
    setShowOverrideModal(false);
    if (!humanCorrection) {
      setHumanCorrection('Structural instability observed. Diverted approach through reinforced secondary corridor.');
    }
    setLearnedLesson(`Human Operator Override: ${humanCorrection || 'Alternate safe route utilized; avoided high-risk corridor.'}`);
  };

  const handleRetainClick = async () => {
    const memoryToRetain: HindsightMemory = {
      id: decision.missionId,
      timestamp: new Date().toISOString(),
      situation: decision.situation,
      zone: decision.zone,
      environmentSummary: `Gas: ${decision.sensorState.gasPpm} ppm, Temp: ${decision.sensorState.temperatureC}°C, Clearance: ${decision.sensorState.distanceCm} cm, Structural: ${decision.sensorState.structuralRisk}`,
      sensorObservations: decision.sensorState,
      visionObservations: decision.visionAnalysis,
      agentReasoning: decision.withMemory.recommendation.reasoning,
      agentRecommendation: decision.withMemory.recommendation.action,
      safetyStatus: decision.safetyEvaluation,
      humanDecision,
      humanCorrection: humanDecision === 'REJECTED' || humanDecision === 'MODIFIED' ? humanCorrection : undefined,
      actionTaken: humanDecision === 'APPROVED' ? decision.withMemory.recommendation.action : `Operator Override: ${humanCorrection}`,
      outcome,
      success: outcome === 'SURVIVOR_CONFIRMED' || outcome === 'HAZARD_AVOIDED',
      failureReason: outcome === 'FALSE_POSITIVE' ? 'Decoy or non-biological motion source' : undefined,
      learnedLesson,
      tags: [
        decision.sensorState.gasPpm >= 600 ? 'high-gas' : 'standard-gas',
        decision.sensorState.motionDetected ? 'motion-active' : 'motion-clear',
        outcome.toLowerCase().replace('_', '-'),
        decision.zone.toLowerCase().replace(/\s+/g, '-'),
      ],
    };

    await onRetainExperience(memoryToRetain);
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-white font-tactical uppercase tracking-wider">
            Human-in-the-Loop Operator Gate
          </h2>
        </div>
        <span className="text-[11px] font-mono text-neutral-400">
          OPERATOR AUTHORITY MANDATORY
        </span>
      </div>

      {/* Operator Decision Action Buttons */}
      <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800">
        <div className="text-xs font-mono text-neutral-400 mb-2 flex items-center justify-between">
          <span>OPERATOR REVIEW: EVALUATE RESQ RECOMMENDATION</span>
          <span className="font-semibold text-white">Status: {humanDecision}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleApprove}
            className={`flex items-center justify-center gap-2 p-3 rounded-lg border font-mono font-bold text-xs transition-all cursor-pointer ${
              humanDecision === 'APPROVED'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500'
                : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-emerald-500/50 hover:text-white'
            }`}
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>[APPROVE RECOMMENDATION]</span>
          </button>

          <button
            onClick={handleRejectClick}
            className={`flex items-center justify-center gap-2 p-3 rounded-lg border font-mono font-bold text-xs transition-all cursor-pointer ${
              humanDecision === 'REJECTED'
                ? 'bg-red-500/20 border-red-500 text-red-300 ring-1 ring-red-500'
                : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-red-500/50 hover:text-white'
            }`}
          >
            <X className="w-4 h-4 text-red-400" />
            <span>[REJECT / OVERRIDE ROUTE]</span>
          </button>
        </div>

        {/* Override Note Display */}
        {humanDecision === 'REJECTED' && (
          <div className="mt-3 p-2.5 rounded bg-red-950/40 border border-red-500/40 text-xs font-mono">
            <div className="text-red-300 font-bold mb-1 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>HUMAN OPERATOR CORRECTION RECORDED:</span>
            </div>
            <div className="text-neutral-200">{humanCorrection || 'Structural instability detected in primary column. Use alternate route.'}</div>
          </div>
        )}
      </div>

      {/* Outcome Recording Section (Active once Human has made a decision) */}
      {humanDecision !== 'PENDING' && (
        <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-3">
          <div className="text-xs font-mono text-neutral-400 flex items-center justify-between">
            <span>GROUND TRUTH MISSION OUTCOME:</span>
            <span className="text-amber-400 font-bold">WILL BE RETAINED IN HINDSIGHT</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            {[
              { id: 'SURVIVOR_CONFIRMED', label: 'Survivor Confirmed', color: 'emerald' },
              { id: 'FALSE_POSITIVE', label: 'False Positive', color: 'red' },
              { id: 'HAZARD_AVOIDED', label: 'Hazard Avoided', color: 'cyan' },
              { id: 'ROUTE_DIVERTED', label: 'Route Diverted', color: 'amber' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setOutcome(opt.id as MissionOutcomeType)}
                className={`p-2 rounded border text-left cursor-pointer transition-colors ${
                  outcome === opt.id
                    ? 'bg-neutral-800 border-white text-white font-bold'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div>
            <div className="text-[11px] font-mono text-neutral-400 mb-1">
              LEARNED LESSON (Ingested into Hindsight Knowledge Graph):
            </div>
            <textarea
              value={learnedLesson}
              onChange={(e) => setLearnedLesson(e.target.value)}
              rows={2}
              className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-xs font-mono text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* RETAIN TRIGGER */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="text-[11px] font-mono text-neutral-400">
              Closes the learning loop: <strong className="text-amber-300">SENSE → DECIDE → OUTCOME → RETAIN</strong>
            </div>

            <button
              onClick={handleRetainClick}
              disabled={isRetaining}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-tactical font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-950/50 cursor-pointer disabled:opacity-50"
            >
              <Database className="w-4 h-4" />
              <span>{isRetaining ? 'RETAINING IN HINDSIGHT...' : 'RETAIN EXPERIENCE IN HINDSIGHT'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Retain Confirmation Celebration Banner */}
      {retainedSuccessId === decision.missionId && (
        <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/50 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 font-mono text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>✓ RETAINED: Mission {decision.missionId} permanently indexed in Hindsight memory bank!</span>
          </div>
          <p className="text-xs text-neutral-300 font-sans">
            Every rescue becomes experience for the next one. On the next similar incident, RESQ will recall this outcome and human intervention.
          </p>
          <div className="pt-1">
            <button
              onClick={onRunNextMission}
              className="flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-500 text-neutral-950 text-xs font-mono font-bold hover:bg-emerald-400 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>SIMULATE NEXT MISSION (TEST MEMORY RECALL)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Operator Override Modal Dialog */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-red-400">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-tactical font-bold text-base uppercase text-white">
                Human Rescue Operator Override
              </h3>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              You are rejecting the AI Agent's recommendation. Enter the operational reason for this correction. This guidance will be stored in Hindsight memory so future missions avoid this error.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-neutral-400">
                Operator Correction & Route Alternative:
              </label>
              <textarea
                value={humanCorrection}
                onChange={(e) => setHumanCorrection(e.target.value)}
                placeholder="e.g. Structural instability detected in primary column. Use alternate western hatch."
                rows={3}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-xs font-mono text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowOverrideModal(false)}
                className="px-3 py-1.5 rounded border border-neutral-700 text-neutral-400 hover:text-white text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOverride}
                className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold"
              >
                Confirm Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
