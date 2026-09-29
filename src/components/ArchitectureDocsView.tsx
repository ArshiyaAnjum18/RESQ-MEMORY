import React from 'react';
import { 
  BookOpen, 
  Layers, 
  Database, 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  CheckCircle2, 
  Workflow,
  Sparkles
} from 'lucide-react';

export const ArchitectureDocsView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Overview Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-white font-tactical uppercase tracking-wider">
            RESQ-MEM Technical Architecture & Hindsight Integration
          </h2>
        </div>
        <p className="text-xs text-neutral-300 mt-2 font-sans leading-relaxed">
          RESQ-MEM is an experiential disaster-response decision-support agent. It differs fundamentally from generic chatbots and sensor dashboards: it possesses genuine persistent memory powered by the Hindsight API, allowing it to remember past missions, reason over successful and failed outcomes, and continuously refine rescue decisions.
        </p>
      </div>

      {/* 1. The Central Learning Loop */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase">
          <Workflow className="w-4 h-4" />
          <span>01. THE EXPERIENTIAL LEARNING LOOP</span>
        </div>

        <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 font-mono text-xs text-neutral-300 overflow-x-auto">
          <div className="whitespace-pre text-amber-300 font-semibold leading-relaxed">
{`SENSE            [Robotic Sensor Telemetry + FLIR Thermal Optics]
  ↓
RECALL           [Hindsight: Multi-strategy semantic + sensor precedent search]
  ↓
REFLECT          [Hindsight: Reasoning loop over previous outcomes & failures]
  ↓
DECIDE           [Gemini 3.8 Agent: Formulates calibrated rescue protocol]
  ↓
SAFETY CHECK     [Deterministic Safety Controller: Evaluates physical rules]
  ↓
HUMAN DECISION   [Rescue Operator: Approves or Overrides with correction]
  ↓
OUTCOME          [Ground truth confirmation: Survivor / False Positive / Divert]
  ↓
RETAIN           [Hindsight: Ingests new structured experience & lessons]
  ↓
LEARN            [Future missions now recall this experience and improve decisions]`}
          </div>
        </div>
      </div>

      {/* 2. Real Hindsight API Integration */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
          <Database className="w-4 h-4" />
          <span>02. HINDSIGHT REST API SPECIFICATION</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-1">
            <span className="text-amber-400 font-bold block">1. RETAIN</span>
            <span className="text-[10px] text-neutral-500 block">POST /v1/default/banks/&#123;bank_id&#125;/memories</span>
            <p className="text-neutral-300 text-[11px] font-sans pt-1">
              Ingests structured disaster missions, sensor readings, decisions, operator corrections, and learned doctrines into the knowledge graph.
            </p>
          </div>

          <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-1">
            <span className="text-cyan-400 font-bold block">2. RECALL</span>
            <span className="text-[10px] text-neutral-500 block">POST /v1/default/banks/&#123;bank_id&#125;/memories/recall</span>
            <p className="text-neutral-300 text-[11px] font-sans pt-1">
              Multi-strategy search combining semantic queries with sensor proximity (gas, motion, thermal gradient, and structural collapse risk).
            </p>
          </div>

          <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-1">
            <span className="text-emerald-400 font-bold block">3. REFLECT</span>
            <span className="text-[10px] text-neutral-500 block">POST /v1/default/banks/&#123;bank_id&#125;/reflect</span>
            <p className="text-neutral-300 text-[11px] font-sans pt-1">
              Agentic synthesis across retrieved memories, weighing confirmed rescues against historical false positives to determine safe confidence.
            </p>
          </div>
        </div>

        {/* Environment Configuration */}
        <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 text-xs font-mono space-y-2">
          <span className="text-neutral-400 font-semibold">ENVIRONMENT CONFIGURATION (.env):</span>
          <pre className="text-neutral-300 text-[11px] overflow-x-auto leading-relaxed">
{`# Gemini Agent (Injected by AI Studio)
GEMINI_API_KEY="AIzaSy..."

# Hindsight Persistent Memory Configuration
HINDSIGHT_API_KEY="hs_..."
HINDSIGHT_BASE_URL="https://api.hindsight.vectorize.io"
HINDSIGHT_BANK_ID="resq-mem-disaster-response-v1"`}
          </pre>
          <div className="text-[10px] text-neutral-500">
            Note: When HINDSIGHT_API_KEY is not configured, RESQ transparently activates its verified demo fallback bank, clearly labeled in the status banner.
          </div>
        </div>
      </div>

      {/* 3. Safety Controller Separation */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-400 uppercase">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>03. INDEPENDENT SAFETY CONTROLLER</span>
        </div>

        <p className="text-xs text-neutral-300 font-sans leading-relaxed">
          The Gemini LLM is never given direct unmediated control of physical rover actuators or team dispatch. All agent recommendations pass through an independent, deterministic Safety Controller:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-neutral-950 rounded border border-neutral-800">
            <span className="text-red-400 font-bold block">RULE 1: CLEARANCE THRESHOLD</span>
            <span className="text-neutral-300 text-[11px]">Forward movement blocked if clearance &lt; 20 cm. Prevents chassis entrapment.</span>
          </div>
          <div className="p-2.5 bg-neutral-950 rounded border border-neutral-800">
            <span className="text-amber-400 font-bold block">RULE 2: COMBUSTIBLE GAS CEILING</span>
            <span className="text-neutral-300 text-[11px]">Forward entry blocked if atmospheric gas &ge; 1000 ppm. Mandates spark-containment.</span>
          </div>
          <div className="p-2.5 bg-neutral-950 rounded border border-neutral-800">
            <span className="text-red-400 font-bold block">RULE 3: FLASHOVER HEAT LIMIT</span>
            <span className="text-neutral-300 text-[11px]">Blocks entry if ambient temperature &ge; 55°C. Protects electronics and survival corridor.</span>
          </div>
          <div className="p-2.5 bg-neutral-950 rounded border border-neutral-800">
            <span className="text-cyan-400 font-bold block">RULE 4: STRUCTURAL OVERRIDE</span>
            <span className="text-neutral-300 text-[11px]">HIGH or CRITICAL collapse risk mandates explicit Human Operator sign-off.</span>
          </div>
        </div>
      </div>

      {/* 4. Hackathon 2-Minute Demo Sequence */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase">
          <Sparkles className="w-4 h-4" />
          <span>04. 2-MINUTE JUDGE DEMONSTRATION FLOW</span>
        </div>

        <ol className="list-decimal list-inside text-xs text-neutral-300 font-sans space-y-1.5 leading-relaxed">
          <li><strong>Introduce RESQ:</strong> Experiential disaster-response agent that learns from every rescue.</li>
          <li><strong>Select Scenario 4:</strong> High-gas incident (810 ppm gas, motion true, 41°C, 52 cm distance).</li>
          <li><strong>Click "Run RESQ Reasoning":</strong> Watch the pipeline execute Sense &rarr; Recall &rarr; Reflect &rarr; Decide.</li>
          <li><strong>Inspect Memory Comparison:</strong> Notice how without memory the agent makes a rash advance, whereas with Hindsight it stops at 52 cm standoff to confirm thermal signal because of RESQ-007 false-alarm precedent.</li>
          <li><strong>Click "Why This Decision?":</strong> Inspect the exact memory citations (RESQ-001, RESQ-007, RESQ-011).</li>
          <li><strong>Human Decision:</strong> Approve or Reject with operator note, and click <strong>"Retain Experience in Hindsight"</strong>.</li>
          <li><strong>Core Message:</strong> "Every rescue becomes experience for the next one."</li>
        </ol>
      </div>
    </div>
  );
};
