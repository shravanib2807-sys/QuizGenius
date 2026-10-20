import {
  initAuthProtection,
  saveTestResult,
  areQuestionsDuplicate,
  getQuestionHistoryTexts,
  saveQuestionHistory,
  enforceQuizAccess
} from "./auth.js";
import { fetchGateQuestions, fetchPerformanceAnalysis } from "./ai.js";

export const GATE_BRANCH_SUBJECTS_CATALOG = {
  "Computer Science Engineering": [
    {
      name: "Data Structures",
      icon: "🌲",
      desc: "Trees, AVL, B/B+ trees, Heaps, Hashing, Graph representations, and asymptotic space bounds.",
      tags: ["Red-Black Trees", "Min-Heaps", "Hashing", "BSTs"]
    },
    {
      name: "Algorithms",
      icon: "⚡",
      desc: "Divide & conquer, Master Theorem, Greedy, Dynamic Programming, Graph shortest paths, NP-Completeness.",
      tags: ["Bellman-Ford", "Floyd-Warshall", "Master Theorem", "Knapsack"]
    },
    {
      name: "DBMS",
      icon: "🗄️",
      desc: "Relational Algebra, SQL queries, Normalization (3NF/BCNF), Concurrency control, Strict 2PL, B+ trees.",
      tags: ["Candidate Keys", "Lossless Join", "Serializability", "ACID"]
    },
    {
      name: "Operating Systems",
      icon: "⚙️",
      desc: "CPU Scheduling, Semaphores, Deadlock Banker's algorithm, Paging, Virtual Memory, Belady's anomaly.",
      tags: ["Banker's Alg", "Paging Math", "Page Faults", "Semaphores"]
    },
    {
      name: "Computer Networks",
      icon: "🌐",
      desc: "OSI & TCP/IP stack, IPv4 CIDR subnetting, Sliding Window, TCP congestion control, Distance Vector, ARP.",
      tags: ["TCP Flow Control", "CIDR / Subnets", "Nyquist", "Routing"]
    },
    {
      name: "Computer Organization and Architecture",
      icon: "💻",
      desc: "Instruction pipelining hazards, cache mapping, speedup calculations, IEEE 754 floating point format, Booth's algorithm.",
      tags: ["Pipeline Hazards", "Cache Tag Bits", "IEEE 754", "Speedup"]
    },
    {
      name: "Theory of Computation",
      icon: "📐",
      desc: "Regular expressions, DFA state minimization, Context-Free Grammars, Pushdown Automata, Turing decidability, Halting problem.",
      tags: ["Pumping Lemma", "PDA & DCFL", "Undecidability", "Chomsky"]
    },
    {
      name: "Compiler Design",
      icon: "🔍",
      desc: "Lexical analysis, LL(1), SLR(1), LALR(1), CLR(1) parsing tables, Syntax-Directed Translation, Three-Address Code, Optimization.",
      tags: ["LR Parsing", "S-Attributed", "Graph Coloring", "Optimization"]
    },
    {
      name: "Engineering Mathematics",
      icon: "🔢",
      desc: "Linear Algebra, Eigenvalues, Rank, Determinants, Calculus, Limits, Probability distributions, Bayes' theorem, Graph theory.",
      tags: ["Eigenvalues", "Bayes Theorem", "Euler Formula", "Matrix Rank"]
    }
  ],
  "Mechanical Engineering": [
    {
      name: "Thermodynamics",
      icon: "🔥",
      desc: "First & second laws, Carnot cycle efficiency, entropy, availability, pure substances, Rankine, Brayton and Otto cycles.",
      tags: ["Carnot Efficiency", "Clausius Inequality", "Entropy", "Isentropic Work"]
    },
    {
      name: "Fluid Mechanics",
      icon: "💧",
      desc: "Hydrostatic forces, Bernoulli equation, Navier-Stokes, Darcy friction factor, boundary layer momentum thickness, turbulent flow.",
      tags: ["Reynolds Number", "Hagen-Poiseuille", "Boundary Layer", "Friction Factor"]
    },
    {
      name: "Strength of Materials",
      icon: "🏗️",
      desc: "Stress-strain relations, Mohr's circle, Euler column buckling, shear force & bending moments, beam deflection, torsion.",
      tags: ["Euler Buckling", "Mohr Circle", "Principal Stresses", "Cantilever Deflection"]
    },
    {
      name: "Manufacturing Engineering",
      icon: "⚙️",
      desc: "Taylor tool life equation, orthogonal cutting mechanics, shear plane angle, Chvorinov casting rule, rolling, welding.",
      tags: ["Taylor Tool Life", "Merchant Circle", "Chvorinov Rule", "Solidification"]
    },
    {
      name: "Theory of Machines",
      icon: "🔄",
      desc: "Grashof planar 4-bar linkages, degrees of freedom (Kutzbach), gear trains, balancing, free and damped vibrations.",
      tags: ["Grashof Law", "Natural Frequency", "DOF Mobility", "Gear Ratios"]
    },
    {
      name: "Heat Transfer",
      icon: "🌡️",
      desc: "Steady/transient conduction, Biot number, lumped capacitance, LMTD and NTU heat exchangers, radiation shape factors.",
      tags: ["LMTD Method", "Biot Number", "Fourier Law", "Stefan-Boltzmann"]
    }
  ],
  "Civil Engineering": [
    {
      name: "Structural Engineering",
      icon: "🏛️",
      desc: "Truss analysis, moment distribution method, plastic moment capacity, shape factors, slope deflection, RCC limit state design.",
      tags: ["Plastic Section", "Carry-Over Factor", "Static Indeterminacy", "Flexural Rigidity"]
    },
    {
      name: "Geotechnical Engineering",
      icon: "⛰️",
      desc: "Soil phase relationships, void ratio, Terzaghi effective stress, Mohr-Coulomb shear strength, consolidation, bearing capacity.",
      tags: ["Void Ratio & Porosity", "Effective Stress", "Terzaghi Bearing", "Consolidation"]
    },
    {
      name: "Fluid Mechanics & Hydraulics",
      icon: "🌊",
      desc: "Open channel flow, specific energy, critical flow depth, Froude number, hydraulic jump energy dissipation, Manning's equation.",
      tags: ["Froude Number", "Hydraulic Jump", "Specific Energy", "Manning Equation"]
    },
    {
      name: "Environmental Engineering",
      icon: "🌱",
      desc: "Water quality standards, 5-day BOD kinetics, sedimentation tank overflow rate, rapid sand filters, breakpoint chlorination.",
      tags: ["BOD5 Kinetics", "Surface Overflow Rate", "Chlorination", "Sedimentation"]
    },
    {
      name: "Transportation Engineering",
      icon: "🛣️",
      desc: "Highway geometric design, stopping sight distance (SSD), superelevation, traffic capacity, CBR pavement design.",
      tags: ["Sight Distance", "Superelevation", "CBR Test", "IRC Standards"]
    },
    {
      name: "Surveying",
      icon: "📐",
      desc: "Levelling, collimation two-peg test, theodolite traverses, contouring, Simpson's 1/3 rule area and earthwork calculations.",
      tags: ["Collimation Error", "Simpson Rule", "Total Station", "Traverse Balancing"]
    }
  ],
  "Electrical Engineering": [
    {
      name: "Circuit Theory",
      icon: "🔌",
      desc: "Thevenin & Norton equivalents, maximum power transfer theorem, series & parallel RLC resonance, transient step response.",
      tags: ["Max Power Transfer", "RLC Resonance", "Thevenin Theorem", "Quality Factor"]
    },
    {
      name: "Electrical Machines",
      icon: "⚡",
      desc: "Transformers, 3-phase synchronous alternators, synchronous speed, induction motor slip frequency, DC motor torque.",
      tags: ["Synchronous Speed", "Rotor Slip", "Transformer Losses", "Torque-Speed"]
    },
    {
      name: "Power Systems",
      icon: "🔋",
      desc: "Transmission line parameters, Ferranti effect, swing equation, symmetrical fault analysis, per-unit impedance calculations.",
      tags: ["Ferranti Effect", "Swing Equation", "Symmetrical Components", "Per-Unit System"]
    },
    {
      name: "Control Systems",
      icon: "🎯",
      desc: "Transfer functions, Routh-Hurwitz stability, steady-state error, second-order damping ratio, Bode phase & gain margin.",
      tags: ["Damping Ratio", "Routh Hurwitz", "Bode Phase Margin", "State Space"]
    },
    {
      name: "Power Electronics",
      icon: "💡",
      desc: "Buck, boost & buck-boost converters, thyristor SCR latching and holding current, PWM inverters, harmonics.",
      tags: ["Buck Converter", "Duty Cycle D", "SCR Latching", "Inverter PWM"]
    }
  ],
  "Electronics & Communication Engineering": [
    {
      name: "Analog Circuits",
      icon: "📻",
      desc: "Inverting/non-inverting op-amp voltage gain, virtual ground, CMRR, Barkhausen oscillation criterion, BJT active bias.",
      tags: ["Op-Amp Inverting", "CMRR Ratio", "Barkhausen Rule", "Virtual Ground"]
    },
    {
      name: "Digital Circuits",
      icon: "💻",
      desc: "Multiplexers, decoders, K-maps, setup and hold timing constraints, ripple carry adders, finite state machines.",
      tags: ["MUX Select Lines", "Setup & Hold Time", "Flip-Flops", "K-Map Logic"]
    },
    {
      name: "Communication Systems",
      icon: "📡",
      desc: "Shannon channel capacity theorem, AM/FM modulation index, Carson's rule, BPSK & QPSK constellation, bit error rate.",
      tags: ["Shannon Capacity", "Modulation Index", "BPSK Constellation", "Carson Bandwidth"]
    },
    {
      name: "Electromagnetics",
      icon: "🧲",
      desc: "Plane wave propagation, intrinsic wave impedance (377 ohms), Poynting vector power flux, transmission lines, SWR.",
      tags: ["Intrinsic Impedance", "Poynting Vector", "SWR & Reflection", "Waveguides"]
    }
  ],
  "Chemical Engineering": [
    {
      name: "Chemical Thermodynamics",
      icon: "🧪",
      desc: "Raoult's law vapor-liquid equilibrium, fugacity coefficient, Gibbs-Duhem equation, heat of reaction, chemical equilibria.",
      tags: ["Raoult Law", "VLE Bubble Point", "Gibbs-Duhem", "Fugacity"]
    },
    {
      name: "Fluid Mechanics",
      icon: "💧",
      desc: "Ergun equation for packed beds, Hagen-Poiseuille laminar pipe flow, centrifugal pump NPSH, boundary layer.",
      tags: ["Ergun Equation", "Packed Beds", "Hagen-Poiseuille", "NPSH Pumps"]
    },
    {
      name: "Heat Transfer",
      icon: "🔥",
      desc: "Critical radius of insulation, Fourier conduction, LMTD, Dittus-Boelter turbulent convection correlation, radiation.",
      tags: ["Critical Insulation", "LMTD Counterflow", "Dittus-Boelter", "Overall U"]
    },
    {
      name: "Chemical Reaction Engineering",
      icon: "⚗️",
      desc: "CSTR and PFR design performance equations, space time tau, Arrhenius activation energy, Damkohler number.",
      tags: ["CSTR Space Time", "PFR Design", "Arrhenius Equation", "Conversion X"]
    }
  ],
  "Instrumentation Engineering": [
    {
      name: "Sensors and Industrial Instrumentation",
      icon: "🎛️",
      desc: "Strain gauge gauge factor, LVDT displacement, RTD Callendar-Van Dusen equation, thermocouples, piezoelectric sensors.",
      tags: ["Gauge Factor", "LVDT Transducer", "RTD Sensitivity", "Piezoelectric"]
    },
    {
      name: "Measurements",
      icon: "⏱️",
      desc: "Maxwell & Hay AC bridges, dual-slope integrating ADC, Wheatstone bridge sensitivity, error propagation analysis.",
      tags: ["Maxwell Bridge", "Dual-Slope ADC", "Bridge Null", "Inductance Q"]
    }
  ],
  "Biotechnology": [
    {
      name: "Bioprocess Engineering",
      icon: "🧬",
      desc: "Monod microbial growth kinetics, volumetric oxygen mass transfer kLa, batch and chemostat fermenter equations.",
      tags: ["Monod Kinetics", "Doubling Time", "Chemostat Dilution", "kLa Transfer"]
    },
    {
      name: "Molecular Biology and Genetics",
      icon: "🔬",
      desc: "Prokaryotic/eukaryotic DNA replication, DNA primase, Okazaki fragments, PCR amplification cycles, recombinant vectors.",
      tags: ["DNA Primase", "PCR Amplification", "Okazaki Fragments", "Plasmids"]
    }
  ],
  "Engineering Sciences": [
    {
      name: "Fluid Mechanics (XE-B)",
      icon: "🌊",
      desc: "2D stream function, continuity equation, Navier-Stokes, boundary layer thickness, drag on submerged bodies.",
      tags: ["Stream Function", "Continuity 2D", "Navier-Stokes", "Drag Coefficient"]
    },
    {
      name: "Materials Science (XE-C)",
      icon: "💎",
      desc: "FCC and BCC crystal structures, atomic packing factor, Bragg's law of X-ray diffraction, Hall-Petch grain strengthening.",
      tags: ["Atomic Packing APF", "Bragg Law", "Miller Indices", "Hall-Petch"]
    }
  ],
  "Data Science & Artificial Intelligence": [
    {
      name: "Probability and Statistics",
      icon: "📊",
      desc: "Bayes' theorem posterior probability, Central Limit Theorem, Poisson & normal distributions, maximum likelihood estimation.",
      tags: ["Bayes Theorem", "CLT Normal", "Poisson Process", "Precision & Recall"]
    },
    {
      name: "Machine Learning",
      icon: "🤖",
      desc: "L1 Lasso vs L2 Ridge regularization, bias-variance trade-off, SVM maximum margin hyperplane, Decision Trees Gini impurity.",
      tags: ["L1 Regularization", "Bias-Variance", "SVM Hyperplane", "F1-Score"]
    },
    {
      name: "Artificial Intelligence",
      icon: "🧠",
      desc: "Heuristic search, A* admissibility and consistency, Minimax with Alpha-Beta pruning, Markov Decision Processes.",
      tags: ["A* Admissibility", "Alpha-Beta Pruning", "Minimax Search", "MDP Bellman"]
    }
  ]
};

