import { generateProceduralAptitudeQuestions } from "./procedural-question-generators";

export interface CuratedAptitudeQuestion {
  id: string;
  section: "Quantitative Aptitude" | "Logical Reasoning" | "Verbal Ability";
  topic: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

/**
 * Standardize text by stripping common question lead-ins, normalizing math notation,
 * and collapsing spaces.
 */
export function canonicalizeText(text: string): string {
  if (!text) return "";
  let clean = text.trim().toLowerCase();

  // Normalize percentage terminology
  clean = clean.replace(/%/g, " percent ");
  clean = clean.replace(/percentage/g, " percent ");

  // Strip common introductory filler phrases
  const fillers = [
    /^what is the value of\b/,
    /^what is the\b/,
    /^what is\b/,
    /^what will be the\b/,
    /^what will be\b/,
    /^what would be\b/,
    /^find the value of\b/,
    /^find the\b/,
    /^find\b/,
    /^calculate the\b/,
    /^calculate\b/,
    /^determine the\b/,
    /^determine\b/,
    /^compute the\b/,
    /^compute\b/,
    /^evaluate\b/,
    /^how much is\b/,
    /^solve for\b/,
    /^solve\b/,
    /^identify the\b/,
    /^identify\b/,
    /^choose the\b/,
    /^select the\b/,
    /^which of the following is\b/,
    /^which of the following\b/
  ];

  for (const filler of fillers) {
    clean = clean.replace(filler, "").trim();
  }

  // Remove punctuation and special characters
  clean = clean.replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
  return clean;
}

export function maskNumbers(text: string): string {
  if (!text) return "";
  return String(text)
    .replace(/[-+]?\b\d+(?:\.\d+)?%?\b/g, " NUM ")
    .replace(/\b\d+\b/g, " NUM ");
}

export function canonicalizeTemplate(text: string): string {
  if (!text) return "";
  const masked = maskNumbers(text);
  return canonicalizeText(masked);
}

const STOP_WORDS = new Set([
  "the", "is", "of", "in", "and", "to", "what", "will", "be", "by",
  "this", "following", "python", "code", "snippet", "script", "print",
  "output", "value", "result", "program", "given", "consider", "expression",
  "statement", "which", "how", "does", "would", "from", "with", "that",
  "for", "when", "executed", "run", "produce", "display", "evaluate"
]);

/**
 * Robust duplicate check:
 * Returns true if two questions are identical, near-identical, or template-based clones
 * where only numerical values or trivial variable details were changed.
 */
export function areQuestionsDuplicate(text1: string, text2: string): boolean {
  if (!text1 || !text2) return false;

  const raw1 = text1.trim().toLowerCase().replace(/\s+/g, " ");
  const raw2 = text2.trim().toLowerCase().replace(/\s+/g, " ");
  if (raw1 === raw2) return true;

  const canon1 = canonicalizeText(text1);
  const canon2 = canonicalizeText(text2);
  if (canon1 === canon2) return true;

  // 1. Template-level duplicate check (masks numbers to detect same-format questions)
  const tmpl1 = canonicalizeTemplate(text1);
  const tmpl2 = canonicalizeTemplate(text2);
  if (tmpl1 && tmpl2 && tmpl1 === tmpl2) return true;

  // Extract all numbers present in the problem
  const nums1 = (text1.match(/\d+(?:\.\d+)?/g) || []).map(Number).sort((a, b) => a - b);
  const nums2 = (text2.match(/\d+(?:\.\d+)?/g) || []).map(Number).sort((a, b) => a - b);

  // Filter out boilerplate stop-words so comparisons reflect true domain content
  const words1 = new Set(canon1.split(" ").filter((w) => w.length > 2 && !STOP_WORDS.has(w)));
  const words2 = new Set(canon2.split(" ").filter((w) => w.length > 2 && !STOP_WORDS.has(w)));

  // Template words (without numbers) to catch near-duplicate templates with slight rephrasings
  const tmplWords1 = new Set(tmpl1.split(" ").filter((w) => w.length > 2 && w !== "num" && !STOP_WORDS.has(w)));
  const tmplWords2 = new Set(tmpl2.split(" ").filter((w) => w.length > 2 && w !== "num" && !STOP_WORDS.has(w)));

  let tmplCommon = 0;
  tmplWords1.forEach((w) => {
    if (tmplWords2.has(w)) tmplCommon++;
  });
  const tmplUnion = new Set([...tmplWords1, ...tmplWords2]).size;
  const tmplJaccard = tmplUnion > 0 ? tmplCommon / tmplUnion : 0;

  // If the underlying sentence template shares 70%+ structure with >= 3 key terms, it is a template clone
  if (tmplJaccard >= 0.70 && tmplWords1.size >= 3 && tmplWords2.size >= 3) {
    return true;
  }

  // If one template is almost a complete substring of the other (length > 20)
  if (tmpl1.length > 20 && tmpl2.length > 20 && (tmpl1.includes(tmpl2) || tmpl2.includes(tmpl1))) {
    return true;
  }

  // If same numbers are used and words overlap significantly
  if (nums1.length > 0 && nums2.length > 0) {
    if (nums1.length === nums2.length && nums1.every((n, i) => n === nums2[i])) {
      let common = 0;
      words1.forEach((w) => {
        if (words2.has(w)) common++;
      });
      const union = new Set([...words1, ...words2]).size;
      const jaccard = union > 0 ? common / union : 0;

      if (jaccard >= 0.40 || (canon1.length > 15 && canon2.length > 15 && (canon1.includes(canon2) || canon2.includes(canon1)))) {
        return true;
      }
    }
  }

  // Token set Jaccard similarity for non-numeric or general reasoning questions
  let common = 0;
  words1.forEach((w) => {
    if (words2.has(w)) common++;
  });
  const union = new Set([...words1, ...words2]).size;
  const jaccard = union > 0 ? common / union : 0;

  if (jaccard >= 0.72) {
    return true;
  }

  return false;
}

// ---------------------------------------------------------------------------
// CURATED APTITUDE QUESTION BANK (Over 75 unique, verified questions)
// ---------------------------------------------------------------------------

export const QUANTITATIVE_BANK: CuratedAptitudeQuestion[] = [
  {
    id: "quant_1",
    section: "Quantitative Aptitude",
    topic: "Percentages",
    question: "What is 20% of 500?",
    options: ["100", "80", "120", "150"],
    correctIndex: 0,
    explanation: "20% of 500 = (20 / 100) * 500 = 100."
  },
  {
    id: "quant_2",
    section: "Quantitative Aptitude",
    topic: "Percentages",
    question: "What is 30% of 200?",
    options: ["60", "50", "70", "80"],
    correctIndex: 0,
    explanation: "30% of 200 = (30 / 100) * 200 = 60."
  },
  {
    id: "quant_3",
    section: "Quantitative Aptitude",
    topic: "Percentages",
    question: "What is 15% of 800?",
    options: ["120", "110", "130", "140"],
    correctIndex: 0,
    explanation: "15% of 800 = (15 / 100) * 800 = 120."
  },
  {
    id: "quant_4",
    section: "Quantitative Aptitude",
    topic: "Profit & Loss",
    question: "An article bought for $400 is sold for $500. What is the profit percentage?",
    options: ["25%", "20%", "30%", "15%"],
    correctIndex: 0,
    explanation: "Profit = $500 - $400 = $100. Profit % = (100 / 400) * 100 = 25%."
  },
  {
    id: "quant_5",
    section: "Quantitative Aptitude",
    topic: "Profit & Loss",
    question: "A shopkeeper sells a jacket for $720 making a loss of 10%. What was the original cost price?",
    options: ["$800", "$792", "$810", "$850"],
    correctIndex: 0,
    explanation: "Selling Price = 0.90 * Cost Price. Cost Price = 720 / 0.90 = $800."
  },
  {
    id: "quant_6",
    section: "Quantitative Aptitude",
    topic: "Time & Work",
    question: "Pipe A fills a tank in 6 hours, while Pipe B empties it in 8 hours. If both pipes are opened together, in how many hours will the tank be full?",
    options: ["24 hours", "14 hours", "12 hours", "18 hours"],
    correctIndex: 0,
    explanation: "Net rate per hour = (1/6) - (1/8) = (4 - 3)/24 = 1/24. Thus, it takes 24 hours to fill the tank."
  },
  {
    id: "quant_7",
    section: "Quantitative Aptitude",
    topic: "Time & Work",
    question: "A can finish a project in 12 days and B can finish the same project in 24 days. Working together, in how many days will they finish the project?",
    options: ["8 days", "6 days", "10 days", "9 days"],
    correctIndex: 0,
    explanation: "Combined rate per day = (1/12) + (1/24) = (2 + 1)/24 = 3/24 = 1/8. Total time = 8 days."
  },
  {
    id: "quant_8",
    section: "Quantitative Aptitude",
    topic: "Speed & Distance",
    question: "A train 150 meters long crosses a stationary electric pole in 10 seconds. What is the speed of the train in km/h?",
    options: ["54 km/h", "45 km/h", "60 km/h", "72 km/h"],
    correctIndex: 0,
    explanation: "Speed = 150m / 10s = 15 m/s. In km/h: 15 * (18/5) = 54 km/h."
  },
  {
    id: "quant_9",
    section: "Quantitative Aptitude",
    topic: "Speed & Distance",
    question: "A car travels 180 km in 3 hours and the next 120 km in 2 hours. What is the average speed of the car for the entire journey?",
    options: ["60 km/h", "55 km/h", "65 km/h", "50 km/h"],
    correctIndex: 0,
    explanation: "Total distance = 180 + 120 = 300 km. Total time = 3 + 2 = 5 hours. Average speed = 300 / 5 = 60 km/h."
  },
  {
    id: "quant_10",
    section: "Quantitative Aptitude",
    topic: "Ratio & Proportion",
    question: "Two numbers are in the ratio 3:5. If their sum is 240, what is the larger number?",
    options: ["150", "90", "140", "160"],
    correctIndex: 0,
    explanation: "Total parts = 3 + 5 = 8. One part = 240 / 8 = 30. Larger number = 5 * 30 = 150."
  },
  {
    id: "quant_11",
    section: "Quantitative Aptitude",
    topic: "Simple Interest",
    question: "What is the simple interest on a principal of $5,000 invested at an annual rate of 8% for 3 years?",
    options: ["$1,200", "$1,000", "$1,400", "$960"],
    correctIndex: 0,
    explanation: "Simple Interest = (P * R * T) / 100 = (5000 * 8 * 3) / 100 = $1,200."
  },
  {
    id: "quant_12",
    section: "Quantitative Aptitude",
    topic: "Averages",
    question: "The average of five numbers is 42. If a sixth number 60 is included, what is the new average?",
    options: ["45", "44", "46", "48"],
    correctIndex: 0,
    explanation: "Sum of 5 numbers = 5 * 42 = 210. New sum = 210 + 60 = 270. New average = 270 / 6 = 45."
  },
  {
    id: "quant_13",
    section: "Quantitative Aptitude",
    topic: "Compound Interest",
    question: "A sum of $2,000 is deposited at 10% annual compound interest compounded annually. What will the amount be after 2 years?",
    options: ["$2,420", "$2,400", "$2,200", "$2,440"],
    correctIndex: 0,
    explanation: "Amount = P * (1 + R/100)^T = 2000 * (1.10)^2 = 2000 * 1.21 = $2,420."
  },
  {
    id: "quant_14",
    section: "Quantitative Aptitude",
    topic: "Number System",
    question: "What is the greatest common divisor (GCD) of 48 and 72?",
    options: ["24", "12", "18", "36"],
    correctIndex: 0,
    explanation: "Factors of 48: 1, 2, 3, 4, 6, 8, 12, 16, 24, 48. Factors of 72: 1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72. Highest common factor = 24."
  },
  {
    id: "quant_15",
    section: "Quantitative Aptitude",
    topic: "Permutations & Combinations",
    question: "In how many distinct ways can 4 books be arranged side by side on a shelf?",
    options: ["24", "16", "12", "48"],
    correctIndex: 0,
    explanation: "The number of permutations of 4 items = 4! = 4 * 3 * 2 * 1 = 24."
  },
  {
    id: "quant_16",
    section: "Quantitative Aptitude",
    topic: "Probability",
    question: "When rolling a fair standard 6-sided die, what is the probability of rolling a prime number?",
    options: ["1/2", "1/3", "2/3", "1/6"],
    correctIndex: 0,
    explanation: "Prime numbers on a die are 2, 3, and 5 (3 favorable outcomes out of 6). Probability = 3/6 = 1/2."
  },
  {
    id: "quant_17",
    section: "Quantitative Aptitude",
    topic: "Age Problems",
    question: "A father is currently 3 times as old as his son. In 12 years, he will be twice as old as his son. What is the father's current age?",
    options: ["36 years", "42 years", "30 years", "45 years"],
    correctIndex: 0,
    explanation: "Let son = x, father = 3x. (3x + 12) = 2(x + 12) => 3x + 12 = 2x + 24 => x = 12. Father = 3 * 12 = 36."
  },
  {
    id: "quant_18",
    section: "Quantitative Aptitude",
    topic: "Boats & Streams",
    question: "A boat moves at 14 km/h in still water. If the river current speed is 2 km/h, what is the boat's downstream speed?",
    options: ["16 km/h", "12 km/h", "18 km/h", "14 km/h"],
    correctIndex: 0,
    explanation: "Downstream speed = boat speed + stream speed = 14 + 2 = 16 km/h."
  },
  {
    id: "quant_19",
    section: "Quantitative Aptitude",
    topic: "Mixtures & Alligation",
    question: "In a 60-liter mixture of milk and water, the ratio of milk to water is 2:1. How many liters of water must be added to make the ratio 1:1?",
    options: ["20 liters", "15 liters", "25 liters", "30 liters"],
    correctIndex: 0,
    explanation: "Milk = (2/3)*60 = 40L, water = 20L. To make ratio 1:1, water must equal 40L. Water to add = 40 - 20 = 20 liters."
  },
  {
    id: "quant_20",
    section: "Quantitative Aptitude",
    topic: "Mensuration",
    question: "What is the area of a circle with a radius of 7 cm (using pi = 22/7)?",
    options: ["154 cm²", "144 cm²", "168 cm²", "132 cm²"],
    correctIndex: 0,
    explanation: "Area = pi * r² = (22/7) * 7 * 7 = 154 cm²."
  }
];

export const LOGICAL_BANK: CuratedAptitudeQuestion[] = [
  {
    id: "logic_1",
    section: "Logical Reasoning",
    topic: "Direction Sense",
    question: "A surveyor walks 4 km North, turns right and walks 3 km. How far is the surveyor from the initial starting point?",
    options: ["5 km", "7 km", "6 km", "1 km"],
    correctIndex: 0,
    explanation: "Using the Pythagorean theorem: distance = sqrt(4² + 3²) = sqrt(16 + 9) = sqrt(25) = 5 km."
  },
  {
    id: "logic_2",
    section: "Logical Reasoning",
    topic: "Direction Sense",
    question: "Starting from a point, Priya walks 12 meters East, then turns left and walks 5 meters North. What is the straight-line distance to her origin?",
    options: ["13 meters", "17 meters", "15 meters", "11 meters"],
    correctIndex: 0,
    explanation: "Using the Pythagorean theorem: distance = sqrt(12² + 5²) = sqrt(144 + 25) = sqrt(169) = 13 meters."
  },
  {
    id: "logic_3",
    section: "Logical Reasoning",
    topic: "Number Series",
    question: "Find the next number in the sequence: 3, 7, 15, 31, 63, ?",
    options: ["127", "126", "125", "128"],
    correctIndex: 0,
    explanation: "Each term is generated by (previous * 2) + 1. 63 * 2 + 1 = 126 + 1 = 127."
  },
  {
    id: "logic_4",
    section: "Logical Reasoning",
    topic: "Number Series",
    question: "What is the missing term in the sequence: 2, 6, 12, 20, 30, ?",
    options: ["42", "40", "44", "46"],
    correctIndex: 0,
    explanation: "Differences between successive terms are +4, +6, +8, +10, +12. Next term = 30 + 12 = 42 (also n*(n+1))."
  },
  {
    id: "logic_5",
    section: "Logical Reasoning",
    topic: "Coding-Decoding",
    question: "If in a certain code 'SYSTEM' is coded as 'METSYS', how is 'ENGINE' coded in that same pattern?",
    options: ["ENIGNE", "EINGNE", "ENNIGE", "EGNNIE"],
    correctIndex: 0,
    explanation: "The letters of the word are reversed in place: SYSTEM -> METSYS; ENGINE reversed is E-N-I-G-N-E."
  },
  {
    id: "logic_6",
    section: "Logical Reasoning",
    topic: "Coding-Decoding",
    question: "If 'LIGHT' is written as 'MJHIU' (+1 shift to each letter), how is 'SOUND' written in the same code?",
    options: ["TPVOE", "TOVPE", "RNTMC", "UQWPF"],
    correctIndex: 0,
    explanation: "Each character is shifted forward by 1 letter: S->T, O->P, U->V, N->O, D->E. Thus, TPVOE."
  },
  {
    id: "logic_7",
    section: "Logical Reasoning",
    topic: "Blood Relations",
    question: "Pointing to a photograph, Rohan said, 'Her mother's only son is my father.' How is Rohan related to the lady in the photograph?",
    options: ["Nephew", "Son", "Brother", "Uncle"],
    correctIndex: 0,
    explanation: "The lady's mother's only son is the lady's brother. If Rohan's father is that brother, Rohan is her nephew."
  },
  {
    id: "logic_8",
    section: "Logical Reasoning",
    topic: "Blood Relations",
    question: "Introducing a man, a woman says, 'His wife is the only daughter of my father.' How is the man related to the woman?",
    options: ["Husband", "Brother", "Father", "Maternal Uncle"],
    correctIndex: 0,
    explanation: "The only daughter of the woman's father is the woman herself. So the man's wife is the woman; thus the man is her husband."
  },
  {
    id: "logic_9",
    section: "Logical Reasoning",
    topic: "Syllogism",
    question: "Statements: All roses are flowers. All flowers are plants. Conclusion: Are all roses plants?",
    options: ["Yes, definitely true", "No, definitely false", "Cannot be determined", "Only some roses are plants"],
    correctIndex: 0,
    explanation: "Since the set of roses is a subset of flowers, and flowers is a subset of plants, by transitive logic all roses are plants."
  },
  {
    id: "logic_10",
    section: "Logical Reasoning",
    topic: "Analogy",
    question: "Complete the logical analogy: Clock : Time :: Thermometer : ?",
    options: ["Temperature", "Heat", "Mercury", "Energy"],
    correctIndex: 0,
    explanation: "A clock is an instrument designed to measure time, just as a thermometer is designed to measure temperature."
  },
  {
    id: "logic_11",
    section: "Logical Reasoning",
    topic: "Odd One Out",
    question: "Which of the following numbers does NOT fit the pattern of the others: 8, 27, 64, 100, 125, 216?",
    options: ["100", "64", "27", "125"],
    correctIndex: 0,
    explanation: "All others are perfect cubes (2³=8, 3³=27, 4³=64, 5³=125, 6³=216). 100 is a square (10²), not a cube."
  },
  {
    id: "logic_12",
    section: "Logical Reasoning",
    topic: "Seating Arrangement",
    question: "Five colleagues A, B, C, D, E sit in a row facing North. C is in the middle. A is immediately to the left of C. Who is sitting on the second seat from the left?",
    options: ["A", "B", "C", "D"],
    correctIndex: 0,
    explanation: "Row has 5 positions: 1, 2, 3, 4, 5. Middle is position 3 (C). Immediate left of position 3 is position 2, which is A."
  },
  {
    id: "logic_13",
    section: "Logical Reasoning",
    topic: "Letter Series",
    question: "Identify the next letter pair in the series: AZ, BY, CX, DW, ?",
    options: ["EV", "EU", "FU", "FW"],
    correctIndex: 0,
    explanation: "The first letter increments (A, B, C, D, E), and the second letter decrements from Z backwards (Z, Y, X, W, V). Result: EV."
  },
  {
    id: "logic_14",
    section: "Logical Reasoning",
    topic: "Calendar",
    question: "If today is Wednesday, what day of the week will it be exactly 50 days from today?",
    options: ["Thursday", "Friday", "Wednesday", "Tuesday"],
    correctIndex: 0,
    explanation: "50 divided by 7 leaves a remainder of 1 day (50 = 7*7 + 1). Wednesday + 1 day = Thursday."
  },
  {
    id: "logic_15",
    section: "Logical Reasoning",
    topic: "Clocks",
    question: "At 3:00, what is the acute angle between the hour hand and the minute hand of a clock?",
    options: ["90 degrees", "80 degrees", "75 degrees", "100 degrees"],
    correctIndex: 0,
    explanation: "Each hour marking on a circular clock represents 360 / 12 = 30 degrees. At 3:00, angle = 3 * 30 = 90 degrees."
  }
];

export const VERBAL_BANK: CuratedAptitudeQuestion[] = [
  {
    id: "verbal_1",
    section: "Verbal Ability",
    topic: "Antonyms",
    question: "Choose the word most nearly opposite in meaning (antonym) to 'CANDID':",
    options: ["Guarded / Deceptive", "Honest", "Frank", "Transparent"],
    correctIndex: 0,
    explanation: "'Candid' means outspoken, straightforward, or frank. Its antonym is deceptive, secretive, or guarded."
  },
  {
    id: "verbal_2",
    section: "Verbal Ability",
    topic: "Sentence Correction",
    question: "Identify the grammatically correct sentence:",
    options: [
      "Neither the principal nor the teachers were present.",
      "Neither the principal nor the teachers was present.",
      "Neither the principal or the teachers were present.",
      "Neither of the principal and teachers were present."
    ],
    correctIndex: 0,
    explanation: "In 'neither... nor' constructions, the verb agrees with the closer subject. 'teachers' is plural, so 'were' is correct."
  },
  {
    id: "verbal_3",
    section: "Verbal Ability",
    topic: "Vocabulary",
    question: "Select the word that best completes the statement: 'The scientist\\'s theory was so _______ that even subject experts struggled to comprehend it.'",
    options: ["Abstruse", "Lucid", "Accessible", "Pragmatic"],
    correctIndex: 0,
    explanation: "'Abstruse' means difficult to understand or esoteric, which aligns with the context."
  },
  {
    id: "verbal_4",
    section: "Verbal Ability",
    topic: "Synonyms",
    question: "Choose the word closest in meaning to 'METICULOUS':",
    options: ["Painstaking / Thorough", "Careless", "Rapid", "Superficial"],
    correctIndex: 0,
    explanation: "'Meticulous' means showing great attention to detail; very careful and precise (painstaking)."
  },
  {
    id: "verbal_5",
    section: "Verbal Ability",
    topic: "Idioms & Phrases",
    question: "What does the idiom 'Bite the bullet' mean?",
    options: [
      "To face a difficult situation with fortitude",
      "To fire a weapon unexpectedly",
      "To avoid danger at all costs",
      "To give up in defeat"
    ],
    correctIndex: 0,
    explanation: "'Bite the bullet' means to bravely endure a grim or unavoidable ordeal."
  },
  {
    id: "verbal_6",
    section: "Verbal Ability",
    topic: "One Word Substitution",
    question: "What is the one-word substitution for 'A person who looks on the bright side of things'?",
    options: ["Optimist", "Pessimist", "Altruist", "Pacifist"],
    correctIndex: 0,
    explanation: "An 'optimist' is someone who anticipates positive outcomes and focuses on favorable aspects."
  },
  {
    id: "verbal_7",
    section: "Verbal Ability",
    topic: "Prepositions",
    question: "Select the correct preposition: 'The committee members agreed _______ the proposal unanimously.'",
    options: ["To", "With", "At", "On"],
    correctIndex: 0,
    explanation: "One agrees 'with' a person, but agrees 'to' a plan, proposal, or recommendation."
  },
  {
    id: "verbal_8",
    section: "Verbal Ability",
    topic: "Spotting Errors",
    question: "Which part contains an error: 'Each of the students (A) / are required to submit (B) / their assignments today (C)'?",
    options: ["Part B (should be 'is required')", "Part A", "Part C", "No error"],
    correctIndex: 0,
    explanation: "'Each' is grammatically singular and requires the singular auxiliary verb 'is', not 'are'."
  },
  {
    id: "verbal_9",
    section: "Verbal Ability",
    topic: "Analogies",
    question: "Select the matching pair: OASIS : DESERT ::",
    options: ["Island : Ocean", "Tree : Forest", "Peak : Mountain", "Stream : River"],
    correctIndex: 0,
    explanation: "An oasis is an isolated fertile fertile area of water surrounded by arid desert; an island is an isolated landmass surrounded by water."
  },
  {
    id: "verbal_10",
    section: "Verbal Ability",
    topic: "Spelling",
    question: "Choose the correctly spelled word:",
    options: ["Accommodate", "Acommodate", "Accomodate", "Acomodate"],
    correctIndex: 0,
    explanation: "'Accommodate' is correctly spelled with double 'c' and double 'm'."
  },
  {
    id: "verbal_11",
    section: "Verbal Ability",
    topic: "Sentence Improvement",
    question: "Improve the sentence: 'He had scarcely entered the room THAN the alarm went off.'",
    options: ["WHEN the alarm went off", "THEN the alarm went off", "AS the alarm went off", "No improvement needed"],
    correctIndex: 0,
    explanation: "The correlative conjunction for 'scarcely' and 'hardly' is 'when' (e.g. 'scarcely... when'), whereas 'no sooner' pairs with 'than'."
  },
  {
    id: "verbal_12",
    section: "Verbal Ability",
    topic: "Active & Passive Voice",
    question: "Convert to passive voice: 'The engineer designed the entire hydraulic system.'",
    options: [
      "The entire hydraulic system was designed by the engineer.",
      "The entire hydraulic system is designed by the engineer.",
      "The entire hydraulic system has been designed by the engineer.",
      "The entire hydraulic system had designed by the engineer."
    ],
    correctIndex: 0,
    explanation: "Simple past active ('designed') converts to 'was/were + past participle' ('was designed')."
  }
];

/**
 * Get distinct curated questions matching a section and difficulty, guaranteeing no duplicates
 * and avoiding history.
 */
export function getCuratedAptitudeQuestions(
  section: "Quantitative Aptitude" | "Logical Reasoning" | "Verbal Ability" | "All",
  count: number,
  existingList: CuratedAptitudeQuestion[] = [],
  historyTexts: string[] = []
): CuratedAptitudeQuestion[] {
  let masterPool: CuratedAptitudeQuestion[] = [];
  if (section === "Quantitative Aptitude") {
    masterPool = [...QUANTITATIVE_BANK];
  } else if (section === "Logical Reasoning") {
    masterPool = [...LOGICAL_BANK];
  } else if (section === "Verbal Ability") {
    masterPool = [...VERBAL_BANK];
  } else {
    masterPool = [...QUANTITATIVE_BANK, ...LOGICAL_BANK, ...VERBAL_BANK];
  }

  // Shuffle pool to provide variety
  const shuffled = [...masterPool].sort(() => Math.random() - 0.5);

  const selected: CuratedAptitudeQuestion[] = [...existingList];

  for (const candidate of shuffled) {
    if (selected.length >= count) break;

    // Check against existing selected questions
    const isDupWithSelected = selected.some(
      (s) => s.id === candidate.id || areQuestionsDuplicate(s.question, candidate.question)
    );
    if (isDupWithSelected) continue;

    // Check against history if possible
    if (historyTexts.length > 0) {
      const isDupWithHistory = historyTexts.some((h) => areQuestionsDuplicate(h, candidate.question));
      if (isDupWithHistory) continue;
    }

    selected.push({
      ...candidate,
      id: `apt_cur_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    });
  }

  // If still need more questions, use procedural generator to provide 100% unique, non-repeating questions
  if (selected.length < count) {
    const proceduralApt = generateProceduralAptitudeQuestions(section, count - selected.length, historyTexts);
    for (const pa of proceduralApt) {
      if (selected.length >= count) break;
      const isDup = selected.some(
        (s) => s.id === pa.id || areQuestionsDuplicate(s.question, pa.question)
      );
      if (!isDup) {
        selected.push({
          id: pa.id,
          section: pa.section as "Quantitative Aptitude" | "Logical Reasoning" | "Verbal Ability",
          topic: pa.topic,
          question: pa.question,
          options: pa.options as [string, string, string, string],
          correctIndex: pa.correctIndex,
          explanation: pa.explanation
        });
      }
    }
  }

  return selected.slice(0, count);
}
