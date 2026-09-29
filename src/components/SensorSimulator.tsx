import React from 'react';
import { 
  Activity, 
  Flame, 
  Thermometer, 
  Droplets, 
  Radio, 
  Ruler, 
  Eye, 
  AlertTriangle,
  Sliders,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { SensorState, StructuralRiskLevel } from '../types/rescue.ts';

interface SensorSimulatorProps {
  sensors: SensorState;
  setSensors: React.Dispatch<React.SetStateAction<SensorState>>;
  onScenarioSelect: (scenarioNumber: number) => void;
  activeScenario: number | null;
  onRunDecision: () => void;
  isProcessing: boolean;
}

export const SensorSimulator: React.FC<SensorSimulatorProps> = ({
  sensors,
  setSensors,
  onScenarioSelect,
  activeScenario,
  onRunDecision,
  isProcessing,
}) => {
  const [showSliders, setShowSliders] = React.useState(false);

  // Status helper classes
  const gasColor = 
    sensors.gasPpm >= 1000 
      ? 'text-red-400 bg-red-950/40 border-red-500/40' 
      : sensors.gasPpm >= 600 
      ? 'text-amber-400 bg-amber-950/40 border-amber-500/40' 
      : 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40';

  const tempColor = 
    sensors.temperatureC >= 55 
      ? 'text-red-400 bg-red-950/40 border-red-500/40' 
      : sensors.temperatureC >= 40 
      ? 'text-amber-400 bg-amber-950/40 border-amber-500/40' 
      : 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40';

  const distColor = 
    sensors.distanceCm < 20 
      ? 'text-red-400 bg-red-950/40 border-red-500/40' 
      : sensors.distanceCm < 45 
      ? 'text-amber-400 bg-amber-950/40 border-amber-500/40' 
      : 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40';

  const riskColor = 
    sensors.structuralRisk === 'CRITICAL'
      ? 'text-red-400 bg-red-950/60 border-red-500/50'
      : sensors.structuralRisk === 'HIGH'
      ? 'text-amber-400 bg-amber-950/60 border-amber-500/50'
      : sensors.structuralRisk === 'MEDIUM'
      ? 'text-yellow-400 bg-yellow-950/40 border-yellow-500/40'
      : 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40';

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 shadow-lg">
      {/* Header & Scenario Selection */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white font-tactical uppercase tracking-wider">
            Live Sensor Telemetry HUD
          </h2>
          <span className="text-[11px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
            ROBOTIC SENSOR SUITE
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowSliders(!showSliders)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border transition-colors font-mono cursor-pointer ${
              showSliders
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Manual Tuning</span>
          </button>
        </div>
      </div>

      {/* Preset Scenarios Strip */}
      <div className="mb-4">
        <div className="text-[11px] font-mono text-neutral-400 mb-1.5 flex items-center justify-between">
          <span>SELECT MISSION SCENARIO:</span>
          <span className="text-amber-400 font-bold">Scenario 4 triggers historical Hindsight recall</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => onScenarioSelect(1)}
            className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
              activeScenario === 1
                ? 'bg-neutral-800 border-neutral-400 shadow-sm'
                : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold font-mono text-emerald-400">SCENARIO 1</span>
              {activeScenario === 1 && <CheckCircle className="w-3 h-3 text-emerald-400" />}
            </div>
            <div className="text-[11px] font-medium text-white truncate">Normal Exploration</div>
            <div className="text-[10px] text-neutral-400 font-mono mt-0.5">Gas 300 | Clr 100cm | Risk Low</div>
          </button>

          <button
            onClick={() => onScenarioSelect(2)}
            className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
              activeScenario === 2
                ? 'bg-neutral-800 border-amber-500 shadow-sm'
                : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold font-mono text-amber-400">SCENARIO 2</span>
              {activeScenario === 2 && <CheckCircle className="w-3 h-3 text-amber-400" />}
            </div>
            <div className="text-[11px] font-medium text-white truncate">Survivor with Hazard</div>
            <div className="text-[10px] text-neutral-400 font-mono mt-0.5">Gas 800 | Therm 0.93 | Risk High</div>
          </button>

          <button
            onClick={() => onScenarioSelect(3)}
            className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
              activeScenario === 3
                ? 'bg-neutral-800 border-yellow-500 shadow-sm'
                : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold font-mono text-yellow-400">SCENARIO 3</span>
              {activeScenario === 3 && <CheckCircle className="w-3 h-3 text-yellow-400" />}
            </div>
            <div className="text-[11px] font-medium text-white truncate">False Positive Precedent</div>
            <div className="text-[10px] text-neutral-400 font-mono mt-0.5">Motion True | Weak Therm 0.28</div>
          </button>

          <button
            onClick={() => onScenarioSelect(4)}
            className={`p-2 rounded-lg border text-left transition-all cursor-pointer relative overflow-hidden ${
              activeScenario === 4
                ? 'bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                : 'bg-neutral-950/90 border-amber-500/40 hover:border-amber-400'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold font-mono text-amber-300 flex items-center gap-1">
                SCENARIO 4 <span className="text-[9px] bg-amber-500/30 px-1 rounded text-amber-200">KEY DEMO</span>
              </span>
              {activeScenario === 4 && <CheckCircle className="w-3 h-3 text-amber-400" />}
            </div>
            <div className="text-[11px] font-medium text-white truncate">Similar Incident (Recall)</div>
            <div className="text-[10px] text-amber-300/80 font-mono mt-0.5">Gas 810 | Therm 0.91 | Clr 52cm</div>
          </button>
        </div>
      </div>

      {/* Sensor Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
        {/* Combustible Gas */}
        <div className={`p-2.5 rounded-lg border ${gasColor}`}>
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
            <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5" /> COMBUSTIBLE GAS</span>
            <span className="text-[10px]">{sensors.gasPpm >= 1000 ? 'EXPLOSIVE' : sensors.gasPpm >= 600 ? 'ELEVATED' : 'SAFE'}</span>
          </div>
          <div className="text-xl font-bold font-mono tracking-tight">
            {sensors.gasPpm} <span className="text-xs font-normal">ppm</span>
          </div>
          <div className="w-full bg-neutral-950 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                sensors.gasPpm >= 1000 ? 'bg-red-500' : sensors.gasPpm >= 600 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, (sensors.gasPpm / 1500) * 100)}%` }}
            />
          </div>
        </div>

        {/* Ambient Temperature */}
        <div className={`p-2.5 rounded-lg border ${tempColor}`}>
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
            <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5" /> TEMPERATURE</span>
            <span className="text-[10px]">{sensors.temperatureC >= 55 ? 'FLASHOVER' : 'STABLE'}</span>
          </div>
          <div className="text-xl font-bold font-mono tracking-tight">
            {sensors.temperatureC} <span className="text-xs font-normal">°C</span>
          </div>
          <div className="w-full bg-neutral-950 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                sensors.temperatureC >= 55 ? 'bg-red-500' : sensors.temperatureC >= 40 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, (sensors.temperatureC / 70) * 100)}%` }}
            />
          </div>
        </div>

        {/* Ultrasonic Distance Clearance */}
        <div className={`p-2.5 rounded-lg border ${distColor}`}>
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
            <span className="flex items-center gap-1"><Ruler className="w-3.5 h-3.5" /> CLEARANCE</span>
            <span className="text-[10px]">{sensors.distanceCm < 20 ? 'PINCH POINT' : 'NAVIGABLE'}</span>
          </div>
          <div className="text-xl font-bold font-mono tracking-tight">
            {sensors.distanceCm} <span className="text-xs font-normal">cm</span>
          </div>
          <div className="w-full bg-neutral-950 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                sensors.distanceCm < 20 ? 'bg-red-500' : sensors.distanceCm < 45 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, (sensors.distanceCm / 150) * 100)}%` }}
            />
          </div>
        </div>

        {/* Structural Risk */}
        <div className={`p-2.5 rounded-lg border ${riskColor}`}>
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
            <span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> STRUCTURAL RISK</span>
            <span className="text-[10px]">INTEGRITY</span>
          </div>
          <div className="text-xl font-bold font-tactical tracking-wider">
            {sensors.structuralRisk}
          </div>
          <div className="text-[10px] font-mono text-neutral-400 mt-2">
            {sensors.structuralRisk === 'CRITICAL' ? 'BLOCKS ALL ADVANCE' : sensors.structuralRisk === 'HIGH' ? 'REQUIRES HUMAN SIGN-OFF' : 'STABLE SECTOR'}
          </div>
        </div>

        {/* PIR Motion */}
        <div className={`p-2.5 rounded-lg border ${sensors.motionDetected ? 'bg-amber-950/30 border-amber-500/40 text-amber-300' : 'bg-neutral-950/60 border-neutral-800 text-neutral-400'}`}>
          <div className="flex items-center justify-between text-[11px] font-mono mb-1">
            <span className="flex items-center gap-1"><Radio className="w-3.5 h-3.5" /> PIR MOTION</span>
            <span className={`w-2 h-2 rounded-full ${sensors.motionDetected ? 'bg-amber-400 animate-ping' : 'bg-neutral-600'}`} />
          </div>
          <div className="text-lg font-bold font-mono">
            {sensors.motionDetected ? 'DETECTED' : 'CLEAR'}
          </div>
          <div className="text-[10px] font-mono text-neutral-400 mt-1">
            {sensors.motionDetected ? 'Kinetic trigger active' : 'Chamber motionless'}
          </div>
        </div>

        {/* Thermal Survivor Signal */}
        <div className="p-2.5 rounded-lg border bg-neutral-950/60 border-neutral-800 text-neutral-200">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
            <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-red-400" /> THERMAL CONF</span>
            <span className="font-mono text-white">{(sensors.thermalConfidence * 100).toFixed(0)}%</span>
          </div>
          <div className="text-lg font-bold font-mono text-red-300">
            {sensors.thermalConfidence >= 0.85 ? 'STRONG (37°C)' : sensors.thermalConfidence >= 0.4 ? 'MODERATE' : 'WEAK / NOISE'}
          </div>
          <div className="w-full bg-neutral-950 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-red-500 transition-all duration-300"
              style={{ width: `${sensors.thermalConfidence * 100}%` }}
            />
          </div>
        </div>

        {/* Survivor Optical Confidence */}
        <div className="p-2.5 rounded-lg border bg-neutral-950/60 border-neutral-800 text-neutral-200">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-cyan-400" /> OPTICAL CONF</span>
            <span className="font-mono text-white">{(sensors.survivorConfidence * 100).toFixed(0)}%</span>
          </div>
          <div className="text-lg font-bold font-mono text-cyan-300">
            {sensors.survivorConfidence >= 0.8 ? 'PERSON DETECTED' : sensors.survivorConfidence >= 0.3 ? 'AMBIGUOUS' : 'VOID'}
          </div>
          <div className="w-full bg-neutral-950 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-cyan-500 transition-all duration-300"
              style={{ width: `${sensors.survivorConfidence * 100}%` }}
            />
          </div>
        </div>

        {/* Humidity */}
        <div className="p-2.5 rounded-lg border bg-neutral-950/60 border-neutral-800 text-neutral-400">
          <div className="flex items-center justify-between text-[11px] font-mono mb-1">
            <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-blue-400" /> HUMIDITY</span>
            <span className="font-mono text-white">{sensors.humidityPct}%</span>
          </div>
          <div className="text-lg font-bold font-mono text-white">
            {sensors.humidityPct} <span className="text-xs font-normal">% RH</span>
          </div>
          <div className="text-[10px] font-mono text-neutral-400 mt-1">
            Moisture vapor density
          </div>
        </div>
      </div>

      {/* Manual Sliders Expansion */}
      {showSliders && (
        <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 mb-3 space-y-3">
          <div className="text-xs font-mono font-bold text-neutral-300 flex items-center justify-between">
            <span>FINE SENSOR CONTROLS (TEST BOUNDARY CONDITIONS):</span>
            <span className="text-[11px] text-neutral-500">Live Telemetry Injection</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div>
              <div className="flex justify-between mb-1 text-neutral-400">
                <span>Gas ({sensors.gasPpm} ppm)</span>
                <span>Max 1500</span>
              </div>
              <input
                type="range"
                min="50"
                max="1500"
                step="25"
                value={sensors.gasPpm}
                onChange={(e) => setSensors((prev) => ({ ...prev, gasPpm: Number(e.target.value) }))}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 text-neutral-400">
                <span>Temp ({sensors.temperatureC} °C)</span>
                <span>Max 70°C</span>
              </div>
              <input
                type="range"
                min="10"
                max="70"
                step="1"
                value={sensors.temperatureC}
                onChange={(e) => setSensors((prev) => ({ ...prev, temperatureC: Number(e.target.value) }))}
                className="w-full accent-red-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 text-neutral-400">
                <span>Clearance ({sensors.distanceCm} cm)</span>
                <span>Min 10cm</span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="2"
                value={sensors.distanceCm}
                onChange={(e) => setSensors((prev) => ({ ...prev, distanceCm: Number(e.target.value) }))}
                className="w-full accent-cyan-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 text-neutral-400">
                <span>Thermal Conf ({(sensors.thermalConfidence * 100).toFixed(0)}%)</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sensors.thermalConfidence}
                onChange={(e) => setSensors((prev) => ({ ...prev, thermalConfidence: Number(e.target.value) }))}
                className="w-full accent-orange-500"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                <input
                  type="checkbox"
                  checked={sensors.motionDetected}
                  onChange={(e) => setSensors((prev) => ({ ...prev, motionDetected: e.target.checked }))}
                  className="rounded accent-amber-500 w-4 h-4"
                />
                <span>PIR Motion Trigger</span>
              </label>
            </div>

            <div>
              <div className="mb-1 text-neutral-400">Structural Risk</div>
              <select
                value={sensors.structuralRisk}
                onChange={(e) => setSensors((prev) => ({ ...prev, structuralRisk: e.target.value as StructuralRiskLevel }))}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-white text-xs font-mono"
              >
                <option value="LOW">LOW Risk</option>
                <option value="MEDIUM">MEDIUM Risk</option>
                <option value="HIGH">HIGH Risk (Human Override Req)</option>
                <option value="CRITICAL">CRITICAL Risk (Advance Blocked)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Execute Reasoning Trigger */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs font-mono text-neutral-400">
          Ready to query Hindsight memory and invoke RESQ Agent reasoning.
        </div>
        <button
          onClick={onRunDecision}
          disabled={isProcessing}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-tactical font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-950/40 disabled:opacity-50 cursor-pointer"
        >
          <Activity className="w-4 h-4 animate-spin-slow" />
          <span>{isProcessing ? 'RECALLING HINDSIGHT...' : 'RUN RESQ REASONING'}</span>
        </button>
      </div>
    </div>
  );
};