function canonicalBranchName(branch) {
  const b = (branch || "").trim().toLowerCase();
  if (b.includes("mech") || b === "me") return "Mechanical Engineering";
  if (b.includes("civil") || b === "ce") return "Civil Engineering";
  if (b.includes("tele") || b.includes("ece") || b.includes("electronics & comm") || b.includes("e&tc") || b.includes("entc")) {
    return "Electronics & Communication Engineering";
  }
  if (b.includes("elec") || b === "ee" || b.includes("eee")) return "Electrical Engineering";
  if (b.includes("chem") || b === "ch") return "Chemical Engineering";
  if (b.includes("inst") || b === "in") return "Instrumentation Engineering";
  if (b.includes("bio") || b === "bt") return "Biotechnology";
  if (b.includes("sciences") || b === "xe") return "Engineering Sciences";
  if (b.includes("data") || b.includes("aiml") || b.includes("artificial") || b.includes("machine") || b === "da") {
    return "Data Science & Artificial Intelligence";
  }
  return "Computer Science Engineering";
}

let currentStudent = null;
let selectedBranch = "Computer Science Engineering";
let selectedSubject = "Data Structures";
let selectedDifficulty = "Medium";
let selectedCount = 10;
let timerMinutes = 10;

let quizQuestions = [];
let currentIndex = 0;
let score = 0;
let userAnswers = [];
let quizSessionId = "";
let timerInterval = null;
let secondsRemaining = 600;
let quizStartTime = 0;

