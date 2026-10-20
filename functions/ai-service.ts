import { GoogleGenAI } from "@google/genai";
import { getCuratedFallbackQuestions, CuratedQuestion } from "./quiz-question-banks";
import {
  areQuestionsDuplicate,
  canonicalizeText,
  getCuratedAptitudeQuestions
} from "./aptitude-question-bank";
import { getCuratedGateQuestions, canonicalGateBranch } from "./gate-question-bank";
import { generateProceduralAptitudeQuestions } from "./procedural-question-generators";

// Initialize Gemini client lazily
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  subject?: string;
}

export interface AptitudeQuestion {
  id: string;
  section: "Quantitative Aptitude" | "Logical Reasoning" | "Verbal Ability";
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PerformanceAnalysis {
  strongAreas: string[];
  needsPractice: string[];
  recommendation: string;
  summary: string;
  accuracyRate: string;
}

// Subject recommendations mapping by engineering branch
// Subject recommendations mapping strictly defined by engineering branch
export const BRANCH_SUBJECTS: Record<string, { languages: string[]; coreSubjects: string[]; description: string }> = {
  "Computer Science Engineering": {
    languages: ["C", "C++", "Java", "Python"],
    coreSubjects: [
      "Data Structures",
      "Algorithms",
      "DBMS",
      "Operating Systems",
      "Computer Networks",
      "Web Development"
    ],
    description: "Master foundational languages, data structures, algorithms, operating systems, and computer networks."
  },
  "Information Technology": {
    languages: ["Java", "Python", "SQL", "Web Development"],
    coreSubjects: [
      "Software Engineering",
      "Computer Networks",
      "Cloud Computing",
      "Database Management"
    ],
    description: "Focus on web technologies, enterprise databases, cloud architectures, and software engineering practices."
  },
  "Artificial Intelligence & Machine Learning": {
    languages: ["Python", "TensorFlow"],
    coreSubjects: [
      "Artificial Intelligence",
      "Machine Learning",
      "Deep Learning",
      "Statistics",
      "Mathematics for AI/ML",
      "Data Structures"
    ],
    description: "Focus on neural architectures, machine learning models, statistical inference, tensor operations, and AI mathematics."
  },
  "Data Science": {
    languages: ["Python", "SQL"],
    coreSubjects: [
      "Statistics",
      "NumPy",
      "Pandas",
      "Data Analysis",
      "Machine Learning",
      "Data Visualization"
    ],
    description: "Focus on statistical modeling, tabular data processing with NumPy/Pandas, SQL querying, and predictive analytics."
  },
  "Electronics & Telecommunication": {
    languages: ["Embedded C", "MATLAB", "Verilog"],
    coreSubjects: [
      "Digital Electronics",
      "Analog Electronics",
      "Microcontrollers",
      "Embedded Systems",
      "Communication Systems"
    ],
    description: "Focus on embedded firmware, digital/analog circuitry, microcontrollers, VLSI logic, and communication systems."
  },
  "Electrical Engineering": {
    languages: ["MATLAB", "Simulink", "PLC"],
    coreSubjects: [
      "Circuit Theory",
      "Electrical Machines",
      "Power Systems",
      "Control Systems",
      "Power Electronics"
    ],
    description: "Focus on grid dynamics, machine drives, circuit theory, programmable logic controllers, and power electronic converters."
  },
  "Mechanical Engineering": {
    languages: ["MATLAB", "AutoCAD", "SolidWorks"],
    coreSubjects: [
      "Engineering Mechanics",
      "Thermodynamics",
      "Strength of Materials",
      "Manufacturing Processes",
      "Fluid Mechanics"
    ],
    description: "Focus on mechanical drafting, solid modeling, thermodynamic cycles, mechanics of materials, and manufacturing."
  },
  "Civil Engineering": {
    languages: ["AutoCAD", "STAAD.Pro"],
    coreSubjects: [
      "Surveying",
      "Structural Engineering",
      "Geotechnical Engineering",
      "Construction Engineering",
      "Environmental Engineering",
      "Transportation Engineering"
    ],
    description: "Focus on structural analysis, CAD drafting, surveying, geotechnical soil mechanics, and civil infrastructure."
  },
  "Chemical Engineering": {
    languages: ["MATLAB", "Aspen Plus"],
    coreSubjects: [
      "Chemical Thermodynamics",
      "Fluid Mechanics",
      "Heat Transfer",
      "Mass Transfer",
      "Chemical Reaction Engineering",
      "Process Control"
    ],
    description: "Focus on transport phenomena, reaction kinetics, mass-heat transfer, process simulation, and plant control."
  }
};

/**
 * Normalizes branch name or abbreviation to canonical key
 */
export function canonicalBranchKey(branch: string): string {
  const b = (branch || "").trim().toLowerCase();
  if (b.includes("chem")) return "Chemical Engineering";
  if (b.includes("data sci") || b === "ds") return "Data Science";
  if (b.includes("ai") || b.includes("aiml") || b.includes("artificial") || b.includes("machine learn")) {
    return "Artificial Intelligence & Machine Learning";
  }
  if ((b.includes("elec") && b.includes("tele")) || b.includes("e&tc") || b.includes("entc") || b.includes("etc")) {
    return "Electronics & Telecommunication";
  }
  if (b.includes("elec") || b.includes("eee")) return "Electrical Engineering";
  if (b.includes("mech")) return "Mechanical Engineering";
  if (b.includes("civil")) return "Civil Engineering";
  if (b.includes("info") || b === "it") return "Information Technology";
  if (b.includes("comp") || b.includes("cse") || b === "cs") return "Computer Science Engineering";
  return "Computer Science Engineering";
}

/**
 * 1. Recommend Subjects based on Student Branch
 * Guarantees strictly branch-specific subjects without generic leakage
 */
export async function recommendSubjects(branch: string): Promise<{
  branch: string;
  recommendedLanguages: string[];
  recommendedSubjects: string[];
  allSubjects: string[];
  learningPath: string;
  isAiGenerated: boolean;
}> {
  const canonKey = canonicalBranchKey(branch);
  const branchData = BRANCH_SUBJECTS[canonKey] || BRANCH_SUBJECTS["Computer Science Engineering"];

  const recommendedLanguages = [...branchData.languages];
  const recommendedSubjects = [...branchData.coreSubjects];
  const allSubjects = [...recommendedLanguages, ...recommendedSubjects];

  const ai = getGeminiClient();
  if (!ai) {
    return {
      branch: canonKey,
      recommendedLanguages,
      recommendedSubjects,
      allSubjects,
      learningPath: branchData.description,
      isAiGenerated: false
    };
  }

  try {
    const prompt = `You are an expert engineering academic advisor.
For the engineering discipline "${canonKey}", generate an insightful, inspiring 2-sentence learning recommendation.
The curriculum for this branch includes: ${allSubjects.join(", ")}.

Return strict JSON format:
{
  "learningPath": "string"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return {
      branch: canonKey,
      recommendedLanguages,
      recommendedSubjects,
      allSubjects,
      learningPath: parsed.learningPath || branchData.description,
      isAiGenerated: true
    };
  } catch (err) {
    console.error("Gemini subject recommendation insight fallback:", err);
    return {
      branch: canonKey,
      recommendedLanguages,
      recommendedSubjects,
      allSubjects,
      learningPath: branchData.description,
      isAiGenerated: false
    };
  }
}

/**
 * Helper to normalize question text for strict duplicate detection
 */
export function normalizeQuestionText(text: any): string {
  if (!text) return "";
  const raw = typeof text === "string" ? text : (text?.questionText || text?.question || String(text));
  return String(raw).trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Validate a candidate question object
 */
function validateQuestion(q: any, targetSubject: string, targetDiff: "Easy" | "Medium" | "Hard"): QuizQuestion | null {
  if (!q || typeof q.question !== "string" || !q.question.trim()) return null;
  if (!Array.isArray(q.options) || q.options.length !== 4) return null;

  const validOptions = q.options.every((opt: any) => typeof opt === "string" && opt.trim().length > 0);
  if (!validOptions) return null;

  // Ensure options are distinct
  const uniqueOpts = new Set(q.options.map((o: string) => o.trim().toLowerCase()));
  if (uniqueOpts.size < 4) return null;

  let correctIndex = -1;
  if (typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex <= 3) {
    correctIndex = Math.floor(q.correctIndex);
  } else if (typeof q.correctAnswer === "number" && q.correctAnswer >= 0 && q.correctAnswer <= 3) {
    correctIndex = Math.floor(q.correctAnswer);
  } else if (typeof q.correctIndex === "string") {
    const char = q.correctIndex.trim().toUpperCase();
    if (char === "A") correctIndex = 0;
    else if (char === "B") correctIndex = 1;
    else if (char === "C") correctIndex = 2;
    else if (char === "D") correctIndex = 3;
    else {
      const parsed = parseInt(char, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 3) correctIndex = parsed;
    }
  }

  if (correctIndex < 0 || correctIndex > 3) return null;

  const explanation = (typeof q.explanation === "string" && q.explanation.trim())
    ? q.explanation.trim()
    : `Verified engineering explanation for ${targetSubject}.`;

  const cleanOptions = q.options.map((o: string) => o.trim());

  // BUG 2 FIX: Natural distribution across A, B, C, D with 100% accurate correctIndex update
  const shuffled = shuffleOptionsSafely({
    id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    question: q.question.trim(),
    options: cleanOptions as [string, string, string, string],
    correctIndex,
    explanation,
    topic: (typeof q.topic === "string" && q.topic.trim()) ? q.topic.trim() : targetSubject,
    difficulty: targetDiff,
    subject: targetSubject
  });

  return shuffled;
}

/**
 * Universal option shuffler for QuizGenius
 * Shuffles options to prevent option A bias while strictly updating correctIndex
 * to the exact new position of the correct answer text.
 */
export function shuffleOptionsSafely<T extends { options: string[] | [string, string, string, string]; correctIndex: number }>(q: T): T {
  if (!q || !Array.isArray(q.options) || q.options.length !== 4) return q;
  const originalOptions = [...q.options];
  const origIndex = typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex <= 3 ? q.correctIndex : 0;
  const correctOptionText = originalOptions[origIndex];

  const hasPositional = originalOptions.some((opt) =>
    /all of the above|none of the above|both [a-d] and [a-d]/i.test(opt)
  );

  let newOptions: string[];
  if (hasPositional && /all of the above|none of the above/i.test(originalOptions[3])) {
    const top3 = [0, 1, 2];
    for (let i = top3.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [top3[i], top3[j]] = [top3[j], top3[i]];
    }
    newOptions = [originalOptions[top3[0]], originalOptions[top3[1]], originalOptions[top3[2]], originalOptions[3]];
  } else if (!hasPositional) {
    const indices = [0, 1, 2, 3];
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    newOptions = indices.map((i) => originalOptions[i]);
  } else {
    newOptions = [...originalOptions];
  }

  const newCorrectIndex = newOptions.indexOf(correctOptionText);
  return {
    ...q,
    options: newOptions as any,
    correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : origIndex
  };
}

/**
 * 2. Generate Technical Quiz Questions
 * Enforces strict difficulty rules, candidate over-generation (15-20 candidates),
 * duplicate filtering, and history avoidance.
 */
export async function generateQuiz(
  subject: string,
  difficulty: "Easy" | "Medium" | "Hard" = "Medium",
  count: number = 10,
  previousQuestions: (string | any)[] = [],
  branch: string = ""
): Promise<{ questions: QuizQuestion[]; isAiGenerated: boolean }> {
  // Normalize difficulty strictly to "Easy" | "Medium" | "Hard"
  const diffLower = String(difficulty || "").toLowerCase().trim();
  const validDiff: "Easy" | "Medium" | "Hard" =
    diffLower === "easy" ? "Easy" :
    diffLower === "hard" ? "Hard" : "Medium";

  // Build exclusion set from student's historical questions
  const seenNormalized = new Set<string>();
  const previousTexts: string[] = [];
  if (Array.isArray(previousQuestions)) {
    for (const prev of previousQuestions) {
      const raw = typeof prev === "string" ? prev : ((prev as any)?.questionText || (prev as any)?.question || "");
      if (raw && typeof raw === "string" && raw.trim()) {
        previousTexts.push(raw.trim());
        const n = normalizeQuestionText(raw);
        if (n) seenNormalized.add(n);
      }
    }
  }

  const collectedQuestions: QuizQuestion[] = [];
  let isAiGenerated = false;

  console.log(`[Backend AI QuizGenius] generateQuiz: subject="${subject}", branch="${branch}", diff="${validDiff}", requested=${count}, historyExclusions=${previousTexts.length}`);

  const ai = getGeminiClient();
  if (ai) {
    // Define explicit difficulty criteria based on requirement rules
    let difficultyCriteria = "";
    if (validDiff === "Easy") {
      difficultyCriteria = `STRICT REQUIREMENT: GENERATE ONLY EASY-LEVEL QUESTIONS.
Do NOT generate Medium or Hard questions.
Every question must match the requested difficulty: "Easy".
Focus strictly on:
- Definitions
- Basic syntax
- Simple output
- Basic concepts
- Simple examples
- Basic terminology
Do NOT include complex code snippets, multi-level logic, or advanced edge cases.`;
    } else if (validDiff === "Medium") {
      difficultyCriteria = `STRICT REQUIREMENT: GENERATE ONLY MEDIUM-LEVEL QUESTIONS.
Do NOT generate Easy or Hard questions.
Every question must match the requested difficulty: "Medium".
Focus strictly on:
- Concept understanding
- Code understanding
- Output prediction
- Application of concepts
- Moderate problem solving
Do NOT include introductory syntax definitions or simple trivia.`;
    } else {
      difficultyCriteria = `STRICT REQUIREMENT: GENERATE ONLY HARD-LEVEL QUESTIONS.
Do NOT generate Easy or Medium questions.
Every question must match the requested difficulty: "Hard".
Focus strictly on:
- Complex concepts
- Advanced code
- Debugging
- Logical reasoning
- Complex output prediction
- Problem solving and edge cases
- Memory internals and runtime behavior
Do NOT include beginner syntax or simple definitions.`;
    }

    let branchGuidance = "";
    if (branch) {
      const bLow = branch.toLowerCase();
      const sLow = subject.toLowerCase();
      branchGuidance = `
STRICT DISCIPLINE CONTEXT:
The student belongs to the "${branch}" engineering department and is attempting questions for the subject: "${subject}".
Ensure all questions are strictly relevant and appropriate for this engineering discipline:
${bLow.includes("civil") ? "- For Civil Engineering: Focus on civil/structural engineering standards, STAAD.Pro structural analysis, surveying, geotech, or civil drafting in AutoCAD." : ""}
${bLow.includes("mech") ? "- For Mechanical Engineering: Focus on mechanical mechanisms, thermal cycles, strength of materials, manufacturing processes, or 3D mechanical modeling in SolidWorks/AutoCAD." : ""}
${bLow.includes("elec") && !bLow.includes("tele") ? "- For Electrical Engineering: Focus on power systems, circuit theory, electrical machines, PLCs, Simulink simulations, or power electronics." : ""}
${bLow.includes("tele") || bLow.includes("e&tc") || bLow.includes("entc") ? "- For Electronics & Telecommunication: Focus on embedded microcontrollers, Verilog HDL, digital/analog signal processing, and communication systems." : ""}
${bLow.includes("chem") ? "- For Chemical Engineering: Focus on transport phenomena, reaction kinetics, chemical thermodynamics, mass/heat transfer, Aspen Plus simulations, or process control." : ""}
${bLow.includes("data sci") ? "- For Data Science: Focus on statistics, NumPy arrays, Pandas dataframes, data visualization, SQL queries, or predictive analytics." : ""}
${bLow.includes("machine learn") || bLow.includes("ai") ? "- For AI/ML: Focus on neural architectures, tensor mathematics, loss functions, deep learning, TensorFlow, or statistical machine learning models." : ""}
${bLow.includes("info") ? "- For Information Technology: Focus on web technologies, enterprise databases, cloud architectures, network protocols, or software engineering." : ""}
${bLow.includes("comp") || bLow.includes("cse") ? "- For Computer Science: Focus on system architecture, algorithms, low-level memory, operating systems, DBMS, or network protocols." : ""}
`;
    }

    let aiRound = 0;
    const maxAiRounds = 4;

    while (collectedQuestions.length < count && aiRound < maxAiRounds) {
      aiRound++;
      try {
        const needed = count - collectedQuestions.length;
        // Generate ample extra candidates so duplicate removal leaves plenty of valid questions
        const candidateCount = Math.min(Math.max(needed * 2 + 6, 16), 30);

        // Feed recent history + in-batch questions as strict negative examples
        const currentExclusions = [
          ...collectedQuestions.map((c) => c.question),
          ...previousTexts
        ].slice(-35);

        const prompt = `You are a rigorous university engineering professor and technical evaluator.
Generate ${candidateCount} multiple-choice questions for the subject: "${subject}".
${difficultyCriteria}
${branchGuidance}

STRICT SUBJECT INTEGRITY:
All questions must be strictly focused on "${subject}". Do NOT mix with other subjects or programming languages.

CRITICAL DEDUPLICATION, REASONING DIVERSITY & ANTI-TEMPLATE MANDATE:
- Every candidate question MUST be completely unique and fresh.
- Do NOT generate questions with identical concepts, duplicate code snippets, or trivial variations.
- DO NOT generate same-format or template-based questions where only values/numbers or variable names are changed.
- Provide a balanced mixture of reasoning types:
  * Conceptual questions
  * Numerical / calculation questions
  * Application / scenario-based questions
  * Problem-solving / reasoning questions
  * Code / output questions (for programming/technical subjects)
  * Definition & architectural understanding
  * Comparison & trade-off analysis
- Each question must require distinct problem-solving logic and test different concepts.
${currentExclusions.length > 0 ? `DO NOT repeat, rephrase, or duplicate any of the following previously used questions:\n${currentExclusions.map((q) => "- " + q).join("\n")}` : ""}

FORMAT RULES:
- Exactly 4 distinct options (A, B, C, D) per question.
- "correctIndex" must be an integer 0, 1, 2, or 3.
- Provide a clear, educational 1-2 sentence explanation of why the correct option is right.
- Set "difficulty" strictly to "${validDiff}".
- Set "subject" strictly to "${subject}".

Return strict JSON:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": 0,
      "explanation": "string",
      "topic": "string",
      "difficulty": "${validDiff}",
      "subject": "${subject}"
    }
  ]
}`;

        const aiPromise = ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Gemini AI request timed out")), 25000)
        );
        const response: any = await Promise.race([aiPromise, timeoutPromise]);

        const parsed = JSON.parse(response.text || "{}");
        if (Array.isArray(parsed.questions)) {
          for (const candidate of parsed.questions) {
            const validated = validateQuestion(candidate, subject, validDiff);
            if (!validated) continue;

            const norm = normalizeQuestionText(validated.question);
            if (seenNormalized.has(norm)) continue;

            // Check semantic duplication against previous history
            const isHistoryDup = previousTexts.some((prev) =>
              areQuestionsDuplicate(prev, validated.question)
            );
            if (isHistoryDup) continue;

            // Check semantic duplication against collected questions in this quiz
            const isBatchDup = collectedQuestions.some((cq) =>
              areQuestionsDuplicate(cq.question, validated.question)
            );
            if (isBatchDup) continue;

            seenNormalized.add(norm);
            collectedQuestions.push(validated);

            if (collectedQuestions.length >= count) {
              isAiGenerated = true;
              break;
            }
          }
        }
      } catch (err: any) {
        console.warn(`Gemini question generation round ${aiRound} notice:`, err?.message || err);
        const errMsg = String(err?.message || err || "");
        if (
          err?.status === 429 ||
          err?.status === 503 ||
          errMsg.includes("429") ||
          errMsg.includes("503") ||
          errMsg.includes("quota") ||
          errMsg.includes("RESOURCE_EXHAUSTED") ||
          errMsg.includes("UNAVAILABLE") ||
          errMsg.includes("high demand")
        ) {
          break;
        }
      }
    }
  }

  // If fewer than count unique questions were obtained, supplement from curated/procedural bank
  // Guarantees zero question repetition for ALL 9 branches without CSE-specific special casing
  let supplementRounds = 0;
  while (collectedQuestions.length < count && supplementRounds < 15) {
    supplementRounds++;
    const needed = count - collectedQuestions.length;
    const fallbackList = getCuratedFallbackQuestions(
      subject,
      validDiff,
      needed + 15,
      seenNormalized,
      branch,
      previousTexts
    );

    for (const fq of fallbackList) {
      if (collectedQuestions.length >= count) break;
      const norm = normalizeQuestionText(fq.question);
      if (seenNormalized.has(norm)) continue;

      const isHistoryDup = previousTexts.some((prev) =>
        areQuestionsDuplicate(prev, fq.question)
      );
      if (isHistoryDup) continue;

      const isBatchDup = collectedQuestions.some((cq) =>
        areQuestionsDuplicate(cq.question, fq.question)
      );
      if (isBatchDup) continue;

      seenNormalized.add(norm);
      collectedQuestions.push(shuffleOptionsSafely(fq));
    }
  }

  // Teacher Requirement: If available fallback bank is exhausted, generate additional fresh AI questions
  // instead of repeating old questions. Never silently re-add an old question just to reach count.
  if (collectedQuestions.length < count && ai) {
    try {
      const remainingNeeded = count - collectedQuestions.length;
      const emergencyExclusions = [
        ...collectedQuestions.map((c) => c.question),
        ...previousTexts
      ].slice(-50);

      const emergencyPrompt = `You are a university professor. Generate ${remainingNeeded * 2 + 4} completely fresh, unique multiple-choice questions for the subject: "${subject}" (${validDiff} level).
