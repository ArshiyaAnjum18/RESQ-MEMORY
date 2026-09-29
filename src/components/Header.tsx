import React from 'react';
import { 
  ShieldAlert, 
  Brain, 
  Database, 
  Radio, 
  Eye, 
  Sparkles, 
  GitCompare, 
  Lightbulb, 
  BookOpen, 
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Activity
} from 'lucide-react';
import { SystemStatus, HindsightConnectionState } from '../types/rescue.ts';

interface HeaderProps {
  currentTab: 'command' | 'comparison' | 'timeline' | 'insights' | 'docs';
  setCurrentTab: (tab: 'command' | 'comparison' | 'timeline' | 'insights' | 'docs') => void;
  status: SystemStatus | null;
  activeMissionId: string;
  onSimulateSimilarIncident: () => void;
  onResetBank: () => void;
  isSimulating: boolean;
  onOpenConnectionModal: () => void;
  onSeedExperiences: () => void;
  isSeeding: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  status,
  activeMissionId,
  onSimulateSimilarIncident,
  onResetBank,
  isSimulating,
  onOpenConnectionModal,
  onSeedExperiences,
  isSeeding,
}) => {
  const hindsightState: HindsightConnectionState = 
    status?.hindsight.state || (status?.hindsight.connected ? 'CONNECTED' : 'NOT CONFIGURED');
  const isHindsightConnected = Boolean(status?.hindsight.connected && hindsightState === 'CONNECTED');

  return (
    <header className="border-b border-neutral-800 bg-neutral-950/95 sticky top-0 z-40 backdrop-blur">
      {/* Top Banner: Brand + Status Strip */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
            <ShieldAlert className="w-6 h-6 animate-pulse-subtle" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-wider text-white font-tactical uppercase">
                RESQ-MEM
              </h1>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono font-medium">
                RESCUE VISION
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Experiential Disaster-Response Agent that Learns From Every Mission
            </p>
          </div>
        </div>

        {/* Live Diagnostics Strip */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* Hindsight Status Badge: Shows CONNECTED only if real authenticated request succeeds */}
          <button 
            onClick={onOpenConnectionModal}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors cursor-pointer ${
              isHindsightConnected
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:border-emerald-400'
                : hindsightState === 'NOT CONFIGURED'
                ? 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:border-neutral-500'
                : 'bg-red-950/40 border-red-500/40 text-red-300 hover:border-red-400'
            }`}
            title="Click to view real Hindsight connection diagnostics"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="font-semibold">HINDSIGHT:</span>
            <span className="font-bold">{isHindsightConnected ? 'CONNECTED' : hindsightState}</span>
            <span className="text-neutral-400 text-[10px]">({status?.hindsight.totalMemories || 0} mems)</span>
          </button>

          {/* Test Hindsight Connection Button */}
          <button
            onClick={onOpenConnectionModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded border bg-neutral-900 border-neutral-700 hover:border-amber-500/50 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Test real authenticated Hindsight Cloud API connection"
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>TEST CONNECTION</span>
          </button>

          {/* Gemini Agent Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border bg-cyan-950/30 border-cyan-500/40 text-cyan-300">
            <Brain className="w-3.5 h-3.5" />
            <span className="font-semibold">AGENT:</span>
            <span>{status?.gemini.connected ? 'GEMINI 3.8' : 'READY'}</span>
          </div>

          {/* Vision Feed */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border bg-neutral-900 border-neutral-700 text-neutral-300">
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>VISION: FLIR ACTIVE</span>
          </div>

          {/* Sensors */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border bg-neutral-900 border-neutral-700 text-neutral-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>SENSORS: 10Hz</span>
          </div>

          {/* Quick Demo Trigger Button */}
          <button
            onClick={onSimulateSimilarIncident}
            disabled={isSimulating}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-sans font-semibold shadow-lg shadow-amber-950/50 transition-all text-xs disabled:opacity-50 cursor-pointer active:scale-95"
            title="Generates a live incident matching historical high-gas conditions to showcase Hindsight recall and reasoning changes"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSimulating ? 'REASONING...' : 'SIMULATE SIMILAR INCIDENT'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between border-t border-neutral-800/80 bg-neutral-900/60">
        <nav className="flex items-center space-x-1 py-1.5 text-xs font-medium">
          <button
            onClick={() => setCurrentTab('command')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded transition-colors cursor-pointer ${
              currentTab === 'command'
                ? 'bg-neutral-800 text-white shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Command Center</span>
            <span className="font-mono text-[10px] text-amber-400/90 bg-amber-500/10 px-1.5 py-0.2 rounded">
              {activeMissionId}
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('comparison')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded transition-colors cursor-pointer ${
              currentTab === 'comparison'
                ? 'bg-neutral-800 text-white shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
            }`}
          >
            <GitCompare className="w-4 h-4 text-cyan-400" />
            <span>Memory Comparison</span>
            <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 rounded font-mono">
              Before vs After
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('timeline')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded transition-colors cursor-pointer ${
              currentTab === 'timeline'
                ? 'bg-neutral-800 text-white shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Hindsight Bank & Timeline</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded font-mono">
              {status?.hindsight.totalMemories || 0}
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('insights')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded transition-colors cursor-pointer ${
              currentTab === 'insights'
                ? 'bg-neutral-800 text-white shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span>Learning Insights</span>
          </button>

          <button
            onClick={() => setCurrentTab('docs')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded transition-colors cursor-pointer ${
              currentTab === 'docs'
                ? 'bg-neutral-800 text-white shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-neutral-400" />
            <span>Architecture & Specs</span>
          </button>
        </nav>

        {/* Action Controls: Seed RESQ Experiences & Reset Bank */}
        <div className="flex items-center gap-2">
          {/* SEED RESQ EXPERIENCES Button (Requirement 7) */}
          <button
            onClick={onSeedExperiences}
            disabled={isSeeding}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-xs font-mono font-semibold transition-colors cursor-pointer disabled:opacity-50"
            title="Make real Hindsight Retain calls for canonical missions RESQ-001, RESQ-007, RESQ-011, and RESQ-014"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isSeeding ? 'SEEDING...' : 'SEED RESQ EXPERIENCES'}</span>
          </button>

          {/* Reset Bank Button */}
          <button
            onClick={onResetBank}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded transition-colors font-mono cursor-pointer"
            title="Reset Hindsight bank to default canonical mission experiences"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Bank</span>
          </button>
        </div>
      </div>
    </header>
  );
};
