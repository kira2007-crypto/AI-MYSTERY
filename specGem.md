Technical Specification: AI Mystery Room (Spec-Driven Development)
Document Status: Approved Source of Truth for Codex / AI Code Generators

Target Architecture: MERN Stack (MongoDB, Express.js, React, Node.js) + Google Gemini API

1. System Overview & Core Loop
AI Mystery Room is an interactive investigative puzzle web platform. The user inputs a brief setup prompt or mystery theme. The backend orchestrates Google Gemini to generate a logically airtight mystery case containing:

A crime scenario with suspects, motives, alibis, and one definitive culprit.

An evidence package consisting of simulated WhatsApp message logs, image descriptions/visuals (crime scene/photos), and transcribed/synthesized CCTV security cam logs.

An interactive accusation dashboard where the user investigates clues, reviews evidence, submits an accusation, and receives an AI-evaluated verdict with full debriefing.

[User Scenario Prompt] 
       │
       ▼
[Backend: Gemini Orchestrator (Structured JSON Schema)]
       │
       ├── Case Generation (Victim, Crime, Suspects, True Culprit, Solution)
       ├── Clue Artifacts Generation (Chat logs, Cam logs, Visual prompts)
       │
       ▼
[Database Persistence (MongoDB)] ──> [Client Gameplay Room (React)]
                                              │
[User Accusation & Logic Input] ──────────────┘
       │
       ▼
[Backend Evaluation Endpoint] ──> [Debriefing & Score]
2. Technical Stack & Dependencies
Layer	Technology	Key Libraries / Packages
Frontend	React 18+ (SPA), Vite or Next.js	tailwindcss, lucide-react, axios, react-router-dom
Backend	Node.js (v20+ LTS), Express.js	express, cors, dotenv, zod (validation), mongoose
Database	MongoDB	mongoose (schema modeling & validation)
AI Engine	Google Gemini API	@google/genai or @google/generative-ai (gemini-2.5-flash or gemini-1.5-pro for structured JSON output; Imagen 3 / Gemini Image Generation for visual evidence)
Asset Storage	Cloudinary or AWS S3 / Local Media Buffer	Storage for generated images / simulated security stills
3. Data Models & MongoDB Schemas
3.1 Case Model (models/Case.js)
JavaScript
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  timestamp: { type: String, required: true },
  text: { type: String, required: true }
});

const ChatEvidenceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  participants: [String],
  messages: [MessageSchema]
});

const CamEvidenceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  cameraLocation: { type: String, required: true },
  timestampRange: { type: String, required: true },
  transcriptLog: { type: String, required: true },
  stillImageUrl: { type: String, default: "" },
  notes: { type: String }
});

const ImageEvidenceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  promptUsed: { type: String },
  description: { type: String, required: true }
});

const SuspectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  relationToVictim: { type: String, required: true },
  alibi: { type: String, required: true },
  motive: { type: String, required: true },
  avatarUrl: { type: String, default: "" }
});

const CaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  synopsis: { type: String, required: true },
  userPrompt: { type: String, required: true },
  victim: {
    name: { type: String, required: true },
    details: { type: String, required: true }
  },
  suspects: [SuspectSchema],
  evidence: {
    chats: [ChatEvidenceSchema],
    cctvLogs: [CamEvidenceSchema],
    images: [ImageEvidenceSchema]
  },
  solution: {
    culpritId: { type: String, required: true },
    culpritName: { type: String, required: true },
    motiveBreakdown: { type: String, required: true },
    smokingGunEvidenceId: { type: String, required: true },
    fullExplanation: { type: String, required: true }
  },
  status: { type: String, enum: ['generating', 'ready', 'failed'], default: 'generating' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Case', CaseSchema);
4. Gemini AI Generation Pipeline & Structured Prompts
All Gemini calls must enforce JSON Schema using responseSchema or explicit structured output controls (responseMimeType: "application/json").

4.1 Generation Prompt Specification (services/geminiCaseGenerator.js)
JavaScript
const GEMINI_SYSTEM_INSTRUCTION = `
You are the Master Mystery Engine. Given a high-level scenario prompt from a user, generate an airtight, logically coherent mystery case with clues, red herrings, and one clear culprit.

Rules:
1. Exactly 3 to 4 suspects.
2. Exactly 1 true culprit whose alibi falls apart based on cross-referencing WhatsApp chats, CCTV timestamps, or visual evidence.
3. WhatsApp chats must resemble realistic chat logs (typos, timestamps, natural dialogue).
4. CCTV logs must contain precise timestamps and observations (e.g., movement across hallways, timestamps contradicting a suspect's alibi).
5. Visual clues must have concrete visual image prompts for image generation (e.g., torn receipt, muddy footprint, security camera still).
6. Provide the solution object containing the true culprit and a detailed explanation of why the evidence proves their guilt beyond doubt.
`;

const CASE_JSON_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    synopsis: { type: "string" },
    victim: {
      type: "object",
      properties: {
        name: { type: "string" },
        details: { type: "string" }
      },
      required: ["name", "details"]
    },
    suspects: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          role: { type: "string" },
          relationToVictim: { type: "string" },
          alibi: { type: "string" },
          motive: { type: "string" }
        },
        required: ["id", "name", "role", "relationToVictim", "alibi", "motive"]
      }
    },
    evidence: {
      type: "object",
      properties: {
        chats: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string" },
              participants: { type: "array", items: { type: "string" } },
              messages: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    sender: { type: "string" },
                    recipient: { type: "string" },
                    timestamp: { type: "string" },
                    text: { type: "string" }
                  },
                  required: ["sender", "recipient", "timestamp", "text"]
                }
              }
            },
            required: ["id", "title", "participants", "messages"]
          }
        },
        cctvLogs: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              cameraLocation: { type: "string" },
              timestampRange: { type: "string" },
              transcriptLog: { type: "string" },
              notes: { type: "string" }
            },
            required: ["id", "cameraLocation", "timestampRange", "transcriptLog"]
          }
        },
        images: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string" },
              imagePrompt: { type: "string", description: "Prompt to send to Imagen/Gemini for image generation" },
              description: { type: "string" }
            },
            required: ["id", "title", "imagePrompt", "description"]
          }
        }
      },
      required: ["chats", "cctvLogs", "images"]
    },
    solution: {
      type: "object",
      properties: {
        culpritId: { type: "string" },
        culpritName: { type: "string" },
        motiveBreakdown: { type: "string" },
        smokingGunEvidenceId: { type: "string" },
        fullExplanation: { type: "string" }
      },
      required: ["culpritId", "culpritName", "motiveBreakdown", "smokingGunEvidenceId", "fullExplanation"]
    }
  },
  required: ["title", "synopsis", "victim", "suspects", "evidence", "solution"]
};
5. API Endpoints Specification
5.1 POST /api/cases/generate
Description: Initiates generation of a new mystery case from a user-provided premise.

Request Body:

JSON
{
  "scenarioPrompt": "A renowned diamond collector is found poisoned in his penthouse library during a stormy dinner party."
}
Processing:

Call Gemini with CASE_JSON_SCHEMA and scenarioPrompt.

For items in evidence.images, trigger Gemini image generation or Imagen 3 API using imagePrompt to produce evidence images.

Store complete case document in MongoDB.

Return sanitized case data (excluding solution field).

Response (201 Created):

JSON
{
  "caseId": "65b...",
  "title": "Poison at Blackwood Penthouse",
  "synopsis": "...",
  "victim": { "name": "Arthur Blackwood", "details": "..." },
  "suspects": [ ... ],
  "evidence": {
    "chats": [ ... ],
    "cctvLogs": [ ... ],
    "images": [ { "id": "img_1", "title": "Glass by the Bookshelf", "imageUrl": "https://..." } ]
  }
}
5.2 GET /api/cases/:id
Description: Retrieves the active investigation room details.

Security: Must strictly project out -solution so client inspection/DevTools cannot see the culprit.

5.3 POST /api/cases/:id/solve
Description: Validates user accusation and deduction reasoning.

Request Body:

