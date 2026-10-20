import { generateQuiz, normalizeQuestionText } from "./functions/ai-service";
import { areQuestionsDuplicate } from "./functions/aptitude-question-bank";

interface BranchTestCase {
  branch: string;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

const testCases: BranchTestCase[] = [
  { branch: "Mechanical Engineering", subject: "Thermodynamics", difficulty: "Easy" },
  { branch: "Civil Engineering", subject: "Surveying", difficulty: "Medium" },
  { branch: "Chemical Engineering", subject: "Heat Transfer", difficulty: "Hard" },
  { branch: "Electronics & Telecommunication", subject: "Embedded C", difficulty: "Medium" },
  { branch: "Electrical Engineering", subject: "Circuit Theory", difficulty: "Easy" },
  { branch: "Artificial Intelligence & Machine Learning", subject: "Machine Learning", difficulty: "Easy" },
  { branch: "Data Science", subject: "Statistics", difficulty: "Medium" },
  { branch: "Information Technology", subject: "Software Engineering", difficulty: "Easy" },
  { branch: "Computer Science Engineering", subject: "C++", difficulty: "Easy" }
];

async function runTests() {
  console.log("=== STARTING MULTI-ATTEMPT NO-REPEAT TESTS FOR ALL 9 BRANCHES ===");
  let allPassed = true;

  for (const tc of testCases) {
    console.log(`\n--------------------------------------------------`);
    console.log(`Testing Branch: ${tc.branch} | Subject: ${tc.subject} | Difficulty: ${tc.difficulty}`);

    // Attempt 1: 10 questions
    const res1 = await generateQuiz(tc.subject, tc.difficulty, 10, [], tc.branch);
    const q1 = res1.questions;
    console.log(`Attempt 1 questions count: ${q1.length}`);
    if (q1.length !== 10) {
      console.error(`FAIL: Expected 10 questions in Attempt 1, got ${q1.length}`);
      allPassed = false;
    }

    // Verify uniqueness within Attempt 1
    for (let i = 0; i < q1.length; i++) {
      for (let j = i + 1; j < q1.length; j++) {
        if (areQuestionsDuplicate(q1[i].question, q1[j].question)) {
          console.error(`FAIL: Internal duplicate in Attempt 1 between #${i} and #${j}: "${q1[i].question}" vs "${q1[j].question}"`);
          allPassed = false;
        }
      }
    }

    // Attempt 2: 10 questions, excluding Attempt 1
    const historyAttempt1 = q1.map(q => q.question);
    const res2 = await generateQuiz(tc.subject, tc.difficulty, 10, historyAttempt1, tc.branch);
    const q2 = res2.questions;
    console.log(`Attempt 2 questions count: ${q2.length}`);
    if (q2.length !== 10) {
      console.error(`FAIL: Expected 10 questions in Attempt 2, got ${q2.length}`);
      allPassed = false;
    }

    // Verify 0 overlap between Attempt 1 and Attempt 2
    let overlap12 = 0;
    for (const q of q2) {
      if (historyAttempt1.some(h => areQuestionsDuplicate(h, q.question))) {
        console.error(`FAIL: Attempt 2 repeated question from Attempt 1: "${q.question}"`);
        overlap12++;
        allPassed = false;
      }
    }
    console.log(`Overlap between Attempt 1 and Attempt 2: ${overlap12} (Expected: 0)`);

    // Attempt 3: 10 questions, excluding Attempts 1 & 2
    const historyAttempt12 = [...historyAttempt1, ...q2.map(q => q.question)];
    const res3 = await generateQuiz(tc.subject, tc.difficulty, 10, historyAttempt12, tc.branch);
    const q3 = res3.questions;
    console.log(`Attempt 3 questions count: ${q3.length}`);
    if (q3.length !== 10) {
      console.error(`FAIL: Expected 10 questions in Attempt 3, got ${q3.length}`);
      allPassed = false;
    }

    // Verify 0 overlap between Attempt 3 and Attempts 1 & 2
    let overlap3 = 0;
    for (const q of q3) {
      if (historyAttempt12.some(h => areQuestionsDuplicate(h, q.question))) {
        console.error(`FAIL: Attempt 3 repeated question from Attempts 1/2: "${q.question}"`);
        overlap3++;
        allPassed = false;
      }
    }
    console.log(`Overlap between Attempt 3 and Attempts 1 & 2: ${overlap3} (Expected: 0)`);

    if (q1.length === 10 && q2.length === 10 && q3.length === 10 && overlap12 === 0 && overlap3 === 0) {
      console.log(`✓ SUCCESS: 30 completely unique, non-repeating questions generated for ${tc.branch} -> ${tc.subject}`);
    }
  }

  console.log(`\n==================================================`);
  if (allPassed) {
    console.log("✓ ALL 9 BRANCHES PASSED PERMANENT NO-REPEAT VERIFICATION!");
  } else {
    console.error("FAIL: One or more branch tests encountered repetitions.");
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
