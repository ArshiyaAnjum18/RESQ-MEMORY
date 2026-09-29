# RESQ-MEM: Rescue Vision
### An Experiential Disaster-Response Agent That Learns From Every Mission

> **"Every rescue becomes experience for the next one."**

RESQ-MEM is an intelligent disaster-response decision-support agent. Rather than treating every emergency as an isolated problem or relying on static RAG chatbots, RESQ integrates **Hindsight persistent agent memory** to retain previous mission experiences, recall relevant operational precedents, reflect over successful and failed outcomes, and calibrate future life-critical decisions.

---

## 🌟 The Central Differentiator: Experiential Memory

Traditional AI agents make reactive, isolated recommendations based only on current sensor inputs. In high-risk disaster environments, this leads to repeating fatal mistakes (e.g. false alarms triggered by swaying wires, or spark risks in combustible gas).

**RESQ-MEM introduces the 8-stage Experiential Learning Loop:**
```
SENSE            [Robotic Sensor Telemetry + FLIR Thermal Optics]
  ↓
RECALL           [Hindsight: Multi-strategy semantic + sensor precedent search]
  ↓
REFLECT          [Hindsight: Agentic reasoning loop over previous outcomes]
  ↓
DECIDE           [Gemini 3.8 Agent: Formulates calibrated rescue protocol]
  ↓
SAFETY CHECK     [Deterministic Safety Controller: Independent physical gate]
  ↓
HUMAN DECISION   [Rescue Operator: Approves or Overrides with correction]
  ↓
OUTCOME          [Ground truth confirmation: Survivor / False Positive / Divert]
  ↓
RETAIN           [Hindsight: Ingests new structured experience & lessons]
  ↓
LEARN            [Future missions recall this experience and improve decisions]
```

---

## 🔍 The Before vs. After Story

### WITHOUT MEMORY:
A disaster occurs in a subterranean void:
- Gas: 810 ppm
- Ambient Temp: 41°C
- Motion: Detected
- Thermal Confidence: 0.91
- Forward Clearance: 52 cm

A naive agent without memory blindly recommends:
> *"Survivor detected! Advance rover immediately and trigger high-priority extraction alert."*
> **Failure risk:** Ignores explosive gas sparks and past false positives.

### WITH HINDSIGHT:
The same conditions occur. Before acting, RESQ queries Hindsight:
> *"Have we encountered similar rescue conditions before?"*

Hindsight retrieves 3 precedent missions:
1. **Mission RESQ-001:** High gas (780 ppm), motion + thermal 0.93 confirmed a survivor when a 48 cm standoff was held.
2. **Mission RESQ-007:** Motion detected with weak thermal (0.32) caused a false positive (wind blowing a severed cable).
3. **Mission RESQ-011:** High gas (840 ppm) and strong thermal confirmed a survivor when core body heat was verified prior to entry.

RESQ's Agent reflects across these experiences and changes its recommendation:
> *"I found 3 relevant previous missions. Two similar situations resulted in confirmed survivors, while one produced a false positive when motion was used without strong thermal confirmation. I recommend stopping forward movement at 52 cm standoff, locking thermal tracking for 10 seconds to confirm core body heat gradient, and escalating only after verification."*

---

## 🛡️ Independent Safety Controller

The Gemini LLM never directly drives robot actuators or executes high-risk team dispatches without passing through the deterministic Safety Controller:
- **Rule 1 (Clearance Distance):** Forward movement blocked if distance < 20 cm.
- **Rule 2 (Gas Limit):** Forward movement blocked if gas &ge; 1000 ppm (explosion threshold).
- **Rule 3 (Flashover Heat):** Forward movement blocked if temperature &ge; 55°C.
- **Rule 4 (Structural Collapse):** HIGH or CRITICAL structural risk mandates explicit Human Operator approval.

---

## 🚀 Quick Start & Environment Setup

### 1. Prerequisites
- Node.js 20+
- npm

### 2. Environment Variables (`.env`)
```bash
# Gemini AI API Key (automatically injected by Google AI Studio)
GEMINI_API_KEY="your_gemini_api_key"

# Hindsight Persistent Memory API Configuration
HINDSIGHT_API_KEY=""  # Optional: Supply your Hindsight API key for live cloud sync
HINDSIGHT_BASE_URL="https://api.hindsight.vectorize.io"
HINDSIGHT_BANK_ID="resq-mem-disaster-response-v1"
```

*Note: If `HINDSIGHT_API_KEY` is omitted, RESQ runs with an explicit, transparently labeled demo fallback bank with 10 pre-seeded historical missions.*

### 3. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## 🎬 2-Minute Judge Demo Sequence

1. **Open the App:** Notice the dark mission-control interface and the live status indicators (`HINDSIGHT: DEMO FALLBACK` or `LIVE CLOUD`, `AGENT: GEMINI 3.8`, `VISION: FLIR ACTIVE`).
2. **Click "Simulate Similar Incident":** Loads **Scenario 4** (Gas 810 ppm, Motion True, Temp 41°C, Thermal 0.91, Clearance 52 cm).
3. **Inspect the Pipeline Tracker:** Observe the progression from `SENSE → RECALL → REFLECT → DECIDE → SAFETY CHECK`.
4. **Compare Decisions:** Switch to the **Memory Comparison** tab to see how the recommendation changed from a rash forward charge to a cautious 52 cm standoff.
5. **Click "Why This Decision?":** Examine the exact memory citations (`RESQ-001`, `RESQ-007`, `RESQ-011`) and see how the failure precedent in RESQ-007 prevented a false-alarm deployment.
6. **Act as Operator:** In the **Human Gate**, click `[APPROVE]` or enter a route correction under `[REJECT]`.
7. **Retain Experience:** Click `[RETAIN EXPERIENCE IN HINDSIGHT]`. The mission is immediately indexed into Hindsight's memory bank!
8. **Check Memory Bank:** Navigate to the **Hindsight Bank & Timeline** tab to inspect the newly added experience.