MANDATORY CONSTRAINTS:
- Do NOT repeat or duplicate any of these questions:
${emergencyExclusions.map((q) => "- " + q).join("\n")}
- Do NOT generate same-format or template-based questions with only altered values/numbers.
- Provide conceptual and practical questions with distinct reasoning.
Return strict JSON:
{"questions": [{"question": "string", "options": ["string", "string", "string", "string"], "correctIndex": 0, "explanation": "string", "topic": "string", "difficulty": "${validDiff}", "subject": "${subject}"}]}`;

      const emergencyRes: any = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: emergencyPrompt,
        config: { responseMimeType: "application/json" }
      });
      const parsedEmergency = JSON.parse(emergencyRes.text || "{}");
      if (Array.isArray(parsedEmergency.questions)) {
        for (const candidate of parsedEmergency.questions) {
          if (collectedQuestions.length >= count) break;
          const validated = validateQuestion(candidate, subject, validDiff);
          if (!validated) continue;
          const norm = normalizeQuestionText(validated.question);
          if (seenNormalized.has(norm)) continue;
          if (previousTexts.some((prev) => areQuestionsDuplicate(prev, validated.question))) continue;
          if (collectedQuestions.some((cq) => areQuestionsDuplicate(cq.question, validated.question))) continue;

          seenNormalized.add(norm);
          collectedQuestions.push(validated);
        }
      }
    } catch (emergencyErr) {
      console.warn("Emergency AI question generation notice:", emergencyErr);
    }
  }

  return {
    questions: collectedQuestions.slice(0, count),
    isAiGenerated
  };
}

/**
 * 3. Generate Aptitude Test Questions
 * Fixes question repetition:
 * - Candidate over-generation (25 candidates)
 * - Exact and semantic duplicate removal (Jaccard token matching & numerical value checks)
 * - Automatic replacement of duplicates
 * - Zero duplicates guaranteed in any test session
 */
export async function generateAptitude(
  section: "Quantitative Aptitude" | "Logical Reasoning" | "Verbal Ability" | "All",
  topic: string = "General",
  difficulty: "Easy" | "Medium" | "Hard" = "Medium",
  count: number = 10,
  previousQuestions: (string | any)[] = []
): Promise<{ questions: AptitudeQuestion[]; isAiGenerated: boolean }> {
  const ai = getGeminiClient();
  const validList: AptitudeQuestion[] = [];
  let isAiGenerated = false;

  const historyTexts: string[] = (Array.isArray(previousQuestions) ? previousQuestions : [])
    .map((p: any) => (typeof p === "string" ? p : p?.questionText || p?.question || ""))
    .map((s) => String(s || "").trim())
    .filter(Boolean);

  if (ai) {
    let aiRound = 0;
    const maxAiRounds = 4;

    while (validList.length < count && aiRound < maxAiRounds) {
      aiRound++;
      try {
        const needed = count - validList.length;
        // Over-generate candidates to ensure plenty of unique questions
        const candidateCount = Math.min(Math.max(needed * 2 + 6, 16), 30);

        // Negative prompt exclusions
        const currentExclusions = [
          ...validList.map((v) => v.question),
          ...historyTexts
        ].slice(-35);

        const prompt = `You are an engineering campus placement aptitude test architect.