document.addEventListener("DOMContentLoaded", () => {
  initAuthProtection(async (student) => {
    currentStudent = student;

    // Feature 4 & 7: Reusable trial/subscription access enforcement
    const allowed = enforceQuizAccess("GATE Exam Quiz");
    if (!allowed) return;

    // Check student branch and URL parameters
    const params = new URLSearchParams(window.location.search);
    const branchParam = params.get("branch");
    const subParam = params.get("subject");
    const diffParam = params.get("diff");

    if (branchParam) {
      selectedBranch = canonicalBranchName(branchParam);
    } else if (currentStudent?.branch) {
      selectedBranch = canonicalBranchName(currentStudent.branch);
    }

    const branchSelect = document.getElementById("gateBranchSelect");
    if (branchSelect) {
      branchSelect.value = selectedBranch;
      branchSelect.addEventListener("change", (e) => {
        selectedBranch = canonicalBranchName(e.target.value);
        renderBranchSubjects(selectedBranch);
      });
    }

    // Setup subject selection handler
    window.selectSubjectCard = (cardElement, subjectName) => {
      document.querySelectorAll(".gate-card").forEach((c) => {
        c.classList.remove("selected");
        const footerSpan = c.querySelector(".gate-card-footer span:first-child");
        if (footerSpan) footerSpan.textContent = "10 MCQs";
      });

      cardElement.classList.add("selected");
      const selectedFooter = cardElement.querySelector(".gate-card-footer span:first-child");
      if (selectedFooter) selectedFooter.textContent = "Selected ✓";
      selectedSubject = subjectName;
    };

    window.startSelectedSubject = () => {
      const branchSel = document.getElementById("gateBranchSelect");
      const diffSelect = document.getElementById("gateDiffSelect");
      const countSelect = document.getElementById("gateCountSelect");
      const timerSelect = document.getElementById("gateTimerSelect");

      if (branchSel) selectedBranch = canonicalBranchName(branchSel.value);
      if (diffSelect) selectedDifficulty = diffSelect.value;
      if (countSelect) selectedCount = parseInt(countSelect.value, 10) || 10;
      if (timerSelect) timerMinutes = parseInt(timerSelect.value, 10);

      launchGateQuiz(selectedSubject, selectedDifficulty, selectedCount, timerMinutes, selectedBranch);
    };

    // Render cards for selected branch
    renderBranchSubjects(selectedBranch, subParam);

    if (subParam) {
      selectedSubject = subParam;
      if (diffParam) selectedDifficulty = diffParam;
      launchGateQuiz(selectedSubject, selectedDifficulty, selectedCount, timerMinutes, selectedBranch);
    }
  });
});

