/**
 * RESQ-MEM Core Rescue & Hindsight Memory Data Types
 */

export type StructuralRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SensorState {
  gasPpm: number;           // 0 - 2000 ppm
  temperatureC: number;     // -10 - 80 °C
  humidityPct: number;      // 0 - 100 %
  motionDetected: boolean;  // PIR motion sensor
  distanceCm: number;       // Ultrasonic clearance (cm)
  thermalConfidence: number;// 0.0 - 1.0
  survivorConfidence: number;// 0.0 - 1.0
  structuralRisk: StructuralRiskLevel;
}

export interface VisionAnalysis {
  source: 'simulated_flir' | 'optical_camera' | 'uploaded';
  survivorConfidence: number;
  thermalSignalDetected: boolean;
  visualConfidence: number;
  personDetected: boolean;
  hazardIndicators: string[];
  sceneContext: string;
  timestamp: string;
  imageThumbnail?: string;
}

export type MissionOutcomeType = 
  | 'SURVIVOR_CONFIRMED'
  | 'FALSE_POSITIVE'
  | 'HAZARD_AVOIDED'
  | 'EQUIPMENT_RESCUED'
  | 'MISSION_ABORTED'
  | 'ROUTE_DIVERTED';

export type HumanDecisionType = 'APPROVED' | 'REJECTED' | 'MODIFIED' | 'PENDING';

export interface SafetyRuleCheck {
  id: string;
  name: string;
  description: string;
  passed: boolean;
  metric: string;
  threshold: string;
  blockingSeverity: 'CRITICAL' | 'WARNING' | 'INFO';
}

export interface SafetyEvaluation {
  status: 'ALLOWED' | 'BLOCKED' | 'REQUIRES_OVERRIDE';
  rulesChecked: SafetyRuleCheck[];
  blockingReason?: string;
  requiresHumanConfirmation: boolean;
}

export interface HindsightMemory {
  id: string;                 // e.g. "RESQ-001"
  timestamp: string;
  situation: string;
  zone: string;
  environmentSummary: string;
  sensorObservations: SensorState;
  visionObservations: VisionAnalysis;
  agentReasoning: string;
  agentRecommendation: string;
  safetyStatus: SafetyEvaluation;
  humanDecision: HumanDecisionType;
  humanCorrection?: string;
  actionTaken: string;
  outcome: MissionOutcomeType;
  success: boolean;
  failureReason?: string;
  learnedLesson: string;
  tags: string[];
  similarityScore?: number;
  matchReasons?: string[];
}

export interface AgentRecommendation {
  action: string;
  summary: string;
  reasoning: string;
  confidence: number;
  riskAssessment: string;
  suggestedProtocol: string;
}

export interface ReflectSynthesis {
  summary: string;
  relevantMissionsCount: number;
  confirmedSurvivorsCount: number;
  falsePositivesCount: number;
  humanOverridesCount: number;
  keyLessons: string[];
  confidenceModifier: number;
  basedOn?: any;
  sourceReferences?: string[];
}

export type HindsightConnectionState = 
  | 'CONNECTED'
  | 'NOT CONFIGURED'
  | 'AUTH ERROR'
  | 'BANK NOT FOUND'
  | 'CONNECTION ERROR';

export interface HindsightHealthResult {
  connected: boolean;
  state: HindsightConnectionState;
  bankId: string;
  endpoint: string;
  totalMemories: number;
  lastSuccessfulOperation: string | null;
  lastError: string | null;
  timestamp: string;
}

export interface AgentDecisionResponse {
  missionId: string;
  timestamp: string;
  situation: string;
  zone: string;
  sensorState: SensorState;
  visionAnalysis: VisionAnalysis;
  
  // Without Memory baseline
  withoutMemory: {
    recommendation: AgentRecommendation;
    flawExplanation: string;
  };
  
  // With Hindsight Memory
  withMemory: {
    recommendation: AgentRecommendation;
    recalledMemories: HindsightMemory[];
    reflectSynthesis: ReflectSynthesis;
    learnedPatternsApplied: string[];
    previousFailuresAverted: string[];
    whyChangedExplanation: string;
  };

  safetyEvaluation: SafetyEvaluation;
  status: 'READY_FOR_HUMAN' | 'BLOCKED_BY_SAFETY';

  diagnostics: {
    hindsightConnected: boolean;
    hindsightMode: 'LIVE_API' | 'DEMO_FALLBACK';
    geminiConnected: boolean;
    geminiModel: string;
    processingTimeMs: number;
  };
}

export interface SystemStatus {
  hindsight: {
    connected: boolean;
    state: HindsightConnectionState;
    mode: 'LIVE_API' | 'DEMO_FALLBACK';
    bankId: string;
    totalMemories: number;
    endpoint: string;
    lastSuccessfulOperation?: string | null;
    lastError?: string | null;
  };
  gemini: {
    connected: boolean;
    model: string;
  };
  sensors: {
    status: 'LIVE' | 'SIMULATED';
    rateHz: number;
  };
  vision: {
    status: 'READY' | 'STANDBY';
    mode: 'FLIR_SYNTHETIC' | 'OPTICAL';
  };
}

export interface OperationalInsight {
  id: string;
  title: string;
  category: 'FALSE_POSITIVE' | 'HAZARD_PREVENTION' | 'HUMAN_DOCTRINE' | 'SENSOR_FUSION';
  description: string;
  derivedFromMissions: string[];
  recommendedAction: string;
  reliabilityScore: number;
}
