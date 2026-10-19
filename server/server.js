
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { GoogleGenAI } from "@google/genai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({
  path: path.join(__dirname, "..", ".env"),
});

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// ==========================================
// SECURITY: ALLOWED FRONTEND ORIGINS
// ==========================================

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "https://soberpath-ai.vercel.app",
]);

// ==========================================
// SECURITY: RATE LIMITING
// ==========================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    reply: "Too many requests. Please wait a few minutes and try again.",
  },
});

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    reply: "Too many AI messages. Please wait a minute and try again.",
  },
});

// ==========================================
// MIDDLEWARE
// ==========================================

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  cors({
    origin(origin, callback) {
      // Requests without Origin may come from local tools.
      // Browser requests from other origins are rejected.
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "32kb" }));

app.use("/api", apiLimiter);

// ==========================================
// API KEY VALIDATION
// ==========================================

if (!process.env.GEMINI_API_KEY) {
  console.error(
    "ERROR: GEMINI_API_KEY is missing from the project root .env file."
  );
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

// ==========================================
// SOBERPATH AI SYSTEM INSTRUCTIONS
// ==========================================

const SYSTEM_INSTRUCTION = `
You are SOBERPATH AI, a supportive alcohol-awareness and recovery assistant.

LANGUAGE:
- Reply in the same language the user uses.
- Understand English, Tamil, and Tanglish.
- If the user writes Tamil using English letters, reply in simple Tanglish.
- Keep explanations clear, friendly, and easy to understand.

SUPPORT:
- Be kind, calm, respectful, and non-judgmental.
- Support people concerned about alcohol or substance use.
- Never shame, blame, threaten, or label a person.
- Offer small, practical, safe next steps.
- Encourage support from trusted people and qualified healthcare professionals.
- Ask brief clarifying questions when useful.

MEDICAL SAFETY:
- Do not diagnose medical conditions.
- Do not prescribe medicines or dosages.
- Do not recommend suddenly stopping heavy, regular alcohol use without medical advice.
- Alcohol withdrawal can be dangerous and may require supervised medical care.
- For severe withdrawal symptoms, seizures, confusion, hallucinations,
  difficulty breathing, unconsciousness, or other medical emergencies,
  advise urgent medical care immediately.
- In India, emergency services can be reached at 112.
- Never claim to be a doctor or a replacement for professional treatment.

CRISIS SUPPORT:
- If someone indicates immediate danger or possible self-harm,
  respond calmly and compassionately.
- Encourage contacting emergency services and a trusted person who can stay with them.
- Do not provide harmful instructions.

PRIVACY:
- Do not ask for passwords, API keys, or unnecessary personal information.
- Do not claim that chat history is permanently private or stored securely unless verified.

RESPONSE STYLE:
- Give direct answers.
- Use short paragraphs and bullet points when useful.
- Do not promise guaranteed recovery.
- Do not invent hospitals, phone numbers, or support services.
`;

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SOBERPATH AI backend is running!",
    model: MODEL,
  });
});

// ==========================================
// AI CHAT ENDPOINT
// ==========================================

app.post("/api/chat", chatLimiter, async (req, res) => {
  try {
    const { message, history } = req.body ?? {};

    // Validate current message
    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        reply: "Please enter a message.",
      });
    }

    const cleanMessage = message.trim();

    if (cleanMessage.length > 4000) {
      return res.status(400).json({
        success: false,
        reply: "Please keep your message under 4000 characters.",
      });
    }

    // Accept only user/model text messages from the recent history.
    const safeHistory = [];

    if (Array.isArray(history)) {
      for (const item of history.slice(-12)) {
        if (
          !item ||
          !["user", "model"].includes(item.role) ||
          typeof item.text !== "string" ||
          !item.text.trim()
        ) {
          continue;
        }

        safeHistory.push({
          role: item.role,
          parts: [
            {
              text: item.text.slice(0, 2000),
            },
          ],
        });
      }
    }

    // Normalize roles so history alternates correctly.
    const normalizedHistory = [];

    for (const item of safeHistory) {
      const previous =
        normalizedHistory[normalizedHistory.length - 1];

      if (!previous && item.role !== "user") {
        continue;
      }

      if (previous && previous.role === item.role) {
        continue;
      }

      normalizedHistory.push(item);
    }

    // History must end with the previous AI response.
    while (
      normalizedHistory.length > 0 &&
      normalizedHistory[normalizedHistory.length - 1].role !== "model"
    ) {
      normalizedHistory.pop();
    }

    const contents = [
      ...normalizedHistory,
      {
        role: "user",
        parts: [{ text: cleanMessage }],
      },
    ];

    console.log("Received chat request.");

    const response = await ai.models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    });

    const reply = response.text?.trim();

    if (!reply) {
      console.error("Gemini returned an empty response.");

      return res.status(502).json({
        success: false,
        reply: "I couldn't prepare a response just now. Please try again.",
      });
    }

    console.log("Gemini response received successfully.");

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    // Do not expose API keys or raw provider errors to the browser.
    console.error("AI request failed:", {
      name: error?.name,
      status: error?.status,
      code: error?.code,
    });

    const status = Number(error?.status);

    let userMessage =
      "AI service is temporarily unavailable. Please try again in a moment.";

    if (status === 400) {
      userMessage =
        "The AI request could not be processed. Please try again.";
    } else if (status === 401 || status === 403) {
      userMessage =
        "AI authentication failed. Please check the server configuration.";
    } else if (status === 404) {
      userMessage =
        "The configured AI model was not found. Check GEMINI_MODEL in .env.";
    } else if (status === 429) {
      userMessage =
        "The AI service has reached its usage limit. Please try again later.";
    } else if (
      error?.code === "ECONNRESET" ||
      error?.code === "ETIMEDOUT"
    ) {
      userMessage =
        "Could not connect to the AI service. Please check your internet connection.";
    }

    return res.status(502).json({
      success: false,
      reply: userMessage,
    });
  }
});

// ==========================================
// UNKNOWN ROUTE
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    reply: "Endpoint not found.",
  });
});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      success: false,
      reply: "Invalid JSON request.",
    });
  }

  if (error?.message === "Origin not allowed by CORS") {
    return res.status(403).json({
      success: false,
      reply: "This website is not allowed to access the API.",
    });
  }

  console.error("Server error:", error?.name || "UnknownError");

  return res.status(500).json({
    success: false,
    reply: "An unexpected server error occurred.",
  });
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log(`SOBERPATH AI backend running at http://localhost:${PORT}`);
  console.log(`Configured AI model: ${MODEL}`);
});

