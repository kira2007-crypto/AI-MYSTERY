import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { z } from 'zod';
import { generateCaseFromPrompt } from './services/geminiService.js';
import { cases, getCaseById, saveCase, sanitizeCase } from './data/store.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5001);

app.use(cors());
app.use(express.json({ limit: '2mb' }));

const generateCaseSchema = z.object({
  scenarioPrompt: z.string().min(10).max(500)
});

const solveCaseSchema = z.object({
  selectedSuspectId: z.string().min(1),
  evidenceIdCited: z.string().min(1),
  deductionReasoning: z.string().min(10).max(1500)
});

async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log('MongoDB URI not provided. Running in in-memory mode for this demo.');
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (error) {
    console.warn('Unable to connect to MongoDB, continuing in memory mode.', error.message);
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'AI Mystery Room API is running' });
});

app.post('/api/cases/generate', async (req, res) => {
  const parsed = generateCaseSchema.safeParse(req.body || {});

  if (!parsed.success) {
    return res.status(400).json({ message: 'A valid scenarioPrompt is required.' });
  }

  const caseDoc = generateCaseFromPrompt(parsed.data.scenarioPrompt);
  const caseId = `case_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const storedCase = {
    caseId,
    ...caseDoc,
    status: 'ready',
    createdAt: new Date().toISOString()
  };

  saveCase(storedCase);

  return res.status(201).json({
    caseId,
    ...sanitizeCase(storedCase)
  });
});

app.get('/api/cases/:id', (req, res) => {
  const caseDoc = getCaseById(req.params.id);

  if (!caseDoc) {
    return res.status(404).json({ message: 'Case not found.' });
  }

  return res.json(sanitizeCase(caseDoc));
});

app.post('/api/cases/:id/solve', (req, res) => {
  const parsed = solveCaseSchema.safeParse(req.body || {});

  if (!parsed.success) {
    return res.status(400).json({ message: 'Missing accusation details.' });
  }

  const caseDoc = getCaseById(req.params.id);

  if (!caseDoc) {
    return res.status(404).json({ message: 'Case not found.' });
  }

  const { selectedSuspectId, deductionReasoning } = parsed.data;
  const isCorrect = selectedSuspectId === caseDoc.solution.culpritId;

  const reasoningScore = deductionReasoning.toLowerCase().includes('cctv') || deductionReasoning.toLowerCase().includes('security')
    ? 89
    : 62;

  const score = isCorrect ? Math.min(100, reasoningScore + 6) : Math.max(5, 18 + (deductionReasoning.length > 150 ? 12 : 0));

  const verdictTitle = isCorrect ? 'Case Solved! Master Detective Rank' : 'Wrong suspect — the mystery remains open';
  const aiEvaluation = isCorrect
    ? 'Your deduction matches the timeline and the evidence chain. The security contradiction is decisive.'
    : 'The evidence points elsewhere. Revisit the timing logs and the hallway footage before choosing a suspect.';

  return res.json({
    isCorrect,
    score: Math.round(score),
    verdictTitle,
    aiEvaluation,
    solution: {
      culpritName: caseDoc.solution.culpritName,
      motiveBreakdown: caseDoc.solution.motiveBreakdown,
      fullExplanation: caseDoc.solution.fullExplanation
    }
  });
});

app.listen(PORT, async () => {
  await connectDatabase();
  console.log(`AI Mystery Room server running on http://localhost:${PORT}`);
});