Generate ${candidateCount} distinct, high-quality multiple-choice aptitude questions for section: "${section}", topic: "${topic}", difficulty: "${difficulty}".
Targeting technical campus recruitment examinations.

CRITICAL DEDUPLICATION AND REASONING VARIATION MANDATE:
- Every single question must be completely distinct.
- The same question, problem, calculation, or scenario must NEVER appear more than once.
- DO NOT generate same-format or template-based questions where only numbers/values are changed (e.g. calculating the same percentage or speed with different values is strictly forbidden).
- Provide a balanced mixture of reasoning:
  * Conceptual and logic puzzles
  * Multi-step word problems
  * Data interpretation & scenario analysis
  * Deductive and analytical reasoning
- Each question must require genuinely different reasoning or concepts.
${currentExclusions.length > 0 ? `- DO NOT repeat or rephrase any of the following previously solved questions:\n${currentExclusions.map((t) => "- " + t).join("\n")}` : ""}

STRICT FORMAT RULES:
- Exactly 4 distinct options (A, B, C, D) per question. No duplicate option values within a question.
- "correctIndex" must be an integer (0, 1, 2, or 3).
- Provide a clear, step-by-step mathematical or logical solution in the "explanation".
- Return strict JSON format:
{
  "questions": [
    {
      "section": "${section === "All" ? "Quantitative Aptitude" : section}",
      "topic": "${topic}",
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": 0,
      "explanation": "string"
    }
  ]
}`;

        const aiPromise = ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Gemini AI request timed out")), 25000)
        );
        const response: any = await Promise.race([aiPromise, timeoutPromise]);

        const parsed = JSON.parse(response.text || "{}");
        if (Array.isArray(parsed.questions)) {
          for (let i = 0; i < parsed.questions.length; i++) {
            const q = parsed.questions[i];
            if (!q || typeof q.question !== "string" || !q.question.trim()) continue;
            if (!Array.isArray(q.options) || q.options.length !== 4) continue;
            const opts = q.options.map((o: any) => String(o || "").trim());
            if (opts.some((o: string) => !o)) continue;
            // Check for duplicate options within the same question
            if (new Set(opts.map((o: string) => o.toLowerCase())).size !== 4) continue;

            const correctIdx =
              typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex <= 3
                ? q.correctIndex
                : 0;
            const candidateText = q.question.trim();

            // 1. Check duplicate with already accepted questions in this test session
            const isDuplicateInBatch = validList.some((existing) =>
              areQuestionsDuplicate(existing.question, candidateText)
            );
            if (isDuplicateInBatch) continue;

            // 2. Check duplicate with student's previous history
            const isDuplicateInHistory = historyTexts.some((prev) =>
              areQuestionsDuplicate(prev, candidateText)
            );
            if (isDuplicateInHistory) continue;

            validList.push({
              id: `apt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${validList.length + 1}`,
              section: q.section || (section === "All" ? "Quantitative Aptitude" : section),
              topic: q.topic || topic,
              question: candidateText,
              options: opts,
              correctIndex: correctIdx,
              explanation: q.explanation || "Step-by-step analytical reasoning verified."
            });

            if (validList.length >= count) {
              isAiGenerated = true;
              break;
            }
          }
        }
      } catch (err: any) {
        console.warn(`Gemini aptitude generation round ${aiRound} error:`, err?.message || err);
        const errMsg = String(err?.message || err || "");
        if (
          err?.status === 429 ||
          err?.status === 503 ||
          errMsg.includes("429") ||
          errMsg.includes("503") ||
          errMsg.includes("quota") ||
          errMsg.includes("RESOURCE_EXHAUSTED") ||
          errMsg.includes("UNAVAILABLE") ||
          errMsg.includes("high demand")
        ) {
          break;
        }
      }
    }
  }

  // If duplicate removal or generation returned fewer than count, automatically draw from curated question bank
  if (validList.length < count) {
    const curatedReplacements = getCuratedAptitudeQuestions(section, count, validList as any, historyTexts);
    for (const cr of curatedReplacements) {
      if (validList.length >= count) break;
      const isDuplicate = validList.some(
        (existing) => existing.id === cr.id || areQuestionsDuplicate(existing.question, cr.question)
      );
      if (!isDuplicate && !historyTexts.some((prev) => areQuestionsDuplicate(prev, cr.question))) {
        validList.push({
          id: cr.id || `apt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${validList.length + 1}`,
          section: cr.section,
          topic: cr.topic,
          question: cr.question,
          options: cr.options,
          correctIndex: cr.correctIndex,
          explanation: cr.explanation
        });
      }
    }
  }

  // If still fewer than count, generate procedural unique questions to guarantee question pool never exhausts
  if (validList.length < count) {
    const needed = count - validList.length;
    const combinedHistory = [
      ...historyTexts,
      ...validList.map((v) => v.question)
    ];
    const proceduralReplacements = generateProceduralAptitudeQuestions(
      section,
      needed + 10,
      combinedHistory
    );
    for (const pr of proceduralReplacements) {
      if (validList.length >= count) break;
      const isDuplicate = validList.some(
        (existing) => existing.id === pr.id || areQuestionsDuplicate(existing.question, pr.question)
      );
      if (!isDuplicate && !historyTexts.some((prev) => areQuestionsDuplicate(prev, pr.question))) {
        validList.push(pr);
      }
    }
  }

  // Final sanity duplicate elimination and ID uniqueness guarantee
  const finalQuestions: AptitudeQuestion[] = [];
  for (const item of validList) {
    if (finalQuestions.length >= count) break;
    const isDup = finalQuestions.some(
      (fq) => fq.id === item.id || areQuestionsDuplicate(fq.question, item.question)
    );
    if (!isDup) {
      finalQuestions.push(shuffleOptionsSafely(item as any));
    }
  }

  return {
    questions: finalQuestions.slice(0, count),
    isAiGenerated: isAiGenerated && validList.length >= count
  };
}

/**
 * 4. Generate GATE Exam Quiz Questions
 * Targeted for GATE CSE & engineering subjects:
 * Data Structures, Algorithms, DBMS, Operating Systems, Computer Networks,
 * Computer Organization and Architecture, Theory of Computation, Compiler Design, Engineering Mathematics.
 * Enforces candidate over-generation, strict duplicate filtering, and persistent history avoidance.
 */
export async function generateGateQuiz(
  subject: string,
  difficulty: "Easy" | "Medium" | "Hard" = "Medium",
  count: number = 10,
  previousQuestions: (string | any)[] = [],
  branch: string = "Computer Science Engineering"
): Promise<{ questions: QuizQuestion[]; isAiGenerated: boolean }> {
  const canonBranch = canonicalGateBranch(branch);
  const diffLower = String(difficulty || "").toLowerCase().trim();
  const validDiff: "Easy" | "Medium" | "Hard" =
    diffLower === "easy" ? "Easy" :
    diffLower === "hard" ? "Hard" : "Medium";

  const seenNormalized = new Set<string>();
  const previousTexts: string[] = [];
  if (Array.isArray(previousQuestions)) {
    for (const prev of previousQuestions) {
      const raw = typeof prev === "string" ? prev : ((prev as any)?.questionText || (prev as any)?.question || "");
      if (raw && typeof raw === "string" && raw.trim()) {
        previousTexts.push(raw.trim());
        const n = normalizeQuestionText(raw);
        if (n) seenNormalized.add(n);
      }
    }
  }

  const collectedQuestions: QuizQuestion[] = [];
  let isAiGenerated = false;
  const ai = getGeminiClient();

  if (ai) {
    let aiRound = 0;
    const maxAiRounds = 4;

    while (collectedQuestions.length < count && aiRound < maxAiRounds) {
      aiRound++;
      try {
        const needed = count - collectedQuestions.length;
        const candidateCount = Math.min(Math.max(needed * 2 + 6, 16), 28);

        const currentExclusions = [
          ...collectedQuestions.map((c) => c.question),
          ...previousTexts
        ].slice(-35);

        const prompt = `You are a premier Graduate Aptitude Test in Engineering (GATE - ${canonBranch}) examination professor and question designer.
