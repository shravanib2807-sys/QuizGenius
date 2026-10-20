import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import {
  recommendSubjects,
  generateQuiz,
  generateAptitude,
  generateGateQuiz,
  analyzePerformance
} from "./functions/ai-service";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "QuizGenius API",
      timestamp: new Date().toISOString(),
      aiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY")
    });
  });

  // 1. Branch-based Subject Recommendations
  app.post("/api/ai/recommend-subjects", async (req, res) => {
    try {
      const { branch } = req.body;
      if (!branch) {
        return res.status(400).json({ error: "Branch is required" });
      }
      const result = await recommendSubjects(branch);
      res.json(result);
    } catch (err: any) {
      console.error("recommend-subjects endpoint error:", err);
      res.status(500).json({ error: "Failed to recommend subjects", message: err?.message });
    }
  });

  // 2. AI Quiz Generation
  app.post("/api/ai/generate-quiz", async (req, res) => {
    try {
      const { subject, difficulty = "Medium", count = 10, previousQuestions = [], branch = "" } = req.body;
      if (!subject) {
        return res.status(400).json({ error: "Subject or programming language is required" });
      }
      const result = await generateQuiz(
        subject,
        difficulty,
        Math.min(Number(count) || 10, 20),
        Array.isArray(previousQuestions) ? previousQuestions : [],
        typeof branch === "string" ? branch : ""
      );
      res.json(result);
    } catch (err: any) {
      console.error("generate-quiz endpoint error:", err);
      res.status(500).json({ error: "Failed to generate quiz", message: err?.message });
    }
  });

  // 3. AI Aptitude Question Generation
  app.post("/api/ai/generate-aptitude", async (req, res) => {
    try {
      const {
        section = "Quantitative Aptitude",
        topic = "General",
        difficulty = "Medium",
        count = 10,
        previousQuestions = []
      } = req.body;
      const result = await generateAptitude(
        section,
        topic,
        difficulty,
        Math.min(Number(count) || 10, 20),
        Array.isArray(previousQuestions) ? previousQuestions : []
      );
      res.json(result);
    } catch (err: any) {
      console.error("generate-aptitude endpoint error:", err);
      res.status(500).json({ error: "Failed to generate aptitude questions", message: err?.message });
    }
  });

  // 4. AI GATE Exam Quiz Generation
  app.post("/api/ai/generate-gate", async (req, res) => {
    try {
      const {
        subject = "Data Structures",
        difficulty = "Medium",
        count = 10,
        previousQuestions = [],
        branch = "Computer Science Engineering"
      } = req.body;
      const result = await generateGateQuiz(
        subject,
        difficulty,
        Math.min(Number(count) || 10, 25),
        Array.isArray(previousQuestions) ? previousQuestions : [],
        branch
      );
      res.json(result);
    } catch (err: any) {
      console.error("generate-gate endpoint error:", err);
      res.status(500).json({ error: "Failed to generate GATE questions", message: err?.message });
    }
  });

  // 5. AI Performance Analysis
  app.post("/api/ai/analyze-performance", async (req, res) => {
    try {
      const { studentName, subject, score, totalQuestions, timeTakenSeconds, answers } = req.body;
      if (typeof score !== "number" || typeof totalQuestions !== "number") {
        return res.status(400).json({ error: "Invalid test performance payload" });
      }
      const analysis = await analyzePerformance({
        studentName,
        subject: subject || "Technical Quiz",
        score,
        totalQuestions,
        timeTakenSeconds: Number(timeTakenSeconds) || 0,
        answers: Array.isArray(answers) ? answers : []
      });
      res.json(analysis);
    } catch (err: any) {
      console.error("analyze-performance endpoint error:", err);
      res.status(500).json({ error: "Failed to analyze test performance", message: err?.message });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "mpa", // Multi-page application support
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      // If requesting a specific page like /register or /register.html
      const reqUrl = req.path.endsWith(".html") ? req.path : `${req.path}.html`;
      const candidatePath = path.join(distPath, reqUrl);
      if (req.path !== "/" && path.extname(req.path) === "") {
        return res.sendFile(candidatePath, (err) => {
          if (err) {
            res.sendFile(path.join(distPath, "index.html"));
          }
        });
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`QuizGenius Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