function renderBranchSubjects(branch, targetSubject = "") {
  const canon = canonicalBranchName(branch);
  const subjects = GATE_BRANCH_SUBJECTS_CATALOG[canon] || GATE_BRANCH_SUBJECTS_CATALOG["Computer Science Engineering"];
  const grid = document.getElementById("gateSubjectsGrid");
  const heading = document.getElementById("gateHeading");

  if (heading) {
    const branchLabel = canon === "Computer Science Engineering" ? "CSE & IT" : canon;
    heading.textContent = `GATE Exam ${branchLabel} Quizzes`;
  }

  // Ensure selectedSubject is valid for this branch
  const match = subjects.find((s) => s.name.toLowerCase() === targetSubject.toLowerCase()) ||
                subjects.find((s) => s.name.toLowerCase() === selectedSubject.toLowerCase()) ||
                subjects[0];
  selectedSubject = match ? match.name : subjects[0].name;

  if (grid) {
    grid.innerHTML = subjects.map((sub) => {
      const isSel = sub.name === selectedSubject;
      return `
        <div class="gate-card ${isSel ? "selected" : ""}" data-subject="${escapeHtml(sub.name)}" onclick="selectSubjectCard(this, '${escapeHtml(sub.name)}')">
          <div>
            <div class="gate-card-icon">${sub.icon}</div>
            <h3>${escapeHtml(sub.name)}</h3>
            <p>${escapeHtml(sub.desc)}</p>
            <div class="gate-subtopics">
              ${sub.tags.map((t) => `<span class="gate-tag">${escapeHtml(t)}</span>`).join("")}
            </div>
          </div>
          <div class="gate-card-footer">
            <span>${isSel ? "Selected ✓" : "10 MCQs"}</span>
            <span>Launch →</span>
          </div>
        </div>
      `;
    }).join("");
  }
}