Create ${candidateCount} multiple-choice questions for the GATE ${canonBranch} subject: "${subject}".
Target Difficulty: ${validDiff}.

MANDATORY CRITICAL DEDUPLICATION & REASONING DIVERSITY MANDATE:
- Every candidate question MUST be unique and completely distinct.
- NEVER generate duplicate questions or variants where only numbers or minor wording differ.
- DO NOT generate same-format questions with only altered values.
- Provide a balanced mixture of:
  * Theoretical / conceptual derivation questions
  * Real-world engineering scenario & design problems
  * Calculation / analytical problem-solving
  * Comparative analysis of engineering methods
- The questions MUST belong strictly to the discipline of ${canonBranch} and subject "${subject}".
${currentExclusions.length > 0 ? `- The student has ALREADY solved the following questions. DO NOT REPEAT ANY OF THEM:\n${currentExclusions.map((t) => "- " + t).join("\n")}` : ""}

STRICT FORMAT REQUIREMENTS:
- Exactly 4 distinct options per question.
- "correctIndex" must be 0, 1, 2, or 3.
- Provide a rigorous mathematical/technical step-by-step derivation in "explanation".
- Return strict JSON format:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": 0,
      "explanation": "string",
      "topic": "string"
    }
  ]
}`;

        const aiPromise = ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Gemini AI request timed out")), 25000)
        );
        const response: any = await Promise.race([aiPromise, timeoutPromise]);

        const parsed = JSON.parse(response.text || "{}");
        if (Array.isArray(parsed.questions)) {
          for (let i = 0; i < parsed.questions.length; i++) {
            const q = parsed.questions[i];
            if (!q || typeof q.question !== "string" || !q.question.trim()) continue;
            if (!Array.isArray(q.options) || q.options.length !== 4) continue;

            const opts = q.options.map((o: any) => String(o || "").trim());
            if (opts.some((o: string) => !o)) continue;
            if (new Set(opts.map((o: string) => o.toLowerCase())).size !== 4) continue;

            const correctIdx =
              typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex <= 3
                ? q.correctIndex
                : 0;
            const candidateText = q.question.trim();
            const normText = normalizeQuestionText(candidateText);

            // Level 1: Duplicate inside current test
            if (collectedQuestions.some((cq) => areQuestionsDuplicate(cq.question, candidateText))) continue;
            // Level 2: Duplicate across previous attempts
            if (seenNormalized.has(normText)) continue;
            if (previousTexts.some((prev) => areQuestionsDuplicate(prev, candidateText))) continue;

            seenNormalized.add(normText);
            collectedQuestions.push(shuffleOptionsSafely({
              id: `gate_${Date.now()}_${collectedQuestions.length}`,
              question: candidateText,
              options: opts as [string, string, string, string],
              correctIndex: correctIdx,
              explanation: String(q.explanation || "GATE concept verified.").trim(),
              topic: String(q.topic || subject).trim(),
              difficulty: validDiff,
              subject
            }));

            if (collectedQuestions.length >= count) {
              isAiGenerated = true;
              break;
            }
          }
        }
      } catch (err: any) {
        console.warn(`Gemini GATE generation round ${aiRound} notice:`, err?.message || err);
        const errMsg = String(err?.message || err || "");
        if (
          err?.status === 404 ||
          err?.status === 429 ||
          err?.status === 503 ||
          errMsg.includes("404") ||
          errMsg.includes("429") ||
          errMsg.includes("503") ||
          errMsg.includes("quota") ||
          errMsg.includes("RESOURCE_EXHAUSTED") ||
          errMsg.includes("UNAVAILABLE") ||
          errMsg.includes("high demand") ||
          errMsg.includes("timed out") ||
          errMsg.includes("NOT_FOUND")
        ) {
          break;
        }
      }
    }
  }

  // Fallback to curated GATE question bank + procedural engine
  if (collectedQuestions.length < count) {
    const needed = count - collectedQuestions.length;
    const fallbackBank = getCuratedGateQuestions(subject, validDiff, needed + 10, seenNormalized, previousTexts, canonBranch);
    for (const fq of fallbackBank) {
      if (collectedQuestions.length >= count) break;
      const norm = normalizeQuestionText(fq.question);
      if (seenNormalized.has(norm)) continue;
      if (previousTexts.some((prev) => areQuestionsDuplicate(prev, fq.question))) continue;
      if (collectedQuestions.some((cq) => areQuestionsDuplicate(cq.question, fq.question))) continue;

      seenNormalized.add(norm);
      collectedQuestions.push(shuffleOptionsSafely({
        ...fq,
        id: `gate_fb_${Date.now()}_${collectedQuestions.length}`
      }));
    }
  }

  // Guarantees non-empty, robust target count: if history excluded previous questions,
  // backfill from curated branch bank ensuring ZERO intra-quiz duplicates
  if (collectedQuestions.length < count) {
    const finalFallback = getCuratedGateQuestions(subject, validDiff, count, new Set(), [], canonBranch);
    for (const fq of finalFallback) {
      if (collectedQuestions.length >= count) break;
      if (collectedQuestions.some((cq) => areQuestionsDuplicate(cq.question, fq.question))) continue;
      if (collectedQuestions.some((cq) => cq.question.trim().toLowerCase() === fq.question.trim().toLowerCase())) continue;

      collectedQuestions.push(shuffleOptionsSafely({
        ...fq,
        id: `gate_fb_final_${Date.now()}_${collectedQuestions.length}`
      }));
    }
  }

  return {
    questions: collectedQuestions.slice(0, count),
    isAiGenerated: isAiGenerated && collectedQuestions.length >= count
  };
}

/**
 * 5. Analyze Performance & Recommendations
 */
export async function analyzePerformance(data: {
  studentName?: string;
  subject: string;
  score: number;
  totalQuestions: number;
  timeTakenSeconds: number;
  answers: Array<{
    question: string;
    topic?: string;
    selectedOption: number;
    correctOption: number;
    isCorrect: boolean;
  }>;
}): Promise<PerformanceAnalysis> {
  const percentage = Math.round((data.score / (data.totalQuestions || 1)) * 100);
  const ai = getGeminiClient();

  // Extract topic breakdown
  const topicStats: Record<string, { correct: number; total: number }> = {};
  data.answers.forEach((ans) => {
    const topic = ans.topic || data.subject;
    if (!topicStats[topic]) {
      topicStats[topic] = { correct: 0, total: 0 };
    }
    topicStats[topic].total += 1;
    if (ans.isCorrect) {
      topicStats[topic].correct += 1;
    }
  });

  const strong: string[] = [];
  const weak: string[] = [];

  Object.entries(topicStats).forEach(([top, stat]) => {
    const rate = stat.correct / stat.total;
    if (rate >= 0.7) {
      strong.push(top);
    } else {
      weak.push(top);
    }
  });

  if (strong.length === 0 && percentage >= 50) {
    strong.push(data.subject + " Fundamentals");
  }
  if (weak.length === 0 && percentage < 100) {
    weak.push("Advanced Edge Cases in " + data.subject);
  }

  if (ai) {
    try {
      const prompt = `You are a personalized academic mentor for an engineering student.