JSON
{
  "selectedSuspectId": "suspect_3",
  "evidenceIdCited": "cam_2",
  "deductionReasoning": "The CCTV timestamp in the hallway shows Dr. Mercer heading to the cellar at 21:14, directly debunking his alibi of being on the patio."
}
Processing:

Fetch complete case (with solution) from MongoDB.

Compare selectedSuspectId with solution.culpritId.

Use Gemini to grade deductionReasoning against solution.fullExplanation (assigning a confidence score from 0 to 100).

Response (200 OK):

JSON
{
  "isCorrect": true,
  "score": 95,
  "verdictTitle": "Case Solved! Master Detective Rank",
  "aiEvaluation": "Your deduction regarding the CCTV discrepancy was spot on.",
  "solution": {
    "culpritName": "Dr. Mercer",
    "motiveBreakdown": "...",
    "fullExplanation": "..."
  }
}
6. Frontend Component Architecture
src/
├── components/
│   ├── CaseCreator/
│   │   ├── ScenarioInput.jsx       // Textarea for scenario input + preset buttons
│   │   └── GenerationLoader.jsx    // Terminal-style loading state
│   ├── InvestigationRoom/
│   │   ├── CaseBrief.jsx           // Case synopsis & victim dossier
│   │   ├── SuspectCardList.jsx     // Grid of suspects with dossiers & alibis
│   │   ├── EvidenceBoard/
│   │   │   ├── EvidenceTabs.jsx    // Switch between WhatsApp, CCTV, Images
│   │   │   ├── WhatsAppViewer.jsx  // WhatsApp UI with contact header & chat bubbles
│   │   │   ├── CCTVViewer.jsx      // Digital cam player with playback timestamps
│   │   │   └── PhotoInspectModal.jsx // High-res image modal with zoom & notes
│   │   └── AccusationDesk/
│   │       ├── SuspectPicker.jsx   // Radio/card selection for suspect
│   │       ├── EvidencePicker.jsx  // Dropdown/tag selector for key proof
│   │       ├── DeductionInput.jsx  // Justification explanation textarea
│   │       └── AccuseModal.jsx     // Submit prompt & confirm modal
│   └── Verdict/
│       ├── VerdictModal.jsx        // Success/Failure reveal
│       └── CaseDebrief.jsx         // Full story breakdown & solution reveals
├── services/
│   └── api.js                      // Axios client wrapper
└── App.jsx
7. Evidence UI Mockup & Simulation Specifications
7.1 Simulated WhatsApp Evidence UI
Green header bar (#075E54) with contact avatar, contact name, and last seen status.

Bubble styling:

Outgoing message: #DCF8C6, right-aligned, double blue ticks.

Incoming message: #FFFFFF, left-aligned, sender name.

Message details: Monospace timestamps ([10:42 PM]), media attachments placeholder if relevant.

7.2 Simulated CCTV Camera Player UI
Dark surveillance monitor container with scanlines, CRT flicker effect, and timestamp stamp (REC • 2026-10-30 22:15:04 CAM-03 LOBBY).

Video replacement strategy:

Frame-based playback or dynamic slideshow showing static stills generated by Gemini Image Generation.

Interactive timestamp scrubber with markers indicating timestamped log events.

Incident transcript side panel with timestamp links jumping to log entries.

7.3 Simulated Forensic Imagery
Evidence photo cards with tag numbers (EVIDENCE ITEM #04), polaroid framing, and click-to-magnify functionality.

8. Anti-Cheat & Production Integrity Rules
Zero Client Leakage: The solution object must NEVER be transmitted to the frontend until the user has submitted their accusation via /api/cases/:id/solve.

Schema Sanitization: Mongoose.select('-solution') must be applied by default on all read queries.

Prompt Hardening: The scenario generator prompt must explicitly prohibit unsolvable paradoxes or scenarios without a single unambiguous contradiction.

Rate Limiting & Safety Filter: Attach express-rate-limit on /api/cases/generate to prevent abuse of Gemini API quotas. Sanitize prompt text against violent extremes using Gemini safety filters.