async function launchGateQuiz(subject, difficulty, count, durationMins, branch = selectedBranch) {
  selectedBranch = canonicalBranchName(branch);
  selectedSubject = subject;
  selectedDifficulty = difficulty;
  // Feature 2: Unique quizSessionId for every attempt
  quizSessionId = `sess_gate_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  // UI state switch
  const selectionView = document.getElementById("gateSelectionView");
  const gateActiveSession = document.getElementById("gateActiveSession");
  const loadingView = document.getElementById("gateLoadingView");
  const quizCard = document.getElementById("gateQuizCard");
  const resultView = document.getElementById("gateResultView");
  const gateNavLinks = document.getElementById("gateNavLinks");
  const gateBackLink = document.getElementById("gateBackLink");
  const exitQuizBtn = document.getElementById("exitQuizBtn");
  const exitConfirmModal = document.getElementById("exitConfirmModal");
  const cancelExitBtn = document.getElementById("cancelExitBtn");
  const confirmExitBtn = document.getElementById("confirmExitBtn");

  if (selectionView) selectionView.style.display = "none";
  if (resultView) resultView.style.display = "none";
  if (gateNavLinks) gateNavLinks.style.display = "none";
  if (gateBackLink) gateBackLink.style.display = "none";
  if (exitQuizBtn) exitQuizBtn.style.display = "inline-block";
  if (gateActiveSession) gateActiveSession.style.display = "block";
  if (quizCard) quizCard.style.display = "none";
  if (loadingView) loadingView.style.display = "block";

  // Wire exit modal buttons
  if (exitQuizBtn) {
    exitQuizBtn.onclick = () => {
      if (timerInterval) clearInterval(timerInterval);
      if (exitConfirmModal) exitConfirmModal.style.display = "flex";
    };
  }
  if (cancelExitBtn) {
    cancelExitBtn.onclick = () => {
      if (exitConfirmModal) exitConfirmModal.style.display = "none";
      if (secondsRemaining > 0 && !timerInterval) {
        resumeTimer();
      }
    };
  }
  if (confirmExitBtn) {
    confirmExitBtn.onclick = () => {
      if (timerInterval) clearInterval(timerInterval);
      if (exitConfirmModal) exitConfirmModal.style.display = "none";
      window.location.href = "gate.html";
    };
  }

  const loadingTitle = document.getElementById("loadingTitle");
  const loadingSubtitle = document.getElementById("loadingSubtitle");
  if (loadingTitle) loadingTitle.textContent = `Preparing ${subject} GATE Questions...`;
  if (loadingSubtitle) loadingSubtitle.textContent = "Retrieving solved question history to guarantee brand new, unique MCQs.";

  // Safely shuffle options while keeping correctIndex 100% synchronized with the correct answer
  function shuffleQuestionOptions(q) {
    if (!q || !Array.isArray(q.options) || q.options.length !== 4) return q;
    const originalOptions = [...q.options];
    const origIndex = typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex <= 3 ? q.correctIndex : 0;
    const correctText = originalOptions[origIndex];

    const hasPositional = originalOptions.some((opt) =>
      /all of the above|none of the above|both [a-d] and [a-d]/i.test(opt)
    );

    let newOptions;
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

    const newCorrectIndex = newOptions.indexOf(correctText);
    return {
      ...q,
      options: newOptions,
      correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : origIndex
    };
  }

  try {
    // Feature 2: Query user's solved question history to prevent repetition across sessions and days
    const studentBranch = selectedBranch;
    const previousSolved = await getQuestionHistoryTexts(currentStudent?.uid, subject, difficulty, studentBranch, "gate");

    const targetCount = count;
    let collectedGate = [];
    let fetchAttempts = 0;
    const maxFetchAttempts = 6;

    while (collectedGate.length < targetCount && fetchAttempts < maxFetchAttempts) {
      fetchAttempts++;
      const needed = targetCount - collectedGate.length;
      const currentExclusions = [
        ...previousSolved,
        ...collectedGate.map((c) => c.question)
      ];

      try {
        const res = await fetchGateQuestions(subject, difficulty, needed, currentExclusions, studentBranch);
        const rawQuestions = Array.isArray(res?.questions) ? res.questions : [];

        for (const q of rawQuestions) {
          if (!q || !q.question || !Array.isArray(q.options) || q.options.length !== 4) continue;
          const isHistoryDup = previousSolved.some((prev) => areQuestionsDuplicate(prev, q.question));
          if (isHistoryDup) continue;
          const isBatchDup = collectedGate.some((cg) => areQuestionsDuplicate(cg.question, q.question));
          if (isBatchDup) continue;

          collectedGate.push(shuffleQuestionOptions(q));
          if (collectedGate.length >= targetCount) break;
        }
      } catch (roundErr) {
        console.warn(`GATE fetch attempt ${fetchAttempts} notice:`, roundErr);
        break;
      }
    }

    // Safety Net: If strict history exclusions filtered out candidate questions
    // or user has already attempted questions previously, backfill with valid branch
    // questions ensuring ZERO duplicates inside the current quiz session.
    if (collectedGate.length < targetCount) {
      try {
        const fallbackRes = await fetchGateQuestions(subject, difficulty, targetCount, [], studentBranch);
        const fallbackQuestions = Array.isArray(fallbackRes?.questions) ? fallbackRes.questions : [];
        for (const fq of fallbackQuestions) {
          if (!fq || !fq.question || !Array.isArray(fq.options) || fq.options.length !== 4) continue;
          const isBatchDup = collectedGate.some((cg) => areQuestionsDuplicate(cg.question, fq.question));
          if (isBatchDup) continue;

          collectedGate.push(shuffleQuestionOptions(fq));
          if (collectedGate.length >= targetCount) break;
        }
      } catch (fbErr) {
        console.warn("GATE safety fallback notice:", fbErr);
      }
    }

    quizQuestions = collectedGate;

    if (quizQuestions.length === 0) {
      throw new Error("Unable to load fresh GATE questions. Please retry.");
    }

    // Persist to question history with unique quizSessionId immediately to record exposure
    saveQuestionHistory({
      userId: currentStudent?.uid || "guest",
      quizSessionId,
      branch: studentBranch,
      subject,
      difficulty,
      quizType: "gate",
      questions: quizQuestions,
      createdAt: new Date().toISOString()
    });

    // Reset state for new quiz
    currentIndex = 0;
    score = 0;
    userAnswers = new Array(quizQuestions.length).fill(null);
    quizStartTime = Date.now();

    if (loadingView) loadingView.style.display = "none";
    if (quizCard) quizCard.style.display = "block";

    // Setup badges
    const subBadge = document.getElementById("quizSubjectBadge");
    const diffBadge = document.getElementById("quizDiffBadge");
    if (subBadge) subBadge.textContent = subject;
    if (diffBadge) diffBadge.textContent = difficulty;

    // Setup timer
    initTimer(durationMins);

    // Render first question
    renderCurrentQuestion();
  } catch (err) {
    console.error("Failed to launch GATE Quiz:", err);
    if (gateActiveSession) gateActiveSession.style.display = "none";
    if (loadingView) loadingView.style.display = "none";
    if (selectionView) selectionView.style.display = "block";
    if (gateNavLinks) gateNavLinks.style.display = "flex";
    if (gateBackLink) gateBackLink.style.display = "inline-block";
    if (exitQuizBtn) exitQuizBtn.style.display = "none";
    const statusBox = document.getElementById("selectionStatusMsg");
    if (statusBox) {
      statusBox.style.display = "block";
      statusBox.textContent = "Could not load GATE questions: " + (err.message || "Please check connection and retry.");
    }
  }
}

function resumeTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    secondsRemaining--;
    updateTimerDisplay();

    if (secondsRemaining <= 0) {
      clearInterval(timerInterval);
      const timerDisplay = document.getElementById("timerDisplay");
      if (timerDisplay) timerDisplay.textContent = "00:00";
      finishQuiz();
    }
  }, 1000);
}

function initTimer(durationMins) {
  if (timerInterval) clearInterval(timerInterval);

  const timerDisplay = document.getElementById("timerDisplay");
  if (durationMins <= 0) {
    if (timerDisplay) timerDisplay.textContent = "Untimed";
    return;
  }

  secondsRemaining = durationMins * 60;
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    secondsRemaining--;
    updateTimerDisplay();

    if (secondsRemaining <= 0) {
      clearInterval(timerInterval);
      const timerDisplay = document.getElementById("timerDisplay");
      if (timerDisplay) timerDisplay.textContent = "00:00";
      finishQuiz();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerDisplay = document.getElementById("timerDisplay");
  if (!timerDisplay) return;

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  timerDisplay.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  if (secondsRemaining < 120) {
    timerDisplay.style.color = "var(--red)";
  } else {
    timerDisplay.style.color = "inherit";
  }
}

function renderCurrentQuestion() {
  const q = quizQuestions[currentIndex];
  if (!q) return;

  const questionCounter = document.getElementById("questionCounter");
  const progressPercent = document.getElementById("progressPercent");
  const progressBarFill = document.getElementById("progressBarFill");
  const topicTag = document.getElementById("topicTag");
  const questionText = document.getElementById("questionText");
  const optionsList = document.getElementById("optionsList");
  const explanationBox = document.getElementById("explanationBox");
  const explanationText = document.getElementById("explanationText");
  const feedbackNotice = document.getElementById("feedbackNotice");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  const total = quizQuestions.length;
  const pct = Math.round(((currentIndex + 1) / total) * 100);

  if (questionCounter) questionCounter.textContent = `Question ${currentIndex + 1} of ${total}`;
  if (progressPercent) progressPercent.textContent = `${pct}%`;
  if (progressBarFill) progressBarFill.style.width = `${pct}%`;

  if (topicTag) topicTag.textContent = q.topic ? `${q.topic} • ${selectedBranch}` : `${selectedSubject} (${selectedBranch})`;
  if (questionText) questionText.textContent = q.question;

  if (prevBtn) {
    prevBtn.disabled = (currentIndex === 0);
    prevBtn.onclick = handlePrevQuestion;
  }

  if (nextBtn) {
    nextBtn.disabled = false;
    nextBtn.textContent = currentIndex === total - 1 ? "Submit GATE Quiz ✓" : "Next Question →";
    nextBtn.onclick = handleNextQuestion;
  }

  const exitBtn = document.getElementById("exitQuizBtn");
  if (exitBtn) {
    exitBtn.onclick = () => {
      if (timerInterval) clearInterval(timerInterval);
      const exitConfirmModal = document.getElementById("exitConfirmModal");
      if (exitConfirmModal) exitConfirmModal.style.display = "flex";
    };
  }

  const existingAns = userAnswers[currentIndex];
  const isAlreadyAnswered = !!(existingAns && existingAns.answered && existingAns.selectedOption !== null && existingAns.selectedOption !== undefined);

  if (isAlreadyAnswered) {
    const isCorrect = existingAns.selectedOption === q.correctIndex;
    if (feedbackNotice) {
      feedbackNotice.style.color = isCorrect ? "var(--green)" : "var(--red)";
      feedbackNotice.textContent = isCorrect ? "✓ Correct! Excellent concept application." : "✗ Incorrect. Review the derivation below.";
    }
    if (explanationBox && explanationText) {
      explanationText.textContent = q.explanation || "GATE concept verified.";
      explanationBox.style.display = "block";
    }
  } else {
    if (explanationBox) explanationBox.style.display = "none";
    if (explanationText) explanationText.textContent = "";
    if (feedbackNotice) feedbackNotice.textContent = "";
  }

  // Render 4 Options matching other QuizGenius pages (option-item)
  if (optionsList) {
    optionsList.innerHTML = "";
    const letters = ["A", "B", "C", "D"];

    optionsList.innerHTML = q.options.map((optText, optIdx) => {
      let itemClass = "option-item";
      if (isAlreadyAnswered) {
        itemClass += " disabled";
        if (optIdx === existingAns.selectedOption) {
          itemClass += (optIdx === q.correctIndex ? " correct" : " wrong");
        } else if (optIdx === q.correctIndex) {
          itemClass += " correct";
        }
      }
      return `
        <div class="${itemClass}" data-opt-idx="${optIdx}">
          <div class="option-left">
            <span class="option-letter">${letters[optIdx]}</span>
            <span class="option-label">${escapeHtml(optText)}</span>
          </div>
          <span class="opt-status-icon"></span>
        </div>
      `;
    }).join("");

    const optElements = optionsList.querySelectorAll(".option-item");
    optElements.forEach((el) => {
      el.addEventListener("click", () => handleOptionClick(el, optElements, q));
    });
  }
}

function handleOptionClick(selectedEl, allOptions, q) {
  if (selectedEl.classList.contains("disabled")) return;
  allOptions.forEach((btn) => btn.classList.add("disabled"));

  const explanationBox = document.getElementById("explanationBox");
  const explanationText = document.getElementById("explanationText");
  const feedbackNotice = document.getElementById("feedbackNotice");

  const selectedIdx = parseInt(selectedEl.getAttribute("data-opt-idx") || "0", 10);
  const isCorrect = selectedIdx === q.correctIndex;

  if (isCorrect) {
    selectedEl.classList.add("correct");
    if (feedbackNotice) {
      feedbackNotice.style.color = "var(--green)";
      feedbackNotice.textContent = "✓ Correct! Excellent concept application.";
    }
  } else {
    selectedEl.classList.add("wrong");
    allOptions.forEach((el) => {
      if (parseInt(el.getAttribute("data-opt-idx") || "-1", 10) === q.correctIndex) {
        el.classList.add("correct");
      }
    });
    if (feedbackNotice) {
      feedbackNotice.style.color = "var(--red)";
      feedbackNotice.textContent = "✗ Incorrect. Review the derivation below.";
    }
  }

  // Record user answer
  userAnswers[currentIndex] = {
    selectedOption: selectedIdx,
    answered: true,
    selectedText: q.options[selectedIdx],
    isCorrect
  };

  // Display explanation
  if (explanationBox && explanationText) {
    explanationText.textContent = q.explanation || "GATE concept verified.";
    explanationBox.style.display = "block";
  }
}

function handlePrevQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    renderCurrentQuestion();
  }
}

function handleNextQuestion() {
  // If student clicks Next without selecting an answer, record as unanswered
  if (!userAnswers[currentIndex]) {
    userAnswers[currentIndex] = {
      selectedOption: null,
      answered: false,
      selectedText: "Unanswered",
      isCorrect: false
    };
  }

  if (currentIndex < quizQuestions.length - 1) {
    currentIndex++;
    renderCurrentQuestion();
  } else {
    finishQuiz();
  }
}

async function finishQuiz() {
  if (timerInterval) clearInterval(timerInterval);

  const gateActiveSession = document.getElementById("gateActiveSession");
  const quizCard = document.getElementById("gateQuizCard");
  const resultView = document.getElementById("gateResultView");
  if (gateActiveSession) gateActiveSession.style.display = "none";
  if (quizCard) quizCard.style.display = "none";
  if (resultView) {
    resultView.style.display = "block";
    resultView.innerHTML = `
      <div class="quiz-card loading-screen">
        <div class="spinner"></div>
        <h3>Analyzing GATE Test Performance...</h3>
        <p>Evaluating accuracy, subject mastery, and generating recommendations.</p>
      </div>
    `;
  }

  const timeTakenSeconds = Math.round((Date.now() - quizStartTime) / 1000);
  let correctAnswers = 0;
  let wrongAnswers = 0;
  let unanswered = 0;

  const finalRecordedAnswers = quizQuestions.map((q, idx) => {
    const ans = userAnswers[idx];
    const isAns = !!(ans && ans.answered && ans.selectedOption !== null && ans.selectedOption !== undefined);
    const isCorr = isAns && ans.selectedOption === q.correctIndex;

    if (isCorr) {
      correctAnswers++;
    } else if (isAns) {
      wrongAnswers++;
    } else {
      unanswered++;
    }

    return {
      question: q.question,
      topic: q.topic || selectedSubject,
      selectedOption: isAns ? ans.selectedOption : null,
      selectedText: isAns ? q.options[ans.selectedOption] : "Unanswered",
      correctOption: q.correctIndex,
      correctText: q.options[q.correctIndex],
      isCorrect: isCorr,
      isUnanswered: !isAns,
      explanation: q.explanation
    };
  });

  const total = quizQuestions.length || 1;
  const percentage = Math.round((correctAnswers / total) * 100);
  const mins = String(Math.floor(timeTakenSeconds / 60)).padStart(2, "0");
  const secs = String(timeTakenSeconds % 60).padStart(2, "0");
  const timeFormatted = `${mins}:${secs}`;

  // Store GATE quiz results in Firebase / Firestore (Feature 1 requirement)
  const resultPayload = {
    type: "gate",
    branch: selectedBranch,
    subject: selectedSubject,
    difficulty: selectedDifficulty,
    totalQuestions: total,
    correctAnswers,
    wrongAnswers,
    unanswered,
    score: correctAnswers,
    percentage,
    timeTaken: timeFormatted,
    timeSpentSeconds: timeTakenSeconds,
    timeTakenSeconds,
    quizSessionId,
    answers: finalRecordedAnswers,
    studentName: currentStudent?.name || "Student"
  };

  try {
    await saveTestResult(resultPayload);
  } catch (err) {
    console.warn("Error persisting GATE result:", err);
  }

  // Redirect to result.html like other QuizGenius quizzes for complete consistency
  sessionStorage.setItem("quizgenius_latest_result", JSON.stringify(resultPayload));
  window.location.href = "result.html";
}

function renderResults(result, analysis) {
  const resultView = document.getElementById("gateResultView");
  if (!resultView) return;

  const mins = Math.floor(result.timeSpentSeconds / 60);
  const secs = result.timeSpentSeconds % 60;
  const timeStr = `${mins}m ${secs}s`;

  // Estimate GATE percentile
  let percentile = "90th+ Percentile";
  let rankStatus = "Top Tier GATE Aspirant";
  if (result.percentage < 50) {
    percentile = "50th-65th Percentile";
    rankStatus = "Needs Targeted Revision";
  } else if (result.percentage < 75) {
    percentile = "75th-88th Percentile";
    rankStatus = "Competitive Score";
  }

  resultView.innerHTML = `
    <div class="result-hero-card">
      <div style="text-align: center; margin-bottom: 24px;">
        <span class="eyebrow" style="background: var(--surface-2); color: var(--purple-deep); padding: 4px 12px; border-radius: 999px; font-size: 13px; font-weight: 700;">
          🎓 GATE ${escapeHtml(result.branch || selectedBranch)} — ${escapeHtml(result.subject || selectedSubject)} Report
        </span>
        <h1 style="font-size: 32px; color: var(--ink); margin: 12px 0 6px;">Test Performance Scorecard</h1>
        <p style="color: var(--ink-soft); font-size: 15px;">Session ID: <code>${result.quizSessionId}</code></p>
      </div>

      <!-- Stats Grid -->
      <div class="result-stats-row">
        <div class="r-stat-box">
          <div class="r-stat-val" style="color: var(--purple-deep);">${result.percentage}%</div>
          <div class="r-stat-lbl">Accuracy Rate</div>
        </div>
        <div class="r-stat-box">
          <div class="r-stat-val">${result.score} / ${result.totalQuestions}</div>
          <div class="r-stat-lbl">Correct Answers</div>
        </div>
        <div class="r-stat-box">
          <div class="r-stat-val">${timeStr}</div>
          <div class="r-stat-lbl">Time Spent</div>
        </div>
        <div class="r-stat-box">
          <div class="r-stat-val" style="font-size: 20px; color: var(--teal);">${percentile}</div>
          <div class="r-stat-lbl">${rankStatus}</div>
        </div>
      </div>

      <!-- AI Recommendations Box -->
      <div class="ai-analysis-card" style="background: #faf8ff; border: 1px solid #e0d7f9; border-radius: var(--radius-md); padding: 24px; margin: 24px 0;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
          <span style="font-size: 24px;">🧠</span>
          <h3 style="font-size: 18px; color: var(--purple-deep);">AI Diagnostic Insights</h3>
        </div>
        <p style="font-size: 14.5px; line-height: 1.6; color: var(--ink); margin-bottom: 16px;">
          ${escapeHtml(analysis?.summary || "")}
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
          <div style="background: var(--white); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--line);">
            <strong style="color: var(--teal); font-size: 13.5px; display: block; margin-bottom: 6px;">✓ Strengths</strong>
            <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: var(--ink-soft);">
              ${(analysis?.strongAreas || ["Core Principles"]).map((s) => `<li>${escapeHtml(s)}</li>`).join("")}
            </ul>
          </div>
          <div style="background: var(--white); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--line);">
            <strong style="color: var(--rose); font-size: 13.5px; display: block; margin-bottom: 6px;">⚠ Priority Focus Areas</strong>
            <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: var(--ink-soft);">
              ${(analysis?.needsPractice || ["Timed Calculations"]).map((w) => `<li>${escapeHtml(w)}</li>`).join("")}
            </ul>
          </div>
        </div>

        <div style="background: var(--white); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--line); font-size: 13.5px; line-height: 1.5;">
          <strong style="color: var(--purple-deep);">Actionable Advice:</strong>
          <span style="color: var(--ink-soft);">${escapeHtml(analysis?.recommendation || "")}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-top: 28px;">
        <button onclick="window.location.reload()" class="btn-gate-start">
          ↻ Practice Another GATE Subject
        </button>
        <a href="dashboard.html" class="btn-gate-start" style="background: var(--surface-2); color: var(--purple-deep); box-shadow: none;">
          ← Back to Dashboard
        </a>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