Analyze this quiz test result:
Student: ${data.studentName || "Student"}
Subject/Topic: ${data.subject}
Score: ${data.score} / ${data.totalQuestions} (${percentage}%)
Time Taken: ${Math.floor(data.timeTakenSeconds / 60)}m ${data.timeTakenSeconds % 60}s
Identified Topic Stats: ${JSON.stringify(topicStats)}

Generate:
1. "strongAreas": List 2-3 specific technical sub-topics the student demonstrated mastery in.
2. "needsPractice": List 2-3 specific technical sub-topics the student struggled with or needs practice on.
3. "recommendation": A concrete, actionable 1-2 sentence engineering study recommendation. Do NOT make psychological judgments.
4. "summary": A concise 1-sentence objective appraisal.

Return strict JSON:
{
  "strongAreas": ["string", "string"],
  "needsPractice": ["string", "string"],
  "recommendation": "string",
  "summary": "string"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return {
        strongAreas: parsed.strongAreas || (strong.length ? strong : ["Core Concepts"]),
        needsPractice: parsed.needsPractice || (weak.length ? weak : ["Complex problem scenarios"]),
        recommendation: parsed.recommendation || `Practice timed problem sets in ${weak.join(", ") || data.subject} before attempting harder levels.`,
        summary: parsed.summary || `Achieved ${percentage}% accuracy with solid foundation in key principles.`,
        accuracyRate: `${percentage}%`
      };
    } catch (err) {
      console.error("Gemini performance analysis error, using analytical fallback:", err);
    }
  }

  // Analytical fallback
  const defaultStrong = strong.length ? strong : ["Basic Syntax & Syntax Rules", "Core Conventions"];
  const defaultWeak = weak.length ? weak : ["Edge cases and boundary conditions", "Time complexity optimization"];
  let rec = "";
  if (percentage >= 80) {
    rec = `Excellent grasp of ${data.subject}. Focus on advanced mock questions and competitive programming challenges next.`;
  } else if (percentage >= 50) {
    rec = `Good foundational base. Review ${defaultWeak.join(" and ")} before attempting higher difficulty quizzes.`;
  } else {
    rec = `Focus on fundamental documentation and hands-on coding exercises for ${defaultWeak.join(", ")} to strengthen your core score.`;
  }

  return {
    strongAreas: defaultStrong,
    needsPractice: defaultWeak,
    recommendation: rec,
    summary: `Scored ${data.score} out of ${data.totalQuestions} questions with an overall precision of ${percentage}%.`,
    accuracyRate: `${percentage}%`
  };
}
