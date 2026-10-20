import { initAuthProtection } from "./auth.js";
import { fetchBranchRecommendations, canonicalClientBranch, CLIENT_BRANCH_SUBJECTS } from "./ai.js";

document.addEventListener("DOMContentLoaded", () => {
  initAuthProtection(async (student) => {
    const branchFilter = document.getElementById("branchFilter");
    const subjectSearch = document.getElementById("subjectSearch");
    const branchAiGuidance = document.getElementById("branchAiGuidance");
    const subjectGrid = document.getElementById("subjectGrid");

    let rawBranch = student?.branch || "Computer Science Engineering";
    let currentBranch = canonicalClientBranch(rawBranch);
    let activeItems = [];

    if (branchFilter) {
      branchFilter.value = currentBranch;
    }

    // Descriptions lookup for engineering subjects
    function getSubjectDescription(name, branch) {
      const n = name.toLowerCase();
      if (n === "c") return "Pointers, memory management, low-level data types, and system calls.";
      if (n === "c++") return "Object-oriented design, STL templates, memory references, and RAII.";
      if (n === "java") return "JVM architecture, OOP inheritance, concurrency, and enterprise design.";
      if (n === "python") return `Syntax, data structures, libraries, and applications in ${branch}.`;
      if (n === "sql") return "Relational queries, joins, window functions, indexing, and normalization.";
      if (n === "data structures") return "Arrays, linked lists, trees, graphs, heaps, and hash tables.";
      if (n === "algorithms") return "Divide & conquer, greedy methods, dynamic programming, and complexity.";
      if (n === "dbms") return "Relational schema design, transactions, ACID properties, and indexing.";
      if (n === "operating systems") return "Process scheduling, thread sync, virtual memory, and file systems.";
      if (n === "computer networks") return "OSI layers, TCP/IP sockets, routing protocols, and network security.";
      if (n === "web development") return "DOM architecture, HTTP protocols, REST APIs, and modern frontend/backend.";
      if (n === "software engineering") return "Agile life-cycle, SDLC models, design patterns, testing, and CI/CD.";
      if (n === "cloud computing") return "Virtualization, microservices, AWS/GCP paradigms, and serverless.";
      if (n === "database management") return "Enterprise RDBMS engines, query execution planners, and transaction logs.";
      if (n === "artificial intelligence") return "Search algorithms, heuristic evaluation, logic systems, and agent design.";
      if (n === "machine learning") return "Supervised, unsupervised models, gradient descent, bias-variance trade-off.";
      if (n === "deep learning") return "Neural network backpropagation, CNNs, RNNs, transformers, and loss functions.";
      if (n === "statistics") return "Probability distributions, hypothesis testing, ANOVA, and regression modeling.";
      if (n === "mathematics for ai/ml") return "Linear algebra, matrix decomposition, multivariable calculus, and optimization.";
      if (n === "tensorflow") return "Tensors, computational graphs, GradientTape, Keras layers, and training loops.";
      if (n === "numpy") return "N-dimensional array slicing, vectorization, linear algebra, and broadcasting.";
      if (n === "pandas") return "DataFrames, Series, group-by aggregations, missing values, and data wrangling.";
      if (n === "data analysis") return "Exploratory data analysis (EDA), pattern discovery, and quantitative evaluation.";
      if (n === "data visualization") return "Chart encoding, visual analytics principles, distribution plots, and dashboards.";
      if (n === "embedded c") return "Hardware register manipulation, volatile variables, interrupts, and bare-metal coding.";
      if (n === "matlab") return `Matrix computations, numerical simulation, and engineering analysis for ${branch}.`;
      if (n === "verilog") return "RTL modeling, sequential/combinational logic, testbenches, and synthesis.";
      if (n === "digital electronics") return "Boolean algebra, logic gates, combinational circuits, flip-flops, and K-maps.";
      if (n === "analog electronics") return "BJT/MOSFET amplifiers, op-amps, frequency response, and feedback loops.";
      if (n === "microcontrollers") return "Timer/counter peripherals, ADC interfacing, serial protocols (SPI/I2C/UART).";
      if (n === "embedded systems") return "Real-time task scheduling, watchdog timers, hardware abstraction, and IoT nodes.";
      if (n === "communication systems") return "Analog/digital modulation, Nyquist sampling, SNR, multiplexing, and RF channels.";
      if (n === "simulink") return "Dynamic model block diagrams, solver configurations, and control simulation.";
      if (n === "plc") return "Ladder logic rungs, contacts, timers, coils, and industrial automation standards.";
      if (n === "circuit theory") return "Kirchhoff's laws, Thevenin/Norton theorems, resonance, and AC network analysis.";
      if (n === "electrical machines") return "Transformers, DC motors, induction motors, and synchronous alternators.";
      if (n === "power systems") return "Transmission line parameters, load flow, fault analysis, and grid stability.";
      if (n === "control systems") return "Transfer functions, block diagram reduction, root locus, Bode, and PID control.";
      if (n === "power electronics") return "Thyristors, buck/boost converters, inverters, and PWM switching drives.";
      if (n === "autocad") return `Engineering drafting, geometric tolerancing, layers, and 2D/3D design in ${branch}.`;
      if (n === "solidworks") return "Parametric 3D solid modeling, mates, assemblies, drawings, and FEA simulation.";
      if (n === "engineering mechanics") return "Statics, free-body diagrams, centroids, friction, and rigid body dynamics.";
      if (n === "thermodynamics") return "First & second laws, thermodynamic cycles (Carnot, Rankine, Otto), and entropy.";
      if (n === "strength of materials") return "Stress-strain relations, bending moments, shear forces, torsion, and deflection.";
      if (n === "manufacturing processes") return "Casting, metal forming, machining mechanics, welding, and metallurgy.";
      if (n === "fluid mechanics") return "Hydrostatic pressure, Bernoulli equation, laminar/turbulent flow, and boundary layers.";
      if (n === "staad.pro") return "Structural framing analysis, member properties, design codes, and load combinations.";
      if (n === "surveying") return "Levelling, theodolite traverse, total station measurements, and contouring.";
      if (n === "structural engineering") return "Limit state RCC design, structural steel connections, trusses, and load paths.";
      if (n === "geotechnical engineering") return "Soil classification, Terzaghi bearing capacity, shear strength, and settlement.";
      if (n === "construction engineering") return "Project scheduling (CPM/PERT), equipment selection, estimation, and concrete mix.";
      if (n === "environmental engineering") return "Water quality treatment, wastewater processes, air pollution, and solid waste.";
      if (n === "transportation engineering") return "Geometric highway design, traffic flow theory, pavement materials, and signals.";
      if (n === "aspen plus") return "Chemical process flowsheet modeling, distillation columns, reactors, and thermodynamics.";
      if (n === "chemical thermodynamics") return "Phase equilibria (VLE), fugacity, Raoult's law, and chemical reaction equilibria.";
      if (n === "heat transfer") return "Conduction (Fourier's law), convection, radiation, and heat exchanger design.";
      if (n === "mass transfer") return "Fick's diffusion laws, distillation, gas absorption, extraction, and drying.";
      if (n === "chemical reaction engineering") return "Reactor kinetics, batch, CSTR, PFR design, conversion, and catalyst kinetics.";
      if (n === "process control") return "Feedback loops, transfer functions, P/PI/PID tuning, and plant stability.";
      return `Engineering problem sets and multiple-choice questions in ${name}.`;
    }

    // Load branch subjects
    async function loadBranchData(branch) {
      currentBranch = canonicalClientBranch(branch);
      if (branchFilter && branchFilter.value !== currentBranch) {
        branchFilter.value = currentBranch;
      }

      // Fast initial render from predefined branch configuration
      const clientConfig = CLIENT_BRANCH_SUBJECTS[currentBranch] || CLIENT_BRANCH_SUBJECTS["Computer Science Engineering"];
      const languages = (clientConfig.recommendedLanguages || []).map((l) => ({
        name: l,
        type: "language",
        desc: getSubjectDescription(l, currentBranch)
      }));
      const coreSubjects = (clientConfig.recommendedSubjects || []).map((s) => ({
        name: s,
        type: "subject",
        desc: getSubjectDescription(s, currentBranch)
      }));

      activeItems = [...languages, ...coreSubjects];
      renderSubjects(activeItems);

      if (branchAiGuidance) {
        branchAiGuidance.textContent = clientConfig.learningPath;
      }

      // Query AI backend for personalized learning path updates
      try {
        const recs = await fetchBranchRecommendations(currentBranch);
        if (branchAiGuidance && recs?.learningPath) {
          branchAiGuidance.textContent = recs.learningPath;
        }
      } catch (err) {
        console.warn("Guidance refinement notice:", err);
      }
    }

    // Render cards
    function renderSubjects(items) {
      if (!subjectGrid) return;
      const query = subjectSearch?.value.toLowerCase().trim() || "";
      const filtered = items.filter((it) => it.name.toLowerCase().includes(query));

      if (filtered.length === 0) {
        subjectGrid.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--ink-soft); font-size: 16px;">
            No subjects or languages found matching "${query}".
          </div>
        `;
        return;
      }

      subjectGrid.innerHTML = filtered.map((item, idx) => `
        <div class="subject-card">
          <div>
            <div class="card-top">
              <h3 class="subject-title">${item.name}</h3>
              <span class="badge-tag">${item.type === "language" ? "Programming & Tools" : "Core Subject"}</span>
            </div>
            <p class="subject-desc">${item.desc}</p>
          </div>

          <div>
            <div class="quiz-config">
              <div class="config-row">
                <span class="label">Questions:</span>
                <strong>10 MCQs</strong>
              </div>
              <div class="config-row">
                <span class="label">Difficulty:</span>
                <select id="diff_${idx}" class="difficulty-select">
                  <option value="Easy">Easy</option>
                  <option value="Medium" selected>Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <button type="button" class="btn-start-quiz" onclick="startQuiz('${encodeURIComponent(item.name)}', 'diff_${idx}')">
              Start Quiz →
            </button>
          </div>
        </div>
      `).join("");
    }

    // Global helper for card clicks - passes selected branch & subject
    window.startQuiz = (encodedName, selectId) => {
      const name = decodeURIComponent(encodedName);
      const sel = document.getElementById(selectId);
      const diff = sel ? sel.value : "Medium";
      window.location.href = `quiz.html?subject=${encodeURIComponent(name)}&diff=${encodeURIComponent(diff)}&branch=${encodeURIComponent(currentBranch)}&count=10`;
    };

    // Event listeners
    branchFilter?.addEventListener("change", (e) => {
      loadBranchData(e.target.value);
    });

    subjectSearch?.addEventListener("input", () => {
      renderSubjects(activeItems);
    });

    // Initial load
    loadBranchData(currentBranch);
  });
});
