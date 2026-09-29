import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { hindsightService } from './src/server/hindsight.ts';
import { geminiAgentService } from './src/server/geminiAgent.ts';
import { SafetyController } from './src/server/safetyController.ts';
import { HindsightMemory, SensorState, VisionAnalysis } from './src/types/rescue.ts';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

// 1. Health & System Status Endpoint
app.get('/api/status', async (req: Request, res: Response) => {
  const hindsight = hindsightService.getStatus();
  const gemini = geminiAgentService.getStatus();

  res.json({
    hindsight,
    gemini,
    sensors: {
      status: 'LIVE',
      rateHz: 10,
    },
    vision: {
      status: 'READY',
      mode: 'FLIR_SYNTHETIC',
    },
  });
});

// 1b. Real Hindsight Connection Test Endpoint
app.get('/api/hindsight/health', async (req: Request, res: Response) => {
  try {
    const health = await hindsightService.testLiveConnection();
    res.json(health);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/hindsight/test-connection', async (req: Request, res: Response) => {
  try {
    const health = await hindsightService.testLiveConnection();
    res.json(health);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 1c. Seed Canonical RESQ Experiences (RESQ-001, RESQ-007, RESQ-011, RESQ-014)
app.post('/api/hindsight/seed-experiences', async (req: Request, res: Response) => {
  try {
    const result = await hindsightService.seedResqExperiences();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Hindsight Memory Bank - List All
app.get('/api/hindsight/memories', (req: Request, res: Response) => {
  const memories = hindsightService.getAllMemories();
  res.json({
    total: memories.length,
    bankId: hindsightService.getStatus().bankId,
    mode: hindsightService.getStatus().mode,
    memories,
  });
});

// 3. Hindsight Memory Bank - Get By ID
app.get('/api/hindsight/memories/:id', (req: Request, res: Response) => {
  const memory = hindsightService.getMemoryById(req.params.id);
  if (!memory) {
    res.status(404).json({ error: `Memory ${req.params.id} not found` });
    return;
  }
  res.json(memory);
});

// 4. Hindsight RECALL Endpoint
app.post('/api/hindsight/recall', async (req: Request, res: Response) => {
  try {
    const { query, sensors, limit = 3 } = req.body;
    if (!query) {
      res.status(400).json({ error: 'Query is required for recall' });
      return;
    }
    const memories = await hindsightService.recall(query, sensors, limit);
    res.json({
      query,
      count: memories.length,
      memories,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Hindsight REFLECT Endpoint
app.post('/api/hindsight/reflect', async (req: Request, res: Response) => {
  try {
    const { query, memoryIds } = req.body;
    let memories: HindsightMemory[] = [];
    if (Array.isArray(memoryIds) && memoryIds.length > 0) {
      memories = memoryIds
        .map((id: string) => hindsightService.getMemoryById(id))
        .filter(Boolean) as HindsightMemory[];
    } else {
      memories = await hindsightService.recall(query || 'rescue reflection', undefined, 3);
    }

    const reflection = await hindsightService.reflect(query || 'rescue reflection', memories);
    res.json(reflection);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Hindsight RETAIN Endpoint
app.post('/api/hindsight/retain', async (req: Request, res: Response) => {
  try {
    const memory: HindsightMemory = req.body;
    if (!memory || !memory.id) {
      res.status(400).json({ error: 'Valid memory object with ID is required' });
      return;
    }

    const result = await hindsightService.retain(memory);
    res.json({
      success: result.success,
      memoryId: result.memoryId,
      liveApiSynced: result.liveApiSynced,
      message: result.message,
      totalMemoriesNow: hindsightService.getAllMemories().length,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Core RESQ Agent Decision Pipeline (Sense -> Recall -> Reflect -> Decide -> Safety)
app.post('/api/agent/decide', async (req: Request, res: Response) => {
  try {
    const { missionId, situation, zone, sensors, vision } = req.body;
    if (!missionId || !sensors) {
      res.status(400).json({ error: 'missionId and sensors are required' });
      return;
    }

    const decisionResponse = await geminiAgentService.makeDecision({
      missionId,
      situation: situation || 'Subterranean disaster zone reconnaissance',
      zone: zone || 'Zone B Sector 1',
      sensors: sensors as SensorState,
      vision: vision as VisionAnalysis,
    });

    res.json(decisionResponse);
  } catch (err: any) {
    console.error('Decision pipeline error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 8. Standalone Safety Controller Evaluation
app.post('/api/safety/check', (req: Request, res: Response) => {
  const { action, sensors } = req.body;
  if (!action || !sensors) {
    res.status(400).json({ error: 'action and sensors are required' });
    return;
  }
  const evaluation = SafetyController.evaluate(action, sensors);
  res.json(evaluation);
});

// 9. Operational Insights
app.get('/api/insights', (req: Request, res: Response) => {
  const insights = hindsightService.getOperationalInsights();
  res.json({ insights });
});

// 10. Reset Hindsight Bank to Initial Seed
app.post('/api/hindsight/reset', async (req: Request, res: Response) => {
  const result = await hindsightService.seedResqExperiences();
  res.json({
    success: true,
    message: 'Reset Hindsight memory bank to canonical seed missions.',
    totalMemories: hindsightService.getAllMemories().length,
    result,
  });
});

// Vite middleware or production static files
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RESQ-MEM] Rescue Vision Agent Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[RESQ-MEM] Failed to start server:', err);
});
