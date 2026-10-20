const fs = require("fs");
const path = require("path");

const content = `import { areQuestionsDuplicate, canonicalizeText } from "./aptitude-question-bank";

export interface GateQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  subject: string;
  branch?: string;
}

export function canonicalGateBranch(branch?: string): string {
  const b = (branch || "").toLowerCase().trim();
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

export const GATE_SUBJECTS = [
  "Data Structures",
  "Algorithms",
  "DBMS",
  "Operating Systems",
  "Computer Networks",
  "Computer Organization and Architecture",
  "Theory of Computation",
  "Compiler Design",
  "Engineering Mathematics"
] as const;

export type GateSubjectName = typeof GATE_SUBJECTS[number];

// ============================================================================
// 1. CURATED GATE CSE QUESTIONS BANK
// ============================================================================

export const GATE_QUESTIONS_BANK: Record<string, GateQuestion[]> = {
  "Data Structures": [
    {
      id: "gate_ds_1",
      question: "What is the worst-case time complexity of searching for an element in a Red-Black Tree containing n keys?",
      options: ["O(log n)", "O(n)", "O(n log n)", "O(1)"],
      correctIndex: 0,
      explanation: "A Red-Black Tree maintains a height of at most 2*log2(n+1). Hence, search, insertion, and deletion all take O(log n) worst-case time.",
      topic: "Balanced Search Trees",
      difficulty: "Medium",
      subject: "Data Structures",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_ds_2",
      question: "Which data structure is primarily used to implement Breadth-First Search (BFS) on a graph?",
      options: ["Queue", "Stack", "Priority Queue", "Binary Search Tree"],
      correctIndex: 0,
      explanation: "BFS explores vertices in order of increasing distance from the source vertex, which strictly requires a First-In-First-Out (FIFO) Queue.",
      topic: "Graph Traversal",
      difficulty: "Easy",
      subject: "Data Structures",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_ds_3",
      question: "In a min-heap with n elements, what is the time complexity to find the maximum element?",
      options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
      correctIndex: 0,
      explanation: "In a min-heap, the minimum is at root O(1), but the maximum can be any of the leaf nodes (n/2 leaves), requiring O(n) scan.",
      topic: "Heaps",
      difficulty: "Medium",
      subject: "Data Structures",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_ds_4",
      question: "How many distinct Binary Search Trees (BSTs) can be constructed with n distinct keys?",
      options: ["(2n)! / ((n+1)! * n!) [nth Catalan number]", "2^n - n", "n! / 2", "2^(n-1)"],
      correctIndex: 0,
      explanation: "The total number of structurally unique BSTs with n distinct keys is given by the nth Catalan number Cn = (2n)! / ((n+1)! * n!).",
      topic: "Binary Search Trees",
      difficulty: "Hard",
      subject: "Data Structures",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_ds_5",
      question: "What is the minimum number of stacks required to implement a FIFO queue efficiently?",
      options: ["2", "1", "3", "4"],
      correctIndex: 0,
      explanation: "Two stacks (in-stack and out-stack) can simulate a queue with amortized O(1) time per operation.",
      topic: "Stacks & Queues",
      difficulty: "Easy",
      subject: "Data Structures",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_ds_6",
      question: "What is the maximum number of nodes in a binary tree of height h (where a tree with only a root node has height 0)?",
      options: ["2^(h+1) - 1", "2^h - 1", "2^(h-1)", "2^h + 1"],
      correctIndex: 0,
      explanation: "The maximum number of nodes occurs in a full binary tree: 2^0 + 2^1 + ... + 2^h = 2^(h+1) - 1.",
      topic: "Binary Trees",
      difficulty: "Easy",
      subject: "Data Structures",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_ds_7",
      question: "In an open addressing hash table with linear probing, what is the primary disadvantage compared to double hashing?",
      options: ["Primary clustering", "Secondary clustering", "Higher memory overhead", "Need for prime table size"],
      correctIndex: 0,
      explanation: "Linear probing suffers from primary clustering: long contiguous runs of occupied slots tend to grow larger, increasing probe lengths.",
      topic: "Hashing",
      difficulty: "Medium",
      subject: "Data Structures",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_ds_8",
      question: "What is the tight asymptotic bound on building a binary heap from an unsorted array of n elements using bottom-up heapify?",
      options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
      correctIndex: 0,
      explanation: "Bottom-up heap construction runs in linear time O(n) because the work done at level h is bounded by (n / 2^(h+1)) * O(h), summing to O(n).",
      topic: "Heaps",
      difficulty: "Hard",
      subject: "Data Structures",
      branch: "Computer Science Engineering"
    }
  ],
  "Algorithms": [
    {
      id: "gate_algo_1",
      question: "Using the Master Theorem, what is the solution to the recurrence relation: T(n) = 2T(n/2) + Theta(n)?",
      options: ["Theta(n log n)", "Theta(n)", "Theta(n^2)", "Theta(log n)"],
      correctIndex: 0,
      explanation: "Here a = 2, b = 2, f(n) = Theta(n). Since log_b(a) = log2(2) = 1 and f(n) = Theta(n^1), Case 2 of Master Theorem applies, yielding Theta(n log n).",
      topic: "Recurrence Relations",
      difficulty: "Easy",
      subject: "Algorithms",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_algo_2",
      question: "What is the time complexity of the Bellman-Ford shortest path algorithm on a directed graph with V vertices and E edges?",
      options: ["O(V * E)", "O(E log V)", "O(V^2)", "O(V + E)"],
      correctIndex: 0,
      explanation: "Bellman-Ford relaxes all E edges (V - 1) times, resulting in a strict O(V * E) time complexity.",
      topic: "Graph Algorithms",
      difficulty: "Medium",
      subject: "Algorithms",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_algo_3",
      question: "In the 0/1 Knapsack problem with n items and capacity W, what is the dynamic programming time complexity?",
      options: ["O(n * W)", "O(2^n)", "O(n log W)", "O(W^2)"],
      correctIndex: 0,
      explanation: "The standard DP table has size (n + 1) * (W + 1), taking O(n * W) pseudo-polynomial time.",
      topic: "Dynamic Programming",
      difficulty: "Medium",
      subject: "Algorithms",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_algo_4",
      question: "Which of the following problems is known to be in P (solvable in deterministic polynomial time)?",
      options: ["2-SAT (2-Satisfiability)", "3-SAT (3-Satisfiability)", "Traveling Salesperson Problem (decision)", "Hamiltonian Cycle"],
      correctIndex: 0,
      explanation: "2-SAT can be solved in linear time O(V + E) using strongly connected components (Tarjan/Kosaraju). 3-SAT, TSP, and Hamiltonian Cycle are NP-Complete.",
      topic: "NP-Completeness",
      difficulty: "Hard",
      subject: "Algorithms",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_algo_5",
      question: "What is the worst-case number of comparisons performed by QuickSort on an array of size n with deterministic first-element pivot?",
      options: ["Theta(n^2)", "Theta(n log n)", "Theta(n)", "Theta(log n)"],
      correctIndex: 0,
      explanation: "When the array is already sorted or reverse sorted, the first-element pivot partitions into 0 and n - 1 elements, giving n*(n-1)/2 = Theta(n^2) comparisons.",
      topic: "Sorting Algorithms",
      difficulty: "Easy",
      subject: "Algorithms",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_algo_6",
      question: "In Huffman coding, if the alphabet frequencies are [A: 0.4, B: 0.2, C: 0.2, D: 0.1, E: 0.1], what is the expected codeword length per character?",
      options: ["2.2 bits", "2.6 bits", "1.8 bits", "3.0 bits"],
      correctIndex: 0,
      explanation: "Merging D(0.1)+E(0.1)=0.2; then 0.2+C(0.2)=0.4; then 0.2(B)+0.4=0.6; final merge with A(0.4). Expected length = 0.4*1 + 0.2*2 + 0.2*3 + 0.1*4 + 0.1*4 = 2.2 bits.",
      topic: "Greedy Algorithms",
      difficulty: "Hard",
      subject: "Algorithms",
      branch: "Computer Science Engineering"
    }
  ],
  "DBMS": [
    {
      id: "gate_dbms_1",
      question: "A relation R(A, B, C, D) has functional dependencies: {A -> B, B -> C, C -> D}. What is the highest normal form of R?",
      options: ["1NF", "2NF", "3NF", "BCNF"],
      correctIndex: 0,
      explanation: "Candidate key is {A}. In B -> C and C -> D, neither B nor C is a superkey, and non-prime attributes C and D transitively depend on key A. It is in 1NF (and 2NF, as no partial dependencies on prime key), but fails 3NF.",
      topic: "Normalization",
      difficulty: "Medium",
      subject: "DBMS",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_dbms_2",
      question: "Under the Strict Two-Phase Locking (Strict 2PL) protocol, when are exclusive (write) locks released?",
      options: ["Only after the transaction commits or aborts", "Immediately after the write operation finishes", "At the start of the shrinking phase", "When the next read lock is acquired"],
      correctIndex: 0,
      explanation: "Strict 2PL requires all exclusive write locks to be held until the transaction finishes (commit/abort), preventing cascading aborts.",
      topic: "Concurrency Control",
      difficulty: "Easy",
      subject: "DBMS",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_dbms_3",
      question: "In a B+ tree of order p (maximum pointer count p per internal node), what is the minimum number of keys in a non-root internal node?",
      options: ["ceil(p / 2) - 1", "floor(p / 2)", "p / 2", "p - 1"],
      correctIndex: 0,
      explanation: "A non-root internal node must contain at least ceil(p / 2) children pointers, and therefore at least ceil(p / 2) - 1 keys.",
      topic: "Indexing & B+ Trees",
      difficulty: "Hard",
      subject: "DBMS",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_dbms_4",
      question: "Which isolation level in ANSI SQL prevents dirty reads and non-repeatable reads, but may allow phantom reads?",
      options: ["Repeatable Read", "Read Committed", "Read Uncommitted", "Serializable"],
      correctIndex: 0,
      explanation: "Repeatable Read locks retrieved rows against modification, preventing dirty reads and non-repeatable reads, but predicate ranges can still admit phantom inserts.",
      topic: "Transactions & ACID",
      difficulty: "Medium",
      subject: "DBMS",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_dbms_5",
      question: "What is the result of the relational algebra operation R / S (Division) when S is empty?",
      options: ["Undefined / Not allowed", "All tuples of R projected on common attributes", "Empty relation", "Cartesian product R x S"],
      correctIndex: 0,
      explanation: "Relational division R(X, Y) / S(Y) requires S to be non-empty; dividing by an empty relation is mathematically undefined.",
      topic: "Relational Algebra",
      difficulty: "Hard",
      subject: "DBMS",
      branch: "Computer Science Engineering"
    }
  ],
  "Operating Systems": [
    {
      id: "gate_os_1",
      question: "Which of the following page replacement algorithms suffers from Belady's Anomaly (where increasing page frames increases page faults)?",
      options: ["FIFO (First In First Out)", "LRU (Least Recently Used)", "Optimal Page Replacement", "LFU (Least Frequently Used)"],
      correctIndex: 0,
      explanation: "FIFO is not a stack algorithm, so adding more physical frames can paradoxically increase the number of page faults (Belady's Anomaly).",
      topic: "Virtual Memory",
      difficulty: "Easy",
      subject: "Operating Systems",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_os_2",
      question: "In a system with 3 processes sharing 4 instances of a single resource type, where each process requires at most 2 instances, can a deadlock occur?",
      options: ["No, the system is strictly deadlock-free", "Yes, deadlock occurs if all request 2 simultaneously", "Deadlock occurs only with preemptive scheduling", "Depends on process arrival order"],
      correctIndex: 0,
      explanation: "For deadlock-freedom with n processes each needing at most m instances: Total resources >= n*(m - 1) + 1. Here 3*(2 - 1) + 1 = 4. Since 4 resources exist, deadlock is impossible.",
      topic: "Deadlocks",
      difficulty: "Medium",
      subject: "Operating Systems",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_os_3",
      question: "In a 32-bit virtual address space with 4 KB page size, if each page table entry occupies 4 bytes, what is the size of a single-level page table?",
      options: ["4 MB", "1 MB", "2 MB", "8 MB"],
      correctIndex: 0,
      explanation: "4 KB page size = 2^12 bytes. Number of pages = 2^32 / 2^12 = 2^20 pages. Page table size = 2^20 * 4 bytes = 4 MB.",
      topic: "Paging & Memory Management",
      difficulty: "Hard",
      subject: "Operating Systems",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_os_4",
      question: "What does the Banker's Algorithm primarily test to ensure system safety?",
      options: ["Whether there exists at least one safe execution sequence of processes", "Whether all resources are currently allocated", "Whether priority inversion has been avoided", "Whether the CPU is idle"],
      correctIndex: 0,
      explanation: "Banker's Algorithm ensures the system remains in a safe state by verifying that there exists at least one order in which all processes can finish without deadlock.",
      topic: "Deadlock Avoidance",
      difficulty: "Medium",
      subject: "Operating Systems",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_os_5",
      question: "What is the main advantage of the Round Robin (RR) scheduling algorithm over Shortest Job First (SJF)?",
      options: ["Guaranteed starvation-freedom and fair responsiveness", "Minimal average waiting time", "Zero context switch overhead", "No need for CPU bursts"],
      correctIndex: 0,
      explanation: "Round Robin uses preemption with a time quantum, guaranteeing that every process gets CPU time without starvation, providing excellent response times.",
      topic: "CPU Scheduling",
      difficulty: "Easy",
      subject: "Operating Systems",
      branch: "Computer Science Engineering"
    }
  ],
  "Computer Networks": [
    {
      id: "gate_cn_1",
      question: "In an IPv4 network, what is the usable host count for a subnet with CIDR prefix /27?",
      options: ["30", "32", "28", "31"],
      correctIndex: 0,
      explanation: "A /27 subnet has 32 - 27 = 5 host bits. Total addresses = 2^5 = 32. Subtracting network and broadcast addresses leaves 32 - 2 = 30 usable hosts.",
      topic: "IPv4 Subnetting",
      difficulty: "Easy",
      subject: "Computer Networks",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_cn_2",
      question: "In Go-Back-N ARQ with a sender window size of N = 7, how many distinct sequence numbers are required?",
      options: ["8", "7", "14", "16"],
      correctIndex: 0,
      explanation: "In Go-Back-N ARQ, the sequence number space must be at least N + 1 to prevent ambiguity between duplicate and fresh frames. For N = 7, we need at least 8 sequence numbers.",
      topic: "Flow Control Protocols",
      difficulty: "Medium",
      subject: "Computer Networks",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_cn_3",
      question: "What is the maximum data rate of a noiseless 4 kHz channel carrying signals with 16 discrete levels according to Nyquist's theorem?",
      options: ["32 kbps", "16 kbps", "64 kbps", "8 kbps"],
      correctIndex: 0,
      explanation: "Nyquist Bit Rate = 2 * Bandwidth * log2(Levels) = 2 * 4000 * log2(16) = 2 * 4000 * 4 = 32,000 bps = 32 kbps.",
      topic: "Physical Layer & Nyquist",
      difficulty: "Hard",
      subject: "Computer Networks",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_cn_4",
      question: "During TCP Slow Start, how does the congestion window (cwnd) increase upon receiving each ACK?",
      options: ["By 1 MSS per ACK (effectively doubling cwnd each RTT)", "Linearly by 1 MSS per RTT", "Exponentially by squaring cwnd", "Remains constant"],
      correctIndex: 0,
      explanation: "In slow start, cwnd increases by 1 MSS for every received ACK, which results in doubling cwnd each round-trip time (RTT).",
      topic: "TCP Congestion Control",
      difficulty: "Medium",
      subject: "Computer Networks",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_cn_5",
      question: "Which protocol is responsible for resolving an IP address to a physical MAC address on a local network?",
      options: ["ARP (Address Resolution Protocol)", "RARP", "DNS", "DHCP"],
      correctIndex: 0,
      explanation: "ARP broadcasts on the local link to find the hardware MAC address associated with a target IPv4 address.",
      topic: "Link Layer & ARP",
      difficulty: "Easy",
      subject: "Computer Networks",
      branch: "Computer Science Engineering"
    }
  ],
  "Computer Organization and Architecture": [
    {
      id: "gate_coa_1",
      question: "In a 5-stage instruction pipeline without branch prediction, how many clock cycles of stall occur for an unconditional branch resolved at stage 3 (Execute)?",
      options: ["2 cycles", "3 cycles", "1 cycle", "4 cycles"],
      correctIndex: 0,
      explanation: "Since the branch target is determined at stage 3, the instructions fetched in stages 1 and 2 during the previous 2 cycles must be flushed, causing 2 stall cycles.",
      topic: "Pipelining & Hazards",
      difficulty: "Medium",
      subject: "Computer Organization and Architecture",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_coa_2",
      question: "In IEEE 754 single-precision 32-bit floating point format, what is the bias added to the 8-bit exponent?",
      options: ["127", "128", "255", "1023"],
      correctIndex: 0,
      explanation: "Single-precision uses 1 sign bit, 8 exponent bits with bias 127 (2^(8-1) - 1 = 127), and 23 mantissa bits.",
      topic: "Data Representation",
      difficulty: "Easy",
      subject: "Computer Organization and Architecture",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_coa_3",
      question: "A direct-mapped cache has 64 KB capacity with 64-byte blocks in a 32-bit byte-addressed architecture. How many bits are in the Tag field?",
      options: ["16 bits", "10 bits", "12 bits", "20 bits"],
      correctIndex: 0,
      explanation: "Block offset = log2(64) = 6 bits. Number of cache lines = 64 KB / 64 B = 1024 = 2^10 lines (10 index bits). Tag bits = 32 - 10 - 6 = 16 bits.",
      topic: "Cache Memory",
      difficulty: "Hard",
      subject: "Computer Organization and Architecture",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_coa_4",
      question: "According to Amdahl's Law, what is the maximum speedup achievable with infinite processors if 20% of a program is strictly serial?",
      options: ["5x", "10x", "4x", "2x"],
      correctIndex: 0,
      explanation: "Amdahl's limit S = 1 / (s + (1 - s)/N). As N -> inf, S = 1 / s = 1 / 0.20 = 5x maximum speedup.",
      topic: "Amdahl Law & Performance",
      difficulty: "Easy",
      subject: "Computer Organization and Architecture",
      branch: "Computer Science Engineering"
    }
  ],
  "Theory of Computation": [
    {
      id: "gate_toc_1",
      question: "What is the minimum number of states in a minimal DFA that accepts all binary strings containing '01' as a substring?",
      options: ["3", "2", "4", "5"],
      correctIndex: 0,
      explanation: "States: q0 (start, no progress), q1 (seen '0'), q2 (accept, seen '01', dead/absorbing accept). Exactly 3 states are required.",
      topic: "Finite Automata",
      difficulty: "Easy",
      subject: "Theory of Computation",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_toc_2",
      question: "Which of the following problems is undecidable?",
      options: ["Halting problem for Turing machines", "Emptiness of regular languages", "Finiteness of context-free languages", "Equivalence of DFAs"],
      correctIndex: 0,
      explanation: "By Turing's proof, whether an arbitrary Turing machine halts on an arbitrary input is fundamentally undecidable.",
      topic: "Decidability",
      difficulty: "Medium",
      subject: "Theory of Computation",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_toc_3",
      question: "Is the language L = {a^n b^n c^n | n >= 1} context-free?",
      options: ["No, it is context-sensitive but not context-free", "Yes, accepted by deterministic PDA", "Yes, accepted by non-deterministic PDA", "Yes, it is regular"],
      correctIndex: 0,
      explanation: "Using the pumping lemma for CFLs, a single stack cannot simultaneously verify the equality of three independent counts (a, b, and c). Hence L is not context-free.",
      topic: "Context-Free Languages",
      difficulty: "Hard",
      subject: "Theory of Computation",
      branch: "Computer Science Engineering"
    }
  ],
  "Compiler Design": [
    {
      id: "gate_cd_1",
      question: "Which of the following parsing techniques is top-down?",
      options: ["LL(1) parsing", "SLR(1) parsing", "LALR(1) parsing", "CLR(1) parsing"],
      correctIndex: 0,
      explanation: "LL(1) is a predictive Left-to-right, Leftmost-derivation top-down parser. SLR, LALR, and CLR are bottom-up shift-reduce parsers.",
      topic: "Parsing Techniques",
      difficulty: "Easy",
      subject: "Compiler Design",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_cd_2",
      question: "In an S-attributed definition, how are the semantic attributes evaluated?",
      options: ["Strictly bottom-up during LR parsing using synthesized attributes only", "Top-down using inherited attributes only", "Using arbitrary multi-pass traversals", "Using inherited attributes during lexical scan"],
      correctIndex: 0,
      explanation: "An S-attributed grammar uses only synthesized attributes, which can be evaluated directly in bottom-up fashion during LR parsing.",
      topic: "Syntax-Directed Translation",
      difficulty: "Medium",
      subject: "Compiler Design",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_cd_3",
      question: "In register allocation for basic blocks, which graph problem is used to determine the minimum number of registers needed?",
      options: ["Graph Coloring", "Minimum Spanning Tree", "Maximum Flow", "Shortest Path"],
      correctIndex: 0,
      explanation: "Chaitin's register allocation maps variable live ranges to an interference graph; finding a k-coloring determines if k physical registers suffice.",
      topic: "Code Optimization",
      difficulty: "Hard",
      subject: "Compiler Design",
      branch: "Computer Science Engineering"
    }
  ],
  "Engineering Mathematics": [
    {
      id: "gate_em_1",
      question: "If a 3x3 matrix A has eigenvalues 2, 3, and 5, what is the determinant of matrix A?",
      options: ["30", "10", "15", "25"],
      correctIndex: 0,
      explanation: "The determinant of any square matrix equals the product of its eigenvalues: det(A) = 2 * 3 * 5 = 30.",
      topic: "Linear Algebra",
      difficulty: "Easy",
      subject: "Engineering Mathematics",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_em_2",
      question: "A fair 6-sided die is rolled 3 times. What is the probability of obtaining at least one six?",
      options: ["91 / 216", "1 / 6", "125 / 216", "1 / 2"],
      correctIndex: 0,
      explanation: "P(at least one 6) = 1 - P(no sixes in 3 rolls) = 1 - (5/6)^3 = 1 - 125/216 = 91/216 (approx 0.421).",
      topic: "Probability",
      difficulty: "Medium",
      subject: "Engineering Mathematics",
      branch: "Computer Science Engineering"
    },
    {
      id: "gate_em_3",
      question: "What is the value of lim(x -> 0) of (sin 3x) / (sin 5x)?",
      options: ["3 / 5", "5 / 3", "1", "0"],
      correctIndex: 0,
      explanation: "Using L'Hopital's rule or standard limits: lim (sin 3x)/(3x) * (5x)/(sin 5x) * (3/5) = 1 * 1 * (3/5) = 3/5.",
      topic: "Calculus",
      difficulty: "Easy",
      subject: "Engineering Mathematics",
      branch: "Computer Science Engineering"
    }
  ]
};

// ============================================================================
// 1B. CURATED GATE QUESTION BANKS FOR ALL ENGINEERING BRANCHES
// ============================================================================

export const GATE_ME_QUESTIONS_BANK: Record<string, GateQuestion[]> = {
  "Thermodynamics": [
    {
      id: "gate_me_th_1",
      question: "A Carnot heat engine operates between reservoirs at 900 K and 300 K. What is the theoretical thermal efficiency of this engine?",
      options: ["66.7%", "50.0%", "33.3%", "75.0%"],
      correctIndex: 0,
      explanation: "Carnot efficiency eta = 1 - (T_L / T_H) = 1 - (300 / 900) = 1 - 0.333 = 0.667 or 66.7%.",
      topic: "Carnot Cycle & Second Law",
      difficulty: "Easy",
      subject: "Thermodynamics",
      branch: "Mechanical Engineering"
    },
    {
      id: "gate_me_th_2",
      question: "For an ideal gas undergoing an isentropic process with ratio of specific heats gamma = 1.4, if temperature increases by a factor of 1.5, by what factor does the volume change?",
      options: ["0.36", "0.67", "0.81", "0.45"],
      correctIndex: 0,
      explanation: "For an isentropic process, T * V^(gamma - 1) = const. Thus V2/V1 = (T1/T2)^(1 / (gamma - 1)) = (1 / 1.5)^(1 / 0.4) = (0.667)^2.5 approx 0.36.",
      topic: "Isentropic Processes",
      difficulty: "Hard",
      subject: "Thermodynamics",
      branch: "Mechanical Engineering"
    },
    {
      id: "gate_me_th_3",
      question: "Which of the following represents the Clausius inequality for any cyclic process?",
      options: ["oint (dQ / T) <= 0", "oint (dQ / T) >= 0", "oint (dQ / T) = 0", "oint (T * dS) < 0"],
      correctIndex: 0,
      explanation: "The Clausius inequality states that for any closed thermodynamic cycle, oint (dQ / T) <= 0, with equality holding strictly for reversible cycles.",
      topic: "Entropy & Second Law",
      difficulty: "Easy",
      subject: "Thermodynamics",
      branch: "Mechanical Engineering"
    },
    {
      id: "gate_me_th_4",
      question: "In an ideal Rankine cycle, what is the effect of reheating steam to the initial turbine inlet temperature?",
      options: ["Increases turbine work output and reduces exhaust moisture content", "Decreases thermal efficiency significantly", "Increases boiler pressure limits", "Eliminates need for condenser"],
      correctIndex: 0,
      explanation: "Reheating increases the total expansion work of the turbine and prevents erosion of low-pressure turbine blades by keeping steam quality high at exit.",
      topic: "Vapour Power Cycles",
      difficulty: "Medium",
      subject: "Thermodynamics",
      branch: "Mechanical Engineering"
    },
    {
      id: "gate_me_th_5",
      question: "What is the Joule-Thomson coefficient mu for an ideal gas?",
      options: ["Zero", "Positive", "Negative", "Infinite"],
      correctIndex: 0,
      explanation: "The Joule-Thomson coefficient is (dT/dP) at constant enthalpy. For an ideal gas, enthalpy depends solely on temperature, so an isenthalpic throttle produces zero temperature change (mu = 0).",
      topic: "Thermodynamic Relations",
      difficulty: "Hard",
      subject: "Thermodynamics",
      branch: "Mechanical Engineering"
    },
    {
      id: "gate_me_th_6",
      question: "For an Otto cycle with compression ratio r = 8 and gamma = 1.4, what is the air-standard efficiency?",
      options: ["56.5%", "62.3%", "48.2%", "50.0%"],
      correctIndex: 0,
      explanation: "Otto cycle efficiency eta = 1 - 1/(r^(gamma - 1)) = 1 - 1/(8^0.4) = 1 - 1/2.297 = 1 - 0.435 = 0.565 or 56.5%.",
      topic: "Gas Power Cycles",
      difficulty: "Medium",
      subject: "Thermodynamics",
      branch: "Mechanical Engineering"
    }
  ],
  "Fluid Mechanics": [
    {
      id: "gate_me_fm_1",
      question: "In a fully developed laminar pipe flow, the maximum velocity is related to the average flow velocity by which factor?",
      options: ["2.0", "1.5", "1.33", "2.5"],
      correctIndex: 0,
      explanation: "For laminar flow through a circular pipe (Hagen-Poiseuille velocity profile), u(r) = u_max * (1 - (r/R)^2), giving u_avg = u_max / 2, so u_max = 2.0 * u_avg.",
      topic: "Viscous Flow in Pipes",
      difficulty: "Easy",
      subject: "Fluid Mechanics",
      branch: "Mechanical Engineering"
    },
    {
      id: "gate_me_fm_2",
      question: "What is the Darcy friction factor f for laminar flow in a smooth circular pipe with Reynolds number Re = 800?",
      options: ["0.08", "0.02", "0.04", "0.16"],
      correctIndex: 0,
      explanation: "For laminar pipe flow, the Darcy-Weisbach friction factor is f = 64 / Re. With Re = 800, f = 64 / 800 = 0.08.",
      topic: "Friction Factor & Head Loss",
      difficulty: "Medium",
      subject: "Fluid Mechanics",
      branch: "Mechanical Engineering"
    },
    {
      id: "gate_me_fm_3",
      question: "According to Blasius boundary layer solution for laminar flow over a flat plate, boundary layer thickness delta grows with distance x as:",
      options: ["x^(1/2)", "x^(1/5)", "x", "x^(1/7)"],
      correctIndex: 0,
      explanation: "Blasius boundary layer thickness delta = 5 * x / sqrt(Re_x). Since Re_x = rho*U*x / mu, delta is proportional to x / sqrt(x) = x^(1/2).",
      topic: "Boundary Layer Theory",
      difficulty: "Hard",
      subject: "Fluid Mechanics",
      branch: "Mechanical Engineering"
    },
    {
      id: "gate_me_fm_4",
      question: "For a 2D velocity potential phi = 2xy, what is the corresponding stream function psi (assuming psi(0,0)=0)?",
      options: ["y^2 - x^2", "x^2 - y^2", "2xy", "x^2 + y^2"],
      correctIndex: 0,
      explanation: "Velocity u = dphi/dx = 2y = dpsi/dy => psi = y^2 + f(x). v = dphi/dy = 2x = -dpsi/dx => -f'(x) = 2x => f(x) = -x^2. Hence psi = y^2 - x^2.",
      topic: "Potential Flow",
      difficulty: "Hard",
      subject: "Fluid Mechanics",
      branch: "Mechanical Engineering"
    },
    {
      id: "gate_me_fm_5",
      question: "What is the metacentric height GM for a floating body with center of buoyancy B, center of gravity G, and metacenter M?",
      options: ["BM - BG", "BG - BM", "BM + BG", "KB + BM"],
      correctIndex: 0,
      explanation: "By geometry of floating bodies, distance GM = BM - BG, where BM = I / V_submerged.",
      topic: "Buoyancy & Floatation",
      difficulty: "Easy",
      subject: "Fluid Mechanics",
      branch: "Mechanical Engineering"
    }
  ],
  "Strength of Materials": [
    {
      id: "gate_me_som_1",
      question: "What is the ratio of Euler critical buckling load for a column with both ends fixed compared to a column with both ends hinged (same material and cross-section)?",
      options: ["4", "2", "16", "1"],
      correctIndex: 0,
      explanation: "Euler buckling load P_cr = (pi^2 * E * I) / L_e^2. For both ends hinged L_e = L, so P_cr1 = pi^2*E*I / L^2. For both ends fixed L_e = L/2, so P_cr2 = 4*pi^2*E*I / L^2. Ratio is 4.",
      topic: "Columns & Buckling",
      difficulty: "Easy",
      subject: "Strength of Materials",
      branch: "Mechanical Engineering"
    },
    {
      id: "gate_me_som_2",
      question: "In a solid circular shaft subjected to pure torsion T, how does the shear stress vary with radial distance r from the axis?",
      options: ["Linearly proportional to r (maximum at outer surface)", "Inversely proportional to r", "Parabolically with r^2", "Constant across the section"],
      correctIndex: 0,
      explanation: "The torsion formula is tau / r = T / J. Hence shear stress tau = (T / J) * r, which is directly linear with r, reaching maximum at outer radius.",
      topic: "Torsion of Shafts",
      difficulty: "Easy",
      subject: "Strength of Materials",
      branch: "Mechanical Engineering"
    },
    {
      id: "gate_me_som_3",
      question: "What is the radius of Mohr's circle for a 2D state of stress with sigma_x = 100 MPa, sigma_y = 40 MPa, and tau_xy = 40 MPa?",
      options: ["50 MPa", "30 MPa", "70 MPa", "40 MPa"],
      correctIndex: 0,
      explanation: "Radius R = sqrt(((sigma_x - sigma_y)/2)^2 + tau_xy^2) = sqrt(((100 - 40)/2)^2 + 40^2) = sqrt(30^2 + 40^2) = 50 MPa.",
      topic: "Mohr Circle & Principal Stresses",
      difficulty: "Medium",
      subject: "Strength of Materials",
      branch: "Mechanical Engineering"
    },
    {
      id: "gate_me_som_4",
      question: "For a cantilever beam of length L carrying a concentrated end load P, what is the maximum deflection at the free end?",
      options: ["P * L^3 / (3 * E * I)", "P * L^3 / (48 * E * I)", "P * L^4 / (8 * E * I)", "5 * P * L^3 / (48 * E * I)"],
      correctIndex: 0,
      explanation: "By moment-area or double integration method, tip deflection of a point-loaded cantilever is delta = P * L^3 / (3 * E * I).",
      topic: "Deflection of Beams",
      difficulty: "Medium",
      subject: "Strength of Materials",
      branch: "Mechanical Engineering"
    },
    {
      id: "gate_me_som_5",
      question: "What is the strain energy per unit volume (resilience) for a material with yield strength sigma_y and Young modulus E in uniaxial tension?",
      options: ["sigma_y^2 / (2 * E)", "sigma_y / E", "sigma_y^2 / E", "2 * sigma_y^2 / E"],
      correctIndex: 0,
      explanation: "Modulus of resilience U_r = 1/2 * stress * strain = 1/2 * sigma_y * (sigma_y / E) = sigma_y^2 / (2 * E).",
      topic: "Strain Energy",
      difficulty: "Hard",
      subject: "Strength of Materials",
      branch: "Mechanical Engineering"
    }
  ],
  "Manufacturing Engineering": [
    {
      id: "gate_me_mfg_1",
      question: "According to Taylor's tool life equation V * T^n = C, if cutting speed V is doubled with exponent n = 0.5, by what factor does tool life T change?",
      options: ["0.25 (reduced to 1/4th)", "0.50 (halved)", "0.125 (1/8th)", "2.0 (doubled)"],
      correctIndex: 0,
      explanation: "V1 * T1^n = V2 * T2^n => T2 / T1 = (V1 / V2)^(1/n) = (1/2)^(1 / 0.5) = (0.5)^2 = 0.25.",
      topic: "Machining & Tool Life",
      difficulty: "Medium",
      subject: "Manufacturing Engineering",
      branch: "Mechanical Engineering"
    },
    {
      id: "gate_me_mfg_2",
      question: "According to Chvorinov's rule for casting solidification time t_s = B * (V / A)^2, if all dimensions of a cube are doubled, solidification time increases by:",
      options: ["4 times", "2 times", "8 times", "16 times"],
      correctIndex: 0,
      explanation: "For a cube of side a, V/A = a^3 / (6*a^2) = a / 6. If side a is doubled, the ratio (V/A) doubles, and t_s increases by (2)^2 = 4 times.",
      topic: "Metal Casting",
      difficulty: "Easy",
      subject: "Manufacturing Engineering",
      branch: "Mechanical Engineering"
    },
    {
      id: "gate_me_mfg_3",
      question: "In orthogonal cutting with rake angle alpha = 10 deg and shear angle phi = 30 deg, what is the chip thickness ratio r?",
      options: ["0.51", "0.65", "0.42", "0.80"],
      correctIndex: 0,
      explanation: "Chip thickness ratio r = sin(phi) / cos(phi - alpha) = sin(30 deg) / cos(20 deg) = 0.50 / 0.9397 approx 0.53.",
      topic: "Merchant Circle & Mechanics",
      difficulty: "Hard",
      subject: "Manufacturing Engineering",
      branch: "Mechanical Engineering"
    },
    {
      id: "gate_me_mfg_4",
      question: "In a rolling operation with roll radius R and coefficient of friction mu, what is the maximum possible draft Delta h in a single pass without assistance?",
      options: ["mu^2 * R", "mu * R", "mu^2 / R", "sqrt(mu * R)"],
      correctIndex: 0,
      explanation: "The condition for biting without external pushing is tan(alpha) <= mu. From roll geometry Delta h_max = R * (1 - cos alpha) approx R * (alpha^2 / 2), giving Delta h_max = mu^2 * R.",
      topic: "Metal Forming",
      difficulty: "Medium",
      subject: "Manufacturing Engineering",
      branch: "Mechanical Engineering"
    }
  ],
  "Theory of Machines": [
    {
      id: "gate_me_tom_1",
      question: "For a planar four-bar mechanism with link lengths s (shortest), l (longest), p and q, what does Grashof's condition state for at least one link to make a complete revolution?",
      options: ["s + l <= p + q", "s + l > p + q", "s + p <= l + q", "s * l <= p * q"],
      correctIndex: 0,
      explanation: "Grashof's law states that a four-bar linkage has at least one revolving link if and only if the sum of the shortest and longest link lengths does not exceed the sum of the remaining two link lengths: s + l <= p + q.",
      topic: "Kinematic Linkages",
      difficulty: "Easy",
      subject: "Theory of Machines",
      branch: "Mechanical Engineering"
    },
    {
      id: "gate_me_tom_2",
      question: "What is the natural frequency omega_n of an undamped single degree of freedom system with mass m and stiffness k?",
      options: ["sqrt(k / m)", "sqrt(m / k)", "k / m", "2 * pi * sqrt(k / m)"],
      correctIndex: 0,
      explanation: "The undamped circular natural frequency is omega_n = sqrt(k / m) in rad/sec.",
      topic: "Vibrations",
      difficulty: "Easy",
      subject: "Theory of Machines",
      branch: "Mechanical Engineering"
    },
    {
      id: "gate_me_tom_3",
      question: "In an epicyclic gear train, the sun gear has 20 teeth and the fixed annular ring gear has 80 teeth. If the arm rotates, what is the speed ratio between the sun and the arm?",
      options: ["5", "4", "3", "6"],
      correctIndex: 0,
      explanation: "Using tabular method: T_sun = 20, T_ring = 80. With fixed ring (N_ring = 0): (N_sun - N_arm)/(0 - N_arm) = - T_ring / T_sun = -80/20 = -4 => N_sun - N_arm = 4*N_arm => N_sun / N_arm = 5.",
      topic: "Gear Trains",
      difficulty: "Hard",
      subject: "Theory of Machines",
      branch: "Mechanical Engineering"
    },
    {
      id: "gate_me_tom_4",
      question: "What is the number of degrees of freedom (mobility) of a planar mechanism with 6 links and 7 simple revolute joints according to Kutzbach criterion?",
      options: ["1", "2", "0", "3"],
      correctIndex: 0,
      explanation: "Kutzbach mobility equation: M = 3*(n - 1) - 2*j1 - j2. Here n = 6, j1 = 7, j2 = 0. M = 3*(6 - 1) - 2*7 = 15 - 14 = 1.",
      topic: "Mechanisms & Mobility",
      difficulty: "Medium",
      subject: "Theory of Machines",
      branch: "Mechanical Engineering"
    }
  ],
  "Heat Transfer": [
    {
      id: "gate_me_ht_1",
      question: "What is the critical radius of insulation r_cr for a cylinder with thermal conductivity k and outer convection coefficient h?",
      options: ["k / h", "2 * k / h", "h / k", "sqrt(k / h)"],
      correctIndex: 0,
      explanation: "For a cylindrical pipe, total thermal resistance is minimized when the outer radius equals r_cr = k / h. For a sphere it is 2*k / h.",
      topic: "Conduction & Critical Radius",
      difficulty: "Easy",
      subject: "Heat Transfer",
      branch: "Mechanical Engineering"
    },
    {
      id: "gate_me_ht_2",
      question: "In transient heat conduction, the lumped capacitance method is valid only when the Biot number Bi satisfies:",
      options: ["Bi < 0.1", "Bi > 1.0", "Bi = 1.0", "Bi > 10.0"],
      correctIndex: 0,
      explanation: "Bi = (h * L_c) / k. When Bi < 0.1, internal conductive resistance is negligible compared to surface convective resistance, meaning uniform spatial temperature inside the body.",
      topic: "Transient Conduction & Biot Number",
      difficulty: "Easy",
      subject: "Heat Transfer",
      branch: "Mechanical Engineering"
    },
    {
      id: "gate_me_ht_3",
      question: "In a counter-flow heat exchanger, hot fluid cools from 100 C to 60 C while cold fluid warms from 30 C to 70 C. What is the Log Mean Temperature Difference (LMTD)?",
      options: ["30 C", "40 C", "35 C", "25 C"],
      correctIndex: 0,
      explanation: "Delta T1 = T_h,in - T_c,out = 100 - 70 = 30 C. Delta T2 = T_h,out - T_c,in = 60 - 30 = 30 C. When Delta T1 = Delta T2, the LMTD is identically equal to 30 C.",
      topic: "Heat Exchangers & LMTD",
      difficulty: "Medium",
      subject: "Heat Transfer",
      branch: "Mechanical Engineering"
    },
    {
      id: "gate_me_ht_4",
      question: "What is the view factor F_12 from a small sphere 1 of surface area A1 completely enclosed within a large cavity 2?",
      options: ["1.0", "0.5", "A1 / A2", "0.0"],
      correctIndex: 0,
      explanation: "Since sphere 1 is convex, it cannot see itself (F_11 = 0). By summation rule F_11 + F_12 = 1, so all radiation leaving sphere 1 must strike the enclosing cavity 2 (F_12 = 1.0).",
      topic: "Radiation Shape Factors",
      difficulty: "Hard",
      subject: "Heat Transfer",
      branch: "Mechanical Engineering"
    }
  ]
};

// ============================================================================
// 1C. CIVIL ENGINEERING (CE) QUESTION BANK
// ============================================================================

export const GATE_CE_QUESTIONS_BANK: Record<string, GateQuestion[]> = {
  "Structural Engineering": [
    {
      id: "gate_ce_se_1",
      question: "For a rectangular cross-section of width b and depth d, what is the shape factor (ratio of plastic moment M_p to yield moment M_y)?",
      options: ["1.50", "1.70", "1.15", "2.00"],
      correctIndex: 0,
      explanation: "Plastic section modulus Z_p = b*d^2 / 4. Elastic section modulus Z_e = b*d^2 / 6. Shape factor S = Z_p / Z_e = 1.50.",
      topic: "Plastic Analysis",
      difficulty: "Easy",
      subject: "Structural Engineering",
      branch: "Civil Engineering"
    },
    {
      id: "gate_ce_se_2",
      question: "In the moment distribution method, what is the carry-over factor to a far end that is fixed for a prismatic beam?",
      options: ["+0.5", "-0.5", "1.0", "0.0"],
      correctIndex: 0,
      explanation: "When a moment M is applied at the near end with a fixed far end, the moment induced at the far end is +M/2, giving a carry-over factor of +0.5.",
      topic: "Moment Distribution Method",
      difficulty: "Easy",
      subject: "Structural Engineering",
      branch: "Civil Engineering"
    },
    {
      id: "gate_ce_se_3",
      question: "What is the static indeterminacy (D_s) of a propped cantilever beam carrying an arbitrary transverse load?",
      options: ["1", "2", "3", "0"],
      correctIndex: 0,
      explanation: "A propped cantilever has 3 reactions at the fixed support + 1 vertical reaction at the prop = 4 reactions. Equilibrium equations = 3. D_s = 4 - 3 = 1.",
      topic: "Indeterminacy",
      difficulty: "Medium",
      subject: "Structural Engineering",
      branch: "Civil Engineering"
    },
    {
      id: "gate_ce_se_4",
      question: "In limit state design of reinforced concrete beams (IS 456), what is the maximum compressive strain in concrete at the outermost fiber in bending?",
      options: ["0.0035", "0.0020", "0.0030", "0.0045"],
      correctIndex: 0,
      explanation: "Clause 38.1 of IS 456 states that the maximum strain in concrete at the outermost compression fiber is taken as 0.0035 in bending.",
      topic: "RCC Design (IS 456)",
      difficulty: "Medium",
      subject: "Structural Engineering",
      branch: "Civil Engineering"
    },
    {
      id: "gate_ce_se_5",
      question: "For an I-section with equal flanges, what is the approximate shape factor?",
      options: ["1.12 to 1.15", "1.50", "1.70", "1.30"],
      correctIndex: 0,
      explanation: "Standard structural steel I-sections have most material in the flanges, resulting in a shape factor typically around 1.12 to 1.15.",
      topic: "Steel Design",
      difficulty: "Hard",
      subject: "Structural Engineering",
      branch: "Civil Engineering"
    }
  ],
  "Geotechnical Engineering": [
    {
      id: "gate_ce_ge_1",
      question: "A soil specimen has a void ratio e = 0.50. What is the porosity n of this soil?",
      options: ["33.3%", "50.0%", "25.0%", "66.7%"],
      correctIndex: 0,
      explanation: "Porosity n = e / (1 + e) = 0.50 / (1 + 0.50) = 0.50 / 1.50 = 0.333 or 33.3%.",
      topic: "Phase Relationships",
      difficulty: "Easy",
      subject: "Geotechnical Engineering",
      branch: "Civil Engineering"
    },
    {
      id: "gate_ce_ge_2",
      question: "According to Terzaghi's 1D consolidation theory, the time factor T_v is related to coefficient of consolidation c_v, time t, and drainage path d by:",
      options: ["c_v * t / d^2", "c_v * d^2 / t", "c_v * t / d", "c_v * d / t^2"],
      correctIndex: 0,
      explanation: "The dimensionless time factor is T_v = (c_v * t) / d^2, where d is the maximum drainage distance.",
      topic: "Consolidation",
      difficulty: "Medium",
      subject: "Geotechnical Engineering",
      branch: "Civil Engineering"
    },
    {
      id: "gate_ce_ge_3",
      question: "In Mohr-Coulomb shear strength criterion tau_f = c + sigma * tan(phi), what is the shear strength of a normally consolidated clay (c = 0) at normal stress sigma = 100 kPa and friction angle phi = 30 deg?",
      options: ["57.7 kPa", "50.0 kPa", "86.6 kPa", "100 kPa"],
      correctIndex: 0,
      explanation: "tau_f = sigma * tan(30 deg) = 100 * (1 / sqrt(3)) = 100 * 0.577 = 57.7 kPa.",
      topic: "Shear Strength",
      difficulty: "Easy",
      subject: "Geotechnical Engineering",
      branch: "Civil Engineering"
    },
    {
      id: "gate_ce_ge_4",
      question: "What is Rankine's coefficient of active earth pressure K_a for a soil with internal friction angle phi = 30 deg?",
      options: ["1 / 3", "3", "1 / 2", "2 / 3"],
      correctIndex: 0,
      explanation: "K_a = (1 - sin phi) / (1 + sin phi) = (1 - 0.5) / (1 + 0.5) = 0.5 / 1.5 = 1/3.",
      topic: "Earth Pressure",
      difficulty: "Easy",
      subject: "Geotechnical Engineering",
      branch: "Civil Engineering"
    },
    {
      id: "gate_ce_ge_5",
      question: "For a strip footing on cohesive soil (phi = 0) with cohesion c, what is Terzaghi's ultimate bearing capacity q_ult (neglecting surcharge)?",
      options: ["5.7 * c", "5.14 * c", "6.2 * c", "3.0 * c"],
      correctIndex: 0,
      explanation: "Terzaghi's bearing capacity factor N_c for a continuous strip footing on purely cohesive soil (phi = 0) is 5.7, giving q_ult = 5.7 * c.",
      topic: "Shallow Foundations",
      difficulty: "Hard",
      subject: "Geotechnical Engineering",
      branch: "Civil Engineering"
    }
  ],
  "Fluid Mechanics & Hydraulics": [
    {
      id: "gate_ce_fm_1",
      question: "In a rectangular open channel of width b carrying discharge Q, what is the critical depth y_c?",
      options: ["(q^2 / g)^(1/3)", "(q / g)^(1/2)", "(q^2 / g)^(1/2)", "(Q / g)^(1/3)"],
      correctIndex: 0,
      explanation: "For a rectangular channel with unit discharge q = Q/b, critical flow occurs when Froude number Fr = 1, giving y_c = (q^2 / g)^(1/3).",
      topic: "Critical Flow in Channels",
      difficulty: "Easy",
      subject: "Fluid Mechanics & Hydraulics",
      branch: "Civil Engineering"
    },
    {
      id: "gate_ce_fm_2",
      question: "In a hydraulic jump in a horizontal rectangular channel, the initial Froude number is Fr1 = 4.0. The jump is classified as:",
      options: ["Steady jump", "Oscillating jump", "Weak jump", "Strong jump"],
      correctIndex: 0,
      explanation: "Hydraulic jumps with 2.5 <= Fr1 < 4.5 are classified as oscillating jumps; 4.5 <= Fr1 < 9.0 are steady jumps.",
      topic: "Hydraulic Jump",
      difficulty: "Hard",
      subject: "Fluid Mechanics & Hydraulics",
      branch: "Civil Engineering"
    },
    {
      id: "gate_ce_fm_3",
      question: "According to Manning's formula, flow velocity V in an open channel is proportional to hydraulic radius R as:",
      options: ["R^(2/3)", "R^(1/2)", "R^(3/2)", "R"],
      correctIndex: 0,
      explanation: "Manning's equation is V = (1/n) * R^(2/3) * S^(1/2). Thus velocity is directly proportional to R^(2/3).",
      topic: "Uniform Flow",
      difficulty: "Easy",
      subject: "Fluid Mechanics & Hydraulics",
      branch: "Civil Engineering"
    }
  ],
  "Environmental Engineering": [
    {
      id: "gate_ce_env_1",
      question: "If 5-day BOD at 20 C is 150 mg/L with deoxygenation constant k = 0.23 /day (base e), what is the ultimate BOD (BOD_u)?",
      options: ["219 mg/L", "180 mg/L", "250 mg/L", "150 mg/L"],
      correctIndex: 0,
      explanation: "BOD5 = BOD_u * (1 - e^(-k * 5)). 150 = BOD_u * (1 - e^(-0.23 * 5)) = BOD_u * (1 - e^(-1.15)) = BOD_u * (1 - 0.3166) = BOD_u * 0.6834 => BOD_u = 150 / 0.6834 = 219.5 mg/L.",
      topic: "BOD Kinetics",
      difficulty: "Medium",
      subject: "Environmental Engineering",
      branch: "Civil Engineering"
    },
    {
      id: "gate_ce_env_2",
      question: "What is the primary objective of adding alum during municipal water treatment?",
      options: ["Coagulation to neutralize colloidal particle surface charges", "Disinfection of bacteria", "Removal of permanent hardness", "Fluoridation"],
      correctIndex: 0,
      explanation: "Alum (aluminum sulfate) acts as a coagulant, hydrolyzing into trivalent cations Al^3+ that destabilize negative colloidal charges so they agglomerate into flocs.",
      topic: "Water Treatment",
      difficulty: "Easy",
      subject: "Environmental Engineering",
      branch: "Civil Engineering"
    }
  ],
  "Transportation Engineering": [
    {
      id: "gate_ce_te_1",
      question: "On a two-lane two-way highway with design speed V = 80 km/h, friction f = 0.35, and reaction time t = 2.5 s, what is the Stopping Sight Distance (SSD)?",
      options: ["128 m", "105 m", "150 m", "92 m"],
      correctIndex: 0,
      explanation: "SSD = lag distance + braking distance = (0.278 * V * t) + (V^2 / (254 * f)) = (0.278 * 80 * 2.5) + (80^2 / (254 * 0.35)) = 55.6 + (6400 / 88.9) = 55.6 + 72.0 = 127.6 m approx 128 m.",
      topic: "Geometric Design",
      difficulty: "Medium",
      subject: "Transportation Engineering",
      branch: "Civil Engineering"
    },
    {
      id: "gate_ce_te_2",
      question: "According to IRC guidelines, what is the maximum allowable superelevation e on plain and rolling terrain?",
      options: ["7% (0.07)", "10% (0.10)", "4% (0.04)", "12% (0.12)"],
      correctIndex: 0,
      explanation: "IRC:73 specifies a maximum superelevation of 7% for plain and rolling terrain, and 10% for hilly roads not bound by snow.",
      topic: "Highway Superelevation",
      difficulty: "Easy",
      subject: "Transportation Engineering",
      branch: "Civil Engineering"
    }
  ],
  "Surveying": [
    {
      id: "gate_ce_sur_1",
      question: "In differential levelling, if the backsight BS on benchmark BM (RL = 100.000 m) is 1.450 m, what is the Height of Instrument (HI)?",
      options: ["101.450 m", "98.550 m", "100.000 m", "102.900 m"],
      correctIndex: 0,
      explanation: "Height of Instrument HI = RL of benchmark + Backsight = 100.000 + 1.450 = 101.450 m.",
      topic: "Levelling",
      difficulty: "Easy",
      subject: "Surveying",
      branch: "Civil Engineering"
    },
    {
      id: "gate_ce_sur_2",
      question: "Simpson's 1/3 rule for area computation assumes that the boundary between ordinates is:",
      options: ["A second-degree parabolic arc", "A straight line", "A cubic spline", "A circular arc"],
      correctIndex: 0,
      explanation: "Simpson's rule approximates the boundary curve across consecutive pairs of strips as a parabola of degree 2 (quadratic polynomial).",
      topic: "Area & Earthwork Computation",
      difficulty: "Medium",
      subject: "Surveying",
      branch: "Civil Engineering"
    }
  ]
};

// ============================================================================
// 1D. ELECTRICAL ENGINEERING (EE) QUESTION BANK
// ============================================================================

export const GATE_EE_QUESTIONS_BANK: Record<string, GateQuestion[]> = {
  "Circuit Theory": [
    {
      id: "gate_ee_ct_1",
      question: "For maximum power transfer from a source with internal impedance Z_s = 4 + j3 ohms, what must be the load impedance Z_L?",
      options: ["4 - j3 ohms", "4 + j3 ohms", "5 ohms resistive", "-4 - j3 ohms"],
      correctIndex: 0,
      explanation: "By the Maximum Power Transfer theorem for AC circuits, the load impedance must be the complex conjugate of the source Thevenin impedance: Z_L = Z_s* = 4 - j3 ohms.",
      topic: "Network Theorems",
      difficulty: "Easy",
      subject: "Circuit Theory",
      branch: "Electrical Engineering"
    },
    {
      id: "gate_ee_ct_2",
      question: "What is the resonant frequency omega_0 of a series RLC circuit with L = 25 mH and C = 10 microfarads?",
      options: ["2000 rad/s", "1000 rad/s", "4000 rad/s", "500 rad/s"],
      correctIndex: 0,
      explanation: "Resonant frequency omega_0 = 1 / sqrt(L * C) = 1 / sqrt(0.025 * 10^-5) = 1 / sqrt(2.5 * 10^-7) = 1 / (5 * 10^-4) = 2000 rad/s.",
      topic: "Resonance",
      difficulty: "Medium",
      subject: "Circuit Theory",
      branch: "Electrical Engineering"
    },
    {
      id: "gate_ee_ct_3",
      question: "In a series RLC circuit at resonance, what is the input impedance?",
      options: ["Purely resistive and equal to R (minimum)", "Zero", "Infinite", "Purely reactive"],
      correctIndex: 0,
      explanation: "At resonance, inductive reactance X_L cancels capacitive reactance X_C (X_L = X_C), making the impedance purely resistive and at its minimum value R.",
      topic: "RLC Resonance",
      difficulty: "Easy",
      subject: "Circuit Theory",
      branch: "Electrical Engineering"
    }
  ],
  "Electrical Machines": [
    {
      id: "gate_ee_em_1",
      question: "What is the synchronous speed N_s of a 4-pole alternator connected to a 50 Hz supply grid?",
      options: ["1500 rpm", "3000 rpm", "1000 rpm", "750 rpm"],
      correctIndex: 0,
      explanation: "N_s = (120 * f) / P = (120 * 50) / 4 = 1500 rpm.",
      topic: "Synchronous Machines",
      difficulty: "Easy",
      subject: "Electrical Machines",
      branch: "Electrical Engineering"
    },
    {
      id: "gate_ee_em_2",
      question: "A 3-phase, 4-pole, 50 Hz induction motor runs at 1440 rpm. What is the rotor slip frequency?",
      options: ["2 Hz", "4 Hz", "50 Hz", "1 Hz"],
      correctIndex: 0,
      explanation: "N_s = 120*50/4 = 1500 rpm. Slip s = (1500 - 1440) / 1500 = 60 / 1500 = 0.04 (4%). Rotor frequency f_r = s * f = 0.04 * 50 = 2 Hz.",
      topic: "Induction Motors",
      difficulty: "Medium",
      subject: "Electrical Machines",
      branch: "Electrical Engineering"
    },
    {
      id: "gate_ee_em_3",
      question: "In a transformer, which test is conducted to determine the core (iron) losses and magnetizing branch parameters?",
      options: ["Open Circuit (OC) test at rated voltage", "Short Circuit (SC) test at rated current", "Sumpner's back-to-back test", "DC resistance test"],
      correctIndex: 0,
      explanation: "The Open Circuit test is performed by applying rated voltage to the low-voltage winding with the high-voltage winding open, measuring no-load core losses.",
      topic: "Transformers",
      difficulty: "Easy",
      subject: "Electrical Machines",
      branch: "Electrical Engineering"
    }
  ],
  "Power Systems": [
    {
      id: "gate_ee_ps_1",
      question: "What causes the Ferranti effect on long transmission lines under light load or no load?",
      options: ["Line charging capacitance drawing leading current", "Skin effect in conductors", "Corona discharge losses", "Inductive reactance voltage drop"],
      correctIndex: 0,
      explanation: "The shunt capacitance of long lines draws leading charging current through the line inductance, causing the receiving end voltage to exceed the sending end voltage.",
      topic: "Transmission Lines & Ferranti Effect",
      difficulty: "Easy",
      subject: "Power Systems",
      branch: "Electrical Engineering"
    },
    {
      id: "gate_ee_ps_2",
      question: "In the swing equation M * (d^2 delta / dt^2) = P_m - P_e, what does M represent?",
      options: ["Angular momentum / inertia constant of the rotor", "Mutual inductance between stator and rotor", "Mechanical torque", "Magnetizing reactance"],
      correctIndex: 0,
      explanation: "M is the angular momentum (inertia constant) of the rotor: M = (H * S) / (pi * f) in MJ-s/rad.",
      topic: "Power System Stability",
      difficulty: "Medium",
      subject: "Power Systems",
      branch: "Electrical Engineering"
    },
    {
      id: "gate_ee_ps_3",
      question: "What is the Surge Impedance Loading (SIL) of a 400 kV transmission line with surge impedance Z_c = 400 ohms?",
      options: ["400 MW", "1000 MW", "160 MW", "800 MW"],
      correctIndex: 0,
      explanation: "SIL = V_L^2 / Z_c = (400 kV)^2 / 400 ohms = 160,000 / 400 = 400 MW.",
      topic: "Surge Impedance Loading",
      difficulty: "Hard",
      subject: "Power Systems",
      branch: "Electrical Engineering"
    }
  ],
  "Control Systems": [
    {
      id: "gate_ee_cs_1",
      question: "A unity feedback system has open-loop transfer function G(s) = 25 / (s * (s + 6)). What is the damping ratio zeta?",
      options: ["0.60", "0.50", "0.707", "0.80"],
      correctIndex: 0,
      explanation: "Closed-loop characteristic equation: s^2 + 6s + 25 = 0. Comparing with s^2 + 2*zeta*omega_n*s + omega_n^2 = 0: omega_n = 5. 2*zeta*5 = 6 => zeta = 6 / 10 = 0.60.",
      topic: "Time Response Analysis",
      difficulty: "Medium",
      subject: "Control Systems",
      branch: "Electrical Engineering"
    },
    {
      id: "gate_ee_cs_2",
      question: "According to the Routh-Hurwitz criterion, a system with characteristic equation s^3 + 2s^2 + 4s + 8 = 0 has how many roots on the imaginary axis (j*omega)?",
      options: ["2 roots (marginal stability)", "0 roots", "1 root", "3 roots"],
      correctIndex: 0,
      explanation: "First column elements: s^3: 1, s^2: 2, s^1: (2*4 - 1*8)/2 = 0 (entire row of zeros). Auxiliary equation A(s) = 2s^2 + 8 = 0 => s = +- j2. Exactly 2 roots lie on the j*omega axis.",
      topic: "Routh-Hurwitz Stability",
      difficulty: "Hard",
      subject: "Control Systems",
      branch: "Electrical Engineering"
    }
  ],
  "Power Electronics": [
    {
      id: "gate_ee_pe_1",
      question: "In a buck DC-DC converter with input voltage V_s = 24 V and duty cycle D = 0.40 in continuous conduction mode, what is the output voltage V_o?",
      options: ["9.6 V", "14.4 V", "60.0 V", "12.0 V"],
      correctIndex: 0,
      explanation: "For an ideal buck converter in CCM, V_o = D * V_s = 0.40 * 24 V = 9.6 V.",
      topic: "DC-DC Converters",
      difficulty: "Easy",
      subject: "Power Electronics",
      branch: "Electrical Engineering"
    },
    {
      id: "gate_ee_pe_2",
      question: "What is the fundamental difference between the latching current and holding current of a thyristor (SCR)?",
      options: ["Latching current is associated with turn-on, holding current is associated with turn-off (I_latching > I_holding)", "Holding current is associated with turn-on only", "Latching current is smaller than holding current", "They are identical in magnitude"],
      correctIndex: 0,
      explanation: "Latching current is the minimum anode current required to maintain conduction immediately after gate trigger pulse removal. Holding current is the minimum anode current below which SCR turns off. Typically I_L is 2-3 times I_H.",
      topic: "Thyristors & SCRs",
      difficulty: "Medium",
      subject: "Power Electronics",
      branch: "Electrical Engineering"
    }
  ]
};

// ============================================================================
// 1E. ELECTRONICS & COMMUNICATION ENGINEERING (ECE) QUESTION BANK
// ============================================================================

export const GATE_ECE_QUESTIONS_BANK: Record<string, GateQuestion[]> = {
  "Analog Circuits": [
    {
      id: "gate_ece_ac_1",
      question: "In an inverting op-amp amplifier with input resistor R1 = 10 kOhm and feedback resistor Rf = 100 kOhm, what is the closed-loop voltage gain?",
      options: ["-10", "+10", "-11", "+11"],
      correctIndex: 0,
      explanation: "For an ideal inverting op-amp configuration, closed-loop voltage gain A_v = -Rf / R1 = -100k / 10k = -10.",
      topic: "Op-Amp Circuits",
      difficulty: "Easy",
      subject: "Analog Circuits",
      branch: "Electronics & Communication Engineering"
    },
    {
      id: "gate_ece_ac_2",
      question: "According to the Barkhausen criterion for sustained sinusoidal oscillations, what must the loop gain |A * beta| and loop phase shift be?",
      options: ["|A * beta| = 1 and phase shift = 0 or 360 deg", "|A * beta| < 1 and phase shift = 180 deg", "|A * beta| > 1 and phase shift = 90 deg", "|A * beta| = 0 and phase shift = 0 deg"],
      correctIndex: 0,
      explanation: "The Barkhausen criteria require unity loop magnitude (|A*beta| = 1) and net phase shift of 0 deg (or 360 deg) around the loop at the oscillation frequency.",
      topic: "Oscillators",
      difficulty: "Medium",
      subject: "Analog Circuits",
      branch: "Electronics & Communication Engineering"
    },
    {
      id: "gate_ece_ac_3",
      question: "An op-amp has a differential gain A_d = 10^5 and a Common Mode Rejection Ratio CMRR = 80 dB. What is its common-mode gain A_cm?",
      options: ["10", "1", "0.1", "100"],
      correctIndex: 0,
      explanation: "CMRR(dB) = 20 * log10(A_d / A_cm) = 80 dB => A_d / A_cm = 10^(80/20) = 10^4. Since A_d = 10^5, A_cm = 10^5 / 10^4 = 10.",
      topic: "Differential Amplifiers & CMRR",
      difficulty: "Hard",
      subject: "Analog Circuits",
      branch: "Electronics & Communication Engineering"
    }
  ],
  "Digital Circuits": [
    {
      id: "gate_ece_dc_1",
      question: "How many 2-to-1 multiplexers are required to construct an 8-to-1 multiplexer?",
      options: ["7", "4", "8", "3"],
      correctIndex: 0,
      explanation: "A tree structure needs 4 MUXes in the first stage, 2 in the second, and 1 in the final stage: 4 + 2 + 1 = 7 MUXes.",
      topic: "Multiplexers",
      difficulty: "Easy",
      subject: "Digital Circuits",
      branch: "Electronics & Communication Engineering"
    },
    {
      id: "gate_ece_dc_2",
      question: "A D flip-flop has setup time t_setup = 2 ns and propagation delay t_cq = 3 ns. For a combinational logic delay of t_comb = 5 ns, what is the minimum clock period T_clk?",
      options: ["10 ns", "7 ns", "8 ns", "5 ns"],
      correctIndex: 0,
      explanation: "Minimum clock period T_clk >= t_cq + t_comb + t_setup = 3 ns + 5 ns + 2 ns = 10 ns (maximum operating frequency = 100 MHz).",
      topic: "Flip-Flop Timing & Setup",
      difficulty: "Medium",
      subject: "Digital Circuits",
      branch: "Electronics & Communication Engineering"
    },
    {
      id: "gate_ece_dc_3",
      question: "How many states are in the state diagram of a 4-bit Johnson (twisted ring) counter?",
      options: ["8 states", "16 states", "4 states", "7 states"],
      correctIndex: 0,
      explanation: "An n-bit Johnson counter uses n flip-flops and counts through 2*n distinct states. For n = 4, number of states = 2 * 4 = 8.",
      topic: "Counters & Sequential Circuits",
      difficulty: "Hard",
      subject: "Digital Circuits",
      branch: "Electronics & Communication Engineering"
    }
  ],
  "Communication Systems": [
    {
      id: "gate_ece_comm_1",
      question: "According to Shannon's channel capacity theorem C = B * log2(1 + SNR), what happens to capacity if channel bandwidth B is doubled while SNR remains unchanged?",
      options: ["Capacity C doubles", "Capacity C quadruples", "Capacity C increases logarithmically", "Capacity remains unchanged"],
      correctIndex: 0,
      explanation: "Channel capacity C is directly linear with bandwidth B when SNR is fixed: C2 = 2 * B * log2(1 + SNR) = 2 * C1.",
      topic: "Information Theory",
      difficulty: "Easy",
      subject: "Communication Systems",
      branch: "Electronics & Communication Engineering"
    },
    {
      id: "gate_ece_comm_2",
      question: "An AM signal has carrier power P_c = 100 W and modulation index mu = 0.80. What is the total transmitted power P_t?",
      options: ["132 W", "164 W", "180 W", "116 W"],
      correctIndex: 0,
      explanation: "Total AM power P_t = P_c * (1 + mu^2 / 2) = 100 * (1 + 0.64 / 2) = 100 * 1.32 = 132 W.",
      topic: "Amplitude Modulation",
      difficulty: "Medium",
      subject: "Communication Systems",
      branch: "Electronics & Communication Engineering"
    },
    {
      id: "gate_ece_comm_3",
      question: "According to Carson's rule, what is the transmission bandwidth of an FM signal with frequency deviation Delta f = 75 kHz and message bandwidth f_m = 15 kHz?",
      options: ["180 kHz", "150 kHz", "90 kHz", "210 kHz"],
      correctIndex: 0,
      explanation: "Carson's rule: Bandwidth = 2 * (Delta f + f_m) = 2 * (75 + 15) = 2 * 90 = 180 kHz.",
      topic: "Frequency Modulation",
      difficulty: "Hard",
      subject: "Communication Systems",
      branch: "Electronics & Communication Engineering"
    }
  ],
  "Electromagnetics": [
    {
      id: "gate_ece_em_1",
      question: "What is the intrinsic wave impedance eta_0 of free space (vacuum)?",
      options: ["377 ohms (120*pi)", "50 ohms", "75 ohms", "0 ohms"],
      correctIndex: 0,
      explanation: "eta_0 = sqrt(mu_0 / epsilon_0) = sqrt((4*pi*10^-7) / (8.854*10^-12)) approx 120*pi approx 376.73 ohms (377 ohms).",
      topic: "Plane Waves",
      difficulty: "Easy",
      subject: "Electromagnetics",
      branch: "Electronics & Communication Engineering"
    },
    {
      id: "gate_ece_em_2",
      question: "A lossless transmission line with characteristic impedance Z_0 = 50 ohms is terminated in a load Z_L = 150 ohms. What is the voltage reflection coefficient Gamma?",
      options: ["0.50", "0.33", "0.25", "-0.50"],
      correctIndex: 0,
      explanation: "Gamma = (Z_L - Z_0) / (Z_L + Z_0) = (150 - 50) / (150 + 50) = 100 / 200 = 0.50.",
      topic: "Transmission Lines",
      difficulty: "Medium",
      subject: "Electromagnetics",
      branch: "Electronics & Communication Engineering"
    }
  ]
};

// ============================================================================
// 1F. CHEMICAL ENGINEERING (CH) QUESTION BANK
// ============================================================================

export const GATE_CH_QUESTIONS_BANK: Record<string, GateQuestion[]> = {
  "Chemical Thermodynamics": [
    {
      id: "gate_ch_ct_1",
      question: "According to Raoult's law for an ideal binary solution at 100 C, component A has vapour pressure P_A^sat = 150 kPa and B has P_B^sat = 50 kPa. What is the bubble point pressure of a liquid with mole fraction x_A = 0.40?",
      options: ["90 kPa", "100 kPa", "110 kPa", "80 kPa"],
      correctIndex: 0,
      explanation: "Bubble point total pressure P = x_A * P_A^sat + x_B * P_B^sat = (0.40 * 150) + (0.60 * 50) = 60 + 30 = 90 kPa.",
      topic: "Vapour-Liquid Equilibrium",
      difficulty: "Easy",
      subject: "Chemical Thermodynamics",
      branch: "Chemical Engineering"
    },
    {
      id: "gate_ch_ct_2",
      question: "Which thermodynamic relationship connects the activity coefficients and mole fractions of components in a multicomponent mixture at constant T and P?",
      options: ["Gibbs-Duhem equation", "Clapeyron equation", "Maxwell relation", "Van der Waals equation"],
      correctIndex: 0,
      explanation: "The Gibbs-Duhem equation sum(x_i * d(ln gamma_i)) = 0 at constant T and P imposes thermodynamic consistency on activity coefficients.",
      topic: "Phase Equilibria & Activity",
      difficulty: "Medium",
      subject: "Chemical Thermodynamics",
      branch: "Chemical Engineering"
    }
  ],
  "Fluid Mechanics": [
    {
      id: "gate_ch_fm_1",
      question: "In packed bed flow, which equation describes the pressure drop across the bed for both laminar and turbulent regimes?",
      options: ["Ergun equation", "Kozeny-Carman equation", "Burke-Plummer equation", "Hagen-Poiseuille equation"],
      correctIndex: 0,
      explanation: "The Ergun equation combines the viscous Kozeny-Carman term (laminar) with the kinetic Burke-Plummer term (turbulent) into a single unified equation.",
      topic: "Packed Bed Flow",
      difficulty: "Easy",
      subject: "Fluid Mechanics",
      branch: "Chemical Engineering"
    },
    {
      id: "gate_ch_fm_2",
      question: "What is the primary cause of cavitation in a centrifugal process pump?",
      options: ["Available NPSH falls below required NPSH (pressure drops below vapour pressure)", "High discharge pressure", "Over-lubrication of bearings", "Air binding"],
      correctIndex: 0,
      explanation: "When NPSH_a < NPSH_r, local pressure at the impeller eye drops below the liquid's saturation vapour pressure, creating vapor cavities that violently collapse.",
      topic: "Pumps & Cavitation",
      difficulty: "Medium",
      subject: "Fluid Mechanics",
      branch: "Chemical Engineering"
    }
  ],
  "Heat Transfer": [
    {
      id: "gate_ch_ht_1",
      question: "What is the Dittus-Boelter correlation used to predict in chemical process heat transfer?",
      options: ["Nusselt number Nu for fully developed turbulent pipe flow", "Fanning friction factor", "LMTD correction factor", "Radiation emissive power"],
      correctIndex: 0,
      explanation: "Nu = 0.023 * Re^0.8 * Pr^n (n = 0.4 for heating, 0.3 for cooling) predicts forced convection Nusselt number in turbulent pipe flow.",
      topic: "Convective Heat Transfer",
      difficulty: "Medium",
      subject: "Heat Transfer",
      branch: "Chemical Engineering"
    },
    {
      id: "gate_ch_ht_2",
      question: "In a double-pipe heat exchanger, if the inner pipe diameter is d and length is L, how is the overall heat transfer coefficient U_o related to total heat duty Q?",
      options: ["Q = U_o * A_o * LMTD", "Q = U_o * A_o / LMTD", "Q = U_o * (T_h - T_c)", "Q = U_o^2 * A_o"],
      correctIndex: 0,
      explanation: "Total heat transfer Q = U * A * Delta T_lm, where U is overall heat transfer coefficient and Delta T_lm is the log mean temperature difference.",
      topic: "Heat Exchangers",
      difficulty: "Easy",
      subject: "Heat Transfer",
      branch: "Chemical Engineering"
    }
  ],
  "Chemical Reaction Engineering": [
    {
      id: "gate_ch_cre_1",
      question: "For an isothermal liquid-phase first-order irreversible reaction A -> B with rate constant k = 0.1 /min, what is the CSTR space time tau required for 50% conversion (X = 0.50)?",
      options: ["10 min", "5 min", "6.93 min", "20 min"],
      correctIndex: 0,
      explanation: "For a CSTR with first-order kinetics: tau = X / (k * (1 - X)) = 0.50 / (0.1 * (1 - 0.50)) = 0.50 / 0.05 = 10 min.",
      topic: "CSTR Design & Kinetics",
      difficulty: "Easy",
      subject: "Chemical Reaction Engineering",
      branch: "Chemical Engineering"
    },
    {
      id: "gate_ch_cre_2",
      question: "For identical feed rate, reaction kinetics, and conversion X > 0, how does the required volume of a Plug Flow Reactor (PFR) compare to a CSTR for positive-order reactions?",
      options: ["V_PFR < V_CSTR strictly", "V_PFR > V_CSTR", "V_PFR = V_CSTR", "V_PFR is double V_CSTR"],
      correctIndex: 0,
      explanation: "Because reactant concentration drops immediately to the exit value inside a CSTR, the reaction rate is at its minimum throughout, requiring a larger volume than a PFR.",
      topic: "Reactor Comparisons",
      difficulty: "Medium",
      subject: "Chemical Reaction Engineering",
      branch: "Chemical Engineering"
    }
  ]
};

// ============================================================================
// 1G. INSTRUMENTATION ENGINEERING (IN) QUESTION BANK
// ============================================================================

export const GATE_IN_QUESTIONS_BANK: Record<string, GateQuestion[]> = {
  "Sensors and Industrial Instrumentation": [
    {
      id: "gate_in_sen_1",
      question: "A metal strain gauge has an initial resistance R = 120 ohms and gauge factor GF = 2.0. Under strain epsilon = 1000 microstrain, what is the resistance change Delta R?",
      options: ["0.24 ohms", "0.12 ohms", "2.40 ohms", "0.48 ohms"],
      correctIndex: 0,
      explanation: "Delta R / R = GF * epsilon => Delta R = 120 * 2.0 * (1000 * 10^-6) = 240 * 10^-3 = 0.24 ohms.",
      topic: "Strain Gauges & Transducers",
      difficulty: "Easy",
      subject: "Sensors and Industrial Instrumentation",
      branch: "Instrumentation Engineering"
    },
    {
      id: "gate_in_sen_2",
      question: "What is the primary operating principle of a Linear Variable Differential Transformer (LVDT)?",
      options: ["Mutual inductance variation proportional to core displacement", "Piezoelectric charge generation", "Capacitive dielectric change", "Photoelectric effect"],
      correctIndex: 0,
      explanation: "An LVDT consists of one primary and two identical secondary windings connected in series opposition. Moving the permeable core varies mutual coupling, giving differential AC voltage output.",
      topic: "Displacement Transducers",
      difficulty: "Easy",
      subject: "Sensors and Industrial Instrumentation",
      branch: "Instrumentation Engineering"
    },
    {
      id: "gate_in_sen_3",
      question: "What is the Callendar-Van Dusen equation used to model in industrial instrumentation?",
      options: ["Resistance vs temperature relationship of an RTD (Pt100)", "Thermocouple Seebeck voltage", "LVDT phase lag", "Piezoelectric frequency response"],
      correctIndex: 0,
      explanation: "The Callendar-Van Dusen equation describes the resistance R(T) = R0 * (1 + A*T + B*T^2 + C*(T-100)*T^3) of platinum resistance thermometers.",
      topic: "Temperature Sensors",
      difficulty: "Medium",
      subject: "Sensors and Industrial Instrumentation",
      branch: "Instrumentation Engineering"
    },
    {
      id: "gate_in_sen_4",
      question: "What is the fundamental limitation of piezoelectric transducers when measuring physical quantities?",
      options: ["Cannot measure purely static (DC) pressures/forces", "High power consumption", "Low frequency cutoff above 100 kHz", "Fragile under high temperature"],
      correctIndex: 0,
      explanation: "Piezoelectric elements generate electric charge across their crystal capacitance. Under static load, the charge leaks away through finite internal resistance, rendering static measurements impossible.",
      topic: "Piezoelectric Sensors",
      difficulty: "Hard",
      subject: "Sensors and Industrial Instrumentation",
      branch: "Instrumentation Engineering"
    }
  ],
  "Measurements": [
    {
      id: "gate_in_meas_1",
      question: "Which AC bridge is specifically suited for measuring the self-inductance of medium-Q coils (1 < Q < 10)?",
      options: ["Maxwell's Inductance-Capacitance bridge", "Hay's bridge", "Anderson's bridge", "Wien's bridge"],
      correctIndex: 0,
      explanation: "Maxwell's inductance-capacitance bridge is optimal for medium-Q coils because balance is independent of frequency. Hay's bridge is preferred for high-Q coils (Q > 10).",
      topic: "AC Bridges",
      difficulty: "Easy",
      subject: "Measurements",
      branch: "Instrumentation Engineering"
    },
    {
      id: "gate_in_meas_2",
      question: "In a dual-slope integrating Analog-to-Digital Converter (ADC), why is conversion accuracy independent of clock frequency and integrator RC values?",
      options: ["Integrator RC and clock frequency cancel out in the ratio of run-up and run-down times", "The integrator operates without capacitors", "Uses successive approximation logic", "Operates purely open-loop"],
      correctIndex: 0,
      explanation: "Run-up integral gives V_peak = (V_in * T1) / (R*C). Run-down integrates reference: V_peak = (V_ref * T2) / (R*C). Equating them gives T2 = (V_in / V_ref) * T1. R, C, and clock rate cancel completely.",
      topic: "Analog-to-Digital Converters",
      difficulty: "Medium",
      subject: "Measurements",
      branch: "Instrumentation Engineering"
    },
    {
      id: "gate_in_meas_3",
      question: "A Wheatstone bridge has four equal arms of resistance R = 100 ohms supplied by 10 V. When one arm increases by Delta R = 2 ohms, what is the open-circuit output voltage?",
      options: ["0.05 V (50 mV)", "0.10 V (100 mV)", "0.20 V", "0.025 V"],
      correctIndex: 0,
      explanation: "Output voltage V_out approx (V_s / 4) * (Delta R / R) = (10 / 4) * (2 / 100) = 2.5 * 0.02 = 0.050 V = 50 mV.",
      topic: "Bridge Circuits & Error Analysis",
      difficulty: "Hard",
      subject: "Measurements",
      branch: "Instrumentation Engineering"
    }
  ]
};

// ============================================================================
// 1H. BIOTECHNOLOGY (BT) QUESTION BANK
// ============================================================================

export const GATE_BT_QUESTIONS_BANK: Record<string, GateQuestion[]> = {
  "Bioprocess Engineering": [
    {
      id: "gate_bt_bp_1",
      question: "In microbial cell growth modeled by the Monod equation mu = mu_max * S / (K_s + S), what does substrate concentration S equal when specific growth rate mu = mu_max / 2?",
      options: ["K_s", "2 * K_s", "K_s / 2", "Zero"],
      correctIndex: 0,
      explanation: "By definition of the Monod saturation constant K_s, it represents the substrate concentration at which the specific growth rate is exactly half of the maximum growth rate mu_max.",
      topic: "Monod Growth Kinetics",
      difficulty: "Easy",
      subject: "Bioprocess Engineering",
      branch: "Biotechnology"
    },
    {
      id: "gate_bt_bp_2",
      question: "In a continuous chemostat fermenter at steady state without cell death, the specific microbial growth rate mu is identically equal to:",
      options: ["Dilution rate D (F / V)", "mu_max strictly", "Zero", "Biomass yield Y_xs"],
      correctIndex: 0,
      explanation: "Mass balance on biomass in a well-mixed chemostat at steady state: dX/dt = mu*X - D*X = 0 => (mu - D)*X = 0 => mu = D, where D = Flow rate F / Volume V.",
      topic: "Chemostat Operation",
      difficulty: "Medium",
      subject: "Bioprocess Engineering",
      branch: "Biotechnology"
    },
    {
      id: "gate_bt_bp_3",
      question: "If a bacterial culture doubles in population every 30 minutes, what is its specific growth rate mu?",
      options: ["1.386 /h", "2.000 /h", "0.693 /h", "0.023 /h"],
      correctIndex: 0,
      explanation: "Doubling time t_d = ln(2) / mu. Here t_d = 0.5 hours. mu = 0.69315 / 0.5 h = 1.386 /h.",
      topic: "Cell Growth Kinetics",
      difficulty: "Medium",
      subject: "Bioprocess Engineering",
      branch: "Biotechnology"
    },
    {
      id: "gate_bt_bp_4",
      question: "What is the volumetric oxygen mass transfer coefficient k_L*a used to evaluate in aerobic fermenters?",
      options: ["Rate of oxygen transfer from gas bubbles into liquid fermentation broth", "Agitator power draw in water", "Sterilization thermal death kinetics", "Downstream centrifugation speed"],
      correctIndex: 0,
      explanation: "The volumetric oxygen transfer rate OTR = k_L*a * (C* - C_L), characterizing the efficiency of oxygenation in high-density aerobic fermentations.",
      topic: "Aeration & Mass Transfer",
      difficulty: "Hard",
      subject: "Bioprocess Engineering",
      branch: "Biotechnology"
    }
  ],
  "Molecular Biology and Genetics": [
    {
      id: "gate_bt_mb_1",
      question: "During DNA replication in E. coli, which enzyme synthesizes the short RNA primer required by DNA polymerase III to initiate strand elongation?",
      options: ["DNA Primase (DnaG)", "DNA Polymerase I", "DNA Ligase", "DNA Helicase (DnaB)"],
      correctIndex: 0,
      explanation: "DNA primase (encoded by dnaG) synthesizes short ~10-12 nucleotide RNA primers complementary to the DNA template, providing the 3'-OH end needed by DNA Pol III.",
      topic: "DNA Replication",
      difficulty: "Easy",
      subject: "Molecular Biology and Genetics",
      branch: "Biotechnology"
    },
    {
      id: "gate_bt_mb_2",
      question: "Starting with a single double-stranded DNA template molecule, how many amplicon molecules are produced after 20 cycles of an ideal Polymerase Chain Reaction (PCR)?",
      options: ["2^20 (approx 1,048,576)", "20 * 2 = 40", "2^10", "10^6"],
      correctIndex: 0,
      explanation: "In an ideal PCR where efficiency is 100%, the number of DNA molecules doubles every thermal cycle: N = N0 * 2^n. With N0 = 1 and n = 20, N = 2^20 = 1,048,576.",
      topic: "PCR Amplification",
      difficulty: "Easy",
      subject: "Molecular Biology and Genetics",
      branch: "Biotechnology"
    },
    {
      id: "gate_bt_mb_3",
      question: "Which of the following is a Type II restriction endonuclease that produces cohesive ('sticky') 5'-overhangs?",
      options: ["EcoRI (G^AATTC)", "SmaI (CCC^GGG)", "EcoRV (GAT^ATC)", "HaeIII (GG^CC)"],
      correctIndex: 0,
      explanation: "EcoRI recognizes 5'-G|AATTC-3' and cleaves between G and A, producing 5'-AATT cohesive overhangs. SmaI, EcoRV, and HaeIII generate blunt ends.",
      topic: "Recombinant DNA Technology",
      difficulty: "Medium",
      subject: "Molecular Biology and Genetics",
      branch: "Biotechnology"
    }
  ]
};

// ============================================================================
// 1I. ENGINEERING SCIENCES (XE) QUESTION BANK
// ============================================================================

export const GATE_XE_QUESTIONS_BANK: Record<string, GateQuestion[]> = {
  "Fluid Mechanics (XE-B)": [
    {
      id: "gate_xe_fm_1",
      question: "For a 2D incompressible flow, if the stream function is psi = 3*x^2*y - y^3, does the flow satisfy the continuity equation?",
      options: ["Yes, identically satisfies the 2D incompressible continuity equation", "No, div(V) is non-zero", "Only at the origin (0,0)", "Only if vorticity is zero"],
      correctIndex: 0,
      explanation: "Velocity components defined from stream function are u = dpsi/dy = 3x^2 - 3y^2, v = -dpsi/dx = -6xy. Divergence = du/dx + dv/dy = 6x - 6x = 0. Continuity is satisfied everywhere.",
      topic: "Stream Function & Continuity",
      difficulty: "Easy",
      subject: "Fluid Mechanics (XE-B)",
      branch: "Engineering Sciences"
    },
    {
      id: "gate_xe_fm_2",
      question: "In laminar flow past a flat plate, what is the displacement thickness delta* in terms of boundary layer thickness delta according to Blasius profile?",
      options: ["delta* approx 0.344 * delta", "delta* = delta / 2", "delta* = delta", "delta* = delta / 8"],
      correctIndex: 0,
      explanation: "For the Blasius boundary layer profile, displacement thickness delta* = 1.72 * x / sqrt(Re_x), while delta = 5.0 * x / sqrt(Re_x), giving delta* / delta = 1.72 / 5.0 approx 0.344.",
      topic: "Boundary Layer Displacement",
      difficulty: "Hard",
      subject: "Fluid Mechanics (XE-B)",
      branch: "Engineering Sciences"
    },
    {
      id: "gate_xe_fm_3",
      question: "What is the relation between total head H and discharge Q for a free liquid jet issuing from an orifice of area A_o under head H?",
      options: ["Q = C_d * A_o * sqrt(2 * g * H)", "Q = C_d * A_o * 2 * g * H", "Q = C_d * A_o * H^2", "Q = C_d * A_o * (2*g*H)^2"],
      correctIndex: 0,
      explanation: "By Torricelli's theorem, theoretical velocity v = sqrt(2*g*H). Real discharge accounts for contraction and friction via C_d: Q = C_d * A_o * sqrt(2*g*H).",
      topic: "Torricelli Jet Flow",
      difficulty: "Medium",
      subject: "Fluid Mechanics (XE-B)",
      branch: "Engineering Sciences"
    }
  ],
  "Materials Science (XE-C)": [
    {
      id: "gate_xe_mat_1",
      question: "What is the Atomic Packing Factor (APF) of a Face-Centered Cubic (FCC) crystal structure with hard-sphere atoms?",
      options: ["0.74 (74%)", "0.68 (68%)", "0.52 (52%)", "0.34 (34%)"],
      correctIndex: 0,
      explanation: "An FCC unit cell contains 4 effective atoms of radius r with lattice parameter a = 2*sqrt(2)*r. APF = (4 * 4/3*pi*r^3) / (a^3) = pi / (3 * sqrt(2)) = 0.74 (74%).",
      topic: "Crystal Structures & APF",
      difficulty: "Easy",
      subject: "Materials Science (XE-C)",
      branch: "Engineering Sciences"
    },
    {
      id: "gate_xe_mat_2",
      question: "According to Bragg's law of X-ray diffraction, what is the relation between interplanar spacing d, diffraction angle theta, and wavelength lambda for first-order reflection (n = 1)?",
      options: ["lambda = 2 * d * sin(theta)", "lambda = d * sin(theta)", "2 * lambda = d * cos(theta)", "lambda = 2 * d * cos(theta)"],
      correctIndex: 0,
      explanation: "Bragg's law states that constructive interference occurs when path difference 2 * d * sin(theta) = n * lambda. For n = 1, lambda = 2 * d * sin(theta).",
      topic: "X-Ray Diffraction",
      difficulty: "Medium",
      subject: "Materials Science (XE-C)",
      branch: "Engineering Sciences"
    },
    {
      id: "gate_xe_mat_3",
      question: "The Hall-Petch relationship states that the yield strength sigma_y of a polycrystalline metal varies with average grain diameter d as:",
      options: ["sigma_y = sigma_0 + k_y * d^(-1/2)", "sigma_y = sigma_0 + k_y * d^(1/2)", "sigma_y = sigma_0 + k_y * d", "sigma_y = sigma_0 * d^2"],
      correctIndex: 0,
      explanation: "Hall-Petch grain boundary strengthening equation: sigma_y = sigma_0 + k_y / sqrt(d) = sigma_0 + k_y * d^(-1/2), where smaller grain size increases yield strength.",
      topic: "Grain Strengthening Mechanisms",
      difficulty: "Hard",
      subject: "Materials Science (XE-C)",
      branch: "Engineering Sciences"
    }
  ]
};

// ============================================================================
// 1J. DATA SCIENCE & ARTIFICIAL INTELLIGENCE (DA) QUESTION BANK
// ============================================================================

export const GATE_DA_QUESTIONS_BANK: Record<string, GateQuestion[]> = {
  "Probability and Statistics": [
    {
      id: "gate_da_ps_1",
      question: "In a medical screening test, a disease has 1% prevalence. The test has 95% sensitivity (true positive rate) and 5% false positive rate. What is the probability that a person who tests positive actually has the disease?",
      options: ["16.1%", "95.0%", "50.0%", "5.0%"],
      correctIndex: 0,
      explanation: "By Bayes' theorem: P(D|+) = (P(+|D)*P(D)) / [P(+|D)*P(D) + P(+|no D)*P(no D)] = (0.95 * 0.01) / [(0.95 * 0.01) + (0.05 * 0.99)] = 0.0095 / (0.0095 + 0.0495) = 0.0095 / 0.0590 approx 0.161 or 16.1%.",
      topic: "Bayes' Theorem & Inference",
      difficulty: "Hard",
      subject: "Probability and Statistics",
      branch: "Data Science & Artificial Intelligence"
    },
    {
      id: "gate_da_ps_2",
      question: "A random variable X follows a Poisson distribution with parameter lambda = 4. What is the variance Var(X)?",
      options: ["4", "2", "16", "8"],
      correctIndex: 0,
      explanation: "For a Poisson distribution, both the expected value E(X) and the variance Var(X) are identically equal to the rate parameter lambda. Hence Var(X) = 4.",
      topic: "Poisson Distribution",
      difficulty: "Easy",
      subject: "Probability and Statistics",
      branch: "Data Science & Artificial Intelligence"
    },
    {
      id: "gate_da_ps_3",
      question: "What does the Central Limit Theorem (CLT) state regarding the distribution of the sample mean of n independent and identically distributed random variables with finite variance?",
      options: ["Approaches a Normal distribution as n -> infinity, regardless of the underlying population distribution", "Remains identical to the population distribution", "Converges to a Uniform distribution", "Requires the population to be Gaussian strictly"],
      correctIndex: 0,
      explanation: "CLT guarantees that the normalized sum and sample mean converge in distribution to a Gaussian normal distribution N(mu, sigma^2/n) as sample size n grows large.",
      topic: "Central Limit Theorem",
      difficulty: "Medium",
      subject: "Probability and Statistics",
      branch: "Data Science & Artificial Intelligence"
    }
  ],
  "Machine Learning": [
    {
      id: "gate_da_ml_1",
      question: "What is the primary difference between L1 (Lasso) and L2 (Ridge) regularization in linear models?",
      options: ["L1 induces sparsity by driving unimportant feature weights to exactly zero", "L2 sets feature weights to exactly zero", "L1 regularization has no geometric penalty", "L2 cannot be used with gradient descent"],
      correctIndex: 0,
      explanation: "L1 regularization uses the absolute value penalty ||w||_1 whose diamond constraint geometry intersects contours at axes, producing exact zeros (feature selection). L2 uses a spherical ||w||_2^2 penalty, shrinking weights toward zero without setting them to exact zero.",
      topic: "Regularization & Sparsity",
      difficulty: "Medium",
      subject: "Machine Learning",
      branch: "Data Science & Artificial Intelligence"
    },
    {
      id: "gate_da_ml_2",
      question: "In a binary classification problem, if True Positives = 80, False Positives = 20, False Negatives = 10, what is the Precision of the model?",
      options: ["80.0% (0.80)", "88.9% (0.89)", "72.7% (0.73)", "90.0% (0.90)"],
      correctIndex: 0,
      explanation: "Precision = TP / (TP + FP) = 80 / (80 + 20) = 80 / 100 = 0.80 or 80.0%.",
      topic: "Evaluation Metrics",
      difficulty: "Easy",
      subject: "Machine Learning",
      branch: "Data Science & Artificial Intelligence"
    },
    {
      id: "gate_da_ml_3",
      question: "In Support Vector Machines (SVM), which data points define the maximum margin separating hyperplane?",
      options: ["Support vectors (points lying exactly on the margin boundaries)", "The centroid of each class", "All interior points", "Outlier noise points"],
      correctIndex: 0,
      explanation: "The decision boundary and margin distance of an SVM depend solely on the support vectors—the critical training examples that lie on the margin boundaries.",
      topic: "Support Vector Machines",
      difficulty: "Easy",
      subject: "Machine Learning",
      branch: "Data Science & Artificial Intelligence"
    },
    {
      id: "gate_da_ml_4",
      question: "What is the Gini impurity for a binary classification node containing 70 positive instances and 30 negative instances?",
      options: ["0.42", "0.21", "0.50", "0.30"],
      correctIndex: 0,
      explanation: "Gini = 1 - (p1^2 + p2^2) = 1 - (0.7^2 + 0.3^2) = 1 - (0.49 + 0.09) = 1 - 0.58 = 0.42.",
      topic: "Decision Trees",
      difficulty: "Hard",
      subject: "Machine Learning",
      branch: "Data Science & Artificial Intelligence"
    }
  ],
  "Artificial Intelligence": [
    {
      id: "gate_da_ai_1",
      question: "For the A* search algorithm on a graph to be guaranteed to find the optimal path, what condition must the heuristic function h(n) satisfy?",
      options: ["Admissibility (h(n) never overestimates true cost to goal)", "Monotonicity only on tree graphs", "Overestimation by a constant factor k", "h(n) = 0 strictly"],
      correctIndex: 0,
      explanation: "A* is optimal if h(n) is admissible (h(n) <= h*(n) for all nodes n, meaning it never overestimates the true remaining cost to the goal). On graphs, consistency (monotonicity) also prevents re-opening nodes.",
      topic: "Heuristic Search & A* Optimality",
      difficulty: "Easy",
      subject: "Artificial Intelligence",
      branch: "Data Science & Artificial Intelligence"
    },
    {
      id: "gate_da_ai_2",
      question: "In Minimax adversarial search with Alpha-Beta pruning, when is a branch pruned?",
      options: ["When alpha >= beta", "When alpha < beta", "When beta = 0", "When evaluation function is monotonic"],
      correctIndex: 0,
      explanation: "Alpha represents the minimum score the maximizing player is assured of, and Beta represents the maximum score the minimizing player is assured of. Whenever alpha >= beta, the current path will never be chosen, so pruning occurs.",
      topic: "Alpha-Beta Pruning",
      difficulty: "Medium",
      subject: "Artificial Intelligence",
      branch: "Data Science & Artificial Intelligence"
    }
  ]
};

export const GATE_ALL_BRANCH_QUESTION_BANKS: Record<string, Record<string, GateQuestion[]>> = {
  "Computer Science Engineering": GATE_QUESTIONS_BANK,
  "Mechanical Engineering": GATE_ME_QUESTIONS_BANK,
  "Civil Engineering": GATE_CE_QUESTIONS_BANK,
  "Electrical Engineering": GATE_EE_QUESTIONS_BANK,
  "Electronics & Communication Engineering": GATE_ECE_QUESTIONS_BANK,
  "Chemical Engineering": GATE_CH_QUESTIONS_BANK,
  "Instrumentation Engineering": GATE_IN_QUESTIONS_BANK,
  "Biotechnology": GATE_BT_QUESTIONS_BANK,
  "Engineering Sciences": GATE_XE_QUESTIONS_BANK,
  "Data Science & Artificial Intelligence": GATE_DA_QUESTIONS_BANK
};

// ============================================================================
// 2. PROCEDURAL GATE QUESTION GENERATOR (INFINITE UNSEEN QUESTIONS)
// ============================================================================

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildOptions(correctOpt: string, distractors: string[]): { options: [string, string, string, string]; correctIndex: number } {
  const uniqueDistractors = Array.from(new Set(distractors.filter((d) => d !== correctOpt))).slice(0, 3);
  let v = 1;
  while (uniqueDistractors.length < 3) {
    uniqueDistractors.push(\`Alternative variant \${v++}\`);
  }
  const all = [correctOpt, ...uniqueDistractors];
  const shuffled = shuffleArray(all);
  const correctIndex = shuffled.indexOf(correctOpt);
  return { options: shuffled as [string, string, string, string], correctIndex };
}

export function generateProceduralGateQuestions(
  subject: string,
  difficulty: "Easy" | "Medium" | "Hard",
  count: number,
  excludeNormalizedSet: Set<string>,
  previousTexts: string[] = [],
  branch: string = "Computer Science Engineering"
): GateQuestion[] {
  const results: GateQuestion[] = [];
  let attempts = 0;
  const maxAttempts = Math.max(count * 60, 500);
  const canonBranch = canonicalGateBranch(branch);

  const isExcluded = (qText: string) => {
    const norm = qText.trim().toLowerCase().replace(/\\s+/g, " ");
    if (excludeNormalizedSet.has(norm)) return true;
    if (previousTexts.some((prev) => areQuestionsDuplicate(prev, qText))) return true;
    if (results.some((r) => areQuestionsDuplicate(r.question, qText))) return true;
    return false;
  };

  while (results.length < count && attempts < maxAttempts) {
    attempts++;
    let candidate: GateQuestion | null = null;
    const variantId = \`gate_proc_\${Date.now()}_\${attempts}\`;
    const subLow = subject.toLowerCase();

    // MECHANICAL ENGINEERING PROCEDURAL
    if (canonBranch === "Mechanical Engineering") {
      const type = attempts % 5;
      if (type === 0) {
        const tH = 900 + (attempts * 45) % 300;
        const tL = 300 + (attempts * 25) % 150;
        const eta = Math.round((1 - tL / tH) * 1000) / 10;
        const q = \`A reversible Carnot heat engine operates between reservoirs at \${tH} K and \${tL} K. What is its maximum thermal efficiency?\`;
        if (!isExcluded(q)) {
          const { options, correctIndex } = buildOptions(\`\${eta}%\`, [\`\${Math.round(eta - 12)}%\`, \`\${Math.round(eta + 12)}%\`, \`\${Math.round((tL/tH)*100)}%\`]);
          candidate = { id: variantId, question: q, options, correctIndex, explanation: \`Carnot efficiency = 1 - (TL/TH) = 1 - (\${tL}/\${tH}) = \${eta}%.\`, topic: "Carnot Efficiency", difficulty, subject, branch: canonBranch };
        }
      } else if (type === 1) {
        const re = 600 + (attempts * 150) % 1200;
        const f = Math.round((64 / re) * 10000) / 10000;
        const q = \`For steady laminar flow in a smooth circular pipe with Reynolds number Re = \${re}, what is the Darcy friction factor f?\`;
        if (!isExcluded(q)) {
          const { options, correctIndex } = buildOptions(String(f), [String(Math.round(f * 2 * 10000) / 10000), "0.0250", "0.0400"]);
          candidate = { id: variantId, question: q, options, correctIndex, explanation: \`For laminar pipe flow, f = 64 / Re = 64 / \${re} = \${f}.\`, topic: "Pipe Friction", difficulty, subject, branch: canonBranch };
        }
      } else if (type === 2) {
        const p = 5 + (attempts % 8);
        const l = 2 + (attempts % 4);
        const q = \`A cantilever beam of length \${l} m carries a tip load P = \${p} kN. What is the maximum bending moment in the beam?\`;
        if (!isExcluded(q)) {
          const m = p * l;
          const { options, correctIndex } = buildOptions(\`\${m} kN-m\`, [\`\${m / 2} kN-m\`, \`\${m * 2} kN-m\`, \`\${m + 5} kN-m\`]);
          candidate = { id: variantId, question: q, options, correctIndex, explanation: \`Maximum moment occurs at the fixed support: M = P * L = \${p} * \${l} = \${m} kN-m.\`, topic: "Bending Moment", difficulty, subject, branch: canonBranch };
        }
      } else if (type === 3) {
        const r = 4 + (attempts % 5);
        const q = \`In an ideal Otto cycle with air compression ratio r = \${r} and gamma = 1.4, what is the thermal efficiency?\`;
        if (!isExcluded(q)) {
          const eff = Math.round((1 - 1 / Math.pow(r, 0.4)) * 1000) / 10;
          const { options, correctIndex } = buildOptions(\`\${eff}%\`, [\`\${Math.round(eff - 10)}%\`, \`\${Math.round(eff + 8)}%\`, "50.0%"]);
          candidate = { id: variantId, question: q, options, correctIndex, explanation: \`Otto efficiency = 1 - 1/(r^0.4) = 1 - 1/(\${r}^0.4) = \${eff}%.\`, topic: "Otto Cycle", difficulty, subject, branch: canonBranch };
        }
      } else {
        const kVal = 0.5 + (attempts % 4) * 0.5;
        const hVal = 10 + (attempts % 5) * 5;
        const rCr = Math.round((kVal / hVal) * 1000) / 1000;
        const q = \`For a pipe with insulation thermal conductivity k = \${kVal} W/m-K and ambient convection coefficient h = \${hVal} W/m^2-K, what is the critical radius of insulation?\`;
        if (!isExcluded(q)) {
          const { options, correctIndex } = buildOptions(\`\${rCr} m (\${rCr * 1000} mm)\`, [\`\${rCr * 2} m\`, \`\${rCr / 2} m\`, "0.010 m"]);
          candidate = { id: variantId, question: q, options, correctIndex, explanation: \`Critical radius r_cr = k / h = \${kVal} / \${hVal} = \${rCr} m.\`, topic: "Critical Radius", difficulty, subject, branch: canonBranch };
        }
      }
    }
    // CIVIL ENGINEERING PROCEDURAL
    else if (canonBranch === "Civil Engineering") {
      const type = attempts % 4;
      if (type === 0) {
        const e = Math.round((0.4 + (attempts % 6) * 0.1) * 10) / 10;
        const n = Math.round((e / (1 + e)) * 1000) / 10;
        const q = \`A saturated soil specimen has a void ratio e = \${e}. What is the porosity n of this soil?\`;
        if (!isExcluded(q)) {
          const { options, correctIndex } = buildOptions(\`\${n}%\`, [\`\${Math.round(e * 100)}%\`, \`\${Math.round(n - 10)}%\`, \`\${Math.round(n + 12)}%\`]);
          candidate = { id: variantId, question: q, options, correctIndex, explanation: \`Porosity n = e / (1 + e) = \${e} / \${1 + e} = \${n}%.\`, topic: "Soil Phase Relations", difficulty, subject, branch: canonBranch };
        }
      } else if (type === 1) {
        const phi = 30;
        const ka = "0.333 (1/3)";
        const q = \`For a cohesionless backfill with angle of internal friction phi = \${phi} deg, what is Rankine's coefficient of active earth pressure K_a?\`;
        if (!isExcluded(q)) {
          const { options, correctIndex } = buildOptions(ka, ["0.500", "3.000", "0.667"]);
          candidate = { id: variantId, question: q, options, correctIndex, explanation: \`K_a = (1 - sin(30))/(1 + sin(30)) = (0.5)/(1.5) = 1/3.\`, topic: "Earth Pressure", difficulty, subject, branch: canonBranch };
        }
      } else if (type === 2) {
        const bm = 100.00;
        const bs = 1.250 + (attempts % 4) * 0.150;
        const hi = (bm + bs).toFixed(3);
        const q = \`In levelling, the backsight staff reading on a benchmark of RL = \${bm.toFixed(3)} m is \${bs.toFixed(3)} m. What is the Height of Instrument (HI)?\`;
        if (!isExcluded(q)) {
          const { options, correctIndex } = buildOptions(\`\${hi} m\`, [\`\${(bm - bs).toFixed(3)} m\`, \`\${(bm + bs * 2).toFixed(3)} m\`, "100.000 m"]);
          candidate = { id: variantId, question: q, options, correctIndex, explanation: \`HI = RL + BS = \${bm.toFixed(3)} + \${bs.toFixed(3)} = \${hi} m.\`, topic: "Levelling", difficulty, subject, branch: canonBranch };
        }
      } else {
        const b = 2;
        const d = 4 + (attempts % 3);
        const zP = Math.round((b * d * d / 4) * 10) / 10;
        const zE = Math.round((b * d * d / 6) * 10) / 10;
        const q = \`For a rectangular section of width \${b} m and depth \${d} m, what is the shape factor (Z_p / Z_e)?\`;
        if (!isExcluded(q)) {
          const { options, correctIndex } = buildOptions("1.50", ["1.70", "1.15", "2.00"]);
          candidate = { id: variantId, question: q, options, correctIndex, explanation: \`For any solid rectangular beam, shape factor S = Z_p / Z_e = (bd^2/4) / (bd^2/6) = 1.50.\`, topic: "Plastic Shape Factor", difficulty, subject, branch: canonBranch };
        }
      }
    }
    // ELECTRICAL ENGINEERING PROCEDURAL
    else if (canonBranch === "Electrical Engineering") {
      const type = attempts % 4;
      if (type === 0) {
        const poles = [2, 4, 6, 8][attempts % 4];
        const freq = 50;
        const ns = (120 * freq) / poles;
        const q = \`What is the synchronous speed N_s of a \${poles}-pole synchronous machine connected to a \${freq} Hz AC grid?\`;
        if (!isExcluded(q)) {
          const { options, correctIndex } = buildOptions(\`\${ns} rpm\`, [\`\${ns / 2} rpm\`, \`\${ns * 1.5} rpm\`, \`\${ns - 100} rpm\`]);
          candidate = { id: variantId, question: q, options, correctIndex, explanation: \`N_s = 120 * f / P = 120 * \${freq} / \${poles} = \${ns} rpm.\`, topic: "Synchronous Speed", difficulty, subject, branch: canonBranch };
        }
      } else if (type === 1) {
        const r = 4 + (attempts % 4) * 2;
        const x = 3 + (attempts % 3) * 2;
        const q = \`A source has internal impedance Z_th = \${r} + j\${x} ohms. For maximum power transfer, what must be the load impedance Z_L?\`;
        if (!isExcluded(q)) {
          const { options, correctIndex } = buildOptions(\`\${r} - j\${x} ohms\`, [\`\${r} + j\${x} ohms\`, \`\${r} ohms\`, \`-\${r} - j\${x} ohms\`]);
          candidate = { id: variantId, question: q, options, correctIndex, explanation: \`Z_L must equal the complex conjugate Z_th* = \${r} - j\${x} ohms.\`, topic: "Max Power Transfer", difficulty, subject, branch: canonBranch };
        }
      } else if (type === 2) {
        const d = (0.2 + (attempts % 6) * 0.1).toFixed(2);
        const vs = 48;
        const vo = Math.round(parseFloat(d) * vs * 10) / 10;
        const q = \`In an ideal buck DC-DC converter with supply V_s = \${vs} V operating at duty cycle D = \${d}, what is the output voltage V_o?\`;
        if (!isExcluded(q)) {
          const { options, correctIndex } = buildOptions(\`\${vo} V\`, [\`\${vs} V\`, \`\${vo * 2} V\`, \`\${(vs - vo).toFixed(1)} V\`]);
          candidate = { id: variantId, question: q, options, correctIndex, explanation: \`V_o = D * V_s = \${d} * \${vs} = \${vo} V.\`, topic: "Buck Converter", difficulty, subject, branch: canonBranch };
        }
      } else {
        const wn = 4 + (attempts % 4);
        const zeta = 0.5;
        const q = \`A second order system has characteristic equation s^2 + \${2 * zeta * wn}s + \${wn * wn} = 0. What is its undamped natural frequency omega_n?\`;
        if (!isExcluded(q)) {
          const { options, correctIndex } = buildOptions(\`\${wn} rad/s\`, [\`\${wn * 2} rad/s\`, \`\${wn * wn} rad/s\`, \`\${wn / 2} rad/s\`]);
          candidate = { id: variantId, question: q, options, correctIndex, explanation: \`Comparing with s^2 + 2*zeta*omega_n*s + omega_n^2 = 0, omega_n = sqrt(\${wn*wn}) = \${wn} rad/s.\`, topic: "Control Second Order", difficulty, subject, branch: canonBranch };
        }
      }
    }
    // ECE PROCEDURAL
    else if (canonBranch === "Electronics & Communication Engineering") {
      const type = attempts % 3;
      if (type === 0) {
        const r1 = 10;
        const rf = 50 + (attempts % 5) * 20;
        const gain = -(rf / r1);
        const q = \`In an inverting op-amp configuration with input resistor R1 = \${r1} kOhm and feedback resistor Rf = \${rf} kOhm, what is the closed-loop voltage gain?\`;
        if (!isExcluded(q)) {
          const { options, correctIndex } = buildOptions(String(gain), [String(Math.abs(gain)), String(gain - 1), String(gain + 2)]);
          candidate = { id: variantId, question: q, options, correctIndex, explanation: \`Gain A_v = -Rf / R1 = -\${rf} / \${r1} = \${gain}.\`, topic: "Op-Amp Gain", difficulty, subject, branch: canonBranch };
        }
      } else if (type === 1) {
        const deltaF = 50 + (attempts % 4) * 25;
        const fm = 10 + (attempts % 3) * 5;
        const bw = 2 * (deltaF + fm);
        const q = \`According to Carson's rule, what is the transmission bandwidth of an FM signal with frequency deviation Delta f = \${deltaF} kHz and message bandwidth f_m = \${fm} kHz?\`;
        if (!isExcluded(q)) {
          const { options, correctIndex } = buildOptions(\`\${bw} kHz\`, [\`\${bw / 2} kHz\`, \`\${deltaF * 2} kHz\`, \`\${bw + 50} kHz\`]);
          candidate = { id: variantId, question: q, options, correctIndex, explanation: \`Bandwidth = 2 * (Delta f + f_m) = 2 * (\${deltaF} + \${fm}) = \${bw} kHz.\`, topic: "Carson Bandwidth", difficulty, subject, branch: canonBranch };
        }
      } else {
        const q = "What is the intrinsic wave impedance eta_0 of free space (vacuum)?";
        if (!isExcluded(q)) {
          const { options, correctIndex } = buildOptions("377 ohms (120*pi)", ["50 ohms", "75 ohms", "100 ohms"]);
          candidate = { id: variantId, question: q, options, correctIndex, explanation: "eta_0 = sqrt(mu_0 / epsilon_0) approx 120*pi approx 377 ohms.", topic: "Intrinsic Impedance", difficulty, subject, branch: canonBranch };
        }
      }
    }
    // DATA SCIENCE & AI PROCEDURAL
    else if (canonBranch === "Data Science & Artificial Intelligence") {
      const type = attempts % 3;
      if (type === 0) {
        const tp = 80 + (attempts % 4) * 5;
        const fp = 10 + (attempts % 3) * 5;
        const prec = Math.round((tp / (tp + fp)) * 1000) / 10;
        const q = \`In a classification test with True Positives = \${tp} and False Positives = \${fp}, what is the Precision of the classifier?\`;
        if (!isExcluded(q)) {
          const { options, correctIndex } = buildOptions(\`\${prec}%\`, [\`\${Math.round(prec - 10)}%\`, \`\${Math.round(prec + 8)}%\`, "50.0%"]);
          candidate = { id: variantId, question: q, options, correctIndex, explanation: \`Precision = TP / (TP + FP) = \${tp} / (\${tp} + \${fp}) = \${prec}%.\`, topic: "Precision & Recall", difficulty, subject, branch: canonBranch };
        }
      } else if (type === 1) {
        const p1 = 0.6;
        const p2 = 0.4;
        const gini = Math.round((1 - (p1 * p1 + p2 * p2)) * 100) / 100;
        const q = "What is the Gini impurity of a binary classification node containing 60% positive and 40% negative samples?";
        if (!isExcluded(q)) {
          const { options, correctIndex } = buildOptions(String(gini), ["0.50", "0.24", "0.36"]);
          candidate = { id: variantId, question: q, options, correctIndex, explanation: \`Gini = 1 - (0.6^2 + 0.4^2) = 1 - (0.36 + 0.16) = \${gini}.\`, topic: "Gini Impurity", difficulty, subject, branch: canonBranch };
        }
      } else {
        const q = "Under what condition is the A* search algorithm guaranteed to return the optimal path on a graph?";
        if (!isExcluded(q)) {
          const { options, correctIndex } = buildOptions("Heuristic h(n) is admissible (never overestimates remaining cost)", ["Heuristic h(n) is zero everywhere", "Heuristic h(n) overestimates by factor 2", "Tree search only with depth cutoff"]);
          candidate = { id: variantId, question: q, options, correctIndex, explanation: "A* is admissible and optimal when h(n) <= h*(n) for all nodes n.", topic: "A* Search", difficulty, subject, branch: canonBranch };
        }
      }
    }
    // DEFAULT CSE & OTHER BRANCHES PROCEDURAL
    else {
      const type = attempts % 4;
      if (type === 0) {
        const mask = 24 + (attempts % 5);
        const hostBits = 32 - mask;
        const usable = Math.pow(2, hostBits) - 2;
        const q = \`How many usable host IP addresses are available in a subnet with IPv4 CIDR prefix /\${mask}?\`;
        if (!isExcluded(q)) {
          const { options, correctIndex } = buildOptions(String(usable), [String(usable + 2), String(usable * 2), String(usable / 2)]);
          candidate = { id: variantId, question: q, options, correctIndex, explanation: \`Subnet /\${mask} leaves \${hostBits} host bits. Usable hosts = 2^\${hostBits} - 2 = \${usable}.\`, topic: "Subnetting", difficulty, subject, branch: canonBranch };
        }
      } else if (type === 1) {
        const n = [2, 3, 4, 5][attempts % 4];
        const catalan = [2, 5, 14, 42][attempts % 4];
        const q = \`How many distinct Binary Search Trees (BSTs) can be formed using \${n} distinct keys?\`;
        if (!isExcluded(q)) {
          const { options, correctIndex } = buildOptions(String(catalan), [String(catalan - 1), String(catalan * 2), String(n * n)]);
          candidate = { id: variantId, question: q, options, correctIndex, explanation: \`The count of distinct BSTs with \${n} keys is the \${n}th Catalan number C_\${n} = \${catalan}.\`, topic: "Catalan Numbers", difficulty, subject, branch: canonBranch };
        }
      } else if (type === 2) {
        const q = "What is the worst-case time complexity of searching in a Red-Black Tree with n keys?";
        if (!isExcluded(q)) {
          const { options, correctIndex } = buildOptions("O(log n)", ["O(n)", "O(n log n)", "O(1)"]);
          candidate = { id: variantId, question: q, options, correctIndex, explanation: "Red-Black Tree height is bounded by 2*log2(n+1), so worst-case search is O(log n).", topic: "Red-Black Trees", difficulty, subject, branch: canonBranch };
        }
      } else {
        const q = "Which normal form requires that every non-trivial functional dependency X -> Y has X as a superkey?";
        if (!isExcluded(q)) {
          const { options, correctIndex } = buildOptions("Boyce-Codd Normal Form (BCNF)", ["Third Normal Form (3NF)", "Second Normal Form (2NF)", "Fourth Normal Form (4NF)"]);
          candidate = { id: variantId, question: q, options, correctIndex, explanation: "BCNF strictly requires that the determinant X in every FD X -> Y is a superkey.", topic: "BCNF", difficulty, subject, branch: canonBranch };
        }
      }
    }

    if (candidate) {
      const norm = candidate.question.trim().toLowerCase().replace(/\\s+/g, " ");
      excludeNormalizedSet.add(norm);
      results.push(candidate);
    }
  }

  return results;
}

// Helper to shuffle options safely while preserving correctIndex
function shuffleOptionsSafely(q: GateQuestion): GateQuestion {
  if (!q || !Array.isArray(q.options) || q.options.length !== 4) return q;
  const originalOptions = [...q.options];
  const origIndex = typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex <= 3 ? q.correctIndex : 0;
  const correctText = originalOptions[origIndex];

  const indices = [0, 1, 2, 3];
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const newOptions = indices.map((i) => originalOptions[i]) as [string, string, string, string];
  const newCorrectIndex = newOptions.indexOf(correctText);

  return {
    ...q,
    options: newOptions,
    correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : origIndex
  };
}

export function getCuratedGateQuestions(
  subject: string,
  difficulty: "Easy" | "Medium" | "Hard" = "Medium",
  count: number = 10,
  excludeNormalizedSet: Set<string> = new Set(),
  previousTexts: string[] = [],
  branch: string = "Computer Science Engineering"
): GateQuestion[] {
  const canonBranch = canonicalGateBranch(branch);
  const branchBank = GATE_ALL_BRANCH_QUESTION_BANKS[canonBranch] || GATE_QUESTIONS_BANK;
  const normSubject = subject.toLowerCase().trim();
  const normDiff = difficulty.toLowerCase().trim();

  let candidatePool: GateQuestion[] = [];

  // 1. Locate questions for the requested subject
  for (const [key, list] of Object.entries(branchBank)) {
    if (normSubject.includes(key.toLowerCase()) || key.toLowerCase().includes(normSubject)) {
      candidatePool = list;
      break;
    }
  }

  // 2. Fall back to all branch questions if subject is not explicitly keyed
  if (candidatePool.length === 0) {
    candidatePool = Object.values(branchBank).flat();
  }

  const poolShuffled = shuffleArray(candidatePool);
  const localExclude = new Set(excludeNormalizedSet);
  const filtered: GateQuestion[] = [];

  // Pass 1: Match requested difficulty & exclude previous history
  for (const q of poolShuffled) {
    if (filtered.length >= count) break;
    if (q.difficulty && q.difficulty.toLowerCase().trim() !== normDiff) continue;

    const norm = q.question.trim().toLowerCase().replace(/\\s+/g, " ");
    if (localExclude.has(norm)) continue;
    if (previousTexts.some((prev) => areQuestionsDuplicate(prev, q.question))) continue;
    if (filtered.some((f) => areQuestionsDuplicate(f.question, q.question))) continue;

    filtered.push(shuffleOptionsSafely({ ...q, subject, difficulty, branch: canonBranch }));
    localExclude.add(norm);
  }

  // Pass 2: Accept adjacent difficulties within the subject & exclude previous history
  if (filtered.length < count) {
    for (const q of poolShuffled) {
      if (filtered.length >= count) break;
      const norm = q.question.trim().toLowerCase().replace(/\\s+/g, " ");
      if (localExclude.has(norm)) continue;
      if (previousTexts.some((prev) => areQuestionsDuplicate(prev, q.question))) continue;
      if (filtered.some((f) => areQuestionsDuplicate(f.question, q.question))) continue;

      filtered.push(shuffleOptionsSafely({ ...q, subject, difficulty, branch: canonBranch }));
      localExclude.add(norm);
    }
  }

  // Pass 3: Pool across all subjects in the same branch & exclude previous history
  if (filtered.length < count) {
    const allBranchQuestions = shuffleArray(Object.values(branchBank).flat());
    for (const q of allBranchQuestions) {
      if (filtered.length >= count) break;
      const norm = q.question.trim().toLowerCase().replace(/\\s+/g, " ");
      if (localExclude.has(norm)) continue;
      if (previousTexts.some((prev) => areQuestionsDuplicate(prev, q.question))) continue;
      if (filtered.some((f) => areQuestionsDuplicate(f.question, q.question))) continue;

      filtered.push(shuffleOptionsSafely({ ...q, subject, difficulty, branch: canonBranch }));
      localExclude.add(norm);
    }
  }

  // Pass 4: Invoke procedural generator for this branch
  if (filtered.length < count) {
    const needed = count - filtered.length;
    const procedural = generateProceduralGateQuestions(subject, difficulty, needed, localExclude, previousTexts, canonBranch);
    for (const pq of procedural) {
      if (filtered.length >= count) break;
      filtered.push(shuffleOptionsSafely({ ...pq, subject, difficulty, branch: canonBranch }));
    }
  }

  // Pass 5: CRITICAL SAFETY NET:
  // If the user's permanent history has already exhausted all questions in this bank,
  // NEVER return an empty array or display "Unable to load fresh GATE questions"!
  // Backfill with shuffled options from the candidate pool, guaranteeing ZERO intra-quiz duplicates!
  if (filtered.length < count) {
    const allCandidates = shuffleArray(candidatePool.length > 0 ? candidatePool : Object.values(branchBank).flat());
    for (const q of allCandidates) {
      if (filtered.length >= count) break;
      const norm = q.question.trim().toLowerCase().replace(/\\s+/g, " ");
      if (localExclude.has(norm)) continue;
      if (filtered.some((f) => areQuestionsDuplicate(f.question, q.question))) continue;

      filtered.push(shuffleOptionsSafely({
        ...q,
        id: \`gate_fb_\${Date.now()}_\${filtered.length}\`,
        subject,
        difficulty,
        branch: canonBranch
      }));
      localExclude.add(norm);
    }
  }

  return filtered.slice(0, count);
}
\`;

fs.writeFileSync(path.join(__dirname, "../functions/gate-question-bank.ts"), content, "utf8");
console.log("Successfully generated functions/gate-question-bank.ts with complete branch question banks!");
`;

fs.writeFileSync("scripts/build-gate-bank.js", content, "utf8");
console.log("build-gate-bank.js created successfully");
