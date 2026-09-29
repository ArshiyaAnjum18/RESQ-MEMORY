import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { PipelineTracker, PipelineStage } from './components/PipelineTracker.tsx';
import { SensorSimulator } from './components/SensorSimulator.tsx';
import { RescueVision } from './components/RescueVision.tsx';
import { AgentDecisionPanel } from './components/AgentDecisionPanel.tsx';
import { HumanDecisionPanel } from './components/HumanDecisionPanel.tsx';
import { WhyDecisionModal } from './components/WhyDecisionModal.tsx';
import { MemoryComparisonView } from './components/MemoryComparisonView.tsx';
import { HindsightBankView } from './components/HindsightBankView.tsx';
import { LearningInsightsView } from './components/LearningInsightsView.tsx';
import { ArchitectureDocsView } from './components/ArchitectureDocsView.tsx';
import { ConnectionStatusModal } from './components/ConnectionStatusModal.tsx';
import { 
  SensorState, 
  VisionAnalysis, 
  AgentDecisionResponse, 
  HindsightMemory, 
  SystemStatus, 
  OperationalInsight,
  HindsightHealthResult
} from './types/rescue.ts';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'command' | 'comparison' | 'timeline' | 'insights' | 'docs'>('command');
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [memories, setMemories] = useState<HindsightMemory[]>([]);
  const [insights, setInsights] = useState<OperationalInsight[]>([]);

  // Hindsight Connection Diagnostics & Seeding
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState<boolean>(false);
  const [healthResult, setHealthResult] = useState<HindsightHealthResult | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);
  const [isSeedingExperiences, setIsSeedingExperiences] = useState<boolean>(false);

  // Active mission state
  const [activeMissionId, setActiveMissionId] = useState<string>('RESQ-012');
  const [situation, setSituation] = useState<string>('Subterranean disaster zone, collapsed commercial building Zone B.');
  const [zone, setZone] = useState<string>('Zone B Subterranean');
  
  // Default to Scenario 4 (The Star Demo Scenario)
  const [activeScenario, setActiveScenario] = useState<number | null>(4);
  const [sensors, setSensors] = useState<SensorState>({
    gasPpm: 810,
    temperatureC: 41,
    humidityPct: 63,
    motionDetected: true,
    distanceCm: 52,
    thermalConfidence: 0.91,
    survivorConfidence: 0.88,
    structuralRisk: 'HIGH',
  });

  const [vision, setVision] = useState<VisionAnalysis>({
    source: 'simulated_flir',
    survivorConfidence: 0.88,
    thermalSignalDetected: true,
    visualConfidence: 0.85,
    personDetected: true,
    hazardIndicators: ['Combustible gas plume (810 ppm)', 'Compromised slab fracture'],
    sceneContext: 'Human core thermal gradient detected behind collapsed void. 37.2°C temperature delta.',
    timestamp: new Date().toISOString(),
  });

  const [decision, setDecision] = useState<AgentDecisionResponse | null>(null);
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>('SENSE');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isRetaining, setIsRetaining] = useState<boolean>(false);
  const [retainedSuccessId, setRetainedSuccessId] = useState<string | null>(null);

  // Modals
  const [isWhyModalOpen, setIsWhyModalOpen] = useState<boolean>(false);
  const [inspectModalMemory, setInspectModalMemory] = useState<HindsightMemory | null>(null);

  // Fetch initial system status, memories, and insights
  useEffect(() => {
    fetchSystemStatus();
    testConnection();
    fetchMemories();
    fetchInsights();
  }, []);

  // Run initial decision on mount for Scenario 4 so judges see immediate results
  useEffect(() => {
    runDecisionPipeline();
  }, []);

  const testConnection = async () => {
    setIsTestingConnection(true);
    try {
      const res = await fetch('/api/hindsight/test-connection', { method: 'POST' });
      if (res.ok) {
        const data: HindsightHealthResult = await res.json();
        setHealthResult(data);
        await fetchSystemStatus();
      }
    } catch (err) {
      console.error('Failed to test connection:', err);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSeedExperiences = async () => {
    setIsSeedingExperiences(true);
    try {
      const res = await fetch('/api/hindsight/seed-experiences', { method: 'POST' });
      if (res.ok) {
        await fetchMemories();
        await fetchSystemStatus();
        await fetchInsights();
        await testConnection();
      }
    } catch (err) {
      console.error('Failed to seed experiences:', err);
    } finally {
      setIsSeedingExperiences(false);
    }
  };

  const fetchSystemStatus = async () => {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (err) {
      console.error('Failed to fetch status:', err);
    }
  };

  const fetchMemories = async () => {
    try {
      const res = await fetch('/api/hindsight/memories');
      if (res.ok) {
        const data = await res.json();
        setMemories(data.memories || []);
      }
    } catch (err) {
      console.error('Failed to fetch memories:', err);
    }
  };

  const fetchInsights = async () => {
    try {
      const res = await fetch('/api/insights');
      if (res.ok) {
        const data = await res.json();
        setInsights(data.insights || []);
      }
    } catch (err) {
      console.error('Failed to fetch insights:', err);
    }
  };

  // Scenario quick-selector
  const handleScenarioSelect = (num: number) => {
    setActiveScenario(num);
    setRetainedSuccessId(null);
    setPipelineStage('SENSE');

    if (num === 1) {
      // Normal exploration
      setSituation('Routine subterranean exploration of commercial basement void.');
      setZone('Zone A Baseline');
      setSensors({
        gasPpm: 300,
        temperatureC: 30,
        humidityPct: 55,
        motionDetected: false,
        distanceCm: 100,
        thermalConfidence: 0.05,
        survivorConfidence: 0.05,
        structuralRisk: 'LOW',
      });
      setVision((prev) => ({
        ...prev,
        survivorConfidence: 0.05,
        thermalSignalDetected: false,
        personDetected: false,
        sceneContext: 'Clear rubble void. No thermal gradient or biological motion detected.',
      }));
    } else if (num === 2) {
      // Survivor with hazard
      setSituation('Subterranean collapse with fractured gas line and heavy debris.');
      setZone('Zone B East Flank');
      setSensors({
        gasPpm: 800,
        temperatureC: 43,
        humidityPct: 65,
        motionDetected: true,
        distanceCm: 50,
        thermalConfidence: 0.93,
        survivorConfidence: 0.91,
        structuralRisk: 'HIGH',
      });
      setVision((prev) => ({
        ...prev,
        survivorConfidence: 0.91,
        thermalSignalDetected: true,
        personDetected: true,
        sceneContext: 'Strong thermal silhouette of trapped survivor under hollow-core slab.',
      }));
    } else if (num === 3) {
      // False positive precedent
      setSituation('Residential seismic collapse corridor with wind drafts.');
      setZone('Zone C Corridor');
      setSensors({
        gasPpm: 500,
        temperatureC: 32,
        humidityPct: 52,
        motionDetected: true,
        distanceCm: 70,
        thermalConfidence: 0.28,
        survivorConfidence: 0.25,
        structuralRisk: 'MEDIUM',
      });
      setVision((prev) => ({
        ...prev,
        survivorConfidence: 0.25,
        thermalSignalDetected: false,
        personDetected: false,
        sceneContext: 'Frayed cable swinging in ventilation duct current. No core body temperature.',
      }));
    } else if (num === 4) {
      // Similar mission (Triggers Hindsight recall of RESQ-001, 007, 011!)
      setSituation('Chemical packaging warehouse partial collapse, Subterranean Sector 2.');
      setZone('Zone B Subterranean');
      setSensors({
        gasPpm: 810,
        temperatureC: 41,
        humidityPct: 63,
        motionDetected: true,
        distanceCm: 52,
        thermalConfidence: 0.91,
        survivorConfidence: 0.88,
        structuralRisk: 'HIGH',
      });
      setVision((prev) => ({
        ...prev,
        survivorConfidence: 0.88,
        thermalSignalDetected: true,
        personDetected: true,
        sceneContext: 'Human core thermal gradient detected behind collapsed void. 37.2°C temperature delta.',
      }));
    }
  };

  // Run the full decision reasoning pipeline
  const runDecisionPipeline = async () => {
    setIsProcessing(true);
    setRetainedSuccessId(null);
    setPipelineStage('RECALL');

    try {
      // Simulating stage step visualization for smooth demonstration
      await new Promise((r) => setTimeout(r, 200));
      setPipelineStage('REFLECT');

      const res = await fetch('/api/agent/decide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionId: activeMissionId,
          situation,
          zone,
          sensors,
          vision,
        }),
      });

      if (res.ok) {
        const data: AgentDecisionResponse = await res.json();
        setDecision(data);
        setPipelineStage('DECIDE');
        setTimeout(() => setPipelineStage('SAFETY_CHECK'), 250);
        setTimeout(() => setPipelineStage('HUMAN_DECISION'), 500);
      } else {
        console.error('Agent decision failed:', res.statusText);
      }
    } catch (err) {
      console.error('Error invoking agent decision pipeline:', err);
    } finally {
      setIsProcessing(false);
      fetchSystemStatus();
    }
  };

  // Instant 1-click Demo Trigger
  const handleSimulateSimilarIncident = () => {
    handleScenarioSelect(4);
    setCurrentTab('command');
    setTimeout(() => {
      runDecisionPipeline();
    }, 100);
  };

  // Retain the experience in Hindsight
  const handleRetainExperience = async (completedMemory: HindsightMemory) => {
    setIsRetaining(true);
    setPipelineStage('RETAIN');

    try {
      const res = await fetch('/api/hindsight/retain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completedMemory),
      });

      if (res.ok) {
        setRetainedSuccessId(completedMemory.id);
        await fetchMemories();
        await fetchSystemStatus();
        await fetchInsights();
      }
    } catch (err) {
      console.error('Error retaining memory:', err);
    } finally {
      setIsRetaining(false);
    }
  };

  // Progress to next mission
  const handleRunNextMission = () => {
    const currentNum = parseInt(activeMissionId.replace('RESQ-', ''), 10) || 12;
    const nextMissionId = `RESQ-${String(currentNum + 1).padStart(3, '0')}`;
    setActiveMissionId(nextMissionId);
    setRetainedSuccessId(null);
    setDecision(null);
    handleScenarioSelect(4);
  };

  // Reset Hindsight Bank
  const handleResetBank = async () => {
    try {
      await fetch('/api/hindsight/reset', { method: 'POST' });
      await fetchMemories();
      await fetchSystemStatus();
      await fetchInsights();
      setActiveMissionId('RESQ-012');
      handleScenarioSelect(4);
    } catch (err) {
      console.error('Error resetting bank:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-neutral-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-300">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        status={status}
        activeMissionId={activeMissionId}
        onSimulateSimilarIncident={handleSimulateSimilarIncident}
        onResetBank={handleResetBank}
        isSimulating={isProcessing}
        onOpenConnectionModal={() => setIsConnectionModalOpen(true)}
        onSeedExperiences={handleSeedExperiences}
        isSeeding={isSeedingExperiences}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Pipeline Progress Tracker (Always visible for clarity of the loop) */}
        <PipelineTracker
          currentStage={pipelineStage}
          recalledCount={decision?.withMemory.recalledMemories.length || 0}
          retainedCount={memories.length}
          safetyStatus={decision?.safetyEvaluation.status || 'CHECKING'}
          humanStatus={decision ? 'GATE OPEN' : 'STANDBY'}
        />

        {/* 1. COMMAND CENTER (PRIMARY OPERATIONAL SCREEN) */}
        {currentTab === 'command' && (
          <div className="space-y-6">
            {/* Top Row: Sensor Telemetry HUD + Rescue Vision FLIR Module */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SensorSimulator
                sensors={sensors}
                setSensors={setSensors}
                onScenarioSelect={handleScenarioSelect}
                activeScenario={activeScenario}
                onRunDecision={runDecisionPipeline}
                isProcessing={isProcessing}
              />

              <RescueVision
                vision={vision}
                setVision={setVision}
                sensors={sensors}
              />
            </div>

            {/* Bottom Row: Agent Decision Panel + Human Gate & Retain Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AgentDecisionPanel
                decision={decision}
                onOpenWhyModal={() => setIsWhyModalOpen(true)}
                onSelectMemoryDetail={(mem) => setInspectModalMemory(mem)}
                isProcessing={isProcessing}
              />

              <HumanDecisionPanel
                decision={decision}
                onRetainExperience={handleRetainExperience}
                isRetaining={isRetaining}
                retainedSuccessId={retainedSuccessId}
                onRunNextMission={handleRunNextMission}
              />
            </div>
          </div>
        )}

        {/* 2. MEMORY COMPARISON (BEFORE VS AFTER HINDSIGHT) */}
        {currentTab === 'comparison' && (
          <MemoryComparisonView
            decision={decision}
            onSimulateSimilarIncident={handleSimulateSimilarIncident}
            isProcessing={isProcessing}
          />
        )}

        {/* 3. HINDSIGHT BANK & TIMELINE */}
        {currentTab === 'timeline' && (
          <HindsightBankView
            memories={memories}
            bankId={status?.hindsight.bankId || 'resq-mem-disaster-response-v1'}
            isLiveApi={Boolean(status?.hindsight.connected && status?.hindsight.state === 'CONNECTED')}
            connectionState={status?.hindsight.state || 'NOT CONFIGURED'}
            onSelectMemory={(mem) => setInspectModalMemory(mem)}
            onTestConnection={() => {
              setIsConnectionModalOpen(true);
              testConnection();
            }}
            onSeedExperiences={handleSeedExperiences}
            isSeeding={isSeedingExperiences}
          />
        )}

        {/* 4. LEARNING INSIGHTS */}
        {currentTab === 'insights' && (
          <LearningInsightsView
            insights={insights}
            totalMemories={memories.length}
          />
        )}

        {/* 5. ARCHITECTURE & DOCS */}
        {currentTab === 'docs' && (
          <ArchitectureDocsView />
        )}
      </main>

      {/* "WHY THIS DECISION?" Explainable Evidence Modal */}
      <WhyDecisionModal
        decision={decision}
        isOpen={isWhyModalOpen}
        onClose={() => setIsWhyModalOpen(false)}
        onSelectMemory={(mem) => setInspectModalMemory(mem)}
      />

      {/* Hindsight Cloud Connection Diagnostics Modal */}
      <ConnectionStatusModal
        isOpen={isConnectionModalOpen}
        onClose={() => setIsConnectionModalOpen(false)}
        health={healthResult}
        onTestConnection={testConnection}
        isTesting={isTestingConnection}
      />

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950/80 py-4 px-6 text-center text-xs font-mono text-neutral-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-bold text-neutral-300">RESQ-MEM DISASTER RESPONSE</span>
            <span>·</span>
            <span>Experiential Memory Layer Powered by Hindsight</span>
          </div>
          <div>
            "Every rescue becomes experience for the next one."
          </div>
        </div>
      </footer>
    </div>
  );
}
