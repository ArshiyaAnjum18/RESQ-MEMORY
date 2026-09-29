import React, { useRef, useEffect } from 'react';
import { 
  Eye, 
  Flame, 
  Camera, 
  Crosshair, 
  Upload, 
  RefreshCw, 
  Maximize2,
  Scan,
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import { VisionAnalysis, SensorState } from '../types/rescue.ts';

interface RescueVisionProps {
  vision: VisionAnalysis;
  setVision: React.Dispatch<React.SetStateAction<VisionAnalysis>>;
  sensors: SensorState;
}

export const RescueVision: React.FC<RescueVisionProps> = ({
  vision,
  setVision,
  sensors,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viewMode, setViewMode] = React.useState<'FLIR' | 'OPTICAL' | 'EDGES'>('FLIR');
  const [isScanning, setIsScanning] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Draw simulated FLIR / Optical canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#06080e';
    ctx.fillRect(0, 0, width, height);

    if (viewMode === 'FLIR') {
      // Draw FLIR Thermal False-Color Palette (Ironbow / Rainbow)
      // Background cold ambient gradient (deep blues/purples)
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#0a0d24');
      bgGrad.addColorStop(0.5, '#180e30');
      bgGrad.addColorStop(1, '#0c071a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw simulated rubble / concrete geometry
      ctx.fillStyle = '#221844';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(80, height - 120);
      ctx.lineTo(190, height - 70);
      ctx.lineTo(260, height - 160);
      ctx.lineTo(width, height - 90);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // If thermal signal detected, draw heat signature
      if (sensors.thermalConfidence > 0.4) {
        const cx = width * 0.58;
        const cy = height * 0.48;
        const radius = 55 * sensors.thermalConfidence;

        // Core heat glow (white -> yellow -> orange -> crimson)
        const heatGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, radius);
        heatGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        heatGrad.addColorStop(0.25, 'rgba(255, 220, 50, 0.9)');
        heatGrad.addColorStop(0.55, 'rgba(255, 90, 20, 0.7)');
        heatGrad.addColorStop(0.85, 'rgba(180, 20, 90, 0.4)');
        heatGrad.addColorStop(1, 'rgba(40, 10, 80, 0)');

        ctx.fillStyle = heatGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        // Anthropomorphic torso / head silhouette if confidence is high
        if (sensors.thermalConfidence >= 0.75) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          // Head
          ctx.beginPath();
          ctx.arc(cx, cy - 22, 14, 0, Math.PI * 2);
          ctx.fill();
          // Torso
          ctx.beginPath();
          ctx.ellipse(cx, cy + 15, 22, 32, 0, 0, Math.PI * 2);
          ctx.fill();

          // Target Bounding Box
          ctx.strokeStyle = '#22d3ee';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(cx - 36, cy - 42, 72, 94);

          // Box brackets
          ctx.fillStyle = '#22d3ee';
          ctx.font = '10px "IBM Plex Mono", monospace';
          ctx.fillText(`TARGET: SURVIVOR [${(sensors.thermalConfidence * 100).toFixed(0)}%]`, cx - 36, cy - 48);
          ctx.fillText(`TEMP: 37.2°C CORE`, cx - 36, cy + 62);
        } else {
          // Ambiguous heat decoy (conduit or motor)
          ctx.strokeStyle = '#eab308';
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(cx - 30, cy - 30, 60, 60);
          ctx.setLineDash([]);
          ctx.fillStyle = '#eab308';
          ctx.font = '10px "IBM Plex Mono", monospace';
          ctx.fillText(`ANOMALY: AMBIGUOUS HEAT [${(sensors.thermalConfidence * 100).toFixed(0)}%]`, cx - 40, cy - 36);
        }
      } else {
        // Cold rubble
        ctx.fillStyle = '#64748b';
        ctx.font = '11px "IBM Plex Mono", monospace';
        ctx.fillText('NO DISTINCT THERMAL GRADIENT (<0.40)', width * 0.32, height * 0.5);
      }
    } else if (viewMode === 'OPTICAL') {
      // Standard RGB Low-light Optical Camera
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, width, height);

      // Low-light grain & rubble texture
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(20, height - 140, width - 40, 120);

      if (sensors.survivorConfidence >= 0.7) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.strokeRect(width * 0.45, height * 0.28, 80, 110);
        ctx.fillStyle = '#10b981';
        ctx.font = '10px "IBM Plex Mono", monospace';
        ctx.fillText(`HUMAN SILHOUETTE [${(sensors.survivorConfidence * 100).toFixed(0)}%]`, width * 0.45, height * 0.24);
      } else {
        ctx.fillStyle = '#9ca3af';
        ctx.font = '11px "IBM Plex Mono", monospace';
        ctx.fillText('OPTICAL: DENSE DEBRIS / LIMITED CLEARANCE', width * 0.25, height * 0.5);
      }
    } else {
      // Edge Detection / Structural Fracture mode
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      // Draw structural grid / shear lines
      ctx.beginPath();
      ctx.moveTo(30, 40);
      ctx.lineTo(240, 180);
      ctx.lineTo(width - 30, 120);
      ctx.moveTo(120, height - 30);
      ctx.lineTo(200, 80);
      ctx.stroke();

      ctx.fillStyle = '#f43f5e';
      ctx.font = '10px "IBM Plex Mono", monospace';
      ctx.fillText('SHEAR FRACTURE RISK // COLUMN FAILURE', 40, 30);
    }

    // Crosshairs & HUD Overlays
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Corner reticles
    const reticleSize = 16;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(15, 15 + reticleSize);
    ctx.lineTo(15, 15);
    ctx.lineTo(15 + reticleSize, 15);
    // Top-right
    ctx.moveTo(width - 15 - reticleSize, 15);
    ctx.lineTo(width - 15, 15);
    ctx.lineTo(width - 15, 15 + reticleSize);
    // Bottom-left
    ctx.moveTo(15, height - 15 - reticleSize);
    ctx.lineTo(15, height - 15);
    ctx.lineTo(15 + reticleSize, height - 15);
    // Bottom-right
    ctx.moveTo(width - 15 - reticleSize, height - 15);
    ctx.lineTo(width - 15, height - 15);
    ctx.lineTo(width - 15, height - 15 - reticleSize);
    ctx.stroke();

  }, [viewMode, sensors.thermalConfidence, sensors.survivorConfidence, sensors.gasPpm]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgUrl = event.target?.result as string;
      setVision((prev) => ({
        ...prev,
        source: 'uploaded',
        imageThumbnail: imgUrl,
        sceneContext: `Operator uploaded tactical frame (${file.name}). Analyzed for anatomical heat gradients and obstruction voids.`,
      }));
    };
    reader.readAsDataURL(file);
  };

  const triggerScanPulse = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 800);
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 shadow-lg">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-white font-tactical uppercase tracking-wider">
            Rescue Vision Module
          </h2>
          <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
            FLIR / OPTICAL FUSION
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs font-mono">
          <button
            onClick={() => setViewMode('FLIR')}
            className={`px-2.5 py-1 rounded transition-colors ${
              viewMode === 'FLIR'
                ? 'bg-amber-500/20 text-amber-300 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            FLIR Thermal
          </button>
          <button
            onClick={() => setViewMode('OPTICAL')}
            className={`px-2.5 py-1 rounded transition-colors ${
              viewMode === 'OPTICAL'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Optical RGB
          </button>
          <button
            onClick={() => setViewMode('EDGES')}
            className={`px-2.5 py-1 rounded transition-colors ${
              viewMode === 'EDGES'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Edge/Fracture
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 aspect-video mb-3">
        <canvas
          ref={canvasRef}
          width={560}
          height={315}
          className="w-full h-full object-cover"
        />

        {/* Scanline overlay */}
        <div className="absolute inset-0 flir-scanline pointer-events-none opacity-40" />

        {/* Scanning sweep effect */}
        {isScanning && (
          <div className="absolute inset-0 bg-cyan-400/10 pointer-events-none animate-pulse" />
        )}

        {/* Transparent Simulation Notice */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-neutral-950/80 border border-neutral-800 text-[10px] font-mono text-neutral-400 backdrop-blur">
          [SIMULATED FLIR/OPTICAL TELEMETRY]
        </div>

        {/* Real-time Target Tracker Info Box */}
        <div className="absolute top-2 right-2 px-2.5 py-1 rounded bg-neutral-950/85 border border-neutral-700 text-right backdrop-blur">
          <div className="text-[10px] font-mono text-neutral-400">SURVIVOR CONFIDENCE</div>
          <div className="text-base font-bold font-mono text-emerald-400">
            {(sensors.thermalConfidence * 100).toFixed(0)}%
          </div>
          <div className="text-[9px] font-mono text-neutral-400">
            {sensors.thermalConfidence >= 0.85 ? 'DUAL LOCK: CONFIRMED' : sensors.thermalConfidence >= 0.4 ? 'AMBIGUOUS HEAT' : 'NO BODY HEAT'}
          </div>
        </div>

        {/* Atmosphere Overlays */}
        <div className="absolute bottom-2 left-2 flex items-center gap-2 text-[10px] font-mono text-neutral-300 bg-neutral-950/80 px-2.5 py-1 rounded border border-neutral-800 backdrop-blur">
          <span>GAS: <strong className="text-amber-400">{sensors.gasPpm} ppm</strong></span>
          <span>·</span>
          <span>TEMP: <strong>{sensors.temperatureC}°C</strong></span>
          <span>·</span>
          <span>CLR: <strong className={sensors.distanceCm < 20 ? 'text-red-400' : 'text-emerald-400'}>{sensors.distanceCm} cm</strong></span>
        </div>

        {/* Scan Controls inside viewer */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
          <button
            onClick={triggerScanPulse}
            className="p-1.5 rounded bg-neutral-900/80 border border-neutral-700 text-neutral-300 hover:text-white transition-colors"
            title="Perform 360° LiDAR / Thermal Dwell Sweep"
          >
            <Scan className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded bg-neutral-900/80 border border-neutral-700 text-neutral-300 hover:text-white transition-colors"
            title="Upload incident frame for survivor analysis"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {/* Vision Analysis Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
        <div className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
          <div className="text-[11px] text-neutral-400 mb-1 flex items-center justify-between">
            <span>SCENE CONTEXT</span>
            <span className="text-[10px] text-emerald-400">VISION ACTIVE</span>
          </div>
          <div className="text-neutral-200 text-[11px] leading-relaxed">
            {sensors.thermalConfidence >= 0.85
              ? 'Distinct human body thermal gradient (37.2°C) pinned behind collapsed slab matrix. Consistent respiratory heat signature.'
              : sensors.thermalConfidence >= 0.4
              ? 'Weak/isolated thermal spot detected (potential smoldering conduit or friction heat). Biological contours uncertain.'
              : 'Ambient cold void. Heavy gypsum and crushed concrete dust. No biological thermal signature detected.'}
          </div>
        </div>

        <div className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
          <div className="text-[11px] text-neutral-400 mb-1 flex items-center justify-between">
            <span>HAZARD INDICATORS</span>
            <span className="text-[10px] text-amber-400">{sensors.gasPpm >= 600 ? 'ELEVATED' : 'NOMINAL'}</span>
          </div>
          <ul className="text-[11px] text-neutral-300 space-y-1">
            <li className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${sensors.gasPpm >= 600 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              <span>Combustible gas plume: {sensors.gasPpm} ppm</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${sensors.distanceCm < 20 ? 'bg-red-400' : 'bg-emerald-400'}`} />
              <span>Void pinch point clearance: {sensors.distanceCm} cm</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${sensors.structuralRisk === 'HIGH' || sensors.structuralRisk === 'CRITICAL' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              <span>Load-bearing structural integrity: {sensors.structuralRisk}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
