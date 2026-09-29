import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  Trophy, 
  AlertTriangle, 
  UserCheck, 
  ShieldCheck, 
  ChevronRight,
  X,
  Flame,
  Thermometer,
  Ruler,
  Radio,
  FileText,
  Calendar,
  Sparkles,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { HindsightMemory, MissionOutcomeType, HindsightConnectionState } from '../types/rescue.ts';

interface HindsightBankViewProps {
  memories: HindsightMemory[];
  bankId: string;
  isLiveApi: boolean;
  connectionState?: HindsightConnectionState;
  onSelectMemory: (mem: HindsightMemory) => void;
  onTestConnection?: () => void;
  onSeedExperiences?: () => void;
  isSeeding?: boolean;
}

export const HindsightBankView: React.FC<HindsightBankViewProps> = ({
  memories,
  bankId,
  isLiveApi,
  connectionState = 'NOT CONFIGURED',
  onSelectMemory,
  onTestConnection,
  onSeedExperiences,
  isSeeding = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState<string>('ALL');
  const [inspectMemory, setInspectMemory] = useState<HindsightMemory | null>(null);

  // Compute metrics from actual bank memories
  const total = memories.length;
  const confirmed = memories.filter((m) => m.outcome === 'SURVIVOR_CONFIRMED').length;
  const falsePositives = memories.filter((m) => m.outcome === 'FALSE_POSITIVE').length;
  const overrides = memories.filter((m) => m.humanDecision === 'REJECTED' || m.humanDecision === 'MODIFIED').length;

  // Filter memories
  const filtered = memories.filter((m) => {
    const matchesSearch = 
      m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.situation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.learnedLesson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.zone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOutcome = 
      outcomeFilter === 'ALL' || m.outcome === outcomeFilter;

    return matchesSearch && matchesOutcome;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Fallback Banner if Hindsight is NOT connected */}
      {!isLiveApi && (
        <div className="p-4 bg-amber-950/40 border border-amber-500/50 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                DEMO FALLBACK — HINDSIGHT NOT CONNECTED
              </div>
              <p className="text-xs text-neutral-300 font-sans mt-0.5">
                Displaying local fallback memories. Connect your real Hindsight Cloud API key to query and retain live disaster records.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onTestConnection && (
              <button
                onClick={onTestConnection}
                className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-neutral-950 font-mono font-bold text-xs transition-colors cursor-pointer"
              >
                TEST HINDSIGHT CONNECTION
              </button>
            )}
          </div>
        </div>
      )}

      {/* Live Connected Banner */}
      {isLiveApi && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                <span>HINDSIGHT: CONNECTED</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  LIVE CLOUD MEMORY BANK
                </span>
              </div>
              <p className="text-xs text-neutral-300 font-sans mt-0.5">
                Authenticated with memory bank <strong className="text-white font-mono">{bankId}</strong>. Real missions are retained, recalled, and reflected.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onTestConnection && (
              <button
                onClick={onTestConnection}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-900 border border-neutral-700 hover:border-emerald-500 text-emerald-300 text-xs font-mono font-semibold transition-colors cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>TEST CONNECTION</span>
              </button>
            )}

            {onSeedExperiences && (
              <button
                onClick={onSeedExperiences}
                disabled={isSeeding}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-mono font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isSeeding ? 'SEEDING...' : 'SEED RESQ EXPERIENCES'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl">
          <div className="text-[11px] font-mono text-neutral-400 mb-1 flex items-center justify-between">
            <span>TOTAL MEMORIES</span>
            <Database className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{total}</div>
          <div className="text-[10px] text-neutral-500 font-mono mt-0.5 truncate" title={bankId}>
            Bank: {bankId.slice(0, 18)}...
          </div>
        </div>

        <div className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl">
          <div className="text-[11px] font-mono text-neutral-400 mb-1 flex items-center justify-between">
            <span>SURVIVORS CONFIRMED</span>
            <Trophy className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">{confirmed}</div>
          <div className="text-[10px] text-neutral-500 font-mono mt-0.5">Verified rescues</div>
        </div>

        <div className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl">
          <div className="text-[11px] font-mono text-neutral-400 mb-1 flex items-center justify-between">
            <span>FALSE POSITIVES</span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-400">{falsePositives}</div>
          <div className="text-[10px] text-neutral-500 font-mono mt-0.5">Cataloged decoy lessons</div>
        </div>

        <div className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl">
          <div className="text-[11px] font-mono text-neutral-400 mb-1 flex items-center justify-between">
            <span>HUMAN OVERRIDES</span>
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">{overrides}</div>
          <div className="text-[10px] text-neutral-500 font-mono mt-0.5">Route & doctrine corrections</div>
        </div>

        <div className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl">
          <div className="text-[11px] font-mono text-neutral-400 mb-1 flex items-center justify-between">
            <span>HINDSIGHT STATUS</span>
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className={`text-base font-bold font-mono ${isLiveApi ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isLiveApi ? 'CONNECTED' : connectionState}
          </div>
          <div className="text-[10px] text-neutral-500 font-mono mt-0.5 truncate">
            {isLiveApi ? 'Authenticated Cloud Bank' : 'Demo Fallback Active'}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search mission situation, zone, or learned lesson..."
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-neutral-400">OUTCOME:</span>
          {['ALL', 'SURVIVOR_CONFIRMED', 'FALSE_POSITIVE'].map((f) => (
            <button
              key={f}
              onClick={() => setOutcomeFilter(f)}
              className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                outcomeFilter === f
                  ? 'bg-neutral-800 border-white text-white font-bold'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {f === 'ALL' ? 'All Missions' : f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Memory Timeline List */}
      <div className="space-y-3">
        {filtered.map((mem) => {
          const isConfirmed = mem.outcome === 'SURVIVOR_CONFIRMED';
          const isFalse = mem.outcome === 'FALSE_POSITIVE';
          const hasOverride = mem.humanDecision === 'REJECTED' || mem.humanDecision === 'MODIFIED';
          const isDemoFallback = !isLiveApi || mem.tags?.includes('DEMO FALLBACK — HINDSIGHT NOT CONNECTED');

          return (
            <div
              key={mem.id}
              onClick={() => setInspectMemory(mem)}
              className="bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-xl p-4 transition-all cursor-pointer shadow-md group"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold font-mono text-amber-400 group-hover:text-amber-300">
                    {mem.id}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    · {mem.zone}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(mem.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isDemoFallback ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                      DEMO FALLBACK — HINDSIGHT NOT CONNECTED
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                      HINDSIGHT CLOUD
                    </span>
                  )}
                  {hasOverride && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      HUMAN OVERRIDE
                    </span>
                  )}
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded ${
                    isConfirmed ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                    isFalse ? 'bg-red-950 text-red-300 border border-red-500/40' :
                    'bg-neutral-800 text-neutral-300'
                  }`}>
                    {mem.outcome.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Situation */}
              <p className="text-xs font-sans text-neutral-200 mb-2 leading-relaxed">
                {mem.situation}
              </p>

              {/* Learned Lesson Highlight */}
              <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80 text-xs font-mono text-neutral-300 mb-3">
                <strong className="text-amber-400 font-semibold">Learned Lesson:</strong> {mem.learnedLesson}
              </div>

              {/* Sensor Summary Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-neutral-400 pt-1 border-t border-neutral-800">
                <div className="flex items-center gap-3">
                  <span>Gas: <strong className="text-neutral-200">{mem.sensorObservations.gasPpm} ppm</strong></span>
                  <span>Temp: <strong className="text-neutral-200">{mem.sensorObservations.temperatureC}°C</strong></span>
                  <span>Motion: <strong className="text-neutral-200">{mem.sensorObservations.motionDetected ? 'Yes' : 'No'}</strong></span>
                  <span>Thermal: <strong className="text-neutral-200">{(mem.sensorObservations.thermalConfidence * 100).toFixed(0)}%</strong></span>
                  <span>Risk: <strong className="text-neutral-200">{mem.sensorObservations.structuralRisk}</strong></span>
                </div>

                <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Inspect Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Memory Deep Inspection Drawer / Modal */}
      {inspectMemory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold">{inspectMemory.id}</span>
                <h3 className="text-base font-bold text-white font-tactical uppercase">
                  {inspectMemory.situation}
                </h3>
              </div>
              <button
                onClick={() => setInspectMemory(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                <div className="text-[10px] text-neutral-500 mb-1">ENVIRONMENT & SENSORS</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>Gas: <strong>{inspectMemory.sensorObservations.gasPpm} ppm</strong></div>
                  <div>Temp: <strong>{inspectMemory.sensorObservations.temperatureC}°C</strong></div>
                  <div>Clearance: <strong>{inspectMemory.sensorObservations.distanceCm} cm</strong></div>
                  <div>Risk: <strong>{inspectMemory.sensorObservations.structuralRisk}</strong></div>
                  <div>Motion: <strong>{inspectMemory.sensorObservations.motionDetected ? 'Detected' : 'Clear'}</strong></div>
                  <div>Thermal: <strong>{(inspectMemory.sensorObservations.thermalConfidence * 100).toFixed(0)}%</strong></div>
                  <div>Survivor Opt: <strong>{(inspectMemory.sensorObservations.survivorConfidence * 100).toFixed(0)}%</strong></div>
                  <div>Outcome: <strong className="text-amber-400">{inspectMemory.outcome}</strong></div>
                </div>
              </div>

              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-1">
                <div className="text-[10px] text-neutral-500">AGENT RECOMMENDATION</div>
                <div className="text-white font-semibold">{inspectMemory.agentRecommendation}</div>
                <p className="text-neutral-400 font-sans text-xs pt-1">{inspectMemory.agentReasoning}</p>
              </div>

              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-1">
                <div className="text-[10px] text-neutral-500">HUMAN DECISION & CORRECTION</div>
                <div className="text-white">Decision: <strong className="text-cyan-400">{inspectMemory.humanDecision}</strong></div>
                {inspectMemory.humanCorrection && (
                  <div className="text-amber-300 font-sans pt-1">Correction: "{inspectMemory.humanCorrection}"</div>
                )}
              </div>

              <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-lg space-y-1">
                <div className="text-[10px] text-amber-400 font-bold uppercase">INGESTED HINDSIGHT LESSON</div>
                <div className="text-neutral-200 font-sans text-xs leading-relaxed">{inspectMemory.learnedLesson}</div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectMemory(null)}
                className="px-4 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
