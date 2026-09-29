import { SafetyEvaluation, SafetyRuleCheck, SensorState } from '../types/rescue.ts';

/**
 * Safety Controller
 * 
 * Strict deterministic safety gate that runs independently of LLM reasoning.
 * The Gemini Agent NEVER directly triggers physical robot actions or high-risk
 * escalations without passing through this deterministic safety validator.
 */
export class SafetyController {
  public static evaluate(
    intendedAction: string,
    sensorState: SensorState
  ): SafetyEvaluation {
    const rules: SafetyRuleCheck[] = [];
    let isBlocked = false;
    let blockingReason = '';
    let requiresHumanOverride = false;

    const actionLower = intendedAction.toLowerCase();
    const isMovementAction = 
      actionLower.includes('move') || 
      actionLower.includes('advance') || 
      actionLower.includes('enter') || 
      actionLower.includes('proceed') ||
      actionLower.includes('forward');

    // Rule 1: Ultrasonic Clearance Distance
    const clearancePassed = sensorState.distanceCm >= 20;
    rules.push({
      id: 'RULE_CLEARANCE_DISTANCE',
      name: 'Minimum Forward Clearance',
      description: 'Physical forward movement requires clearance distance >= 20 cm.',
      passed: clearancePassed,
      metric: `${sensorState.distanceCm} cm`,
      threshold: '>= 20 cm',
      blockingSeverity: 'CRITICAL',
    });

    if (isMovementAction && !clearancePassed) {
      isBlocked = true;
      blockingReason = `ACTION BLOCKED: Forward clearance is ${sensorState.distanceCm} cm. Minimum safe distance is 20 cm to avoid collision or pinning.`;
    }

    // Rule 2: Critical Combustible Gas Threshold
    const gasPassed = sensorState.gasPpm < 1000;
    rules.push({
      id: 'RULE_GAS_THRESHOLD',
      name: 'Atmospheric Gas Limit',
      description: 'Combustible/toxic gas concentration must be below 1000 ppm for standard entry.',
      passed: gasPassed,
      metric: `${sensorState.gasPpm} ppm`,
      threshold: '< 1000 ppm',
      blockingSeverity: 'CRITICAL',
    });

    if (isMovementAction && !gasPassed) {
      isBlocked = true;
      blockingReason = `ACTION BLOCKED: Gas level (${sensorState.gasPpm} ppm) exceeds explosion hazard limit (1000 ppm). Requires spark-isolated crawler or ventilation protocol.`;
    }

    // Rule 3: Extreme Thermal / Flashover Risk
    const tempPassed = sensorState.temperatureC < 55;
    rules.push({
      id: 'RULE_THERMAL_SAFETY',
      name: 'Ambient Temperature Threshold',
      description: 'Ambient temperature must be below 55°C to protect electronics and survivor survival corridor.',
      passed: tempPassed,
      metric: `${sensorState.temperatureC}°C`,
      threshold: '< 55°C',
      blockingSeverity: 'CRITICAL',
    });

    if (isMovementAction && !tempPassed) {
      isBlocked = true;
      blockingReason = `ACTION BLOCKED: Extreme temperature (${sensorState.temperatureC}°C) exceeds robotic thermal tolerance. Potential flashover zone.`;
    }

    // Rule 4: Structural Risk & Human Confirmation
    const structuralRiskCritical = sensorState.structuralRisk === 'CRITICAL';
    const structuralRiskHigh = sensorState.structuralRisk === 'HIGH';
    const structuralPassed = !structuralRiskCritical;

    rules.push({
      id: 'RULE_STRUCTURAL_INTEGRITY',
      name: 'Structural Collapse Risk',
      description: 'High or Critical structural instability mandates explicit Human Operator approval.',
      passed: structuralPassed,
      metric: sensorState.structuralRisk,
      threshold: 'NON-CRITICAL',
      blockingSeverity: structuralRiskCritical ? 'CRITICAL' : 'WARNING',
    });

    if (structuralRiskCritical && isMovementAction) {
      isBlocked = true;
      blockingReason = `ACTION BLOCKED: Structural collapse risk is CRITICAL. Robotic insertion halted to prevent progressive collapse.`;
    } else if (structuralRiskHigh) {
      requiresHumanOverride = true;
    }

    // Overall Status Computation
    let status: 'ALLOWED' | 'BLOCKED' | 'REQUIRES_OVERRIDE' = 'ALLOWED';
    if (isBlocked) {
      status = 'BLOCKED';
    } else if (requiresHumanOverride) {
      status = 'REQUIRES_OVERRIDE';
    }

    return {
      status,
      rulesChecked: rules,
      blockingReason: blockingReason || undefined,
      requiresHumanConfirmation: requiresHumanOverride || isBlocked,
    };
  }
}
