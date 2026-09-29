import React from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Flame, 
  Users, 
  Layers, 
  TrendingUp,
  Compass
} from 'lucide-react';
import { OperationalInsight } from '../types/rescue.ts';

interface LearningInsightsViewProps {
  insights: OperationalInsight[];
  totalMemories: number;
}

export const LearningInsightsView: React.FC<LearningInsightsViewProps> = ({
  insights,
  totalMemories,
}) => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <h2 className="text-base font-bold text-white font-tactical uppercase tracking-wider">
                Operational Learning Insights & Doctrines
              </h2>
            </div>
            <p className="text-xs text-neutral-400 mt-1 font-mono">
              Consolidated knowledge graph synthesized across {totalMemories} disaster rescue missions via Hindsight Reflect.
            </p>
          </div>

          <span className="text-xs font-mono text-neutral-400 bg-neutral-950 px-2.5 py-1 rounded border border-neutral-800">
            HINDSIGHT REFLECT SYNTHESIS: <strong className="text-emerald-400">ACTIVE</strong>
          </span>
        </div>

        <p className="pt-3 text-xs text-neutral-300 leading-relaxed font-sans">
          These rules are not pre-programmed heuristics. They are experiential doctrines extracted directly from historical mission successes, false alarms, and operator overrides. When RESQ encounters a new crisis, it evaluates these doctrines to avoid repeating costly tactical mistakes.
        </p>
      </div>

      {/* Grid of Key Doctrines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((ins) => {
          let categoryColor = 'text-amber-400 bg-amber-950/40 border-amber-500/30';
          let icon = <Layers className="w-4 h-4 text-amber-400" />;

          if (ins.category === 'FALSE_POSITIVE') {
            categoryColor = 'text-red-400 bg-red-950/40 border-red-500/30';
            icon = <AlertTriangle className="w-4 h-4 text-red-400" />;
          } else if (ins.category === 'HUMAN_DOCTRINE') {
            categoryColor = 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30';
            icon = <Users className="w-4 h-4 text-cyan-400" />;
          } else if (ins.category === 'SENSOR_FUSION') {
            categoryColor = 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';
            icon = <TrendingUp className="w-4 h-4 text-emerald-400" />;
          }

          return (
            <div
              key={ins.id}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-lg flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${categoryColor} flex items-center gap-1.5`}>
                    {icon}
                    <span>{ins.category.replace('_', ' ')}</span>
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400">
                    Reliability: <strong className="text-white font-bold">{(ins.reliabilityScore * 100).toFixed(0)}%</strong>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white font-tactical uppercase tracking-wide leading-snug">
                  {ins.title}
                </h3>

                <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                  {ins.description}
                </p>

                <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800/80 space-y-1">
                  <div className="text-[10px] font-mono text-neutral-500 uppercase font-semibold">
                    TACTICAL ACTION DIRECTIVE:
                  </div>
                  <div className="text-xs font-mono text-amber-300 font-medium">
                    "{ins.recommendedAction}"
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                <span>Derived from missions:</span>
                <div className="flex gap-1">
                  {ins.derivedFromMissions.map((m) => (
                    <span key={m} className="px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-200">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Learning Progression Note */}
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-amber-400 shrink-0" />
        <div className="text-xs text-neutral-300 font-sans leading-relaxed">
          <strong className="text-white">Continuous Knowledge Graph Expansion:</strong> Every time an operator approves or rejects an action and the final mission outcome is recorded, Hindsight updates its memory weights. As more missions are retained, false-alarm rates decline and clearance-negotiation doctrines become sharper.
        </div>
      </div>
    </div>
  );
};
