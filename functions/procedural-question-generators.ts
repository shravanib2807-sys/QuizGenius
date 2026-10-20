import { QuizQuestion, AptitudeQuestion } from "./ai-service";
import { areQuestionsDuplicate, canonicalizeText } from "./aptitude-question-bank";

/**
 * Procedural Dynamic Question Generator for QuizGenius
 * Generates an endless pool of verified, non-repeating, difficulty-disciplined questions
 * for technical programming languages, engineering subjects, and aptitude tests.
 */

// Helper to pick random element from array
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to shuffle array
function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Helper to assemble 4 distinct options and track correctIndex
function buildOptions(correctOpt: string, distractors: string[]): { options: string[]; correctIndex: number } {
  const uniqueDistractors = Array.from(new Set(distractors.filter(d => d !== correctOpt))).slice(0, 3);
  while (uniqueDistractors.length < 3) {
    uniqueDistractors.push(`None of the mentioned (Variant ${uniqueDistractors.length + 1})`);
  }
  const all = [correctOpt, ...uniqueDistractors];
  const shuffled = shuffleArray(all);
  const correctIndex = shuffled.indexOf(correctOpt);
  return { options: shuffled, correctIndex };
}

// ============================================================================
// 1. PYTHON PROCEDURAL GENERATORS (Easy, Medium, Hard)
// ============================================================================

export function generateProceduralPythonQuestions(
  difficulty: "Easy" | "Medium" | "Hard",
  count: number,
  excludeNormalizedSet: Set<string>,
  previousTexts: string[] = []
): QuizQuestion[] {
  const results: QuizQuestion[] = [];
  let attempts = 0;
  const maxAttempts = Math.max(count * 80, 800);

  const isExcluded = (qText: string) => {
    const norm = qText.trim().toLowerCase().replace(/\s+/g, " ");
    if (excludeNormalizedSet.has(norm)) return true;
    if (previousTexts.some(prev => areQuestionsDuplicate(prev, qText))) return true;
    if (results.some(r => areQuestionsDuplicate(r.question, qText))) return true;
    return false;
  };

  while (results.length < count && attempts < maxAttempts) {
    attempts++;
    let candidate: QuizQuestion | null = null;

    if (difficulty === "Easy") {
      const templateType = attempts % 16;

      if (templateType === 0) {
        // String Slicing Output
        const words = ["PYTHON", "PROGRAMMING", "ALGORITHM", "DATABASE", "COMPUTER", "ENGINEERING", "VARIABLE", "FUNCTION", "DEVELOPER", "KEYWORD"];
        const word = pickRandom(words);
        const start = Math.floor(Math.random() * 3);
        const end = start + 2 + Math.floor(Math.random() * 3);
        const sliced = word.slice(start, end);
        const qText = `What is the output of the following Python code snippet?\ns = "${word}"\nprint(s[${start}:${end}])`;
        if (!isExcluded(qText)) {
          const distractors = [
            word.slice(start, end + 1),
            word.slice(start - 1 < 0 ? 0 : start - 1, end),
            word.slice(start + 1, end + 1)
          ];
          const { options, correctIndex } = buildOptions(`'${sliced}'`, distractors.map(d => `'${d}'`));
          candidate = {
            id: `py_proc_slice_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `In Python string slicing, s[start:end] includes characters from index ${start} up to index ${end - 1} (non-inclusive of end).`,
            topic: "String Slicing",
            difficulty: "Easy",
            subject: "Python"
          };
        }
      } else if (templateType === 1) {
        // Integer Division & Modulo
        const a = 15 + Math.floor(Math.random() * 35);
        const b = 3 + Math.floor(Math.random() * 7);
        const isFloorDiv = attempts % 2 === 0;
        const op = isFloorDiv ? "//" : "%";
        const ans = isFloorDiv ? Math.floor(a / b) : a % b;
        const qText = `What is the evaluated result of the Python expression: ${a} ${op} ${b}?`;
        if (!isExcluded(qText)) {
          const distractors = [
            String((a / b).toFixed(2)),
            String(isFloorDiv ? a % b : Math.floor(a / b)),
            String(ans + 1),
            String(Math.max(0, ans - 1))
          ];
          const { options, correctIndex } = buildOptions(String(ans), distractors);
          candidate = {
            id: `py_proc_op_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: isFloorDiv
              ? `The '//' operator in Python performs floor division, truncating fractional parts and returning ${ans}.`
              : `The '%' modulo operator computes the remainder after division: ${a} = (${b} * ${Math.floor(a/b)}) + ${ans}.`,
            topic: "Operators",
            difficulty: "Easy",
            subject: "Python"
          };
        }
      } else if (templateType === 2) {
        // List length and indexing
        const sampleLists = [
          [10, 20, 30, 40, 50],
          [2, 4, 6, 8, 10, 12],
          [5, 15, 25, 35],
          [1, 3, 5, 7, 9, 11, 13],
          [100, 200, 300, 400]
        ];
        const list = pickRandom(sampleLists);
        const idx = Math.floor(Math.random() * list.length);
        const qText = `Given the Python list items = ${JSON.stringify(list)}, what will items[${idx}] evaluate to?`;
        if (!isExcluded(qText)) {
          const correctVal = String(list[idx]);
          const distractors = [
            String(list[(idx + 1) % list.length]),
            String(list[(idx - 1 + list.length) % list.length]),
            String(list.length)
          ];
          const { options, correctIndex } = buildOptions(correctVal, distractors);
          candidate = {
            id: `py_proc_idx_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `Python uses 0-based indexing. Index ${idx} points to element ${correctVal}.`,
            topic: "Lists",
            difficulty: "Easy",
            subject: "Python"
          };
        }
      } else if (templateType === 3) {
        // Built-in Type & Truthiness
        const cases = [
          { expr: "bool([])", ans: "False", why: "Empty lists evaluate to False in Python boolean context." },
          { expr: "bool([0])", ans: "True", why: "A non-empty list containing zero has length 1, so it evaluates to True." },
          { expr: "bool('')", ans: "False", why: "Empty strings evaluate to False." },
          { expr: "bool('0')", ans: "True", why: "A non-empty string containing character '0' is truthy." },
          { expr: "type(3.14).__name__", ans: "'float'", why: "Floating-point numbers in Python belong to class float." },
          { expr: "type([1, 2]).__name__", ans: "'list'", why: "Square bracket notation creates a list object." },
          { expr: "type((1,)).__name__", ans: "'tuple'", why: "A comma inside parentheses defines a single-element tuple." },
          { expr: "bool(None)", ans: "False", why: "NoneType values evaluate to False in boolean context." }
        ];
        const c = pickRandom(cases);
        const qText = `What is the exact evaluation of the Python expression: ${c.expr}?`;
        if (!isExcluded(qText)) {
          const distractors = ["True", "False", "None", "'int'", "TypeError", "'str'"].filter(d => d !== c.ans);
          const { options, correctIndex } = buildOptions(c.ans, distractors);
          candidate = {
            id: `py_proc_bool_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: c.why,
            topic: "Built-in Types",
            difficulty: "Easy",
            subject: "Python"
          };
        }
      } else if (templateType === 4) {
        // String methods
        const methods = [
          { text: "data = 'quiz_genius'\nprint(data.replace('_', ' ').upper())", ans: "'QUIZ GENIUS'", why: "replace converts underscore to space, then upper converts all letters to uppercase." },
          { text: "name = '  python  '\nprint(len(name.strip()))", ans: "6", why: "strip() removes leading and trailing whitespace, leaving 'python' with length 6." },
          { text: "msg = 'Hello World'\nprint(msg.startswith('Hell'))", ans: "True", why: "startswith('Hell') checks prefix substring match." },
          { text: "code = 'abcdef'\nprint(code.find('c'))", ans: "2", why: "find() returns the zero-based index where 'c' first occurs (index 2)." }
        ];
        const m = pickRandom(methods);
        const qText = `What will be printed by this Python snippet?\n${m.text}`;
        if (!isExcluded(qText)) {
          const distractors = ["'quiz_genius'", "'QUIZ_GENIUS'", "8", "10", "False", "3", "-1"];
          const { options, correctIndex } = buildOptions(m.ans, distractors);
          candidate = {
            id: `py_proc_str_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: m.why,
            topic: "String Methods",
            difficulty: "Easy",
            subject: "Python"
          };
        }
      } else if (templateType === 5) {
        // Range & sum
        const n = 4 + Math.floor(Math.random() * 5); // 4 to 8
        const total = (n * (n - 1)) / 2; // sum(range(n))
        const qText = `What is the return value of print(sum(range(${n}))) in Python?`;
        if (!isExcluded(qText)) {
          const distractors = [String(total + n), String(Math.max(0, total - 1)), String(n * n), String(total + 1)];
          const { options, correctIndex } = buildOptions(String(total), distractors);
          candidate = {
            id: `py_proc_range_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `range(${n}) generates integers from 0 to ${n - 1}. The sum 0 + 1 + ... + ${n - 1} = ${total}.`,
            topic: "Range Function",
            difficulty: "Easy",
            subject: "Python"
          };
        }
      } else if (templateType === 6) {
        // Dictionary key access & get
        const dictQuestions = [
          { q: "d = {'a': 1, 'b': 2}\nprint(d.get('c', 100))", ans: "100", why: "dict.get(key, default) returns the specified default when the key is not present." },
          { q: "d = {'x': 10, 'y': 20}\nprint(len(d.keys()))", ans: "2", why: "The dictionary contains 2 distinct keys ('x' and 'y')." },
          { q: "d = {'name': 'Alice'}\nprint('age' in d)", ans: "False", why: "The 'in' operator checks for membership of keys; 'age' is not in the dictionary." },
          { q: "d = {'p': 5, 'q': 15}\nprint(d.pop('p'))", ans: "5", why: "pop('p') removes key 'p' and returns its associated value (5)." }
        ];
        const dq = pickRandom(dictQuestions);
        const qText = `What is the output of the following Python code?\n${dq.q}`;
        if (!isExcluded(qText)) {
          const distractors = ["None", "KeyError", "0", "True", "1", "15"];
          const { options, correctIndex } = buildOptions(dq.ans, distractors);
          candidate = {
            id: `py_proc_dict_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: dq.why,
            topic: "Dictionaries",
            difficulty: "Easy",
            subject: "Python"
          };
        }
      } else if (templateType === 7) {
        // List append / pop
        const listQuestions = [
          { q: "arr = [1, 2, 3]\narr.append(4)\nprint(len(arr))", ans: "4", why: "append() adds an item to the end of the list, increasing its length by 1." },
          { q: "arr = [10, 20, 30]\nval = arr.pop()\nprint(val)", ans: "30", why: "pop() with no arguments removes and returns the last element of the list." },
          { q: "nums = [1, 2, 3]\nnums.extend([4, 5])\nprint(len(nums))", ans: "5", why: "extend() appends all elements of an iterable, resulting in 5 items." },
          { q: "a = [1, 2]\nb = a * 2\nprint(b)", ans: "[1, 2, 1, 2]", why: "Multiplying a list repeats its sequence." }
        ];
        const lq = pickRandom(listQuestions);
        const qText = `What will the following Python script print?\n${lq.q}`;
        if (!isExcluded(qText)) {
          const distractors = ["3", "10", "20", "[1, 2]", "None", "[2, 4]"];
          const { options, correctIndex } = buildOptions(lq.ans, distractors);
          candidate = {
            id: `py_proc_lops_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: lq.why,
            topic: "List Methods",
            difficulty: "Easy",
            subject: "Python"
          };
        }
      } else if (templateType === 8) {
        // Set Operations
        const a = 1 + (attempts % 4);
        const b = a + 1;
        const c = b + 1;
        const d = c + 1;
        const qText = `What is the result of len(set([${a}, ${b}, ${c}]) | set([${b}, ${c}, ${d}])) in Python?`;
        if (!isExcluded(qText)) {
          const ans = "4";
          const distractors = ["2", "3", "5", "6"];
          const { options, correctIndex } = buildOptions(ans, distractors);
          candidate = {
            id: `py_proc_set_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `The '|' union operator combines all unique elements across both sets: {${a}, ${b}, ${c}, ${d}}, which has length 4.`,
            topic: "Sets",
            difficulty: "Easy",
            subject: "Python"
          };
        }
      } else if (templateType === 9) {
        // Tuple indexing
        const vals = [10 * (attempts % 5 + 1), 20 * (attempts % 3 + 1), 30 * (attempts % 4 + 1), 40];
        const qText = `Given the Python tuple values = (${vals.join(", ")}), what is the value of values[-1]?`;
        if (!isExcluded(qText)) {
          const ans = String(vals[vals.length - 1]);
          const distractors = [String(vals[0]), String(vals[1]), "IndexError", "None"];
          const { options, correctIndex } = buildOptions(ans, distractors);
          candidate = {
            id: `py_proc_tup_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: "Negative indexing in Python accesses elements from the end: -1 is the last item.",
            topic: "Tuples",
            difficulty: "Easy",
            subject: "Python"
          };
        }
      } else if (templateType === 10) {
        // Comparison Chaining
        const x = 5 + (attempts % 7);
        const y = x + 3;
        const z = y + 2;
        const qText = `In Python, what is the boolean outcome of: ${x} < ${y} < ${z}?`;
        if (!isExcluded(qText)) {
          const ans = "True";
          const distractors = ["False", "SyntaxError", "None"];
          const { options, correctIndex } = buildOptions(ans, distractors);
          candidate = {
            id: `py_proc_cmp_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `Python supports chained comparisons: '${x} < ${y} < ${z}' is equivalent to '${x} < ${y} and ${y} < ${z}', which evaluates to True.`,
            topic: "Comparisons",
            difficulty: "Easy",
            subject: "Python"
          };
        }
      } else if (templateType === 11) {
        // Math Builtins: abs and min/max
        const n1 = -10 - (attempts % 15);
        const n2 = 5 + (attempts % 8);
        const qText = `What is the output of print(abs(${n1}) + min(${n2}, 25)) in Python?`;
        if (!isExcluded(qText)) {
          const ans = String(Math.abs(n1) + Math.min(n2, 25));
          const distractors = [String(n1 + n2), String(Math.abs(n1) + 25), String(n1 + 25), String(Math.abs(n1))];
          const { options, correctIndex } = buildOptions(ans, distractors);
          candidate = {
            id: `py_proc_math_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `abs(${n1}) evaluates to ${Math.abs(n1)}, and min(${n2}, 25) is ${Math.min(n2, 25)}. Their sum is ${ans}.`,
            topic: "Built-in Functions",
            difficulty: "Easy",
            subject: "Python"
          };
        }
      } else if (templateType === 12) {
        // String splitting
        const wordsArr = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon"].slice(0, 3 + (attempts % 3));
        const joined = wordsArr.join("-");
        const qText = `What is the return value of len("${joined}".split("-")) in Python?`;
        if (!isExcluded(qText)) {
          const ans = String(wordsArr.length);
          const distractors = [String(wordsArr.length - 1), String(wordsArr.length + 1), "1", String(joined.length)];
          const { options, correctIndex } = buildOptions(ans, distractors);
          candidate = {
            id: `py_proc_split_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `split("-") breaks the string at each hyphen delimiter into a list of ${wordsArr.length} elements.`,
            topic: "String Methods",
            difficulty: "Easy",
            subject: "Python"
          };
        }
      } else if (templateType === 13) {
        // String repetition
        const countRep = 2 + (attempts % 4);
        const sub = ["py", "go", "ai", "js"][attempts % 4];
        const qText = `What does the Python expression print("${sub}" * ${countRep}) display?`;
        if (!isExcluded(qText)) {
          const ans = sub.repeat(countRep);
          const distractors = [`${sub}${countRep}`, `${sub} + ${countRep}`, "TypeError", sub];
          const { options, correctIndex } = buildOptions(ans, distractors);
          candidate = {
            id: `py_proc_rep_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `In Python, multiplying a string by an integer n repeats the string sequence n times.`,
            topic: "Strings",
            difficulty: "Easy",
            subject: "Python"
          };
        }
      } else if (templateType === 14) {
        // Type conversion
        const intVal = 10 + (attempts % 20);
        const floatVal = 5.0;
        const qText = `What is the evaluated type of: type(int("${intVal}") + ${floatVal}).__name__?`;
        if (!isExcluded(qText)) {
          const ans = "'float'";
          const distractors = ["'int'", "'str'", "'number'", "TypeError"];
          const { options, correctIndex } = buildOptions(ans, distractors);
          candidate = {
            id: `py_proc_conv_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: "Adding an integer and a float in Python implicitly promotes the result to a float.",
            topic: "Type Conversion",
            difficulty: "Easy",
            subject: "Python"
          };
        }
      } else {
        // In-place assignment
        const base = 5 + (attempts % 10);
        const add = 3 + (attempts % 5);
        const qText = `What is the value of x after executing:\nx = ${base}\nx += ${add}\nx *= 2?`;
        if (!isExcluded(qText)) {
          const ans = String((base + add) * 2);
          const distractors = [String(base + add * 2), String(base * 2 + add), String((base + add)), String(base * 2)];
          const { options, correctIndex } = buildOptions(ans, distractors);
          candidate = {
            id: `py_proc_asn_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `First x += ${add} sets x to ${base + add}. Then x *= 2 multiplies ${base + add} by 2 to yield ${ans}.`,
            topic: "Assignment Operators",
            difficulty: "Easy",
            subject: "Python"
          };
        }
      }
    } else if (difficulty === "Medium") {
      const mediumCases = [
        {
          q: "What is the output of: [x**2 for x in range(5) if x % 2 == 1]?",
          ans: "[1, 9]",
          distractors: ["[0, 4, 16]", "[1, 4, 9]", "[1, 9, 25]", "[0, 1, 4]"],
          why: "range(5) produces 0, 1, 2, 3, 4. The odd numbers are 1 and 3. Their squares are 1 and 9.",
          topic: "List Comprehensions"
        },
        {
          q: "What will print(list(zip([1, 2], ['a', 'b', 'c']))) output in Python 3?",
          ans: "[(1, 'a'), (2, 'b')]",
          distractors: ["[(1, 'a'), (2, 'b'), (None, 'c')]", "ValueError", "[(1, 2), ('a', 'b', 'c')]", "((1, 'a'), (2, 'b'))"],
          why: "zip() stops when the shortest input iterable is exhausted.",
          topic: "Built-in Functions"
        },
        {
          q: "What happens when executing:\ndef add_item(x, target=[]):\n    target.append(x)\n    return target\nprint(add_item(1))\nprint(add_item(2))",
          ans: "It prints [1] followed by [1, 2]",
          distractors: ["It prints [1] followed by [2]", "It throws UnboundLocalError", "It prints [1] followed by [1]", "It prints [2] followed by [2]"],
          why: "Default argument values are evaluated once when the function is defined, causing mutable default lists to persist across function calls.",
          topic: "Function Arguments"
        },
        {
          q: "In Python, what is the key difference between '==' and 'is'?",
          ans: "'==' checks value equality, whereas 'is' checks object identity in memory",
          distractors: [
            "'is' checks value equality, whereas '==' checks object identity",
            "'==' only works on numbers; 'is' works on strings",
            "There is no difference; they are exact aliases",
            "'is' converts types automatically before comparison"
          ],
          why: "'==' calls __eq__ to compare values, while 'is' compares memory addresses (id(a) == id(b)).",
          topic: "Identity vs Equality"
        },
        {
          q: "What is the result of print(set([1, 2, 2, 3]) & set([2, 3, 4]))?",
          ans: "{2, 3}",
          distractors: ["{1, 2, 3, 4}", "{1, 4}", "[2, 3]", "None"],
          why: "The '&' operator computes set intersection, returning common elements {2, 3}.",
          topic: "Sets"
        },
        {
          q: "What will be printed by:\ntry:\n    val = 10 / 0\nexcept ZeroDivisionError:\n    val = 5\nfinally:\n    val = 20\nprint(val)",
          ans: "20",
          distractors: ["5", "10", "ZeroDivisionError", "None"],
          why: "The 'finally' block always executes before leaving the try/except structure, reassigning val to 20.",
          topic: "Exception Handling"
        },
        {
          q: "What will print(sorted(['apple', 'banana', 'kiwi'], key=lambda x: len(x))[0]) output?",
          ans: "'kiwi'",
          distractors: ["'apple'", "'banana'", "4", "'a'"],
          why: "Sorting by string length places 'kiwi' (length 4) first before 'apple' (5) and 'banana' (6).",
          topic: "Lambda Functions"
        }
      ];
      const mc = pickRandom(mediumCases);
      if (!isExcluded(mc.q)) {
        const { options, correctIndex } = buildOptions(mc.ans, mc.distractors);
        candidate = {
          id: `py_proc_med_${Date.now()}_${attempts}`,
          question: mc.q,
          options,
          correctIndex,
          explanation: mc.why,
          topic: mc.topic,
          difficulty: "Medium",
          subject: "Python"
        };
      }
    } else {
      // Hard
      const hardCases = [
        {
          q: "How does Python resolve method calls in multiple inheritance hierarchies?",
          ans: "Using the C3 Linearization algorithm to determine Method Resolution Order (MRO)",
          distractors: [
            "Using standard Depth-First Search (DFS) with leftmost priority",
            "Using Breadth-First Search (BFS) exclusively",
            "By alphabetical ordering of parent class names"
          ],
          why: "Python 2.3+ uses the C3 superclass linearization algorithm to ensure monotonic class hierarchy ordering.",
          topic: "OOP & MRO"
        },
        {
          q: "What is the primary operational effect of defining '__slots__' in a custom Python class?",
          ans: "It prevents creation of the instance '__dict__' and restricts attribute names to save memory",
          distractors: [
            "It turns the class into a thread-safe synchronized monitor",
            "It automatically compiles the class methods to C bytecode",
            "It enables private access modifiers on all class variables"
          ],
          why: "__slots__ replaces instance dictionaries with a fixed-size descriptor array, significantly reducing memory footprint.",
          topic: "Memory & Descriptors"
        },
        {
          q: "In Python's asyncio module, what is the fundamental difference between a Coroutine and a Task?",
          ans: "A Task is an asyncio.Future subclass that schedules the coroutine onto the event loop immediately",
          distractors: [
            "A Coroutine runs on a separate OS thread, while a Task runs on the main thread",
            "A Task can only be executed once across the entire application lifecycle",
            "Coroutines cannot be awaited; only Tasks can be awaited"
          ],
          why: "Wrapping a coroutine in asyncio.create_task() schedules it concurrently on the event loop as a Task.",
          topic: "Asyncio & Concurrency"
        },
        {
          q: "What does the Global Interpreter Lock (GIL) in CPython prevent?",
          ans: "Multiple native threads from executing Python bytecode simultaneously",
          distractors: [
            "Any multithreaded I/O operations from taking place",
            "Memory leaks in cyclic reference garbage collection",
            "Process forks on Linux environments"
          ],
          why: "The CPython GIL is a mutex that protects access to Python objects, preventing multiple native threads from running bytecode concurrently.",
          topic: "CPython Internals"
        }
      ];
      const hc = pickRandom(hardCases);
      if (!isExcluded(hc.q)) {
        const { options, correctIndex } = buildOptions(hc.ans, hc.distractors);
        candidate = {
          id: `py_proc_hard_${Date.now()}_${attempts}`,
          question: hc.q,
          options,
          correctIndex,
          explanation: hc.why,
          topic: hc.topic,
          difficulty: "Hard",
          subject: "Python"
        };
      }
    }

    if (candidate) {
      excludeNormalizedSet.add(candidate.question.trim().toLowerCase().replace(/\s+/g, " "));
      results.push(candidate);
    }
  }

  return results;
}

// ============================================================================
// 2. APTITUDE PROCEDURAL GENERATORS (Quantitative, Logical, Verbal)
// ============================================================================

export function generateProceduralAptitudeQuestions(
  section: "Quantitative Aptitude" | "Logical Reasoning" | "Verbal Ability" | "All",
  count: number,
  historyTexts: string[] = []
): AptitudeQuestion[] {
  const results: AptitudeQuestion[] = [];
  let attempts = 0;
  const maxAttempts = count * 60;

  const isExcluded = (qText: string) => {
    if (historyTexts.some(prev => areQuestionsDuplicate(prev, qText))) return true;
    if (results.some(r => areQuestionsDuplicate(r.question, qText))) return true;
    return false;
  };

  while (results.length < count && attempts < maxAttempts) {
    attempts++;
    let candidate: AptitudeQuestion | null = null;
    const targetSec = section === "All" ? pickRandom(["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability"] as const) : section;

    if (targetSec === "Quantitative Aptitude") {
      const quantType = attempts % 13;

      if (quantType === 0) {
        // Percentages
        const base = (1 + Math.floor(Math.random() * 25)) * 40; // 40, 80, 120, ... 1000
        const pct = pickRandom([5, 10, 12, 15, 20, 25, 30, 35, 40, 50, 75]);
        const ans = Math.round((pct / 100) * base);
        const qText = `What is ${pct}% of ${base}?`;
        if (!isExcluded(qText)) {
          const distractors = [String(ans + 10), String(Math.max(5, ans - 10)), String(ans + 25), String(Math.round(ans * 1.5))];
          const { options, correctIndex } = buildOptions(String(ans), distractors);
          candidate = {
            id: `apt_proc_pct_${Date.now()}_${attempts}`,
            section: "Quantitative Aptitude",
            topic: "Percentages",
            question: qText,
            options,
            correctIndex,
            explanation: `${pct}% of ${base} = (${pct} / 100) * ${base} = ${ans}.`
          };
        }
      } else if (quantType === 1) {
        // Profit & Loss
        const cp = (2 + Math.floor(Math.random() * 15)) * 100;
        const profitPct = pickRandom([10, 15, 20, 25, 30, 40, 50]);
        const sp = Math.round(cp * (1 + profitPct / 100));
        const qText = `An engineer purchases test hardware for $${cp} and sells it for $${sp}. What is the percentage profit gained?`;
        if (!isExcluded(qText)) {
          const distractors = [`${profitPct + 5}%`, `${Math.max(5, profitPct - 5)}%`, `${profitPct + 10}%`, `${profitPct + 15}%`];
          const { options, correctIndex } = buildOptions(`${profitPct}%`, distractors);
          candidate = {
            id: `apt_proc_pnl_${Date.now()}_${attempts}`,
            section: "Quantitative Aptitude",
            topic: "Profit & Loss",
            question: qText,
            options,
            correctIndex,
            explanation: `Profit = $${sp} - $${cp} = $${sp - cp}. Profit % = ((${sp - cp}) / ${cp}) * 100 = ${profitPct}%.`
          };
        }
      } else if (quantType === 2) {
        // Time & Work
        const daysA = pickRandom([6, 8, 10, 12, 15, 20]);
        const daysB = pickRandom([12, 16, 20, 24, 30, 60]);
        const combined = (daysA * daysB) / (daysA + daysB);
        if (Number.isInteger(combined) || combined * 10 === Math.round(combined * 10)) {
          const ansStr = `${Number.isInteger(combined) ? combined : combined.toFixed(1)} days`;
          const qText = `Technician A completes a laboratory calibration in ${daysA} hours, while Technician B completes the identical task in ${daysB} hours. Working together, in how many hours will they complete the calibration?`;
          if (!isExcluded(qText)) {
            const distractors = [`${Math.round(combined + 2)} days`, `${Math.max(1, Math.round(combined - 1))} days`, `${Math.round(combined + 4)} days`, `${Math.round(combined * 2)} days`];
            const { options, correctIndex } = buildOptions(ansStr, distractors);
            candidate = {
              id: `apt_proc_work_${Date.now()}_${attempts}`,
              section: "Quantitative Aptitude",
              topic: "Time & Work",
              question: qText,
              options,
              correctIndex,
              explanation: `Rate of A = 1/${daysA}, Rate of B = 1/${daysB}. Combined rate = 1/${daysA} + 1/${daysB} = ${(daysA + daysB)}/${daysA * daysB}. Time = ${ansStr}.`
            };
          }
        }
      } else if (quantType === 3) {
        // Speed, Distance, Time
        const speedKmph = pickRandom([36, 54, 72, 90, 108]);
        const speedMps = (speedKmph * 5) / 18;
        const timeSec = pickRandom([12, 15, 18, 20, 25, 30]);
        const lengthM = speedMps * timeSec;
        const qText = `A train moving at a constant speed of ${speedKmph} km/h passes a stationary transmission tower in ${timeSec} seconds. What is the length of the train?`;
        if (!isExcluded(qText)) {
          const distractors = [`${lengthM + 50} meters`, `${Math.max(50, lengthM - 50)} meters`, `${lengthM + 100} meters`, `${lengthM * 2} meters`];
          const { options, correctIndex } = buildOptions(`${lengthM} meters`, distractors);
          candidate = {
            id: `apt_proc_train_${Date.now()}_${attempts}`,
            section: "Quantitative Aptitude",
            topic: "Speed Distance Time",
            question: qText,
            options,
            correctIndex,
            explanation: `Speed in m/s = ${speedKmph} * (5/18) = ${speedMps} m/s. Length = Speed * Time = ${speedMps} * ${timeSec} = ${lengthM} meters.`
          };
        }
      } else if (quantType === 4) {
        // Ratio & Proportion
        const r1 = pickRandom([2, 3, 4, 5]);
        const r2 = pickRandom([5, 7, 8, 9]);
        const multiplier = pickRandom([15, 20, 25, 35, 50]);
        const sum = (r1 + r2) * multiplier;
        const share1 = r1 * multiplier;
        const qText = `A total research budget of $${sum} is split between Project Alpha and Project Beta in the ratio ${r1}:${r2}. What is the budget allocated to Project Alpha?`;
        if (!isExcluded(qText)) {
          const distractors = [`$${r2 * multiplier}`, `$${share1 + 50}`, `$${Math.max(20, share1 - 50)}`, `$${Math.round(sum / 2)}`];
          const { options, correctIndex } = buildOptions(`$${share1}`, distractors);
          candidate = {
            id: `apt_proc_ratio_${Date.now()}_${attempts}`,
            section: "Quantitative Aptitude",
            topic: "Ratio & Proportion",
            question: qText,
            options,
            correctIndex,
            explanation: `Total ratio parts = ${r1} + ${r2} = ${r1 + r2}. Value per part = $${sum} / ${r1 + r2} = $${multiplier}. Alpha = ${r1} * $${multiplier} = $${share1}.`
          };
        }
      } else if (quantType === 5) {
        // Simple Interest
        const p = pickRandom([1000, 2000, 3000, 5000, 8000, 10000]);
        const r = pickRandom([4, 5, 6, 8, 10, 12]);
        const t = pickRandom([2, 3, 4, 5]);
        const si = (p * r * t) / 100;
        const qText = `Calculate the simple interest accrued on an engineering equipment loan of $${p} at ${r}% per annum over ${t} years.`;
        if (!isExcluded(qText)) {
          const distractors = [`$${si + 100}`, `$${Math.max(50, si - 100)}`, `$${si + 250}`, `$${si * 2}`];
          const { options, correctIndex } = buildOptions(`$${si}`, distractors);
          candidate = {
            id: `apt_proc_si_${Date.now()}_${attempts}`,
            section: "Quantitative Aptitude",
            topic: "Simple Interest",
            question: qText,
            options,
            correctIndex,
            explanation: `Simple Interest = (P * R * T) / 100 = (${p} * ${r} * ${t}) / 100 = $${si}.`
          };
        }
      } else if (quantType === 6) {
        // Compound Interest
        const p = pickRandom([1000, 2000, 5000, 10000]);
        const r = pickRandom([10, 20]);
        const t = pickRandom([2, 3]);
        const amount = Math.round(p * Math.pow(1 + r / 100, t));
        const ci = amount - p;
        const qText = `What is the compound interest on a principal amount of $${p} at ${r}% per annum compounded annually for ${t} years?`;
        if (!isExcluded(qText)) {
          const distractors = [`$${ci + 100}`, `$${Math.max(20, ci - 100)}`, `$${ci + 150}`, `$${Math.round(ci * 1.25)}`];
          const { options, correctIndex } = buildOptions(`$${ci}`, distractors);
          candidate = {
            id: `apt_proc_ci_${Date.now()}_${attempts}`,
            section: "Quantitative Aptitude",
            topic: "Compound Interest",
            question: qText,
            options,
            correctIndex,
            explanation: `Amount = P * (1 + r/100)^t = ${p} * (1 + ${r}/100)^${t} = $${amount}. Compound Interest = $${amount} - $${p} = $${ci}.`
          };
        }
      } else if (quantType === 7) {
        // Permutations & Combinations
        const n = pickRandom([5, 6, 7]);
        const r = pickRandom([2, 3]);
        let ways = 1;
        for (let i = 0; i < r; i++) ways *= (n - i);
        let rFact = 1;
        for (let i = 1; i <= r; i++) rFact *= i;
        const nCr = ways / rFact;
        const qText = `In how many different ways can a committee of ${r} software engineers be selected from a pool of ${n} candidates?`;
        if (!isExcluded(qText)) {
          const distractors = [String(nCr + 5), String(Math.max(2, nCr - 3)), String(nCr * 2), String(nCr + 10)];
          const { options, correctIndex } = buildOptions(String(nCr), distractors);
          candidate = {
            id: `apt_proc_comb_${Date.now()}_${attempts}`,
            section: "Quantitative Aptitude",
            topic: "Combinations",
            question: qText,
            options,
            correctIndex,
            explanation: `Formula: nCr = n! / (r! * (n - r)!). Here ${n}C${r} = ${nCr} distinct ways.`
          };
        }
      } else if (quantType === 8) {
        // Probability
        const red = pickRandom([3, 4, 5]);
        const blue = pickRandom([4, 5, 6]);
        const total = red + blue;
        const qText = `A container holds ${red} red sensors and ${blue} blue sensors. If one sensor is chosen at random, what is the probability that it is red?`;
        if (!isExcluded(qText)) {
          const ansStr = `${red}/${total}`;
          const distractors = [`${blue}/${total}`, `1/${red}`, `1/${total}`, `${red}/${blue}`];
          const { options, correctIndex } = buildOptions(ansStr, distractors);
          candidate = {
            id: `apt_proc_prob_${Date.now()}_${attempts}`,
            section: "Quantitative Aptitude",
            topic: "Probability",
            question: qText,
            options,
            correctIndex,
            explanation: `Total favorable outcomes = ${red}. Total possible outcomes = ${red} + ${blue} = ${total}. Probability = ${red}/${total}.`
          };
        }
      } else if (quantType === 9) {
        // Problems on Ages
        const sonAge = pickRandom([10, 12, 14, 15]);
        const mult = pickRandom([3, 4]);
        const fatherAge = sonAge * mult;
        const diff = fatherAge - sonAge;
        const qText = `A senior engineer is ${mult} times as old as an intern. If the difference between their ages is ${diff} years, how old is the intern?`;
        if (!isExcluded(qText)) {
          const distractors = [String(sonAge + 2), String(sonAge - 2), String(sonAge + 5), String(sonAge * 2)];
          const { options, correctIndex } = buildOptions(String(sonAge), distractors);
          candidate = {
            id: `apt_proc_ages_${Date.now()}_${attempts}`,
            section: "Quantitative Aptitude",
            topic: "Ages",
            question: qText,
            options,
            correctIndex,
            explanation: `Let intern's age = x. Senior engineer's age = ${mult}x. Difference: ${mult}x - x = ${diff} => ${mult - 1}x = ${diff} => x = ${sonAge} years.`
          };
        }
      } else if (quantType === 10) {
        // Averages
        const countN = pickRandom([4, 5]);
        const avg = pickRandom([60, 70, 75, 80, 85]);
        const totalSum = countN * avg;
        const givenSum = totalSum - avg - 5;
        const lastVal = totalSum - givenSum;
        const qText = `The average test score of ${countN} programming modules is ${avg}. If the sum of scores of ${countN - 1} modules is ${givenSum}, what is the score of the remaining module?`;
        if (!isExcluded(qText)) {
          const distractors = [String(lastVal + 5), String(lastVal - 5), String(lastVal + 10), String(avg)];
          const { options, correctIndex } = buildOptions(String(lastVal), distractors);
          candidate = {
            id: `apt_proc_avg_${Date.now()}_${attempts}`,
            section: "Quantitative Aptitude",
            topic: "Averages",
            question: qText,
            options,
            correctIndex,
            explanation: `Total sum required = ${countN} * ${avg} = ${totalSum}. Remaining module = ${totalSum} - ${givenSum} = ${lastVal}.`
          };
        }
      } else if (quantType === 11) {
        // Number Systems: HCF / LCM
        const a = pickRandom([12, 15, 18, 24]);
        const b = pickRandom([16, 20, 30, 36]);
        const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
        const hcf = gcd(a, b);
        const lcm = (a * b) / hcf;
        const qText = `What is the Least Common Multiple (LCM) of the integers ${a} and ${b}?`;
        if (!isExcluded(qText)) {
          const distractors = [String(lcm + 12), String(Math.max(10, lcm - 12)), String(a * b), String(hcf)];
          const { options, correctIndex } = buildOptions(String(lcm), distractors);
          candidate = {
            id: `apt_proc_lcm_${Date.now()}_${attempts}`,
            section: "Quantitative Aptitude",
            topic: "Number Systems",
            question: qText,
            options,
            correctIndex,
            explanation: `LCM(${a}, ${b}) = (${a} * ${b}) / HCF(${a}, ${b}) = (${a * b}) / ${hcf} = ${lcm}.`
          };
        }
      } else {
        // Pipes & Cisterns
        const pA = pickRandom([10, 12, 15, 20]);
        const pB = pickRandom([15, 20, 30, 60]);
        const combRate = (pA * pB) / (pA + pB);
        if (Number.isInteger(combRate)) {
          const qText = `Inlet pipe A can fill a cooling tank in ${pA} minutes and inlet pipe B can fill it in ${pB} minutes. If both pipes are opened simultaneously, how long will it take to fill the tank?`;
          if (!isExcluded(qText)) {
            const ansStr = `${combRate} minutes`;
            const distractors = [`${combRate + 2} minutes`, `${Math.max(2, combRate - 2)} minutes`, `${combRate + 5} minutes`, `${pA + pB} minutes`];
            const { options, correctIndex } = buildOptions(ansStr, distractors);
            candidate = {
              id: `apt_proc_pipes_${Date.now()}_${attempts}`,
              section: "Quantitative Aptitude",
              topic: "Pipes & Cisterns",
              question: qText,
              options,
              correctIndex,
              explanation: `1-minute combined work = 1/${pA} + 1/${pB} = ${(pA + pB)}/${pA * pB}. Total time = ${combRate} minutes.`
            };
          }
        }
      }
    } else if (targetSec === "Logical Reasoning") {
      const logicalType = attempts % 8;

      if (logicalType === 0) {
        // Arithmetic Progression
        const start = pickRandom([3, 5, 7, 11, 14, 20, 25]);
        const step = pickRandom([4, 6, 7, 9, 11, 13, 15]);
        const seq = [start, start + step, start + 2 * step, start + 3 * step];
        const nextVal = start + 4 * step;
        const qText = `Find the missing next term in the arithmetic sequence: ${seq.join(", ")}, ?`;
        if (!isExcluded(qText)) {
          const distractors = [String(nextVal + step), String(nextVal - 2), String(nextVal + 3), String(nextVal - step)];
          const { options, correctIndex } = buildOptions(String(nextVal), distractors);
          candidate = {
            id: `apt_proc_numseq_${Date.now()}_${attempts}`,
            section: "Logical Reasoning",
            topic: "Number Series",
            question: qText,
            options,
            correctIndex,
            explanation: `Each consecutive term increases by +${step}. Thus, ${seq[3]} + ${step} = ${nextVal}.`
          };
        }
      } else if (logicalType === 1) {
        // Geometric progression
        const ratio = pickRandom([2, 3]);
        const base = pickRandom([2, 3, 5, 7]);
        const s0 = base;
        const s1 = s0 * ratio;
        const s2 = s1 * ratio;
        const s3 = s2 * ratio;
        const nextVal = s3 * ratio;
        const qText = `Identify the next number in the geometric series: ${s0}, ${s1}, ${s2}, ${s3}, ?`;
        if (!isExcluded(qText)) {
          const distractors = [String(nextVal + ratio), String(nextVal - ratio), String(nextVal * 2), String(s3 + ratio * 2)];
          const { options, correctIndex } = buildOptions(String(nextVal), distractors);
          candidate = {
            id: `apt_proc_geoseq_${Date.now()}_${attempts}`,
            section: "Logical Reasoning",
            topic: "Number Series",
            question: qText,
            options,
            correctIndex,
            explanation: `Each term is multiplied by a common ratio of ${ratio}: ${s3} * ${ratio} = ${nextVal}.`
          };
        }
      } else if (logicalType === 2) {
        // Direction Sense with Pythagorean distance
        const dNorth = pickRandom([6, 8, 12]);
        const dEast = pickRandom([8, 6, 9]);
        const dist = Math.round(Math.sqrt(dNorth * dNorth + dEast * dEast));
        if (Number.isInteger(dist)) {
          const qText = `An autonomous drone flies ${dNorth} meters North, then turns 90 degrees right and flies ${dEast} meters East. What is the shortest straight-line distance from its starting point?`;
          if (!isExcluded(qText)) {
            const ansStr = `${dist} meters`;
            const distractors = [`${dNorth + dEast} meters`, `${dist + 2} meters`, `${Math.max(4, dist - 2)} meters`, `${dist * 2} meters`];
            const { options, correctIndex } = buildOptions(ansStr, distractors);
            candidate = {
              id: `apt_proc_dir_${Date.now()}_${attempts}`,
              section: "Logical Reasoning",
              topic: "Direction Sense",
              question: qText,
              options,
              correctIndex,
              explanation: `By Pythagorean theorem: Distance = sqrt(${dNorth}^2 + ${dEast}^2) = sqrt(${dNorth * dNorth} + ${dEast * dEast}) = ${dist} meters.`
            };
          }
        }
      } else if (logicalType === 3) {
        // Coding-Decoding (Caesar shift)
        const words = [
          { original: "CODE", shift: 1, coded: "DPEF" },
          { original: "JAVA", shift: 1, coded: "KBWB" },
          { original: "BYTE", shift: 2, coded: "DAUG" },
          { original: "NODE", shift: 1, coded: "OPEF" },
          { original: "DATA", shift: 2, coded: "FCVC" }
        ];
        const w = pickRandom(words);
        const qText = `If in a certain code language '${w.original}' is written as '${w.coded}', what is the encoding rule applied?`;
        if (!isExcluded(qText)) {
          const ansStr = `Each letter is shifted forward by +${w.shift}`;
          const distractors = [
            `Each letter is shifted backward by -${w.shift}`,
            `The letters are written in reverse order`,
            `Vowels and consonants are inverted`
          ];
          const { options, correctIndex } = buildOptions(ansStr, distractors);
          candidate = {
            id: `apt_proc_code_${Date.now()}_${attempts}`,
            section: "Logical Reasoning",
            topic: "Coding-Decoding",
            question: qText,
            options,
            correctIndex,
            explanation: `Comparing letters: every alphabet in '${w.original}' advances by +${w.shift} positions to produce '${w.coded}'.`
          };
        }
      } else if (logicalType === 4) {
        // Blood Relations
        const bloodCases = [
          {
            q: "Pointing to a photograph, a woman says: 'He is the son of the only daughter of my father.' How is the man in the photograph related to the woman?",
            ans: "Son",
            distractors: ["Brother", "Father", "Nephew"],
            why: "The only daughter of her father is the woman herself. Therefore, the man is her son."
          },
          {
            q: "Introducing a man, a person says: 'His mother is the only daughter of my mother.' How is the person related to the man if the speaker is female?",
            ans: "Mother",
            distractors: ["Aunt", "Sister", "Grandmother"],
            why: "The only daughter of the speaker's mother is the female speaker herself. Hence she is his mother."
          },
          {
            q: "A is the brother of B. B is the sister of C. D is the father of A. How is D related to C?",
            ans: "Father",
            distractors: ["Uncle", "Brother", "Grandfather"],
            why: "Since A, B, and C are siblings and D is the father of A, D is the father of C as well."
          }
        ];
        const bc = pickRandom(bloodCases);
        if (!isExcluded(bc.q)) {
          const { options, correctIndex } = buildOptions(bc.ans, bc.distractors);
          candidate = {
            id: `apt_proc_blood_${Date.now()}_${attempts}`,
            section: "Logical Reasoning",
            topic: "Blood Relations",
            question: bc.q,
            options,
            correctIndex,
            explanation: bc.why
          };
        }
      } else if (logicalType === 5) {
        // Syllogisms
        const syllogisms = [
          {
            q: "Statements:\n- All microprocessors are semiconductor devices.\n- All semiconductor devices require electrical power.\nConclusions:\nI. All microprocessors require electrical power.\nII. Some microprocessors do not require electrical power.",
            ans: "Only conclusion I follows",
            distractors: ["Only conclusion II follows", "Both conclusions I and II follow", "Neither conclusion follows"],
            why: "By transitive property: Microprocessors ⊂ Semiconductor Devices ⊂ Power-requiring devices. Therefore, all microprocessors require electrical power."
          },
          {
            q: "Statements:\n- Some compilers are open-source.\n- All open-source tools are free to inspect.\nConclusions:\nI. Some compilers are free to inspect.\nII. All compilers are free to inspect.",
            ans: "Only conclusion I follows",
            distractors: ["Only conclusion II follows", "Both conclusions I and II follow", "Neither conclusion follows"],
            why: "Only the subset of compilers that are open-source are guaranteed to be free to inspect."
          },
          {
            q: "Statements:\n- No optical storage is volatile memory.\n- All RAM modules are volatile memory.\nConclusions:\nI. No RAM module is optical storage.\nII. Some optical storage is RAM.",
            ans: "Only conclusion I follows",
            distractors: ["Only conclusion II follows", "Both conclusions I and II follow", "Neither conclusion follows"],
            why: "Since optical storage and volatile memory are disjoint sets, no RAM (which is volatile) can be optical storage."
          }
        ];
        const s = pickRandom(syllogisms);
        if (!isExcluded(s.q)) {
          const { options, correctIndex } = buildOptions(s.ans, s.distractors);
          candidate = {
            id: `apt_proc_syl_${Date.now()}_${attempts}`,
            section: "Logical Reasoning",
            topic: "Syllogisms",
            question: s.q,
            options,
            correctIndex,
            explanation: s.why
          };
        }
      } else if (logicalType === 6) {
        // Clocks and Angles
        const hours = pickRandom([2, 3, 4, 5, 7, 8, 9, 10]);
        // Angle at H:00 = |30 * H - 0| degrees (smaller angle: min(angle, 360 - angle))
        let rawAngle = hours * 30;
        if (rawAngle > 180) rawAngle = 360 - rawAngle;
        const qText = `What is the smaller angle between the hour hand and the minute hand of an analog clock at exactly ${hours}:00 o'clock?`;
        if (!isExcluded(qText)) {
          const ansStr = `${rawAngle}°`;
          const distractors = [`${rawAngle + 15}°`, `${Math.max(15, rawAngle - 15)}°`, `${rawAngle + 30}°`, `${360 - rawAngle}°`].filter(d => d !== ansStr);
          const { options, correctIndex } = buildOptions(ansStr, distractors);
          candidate = {
            id: `apt_proc_clock_${Date.now()}_${attempts}`,
            section: "Logical Reasoning",
            topic: "Clocks",
            question: qText,
            options,
            correctIndex,
            explanation: `At ${hours}:00, minute hand is at 12 (0°) and hour hand is at ${hours} * 30° = ${hours * 30}°. Angle = ${rawAngle}°.`
          };
        }
      } else {
        // Linear Seating Arrangement
        const qText = "Five engineers (A, B, C, D, E) sit in a row facing North. A is to the immediate right of B. E is to the left of B but to the right of C. D is at the extreme right end. Who is sitting in the exact middle of the row?";
        if (!isExcluded(qText)) {
          const { options, correctIndex } = buildOptions("B", ["A", "C", "E"]);
          candidate = {
            id: `apt_proc_seat_${Date.now()}_${attempts}`,
            section: "Logical Reasoning",
            topic: "Seating Arrangement",
            question: qText,
            options,
            correctIndex,
            explanation: "Order from left to right: C, E, B, A, D. The middle person is B."
          };
        }
      }
    } else {
      // Verbal Ability
      const verbalPool = [
        {
          q: "Select the word that is most nearly SYNONYMOUS with 'PRAGMATIC':",
          ans: "Practical and realistic",
          distractors: ["Idealistic and dreamy", "Theoretical and abstract", "Hesitant and timid"],
          why: "Pragmatic refers to dealing with things sensibly and realistically based on practical considerations rather than theoretical ones."
        },
        {
          q: "Select the word that is directly OPPOSITE (ANTONYM) in meaning to 'EPHEMERAL':",
          ans: "Permanent and enduring",
          distractors: ["Transient and brief", "Fleeting and quick", "Fragile and breakable"],
          why: "Ephemeral means lasting for a very short time; its direct antonym is permanent or enduring."
        },
        {
          q: "Select the word that is most nearly SYNONYMOUS with 'UBIQUITOUS':",
          ans: "Omnipresent, found everywhere",
          distractors: ["Extremely rare", "Dangerous and lethal", "Underground and hidden"],
          why: "Ubiquitous means present, appearing, or found everywhere simultaneously."
        },
        {
          q: "Select the word that is directly OPPOSITE (ANTONYM) in meaning to 'CANDID':",
          ans: "Deceitful or guarded",
          distractors: ["Truthful and honest", "Outspoken and frank", "Gentle and calm"],
          why: "Candid denotes truthful, straightforward, and frank. Its antonym is deceptive or guarded."
        },
        {
          q: "Select the word that is most nearly SYNONYMOUS with 'METICULOUS':",
          ans: "Painstakingly careful and precise",
          distractors: ["Careless and hasty", "Aggressive and bold", "Indifferent and cold"],
          why: "Meticulous means showing great attention to detail; very careful and precise."
        },
        {
          q: "Select the word that is directly OPPOSITE (ANTONYM) in meaning to 'RESILIENT':",
          ans: "Fragile and easily broken",
          distractors: ["Elastic and flexible", "Robust and tough", "Determined and hardy"],
          why: "Resilient describes an entity able to withstand or recover quickly from difficult conditions."
        },
        {
          q: "Select the word that is most nearly SYNONYMOUS with 'AMBIGUOUS':",
          ans: "Equivocal or open to more than one interpretation",
          distractors: ["Crystal clear and distinct", "Loud and resonant", "Dangerous and volatile"],
          why: "Ambiguous describes language or situations having multiple possible interpretations or unclear meaning."
        },
        {
          q: "Identify the grammatically correct sentence:",
          ans: "Neither the team lead nor the developers were available for the code deployment.",
          distractors: [
            "Neither the team lead nor the developers was available for the code deployment.",
            "Neither the team lead or the developers were available for the code deployment.",
            "Neither the team lead nor the developers are not available for the code deployment."
          ],
          why: "In 'neither... nor' constructions, the verb agrees in person and number with the closer subject ('developers' is plural -> 'were')."
        },
        {
          q: "Identify the grammatically correct sentence regarding subject-verb agreement:",
          ans: "A collection of rare engineering microcontrollers was displayed in the exhibition hall.",
          distractors: [
            "A collection of rare engineering microcontrollers were displayed in the exhibition hall.",
            "A collection of rare engineering microcontrollers are displayed in the exhibition hall.",
            "A collection of rare engineering microcontrollers have been displayed in the exhibition hall."
          ],
          why: "The grammatical subject is the singular collective noun 'collection', which takes the singular verb 'was'."
        },
        {
          q: "Choose the exact meaning of the idiom 'CUTTING-EDGE':",
          ans: "Highly advanced, modern, and at the forefront of development",
          distractors: [
            "Sharp enough to cut paper cleanly",
            "Dangerous and reckless in methodology",
            "Expensive and prone to frequent hardware failures"
          ],
          why: "'Cutting-edge' idiomatically denotes the most advanced or pioneering stage in a technology or field."
        },
        {
          q: "Choose the exact meaning of the idiom 'BURN THE MIDNIGHT OIL':",
          ans: "Work or study late into the night",
          distractors: [
            "Waste fuel carelessly",
            "Start an accidental workshop fire",
            "Give up on a challenging assignment"
          ],
          why: "'Burn the midnight oil' means to read, study, or work late into the nighttime hours."
        },
        {
          q: "Select the word that best completes the sentence: 'The software architecture was designed to be highly ________, allowing it to seamlessly handle 10x traffic spikes.'",
          ans: "scalable",
          distractors: ["fragile", "inflexible", "obsolete"],
          why: "'Scalable' accurately describes a system capable of growing and managing increased workloads gracefully."
        },
        {
          q: "Select the word that best completes the sentence: 'The lead architect gave a ________ explanation that resolved all ambiguities during the sprint review.'",
          ans: "lucid",
          distractors: ["convoluted", "murky", "hostile"],
          why: "'Lucid' means expressed clearly and easy to comprehend."
        },
        {
          q: "Choose the one-word substitution for: 'A person who has comprehensive knowledge across many varied subjects.'",
          ans: "Polymath",
          distractors: ["Specialist", "Amateur", "Optimist"],
          why: "A polymath is an individual of wide-ranging knowledge or learning across diverse disciplines."
        },
        {
          q: "Identify the correct active voice form of: 'The bug was resolved by the software team in under two hours.'",
          ans: "The software team resolved the bug in under two hours.",
          distractors: [
            "The software team was resolving the bug in under two hours.",
            "The bug resolved the software team in under two hours.",
            "In under two hours the bug has been resolved by the software team."
          ],
          why: "Active voice places the agent ('The software team') as the subject followed by past simple verb ('resolved')."
        }
      ];

      const vc = pickRandom(verbalPool);
      if (!isExcluded(vc.q)) {
        const { options, correctIndex } = buildOptions(vc.ans, vc.distractors);
        candidate = {
          id: `apt_proc_verb_${Date.now()}_${attempts}`,
          section: "Verbal Ability",
          topic: "Vocabulary & Grammar",
          question: vc.q,
          options,
          correctIndex,
          explanation: vc.why
        };
      }
    }

    if (candidate) {
      results.push(candidate);
    }
  }

  return results;
}

// ============================================================================
// 3. UNIVERSAL PROCEDURAL GENERATOR FOR ALL 9 BRANCHES & SUBJECTS
// ============================================================================

export function generateProceduralBranchQuestions(
  branch: string,
  subject: string,
  difficulty: "Easy" | "Medium" | "Hard",
  count: number,
  excludeNormalizedSet: Set<string>,
  previousTexts: string[] = []
): QuizQuestion[] {
  const results: QuizQuestion[] = [];
  let attempts = 0;
  const maxAttempts = Math.max(count * 100, 1000);

  const isExcluded = (qText: string) => {
    const norm = qText.trim().toLowerCase().replace(/\s+/g, " ");
    if (excludeNormalizedSet.has(norm)) return true;
    if (previousTexts.some((prev) => areQuestionsDuplicate(prev, qText))) return true;
    if (results.some((r) => areQuestionsDuplicate(r.question, qText))) return true;
    return false;
  };

  const normSub = (subject || "").toLowerCase().trim();
  const normBranch = (branch || "").toLowerCase().trim();

  while (results.length < count && attempts < maxAttempts) {
    attempts++;
    let candidate: QuizQuestion | null = null;
    const mode = attempts % 8;

    // ------------------------------------------------------------------------
    // THERMODYNAMICS (Mechanical, Chemical)
    // ------------------------------------------------------------------------
    if (normSub.includes("thermo")) {
      if (mode === 0 || mode === 1) {
        // Carnot engine efficiency
        const tH = 600 + (attempts * 47) % 600; // 600 to 1200 K
        const tC = 300 + (attempts * 23) % 150; // 300 to 450 K
        const eff = Math.round((1 - tC / tH) * 100);
        const qText = `A Carnot heat engine operates between a source temperature of ${tH} K and a sink temperature of ${tC} K. What is the theoretical maximum thermal efficiency of this engine?`;
        if (!isExcluded(qText)) {
          const { options, correctIndex } = buildOptions(
            `${eff}%`,
            [`${eff - 12}%`, `${eff + 10 > 98 ? 98 : eff + 10}%`, `${Math.round((tC / tH) * 100)}%`]
          );
          candidate = {
            id: `proc_thermo_carnot_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `Carnot efficiency is given by eta = 1 - (T_sink / T_source) = 1 - (${tC} / ${tH}) = ${eff}%.`,
            topic: "Carnot Cycle",
            difficulty,
            subject
          };
        }
      } else if (mode === 2) {
        // First Law Work / Heat
        const qIn = 250 + (attempts * 31) % 500;
        const wOut = 80 + (attempts * 19) % 150;
        const dU = qIn - wOut;
        const qText = `During a non-flow closed system process, a system absorbs ${qIn} kJ of heat while performing ${wOut} kJ of boundary work. What is the net change in internal energy (Delta U)?`;
        if (!isExcluded(qText)) {
          const { options, correctIndex } = buildOptions(
            `+${dU} kJ`,
            [`-${dU} kJ`, `+${qIn + wOut} kJ`, `+${Math.round(qIn / wOut)} kJ`]
          );
          candidate = {
            id: `proc_thermo_firstlaw_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `By the First Law of Thermodynamics for a closed system, Q = Delta U + W => Delta U = Q - W = ${qIn} - ${wOut} = +${dU} kJ.`,
            topic: "First Law of Thermodynamics",
            difficulty,
            subject
          };
        }
      } else {
        const concepts = [
          {
            q: `In thermodynamics, what property is defined as the measure of microscopic molecular disorder or irreversibility?`,
            a: "Entropy (S)",
            d: ["Enthalpy (H)", "Exergy", "Specific Volume"],
            exp: "Entropy is a state function quantifying microscopic disorder and system irreversibility according to the Second Law."
          },
          {
            q: `What condition characterizes an adiabatic thermodynamic process?`,
            a: "Zero heat transfer across the system boundary (Q = 0)",
            d: ["Constant temperature throughout (T = const)", "Constant pressure (P = const)", "Zero work interaction (W = 0)"],
            exp: "An adiabatic process is insulated such that no heat crosses the boundary (dQ = 0)."
          },
          {
            q: `Which thermodynamic relationship defines total enthalpy (H)?`,
            a: "H = U + P*V",
            d: ["H = U - T*S", "H = Q + W", "H = P*V / T"],
            exp: "Enthalpy is defined as the sum of internal energy and flow work: H = U + PV."
          }
        ];
        const c = concepts[attempts % concepts.length];
        if (!isExcluded(c.q)) {
          const { options, correctIndex } = buildOptions(c.a, c.d);
          candidate = {
            id: `proc_thermo_concept_${Date.now()}_${attempts}`,
            question: c.q,
            options,
            correctIndex,
            explanation: c.exp,
            topic: "Thermodynamic Principles",
            difficulty,
            subject
          };
        }
      }
    }

    // ------------------------------------------------------------------------
    // FLUID MECHANICS (Mechanical, Civil, Chemical)
    // ------------------------------------------------------------------------
    else if (normSub.includes("fluid")) {
      if (mode === 0 || mode === 1) {
        // Hydrostatic pressure P = rho * g * h
        const h = 5 + (attempts * 7) % 45; // 5 to 50 meters
        const pKPa = Math.round((1000 * 9.81 * h) / 1000);
        const qText = `Calculate the gauge hydrostatic pressure at a water depth of ${h} m in a reservoir (density of water = 1000 kg/m³, g = 9.81 m/s²):`;
        if (!isExcluded(qText)) {
          const { options, correctIndex } = buildOptions(
            `${pKPa} kPa`,
            [`${pKPa * 10} kPa`, `${Math.round(pKPa * 0.5)} kPa`, `${pKPa + 98} kPa`]
          );
          candidate = {
            id: `proc_fluid_hydro_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `Hydrostatic pressure P = rho * g * h = 1000 * 9.81 * ${h} = ${pKPa * 1000} Pa = ${pKPa} kPa.`,
            topic: "Hydrostatics",
            difficulty,
            subject
          };
        }
      } else if (mode === 2) {
        // Continuity equation A1*V1 = A2*V2
        const v1 = 2 + (attempts % 4); // 2, 3, 4, 5 m/s
        const ratio = 2; // diameter halved => area drops by 4 => velocity quadruples
        const v2 = v1 * 4;
        const qText = `In steady incompressible pipe flow, water flows at ${v1} m/s through a pipe of diameter D. If the pipe diameter is reduced to D/2 at a constriction, what is the new flow velocity?`;
        if (!isExcluded(qText)) {
          const { options, correctIndex } = buildOptions(
            `${v2} m/s`,
            [`${v1 * 2} m/s`, `${v1} m/s`, `${(v1 / 2).toFixed(1)} m/s`]
          );
          candidate = {
            id: `proc_fluid_contin_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `By continuity: A1 * V1 = A2 * V2. Since area is proportional to D², halving D reduces area by a factor of 4, so V2 = 4 * V1 = ${v2} m/s.`,
            topic: "Continuity Equation",
            difficulty,
            subject
          };
        }
      } else {
        const concepts = [
          {
            q: "What dimensionless number determines whether internal pipe flow is laminar (Re < 2000) or turbulent (Re > 4000)?",
            a: "Reynolds Number (Re)",
            d: ["Prandtl Number (Pr)", "Froude Number (Fr)", "Mach Number (Ma)"],
            exp: "Reynolds number represents the ratio of inertial forces to viscous forces in fluid motion."
          },
          {
            q: "Bernoulli's equation is a statement of which fundamental physical conservation principle?",
            a: "Conservation of mechanical energy for an inviscid, incompressible fluid in streamline flow",
            d: ["Conservation of linear momentum", "Conservation of mass", "Second law of thermodynamics"],
            exp: "Bernoulli's equation equates the sum of pressure energy, kinetic energy, and potential energy along a streamline."
          },
          {
            q: "What is the SI unit of dynamic (absolute) viscosity?",
            a: "Pascal-second (Pa*s) or kg/(m*s)",
            d: ["Poiseuille / second", "m²/s", "Newton / meter"],
            exp: "Dynamic viscosity SI units are Pa*s (Pascal-seconds) or N*s/m²."
          }
        ];
        const c = concepts[attempts % concepts.length];
        if (!isExcluded(c.q)) {
          const { options, correctIndex } = buildOptions(c.a, c.d);
          candidate = {
            id: `proc_fluid_concept_${Date.now()}_${attempts}`,
            question: c.q,
            options,
            correctIndex,
            explanation: c.exp,
            topic: "Fluid Principles",
            difficulty,
            subject
          };
        }
      }
    }

    // ------------------------------------------------------------------------
    // STRENGTH OF MATERIALS & ENGINEERING MECHANICS (Mechanical, Civil)
    // ------------------------------------------------------------------------
    else if (normSub.includes("strength") || normSub.includes("mechanics") || normSub.includes("solidworks") || normSub.includes("autocad") || normSub.includes("staad")) {
      if (mode === 0 || mode === 1) {
        // Stress = Force / Area
        const loadKN = 20 + (attempts * 13) % 80;
        const areaMM2 = 100 + (attempts * 25) % 300;
        const stress = Math.round((loadKN * 1000) / areaMM2);
        const qText = `A structural tie bar of cross-sectional area ${areaMM2} mm² carries an axial tensile load of ${loadKN} kN. What is the induced normal tensile stress?`;
        if (!isExcluded(qText)) {
          const { options, correctIndex } = buildOptions(
            `${stress} MPa`,
            [`${stress * 10} MPa`, `${Math.round(stress * 0.5)} MPa`, `${stress + 45} MPa`]
          );
          candidate = {
            id: `proc_som_stress_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `Normal stress sigma = Load / Area = (${loadKN} * 1000 N) / ${areaMM2} mm² = ${stress} N/mm² = ${stress} MPa.`,
            topic: "Normal Stress",
            difficulty,
            subject
          };
        }
      } else {
        const concepts = [
          {
            q: "According to Hooke's Law within the proportional elastic limit, stress is directly proportional to:",
            a: "Strain",
            d: ["Temperature", "Volume", "Poisson's ratio"],
            exp: "Hooke's law states that stress is directly proportional to strain up to the proportional elastic limit: sigma = E * epsilon."
          },
          {
            q: "In the Euler-Bernoulli bending equation (sigma/y = M/I = E/R), what does 'I' represent?",
            a: "Second moment of area (area moment of inertia) of the cross-section",
            d: ["Mass moment of inertia", "Polar radius of gyration", "Section modulus"],
            exp: "I denotes the second moment of area about the neutral axis."
          },
          {
            q: "What structural analysis command in STAAD.Pro or civil engineering defines support boundary conditions where neither translation nor rotation is permitted?",
            a: "Fixed Support",
            d: ["Pinned Support", "Roller Support", "Spring Support"],
            exp: "A fixed support constrains all 6 degrees of freedom (3 translations and 3 rotations)."
          },
          {
            q: "In parametric 3D CAD modeling (SolidWorks/AutoCAD), what geometric mate aligns two cylindrical surfaces along a common axis of rotation?",
            a: "Concentric Mate",
            d: ["Coincident Mate", "Parallel Mate", "Tangent Mate"],
            exp: "A concentric mate forces the axes of two cylindrical or conical faces to be collinear."
          }
        ];
        const c = concepts[attempts % concepts.length];
        if (!isExcluded(c.q)) {
          const { options, correctIndex } = buildOptions(c.a, c.d);
          candidate = {
            id: `proc_som_concept_${Date.now()}_${attempts}`,
            question: c.q,
            options,
            correctIndex,
            explanation: c.exp,
            topic: "Mechanics Principles",
            difficulty,
            subject
          };
        }
      }
    }

    // ------------------------------------------------------------------------
    // ELECTRICAL & ELECTRONICS (Circuit Theory, Machines, Power, E&TC, Embedded C, Verilog)
    // ------------------------------------------------------------------------
    else if (
      normSub.includes("circuit") ||
      normSub.includes("electrical") ||
      normSub.includes("power") ||
      normSub.includes("embedded") ||
      normSub.includes("verilog") ||
      normSub.includes("analog") ||
      normSub.includes("digital") ||
      normSub.includes("microcontroller") ||
      normSub.includes("communication") ||
      normSub.includes("plc") ||
      normSub.includes("simulink")
    ) {
      if (mode === 0 || mode === 1) {
        // Synchronous speed Ns = 120 * f / P
        const poles = pickRandom([2, 4, 6, 8]);
        const freq = 50; // 50 Hz standard
        const ns = Math.round((120 * freq) / poles);
        const qText = `What is the synchronous speed (Ns) in RPM of a ${poles}-pole 3-phase induction motor supplied from a ${freq} Hz AC grid?`;
        if (!isExcluded(qText)) {
          const { options, correctIndex } = buildOptions(
            `${ns} RPM`,
            [`${ns - 250 < 300 ? 750 : ns - 250} RPM`, `${ns + 300} RPM`, `${Math.round(ns * 1.5)} RPM`]
          );
          candidate = {
            id: `proc_elec_ns_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `Synchronous speed Ns = (120 * f) / P = (120 * ${freq}) / ${poles} = ${ns} RPM.`,
            topic: "Electrical Machines",
            difficulty,
            subject
          };
        }
      } else if (mode === 2) {
        // Resonant frequency f0 = 1 / (2*pi*sqrt(L*C)) or Ohm's Law
        const r1 = 10 + (attempts * 5) % 40;
        const r2 = 20 + (attempts * 7) % 60;
        const v = 60 + (attempts * 12) % 120;
        const rTotal = r1 + r2;
        const current = (v / rTotal).toFixed(2);
        const qText = `Two resistors R1 = ${r1} ohms and R2 = ${r2} ohms are connected in series across a ${v} V DC source. What is the current drawn from the supply?`;
        if (!isExcluded(qText)) {
          const { options, correctIndex } = buildOptions(
            `${current} A`,
            [`${(Number(current) * 2).toFixed(2)} A`, `${(v / r1).toFixed(2)} A`, `${(v / r2).toFixed(2)} A`]
          );
          candidate = {
            id: `proc_elec_ohm_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `Series equivalent resistance Req = R1 + R2 = ${r1} + ${r2} = ${rTotal} ohms. By Ohm's law: I = V / Req = ${v} / ${rTotal} = ${current} A.`,
            topic: "DC Circuits",
            difficulty,
            subject
          };
        }
      } else {
        const concepts = [
          {
            q: "Why is the 'volatile' keyword mandatory when declaring hardware memory-mapped peripheral pointers in Embedded C?",
            a: "To tell the compiler optimization engine not to cache the register value in CPU registers",
            d: ["To store the variable in non-volatile flash memory", "To enable DMA automatic transfer", "To convert 8-bit variables to 32-bit"],
            exp: "'volatile' forces the compiler to read directly from the physical memory address every time, preventing optimizer caching."
          },
          {
            q: "In synthesizable Verilog HDL, what assignment operator models non-blocking synchronous edge-triggered register transfers?",
            a: "<= (Non-blocking assignment)",
            d: ["= (Blocking assignment)", "assign (Continuous assignment)", "== (Equality comparison)"],
            exp: "Non-blocking assignments (<=) update at the end of the simulation time step, accurately modeling sequential clock-driven flip-flops."
          },
          {
            q: "According to Nyquist's sampling theorem, to prevent aliasing, the minimum sampling frequency (fs) for a signal with maximum frequency fm must be:",
            a: "fs >= 2 * fm",
            d: ["fs = fm / 2", "fs >= 4 * fm", "fs = fm"],
            exp: "The Nyquist criterion requires sampling at at least twice the highest frequency component of the signal."
          },
          {
            q: "In an ideal operational amplifier (Op-Amp) with negative feedback, what are the two golden rules?",
            a: "Zero input bias currents (I+ = I- = 0) and virtual short between input terminals (V+ = V-)",
            d: ["Zero open loop gain and infinite output resistance", "Unity gain bandwidth of zero", "Equal positive and negative supply rail voltages"],
            exp: "Ideal op-amps have infinite input impedance (zero input current) and infinite open-loop gain (forcing V+ = V- under negative feedback)."
          }
        ];
        const c = concepts[attempts % concepts.length];
        if (!isExcluded(c.q)) {
          const { options, correctIndex } = buildOptions(c.a, c.d);
          candidate = {
            id: `proc_elec_concept_${Date.now()}_${attempts}`,
            question: c.q,
            options,
            correctIndex,
            explanation: c.exp,
            topic: "Electronics Principles",
            difficulty,
            subject
          };
        }
      }
    }

    // ------------------------------------------------------------------------
    // CIVIL ENGINEERING (Surveying, Geotechnical, Transportation, Environmental)
    // ------------------------------------------------------------------------
    else if (
      normSub.includes("survey") ||
      normSub.includes("geotech") ||
      normSub.includes("structural") ||
      normSub.includes("construction") ||
      normSub.includes("environmental") ||
      normSub.includes("transportation")
    ) {
      if (mode === 0 || mode === 1) {
        // Surveying: Fore Bearing to Back Bearing
        const fb = 35 + (attempts * 29) % 140; // 35 to 175 degrees
        const bb = fb + 180;
        const qText = `In plane surveying, if the Fore Bearing (FB) of a line AB is observed as ${fb}° 00', what is the corresponding Back Bearing (BB)?`;
        if (!isExcluded(qText)) {
          const { options, correctIndex } = buildOptions(
            `${bb}° 00'`,
            [`${180 - fb}° 00'`, `${360 - fb}° 00'`, `${fb + 90}° 00'`]
          );
          candidate = {
            id: `proc_civil_bearing_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `When Fore Bearing is less than 180°, Back Bearing = Fore Bearing + 180° = ${fb}° + 180° = ${bb}° 00'.`,
            topic: "Compass Surveying",
            difficulty,
            subject
          };
        }
      } else {
        const concepts = [
          {
            q: "In soil mechanics and geotechnical engineering, what is the formula relating void ratio (e) and porosity (n)?",
            a: "n = e / (1 + e)",
            d: ["n = e / (1 - e)", "n = 1 + e", "n = e * (1 + e)"],
            exp: "Porosity n = V_v / V_total = e / (1 + e), where e is the void ratio V_v / V_s."
          },
          {
            q: "What is the primary objective of rapid sand filtration in municipal water treatment plants?",
            a: "Removal of residual suspended colloidal particles and floc from clarified water",
            d: ["Desalination of dissolved minerals", "Disinfection of all bacterial pathogens", "Removal of dissolved oxygen"],
            exp: "Rapid sand filtration removes remaining finely divided floc and suspended solids after sedimentation."
          },
          {
            q: "In transportation highway geometric design, what physical purpose does super-elevation (banking) serve on horizontal curves?",
            a: "To counteract the overturning and outward sliding tendency caused by centrifugal force",
            d: ["To increase tire friction wear", "To allow rainwater to pool on the road", "To decrease vehicle sight distance"],
            exp: "Super-elevation tilts the roadway inward to counteract centrifugal force with vehicle weight component."
          }
        ];
        const c = concepts[attempts % concepts.length];
        if (!isExcluded(c.q)) {
          const { options, correctIndex } = buildOptions(c.a, c.d);
          candidate = {
            id: `proc_civil_concept_${Date.now()}_${attempts}`,
            question: c.q,
            options,
            correctIndex,
            explanation: c.exp,
            topic: "Civil Engineering",
            difficulty,
            subject
          };
        }
      }
    }

    // ------------------------------------------------------------------------
    // CHEMICAL ENGINEERING (Heat/Mass Transfer, Reaction Eng, Process Control)
    // ------------------------------------------------------------------------
    else if (
      normSub.includes("heat transfer") ||
      normSub.includes("mass transfer") ||
      normSub.includes("reaction") ||
      normSub.includes("process control") ||
      normSub.includes("aspen")
    ) {
      if (mode === 0 || mode === 1) {
        // Conduction Q = k * A * DeltaT / L
        const k = 45; // thermal conductivity W/(m*K)
        const a = 2; // area m²
        const dt = 50 + (attempts * 10) % 150; // delta T
        const l = 0.1; // thickness 10 cm = 0.1 m
        const qHeat = Math.round((k * a * dt) / l);
        const qText = `A flat plane furnace wall of area ${a} m² and thickness ${l} m has thermal conductivity k = ${k} W/(m·K). If the temperature difference across the faces is ${dt} °C, what is the rate of heat conduction?`;
        if (!isExcluded(qText)) {
          const { options, correctIndex } = buildOptions(
            `${qHeat} W`,
            [`${qHeat * 10} W`, `${Math.round(qHeat * 0.1)} W`, `${qHeat + 1200} W`]
          );
          candidate = {
            id: `proc_chem_heat_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `By Fourier's Law: Q = (k * A * DeltaT) / L = (${k} * ${a} * ${dt}) / ${l} = ${qHeat} W.`,
            topic: "Conduction Heat Transfer",
            difficulty,
            subject
          };
        }
      } else {
        const concepts = [
          {
            q: "In Chemical Reaction Engineering, what ideal reactor model assumes perfect spatial mixing such that output composition equals internal vessel composition?",
            a: "Continuous Stirred Tank Reactor (CSTR)",
            d: ["Plug Flow Reactor (PFR)", "Packed Bed Reactor (PBR)", "Semi-batch reactor"],
            exp: "A CSTR operates at steady state with uniform internal temperature and concentration identical to the exit stream."
          },
          {
            q: "What graphical method in mass transfer is standard for calculating theoretical stages in binary distillation columns?",
            a: "McCabe-Thiele Method",
            d: ["Ponchon-Savarit Method", "Fenske Equation", "Ergun Equation"],
            exp: "McCabe-Thiele uses vapor-liquid equilibrium (VLE) curves and operating lines under constant molar overflow."
          },
          {
            q: "Fick's first law of molecular diffusion defines mass flux as directly proportional to negative:",
            a: "Concentration gradient (dC/dz)",
            d: ["Temperature gradient", "Pressure divergence", "Viscosity index"],
            exp: "Fick's first law states J = -D_AB * (dC_A / dz), showing flux is driven down the concentration gradient."
          }
        ];
        const c = concepts[attempts % concepts.length];
        if (!isExcluded(c.q)) {
          const { options, correctIndex } = buildOptions(c.a, c.d);
          candidate = {
            id: `proc_chem_concept_${Date.now()}_${attempts}`,
            question: c.q,
            options,
            correctIndex,
            explanation: c.exp,
            topic: "Chemical Engineering",
            difficulty,
            subject
          };
        }
      }
    }

    // ------------------------------------------------------------------------
    // DATA SCIENCE & AI/ML (Statistics, Machine Learning, Deep Learning, SQL, etc.)
    // ------------------------------------------------------------------------
    else if (
      normSub.includes("machine learning") ||
      normSub.includes("deep learning") ||
      normSub.includes("artificial intelligence") ||
      normSub.includes("statistic") ||
      normSub.includes("numpy") ||
      normSub.includes("pandas") ||
      normSub.includes("data analysis") ||
      normSub.includes("visualization") ||
      normSub.includes("sql")
    ) {
      if (mode === 0 || mode === 1) {
        // Confusion matrix calculation: Precision or Recall
        const tp = 80 + (attempts * 7) % 40;
        const fp = 10 + (attempts * 3) % 20;
        const fn = 15 + (attempts * 4) % 25;
        const precision = Math.round((tp / (tp + fp)) * 100);
        const qText = `In evaluating a binary classification model: True Positives (TP) = ${tp}, False Positives (FP) = ${fp}, False Negatives (FN) = ${fn}. What is the model's Precision?`;
        if (!isExcluded(qText)) {
          const { options, correctIndex } = buildOptions(
            `${precision}%`,
            [`${Math.round((tp / (tp + fn)) * 100)}%`, `${precision - 15}%`, `${precision + 10 > 100 ? 99 : precision + 10}%`]
          );
          candidate = {
            id: `proc_ml_prec_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `Precision = TP / (TP + FP) = ${tp} / (${tp} + ${fp}) = ${precision}%.`,
            topic: "Model Evaluation",
            difficulty,
            subject
          };
        }
      } else {
        const concepts = [
          {
            q: "What statistical problem occurs when a machine learning model learns training data noise and performs poorly on unseen test data?",
            a: "Overfitting (High Variance)",
            d: ["Underfitting (High Bias)", "Data leakage", "Gradient explosion"],
            exp: "Overfitting occurs when a high-capacity model fits training anomalies rather than true underlying population patterns."
          },
          {
            q: "In deep learning, which activation function mitigates the vanishing gradient problem in deep feedforward networks by outputting max(0, x)?",
            a: "ReLU (Rectified Linear Unit)",
            d: ["Sigmoid", "Hyperbolic Tangent (tanh)", "Softmax"],
            exp: "ReLU has a constant derivative of 1 for positive inputs, eliminating vanishing gradients along active paths."
          },
          {
            q: "In SQL, which clause filters rows AFTER an aggregate GROUP BY operation has been computed?",
            a: "HAVING",
            d: ["WHERE", "ORDER BY", "QUALIFY"],
            exp: "HAVING filters groups post-aggregation, while WHERE filters individual records pre-aggregation."
          },
          {
            q: "In Pandas, what is the primary structural difference between a Series and a DataFrame?",
            a: "A Series is 1-dimensional with labeled index; a DataFrame is 2-dimensional tabular with row and column labels",
            d: ["A Series cannot store strings", "A DataFrame has no index", "A Series has multiple columns"],
            exp: "A Pandas DataFrame is a 2D labeled tabular container composed of individual 1D Series columns."
          }
        ];
        const c = concepts[attempts % concepts.length];
        if (!isExcluded(c.q)) {
          const { options, correctIndex } = buildOptions(c.a, c.d);
          candidate = {
            id: `proc_ds_concept_${Date.now()}_${attempts}`,
            question: c.q,
            options,
            correctIndex,
            explanation: c.exp,
            topic: "Data Science & AI",
            difficulty,
            subject
          };
        }
      }
    }

    // ------------------------------------------------------------------------
    // C++ & C PROGRAMMING
    // ------------------------------------------------------------------------
    else if (normSub.includes("c++") || normSub.includes("cpp") || normSub === "c" || normSub.includes(" c ") || normSub.startsWith("c ")) {
      const subMode = attempts % 7;
      if (subMode === 0) {
        // Dynamic Pointer Arithmetic & Array Indexing
        const seed = attempts * 13 + results.length * 37;
        const v0 = 10 + (seed % 23);
        const v1 = v0 + 7 + (seed % 19);
        const v2 = v1 + 11 + (seed % 29);
        const v3 = v2 + 13 + (seed % 31);
        const v4 = v3 + 17 + (seed % 41);
        const nums = [v0, v1, v2, v3, v4];
        const offset = 1 + (attempts % 3);
        const ans = nums[offset];
        const qText = `What is the output of the following C/C++ program snippet?\nint data[] = {${nums.join(", ")}};\nint *p = data;\nprintf("%d", *(p + ${offset}));`;
        if (!isExcluded(qText)) {
          const { options, correctIndex } = buildOptions(
            `${ans}`,
            [`${nums[0]}`, `${nums[offset - 1]}`, `${nums[offset + 1] || ans + 10}`]
          );
          candidate = {
            id: `proc_cpp_ptr_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `*(p + ${offset}) accesses the array element at index ${offset}, which evaluates to ${ans}.`,
            topic: "Pointers & Arrays",
            difficulty,
            subject: subject || "C++"
          };
        }
      } else if (subMode === 1) {
        // Dynamic Recursive Function Output
        const nVal = 3 + (attempts % 3); // 3, 4, 5
        const base = 1 + (attempts % 4);
        let expected = base;
        for (let k = 1; k <= nVal; k++) expected += k;
        const qText = `What will be returned by the following C++ function call: calcSum(${nVal})?\nint calcSum(int n) {\n  if (n <= 0) return ${base};\n  return n + calcSum(n - 1);\n}`;
        if (!isExcluded(qText)) {
          const { options, correctIndex } = buildOptions(
            `${expected}`,
            [`${expected - nVal}`, `${expected + 5}`, `${expected * 2}`]
          );
          candidate = {
            id: `proc_cpp_rec_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `calcSum(${nVal}) computes ${base} + sum(1..${nVal}) = ${expected}.`,
            topic: "Recursion",
            difficulty,
            subject: subject || "C++"
          };
        }
      } else if (subMode === 2) {
        // Dynamic Bitwise Operations
        const val = 16 + (attempts * 7) % 45;
        const shift = 1 + (attempts % 3);
        const isLeft = (attempts % 2 === 0);
        const res = isLeft ? val << shift : val >> shift;
        const op = isLeft ? "<<" : ">>";
        const qText = `What is the evaluated integer result of the C/C++ expression: (${val} ${op} ${shift})?`;
        if (!isExcluded(qText)) {
          const { options, correctIndex } = buildOptions(
            `${res}`,
            [`${res + 4}`, `${isLeft ? val * shift : Math.floor(val / shift)}`, `${res > 2 ? res - 2 : res + 8}`]
          );
          candidate = {
            id: `proc_cpp_bitwise_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `Bitwise ${isLeft ? "left shift (<<)" : "right shift (>>)"} by ${shift} ${isLeft ? "multiplies" : "divides"} ${val} by 2^${shift} = ${res}.`,
            topic: "Bitwise Operators",
            difficulty,
            subject: subject || "C++"
          };
        }
      } else if (subMode === 3) {
        // Dynamic String / Character Array Indexing
        const words = ["ENGINEERING", "STRUCTURES", "ALGORITHMS", "DEVELOPMENT", "POLYMORPHISM", "COMPILER", "INTERFACE", "DESTRUCTOR"];
        const word = words[attempts % words.length];
        const idx = 1 + (attempts % (word.length - 2));
        const ch = word[idx];
        const qText = `In C++, what character is printed by:\nstd::string s = "${word}";\nstd::cout << s[${idx}];`;
        if (!isExcluded(qText)) {
          const { options, correctIndex } = buildOptions(
            `'${ch}'`,
            [`'${word[idx - 1]}'`, `'${word[idx + 1]}'`, `'${word[0]}'`]
          );
          candidate = {
            id: `proc_cpp_str_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `String indexing is 0-based. Index ${idx} in "${word}" corresponds to character '${ch}'.`,
            topic: "Strings & Indexing",
            difficulty,
            subject: subject || "C++"
          };
        }
      } else if (subMode === 4) {
        // Dynamic Loop Increment Output
        const step = 2 + (attempts % 3);
        const limit = 10 + (attempts % 4) * step;
        let count = 0;
        for (let i = 0; i < limit; i += step) count++;
        const qText = `How many times will the body of the following C++ for-loop execute?\nfor (int i = 0; i < ${limit}; i += ${step}) {\n  // loop body\n}`;
        if (!isExcluded(qText)) {
          const { options, correctIndex } = buildOptions(
            `${count} times`,
            [`${count + 1} times`, `${count - 1} times`, `${limit} times`]
          );
          candidate = {
            id: `proc_cpp_loop_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `The loop variable starts at 0 and increments by ${step} until reaching ${limit}, running exactly ${count} times.`,
            topic: "Control Structures",
            difficulty,
            subject: subject || "C++"
          };
        }
      } else {
        const cppConcepts = [
          {
            q: "What is the primary difference between a reference and a pointer in C++?",
            a: "A reference is an immutable alias that must be initialized and cannot be null; a pointer can be null and reseated",
            d: [
              "Pointers require dynamic memory; references cannot use heap memory",
              "References can point to void; pointers cannot",
              "There is no difference in modern C++"
            ],
            exp: "References must bind to valid objects upon initialization and cannot be reseated or null."
          },
          {
            q: "Why should a base class destructor be declared as 'virtual' in polymorphic C++ inheritance?",
            a: "To ensure that derived class destructors are correctly invoked when deleting an object through a base pointer",
            d: [
              "To prevent instantiation of the derived class",
              "To speed up memory deallocation at runtime",
              "To allow private members to be inherited"
            ],
            exp: "Declaring the destructor virtual prevents undefined behavior and memory leaks by ensuring the full derived object is cleaned up."
          },
          {
            q: "In C++, what does the RAII (Resource Acquisition Is Initialization) idiom ensure?",
            a: "Resources (memory, file handles, mutexes) are bound to object lifetime and automatically released in destructors",
            d: [
              "All variables are allocated on the global heap",
              "Constructors can never throw exceptions",
              "Static variables are initialized before main() starts"
            ],
            exp: "RAII guarantees resource cleanup during stack unwinding or object destruction, eliminating resource leaks."
          },
          {
            q: "What is the time complexity of element lookup by key in std::map (balanced BST) vs std::unordered_map (hash table)?",
            a: "O(log N) for std::map and average O(1) for std::unordered_map",
            d: [
              "O(1) for std::map and O(N) for std::unordered_map",
              "O(N) for both",
              "O(log N) for both"
            ],
            exp: "std::map is implemented with Red-Black Trees (O(log N)), while std::unordered_map uses hash tables (average O(1))."
          },
          {
            q: "In C++, which keyword is used in a constructor to prevent implicit conversions from single arguments?",
            a: "explicit",
            d: ["const", "override", "final"],
            exp: "The 'explicit' keyword prevents the compiler from performing unwanted implicit type conversions."
          },
          {
            q: "What does the C++ 'std::move' function in <utility> actually do?",
            a: "It performs an unconditional static_cast to an rvalue reference (T&&)",
            d: [
              "It copies memory bytes to another register",
              "It deletes the original object from heap",
              "It allocates a new heap buffer"
            ],
            exp: "std::move does not move any bytes itself; it casts its argument to an rvalue reference to enable move semantics."
          },
          {
            q: "In C++, what is a pure virtual function?",
            a: "A virtual function declared with '= 0' in the base class, making the class abstract",
            d: [
              "A function written entirely in inline assembly",
              "A static member function that cannot access 'this'",
              "A friend function without access specifiers"
            ],
            exp: "A pure virtual function has no default implementation in the abstract base class and must be overridden by concrete derived classes."
          }
        ];
        const c = cppConcepts[attempts % cppConcepts.length];
        if (!isExcluded(c.q)) {
          const { options, correctIndex } = buildOptions(c.a, c.d);
          candidate = {
            id: `proc_cpp_concept_${Date.now()}_${attempts}`,
            question: c.q,
            options,
            correctIndex,
            explanation: c.exp,
            topic: "C++ Core Concepts",
            difficulty,
            subject: subject || "C++"
          };
        }
      }
    }

    // ------------------------------------------------------------------------
    // JAVA & OBJECT-ORIENTED PROGRAMMING
    // ------------------------------------------------------------------------
    else if (normSub.includes("java")) {
      const javaConcepts = [
        {
          q: "In Java, what is the key difference between String, StringBuilder, and StringBuffer?",
          a: "String is immutable; StringBuilder is mutable and non-thread-safe; StringBuffer is mutable and synchronized (thread-safe)",
          d: [
            "String is mutable; StringBuilder is immutable; StringBuffer is obsolete",
            "StringBuilder uses stack memory; String uses heap memory",
            "There is no performance difference between them"
          ],
          exp: "Strings cannot be modified once created. StringBuilder offers high-speed mutable manipulation; StringBuffer adds synchronization."
        },
        {
          q: "What does the '==' operator compare when applied to two non-primitive reference variables in Java?",
          a: "Memory address references (whether both refer to the exact same object)",
          d: [
            "Logical content equivalence of the objects",
            "The hashCodes returned by the objects",
            "The class loader metadata"
          ],
          exp: "'==' compares reference identity in heap memory; .equals() must be overridden for semantic value comparison."
        },
        {
          q: "In the Java Virtual Machine (JVM), which memory area is shared among all active threads?",
          a: "Heap memory and Method Area (Metaspace)",
          d: ["Java Thread Stack", "Program Counter (PC) Register", "Native Method Stack"],
          exp: "The Heap and Metaspace are shared across all threads; each thread maintains its own call stack and PC register."
        },
        {
          q: "What happens when an unhandled runtime exception occurs inside a Java thread?",
          a: "The thread terminates execution and dumps its stack trace to System.err",
          d: [
            "The entire JVM process immediately crashes",
            "The exception is automatically retried 3 times",
            "The thread enters an infinite blocking sleep"
          ],
          exp: "Uncaught exceptions terminate the offending thread without necessarily crashing other independent threads in the JVM."
        }
      ];
      const jc = javaConcepts[attempts % javaConcepts.length];
      if (!isExcluded(jc.q)) {
        const { options, correctIndex } = buildOptions(jc.a, jc.d);
        candidate = {
          id: `proc_java_concept_${Date.now()}_${attempts}`,
          question: jc.q,
          options,
          correctIndex,
          explanation: jc.exp,
          topic: "Java Fundamentals",
          difficulty,
          subject: "Java"
        };
      }
    }

    // ------------------------------------------------------------------------
    // SOFTWARE ENGINEERING, WEB DEVELOPMENT & CLOUD COMPUTING
    // ------------------------------------------------------------------------
    else if (
      normSub.includes("software") ||
      normSub.includes("cloud") ||
      normSub.includes("web") ||
      normSub.includes("devops")
    ) {
      const seMode = attempts % 6;
      if (seMode === 0) {
        // Agile / Scrum Velocity Sprint Calculation
        const velocity = 20 + (attempts * 7) % 30; // 20 to 50 story points
        const backlog = 120 + (attempts * 13) % 180; // 120 to 300 story points
        const sprints = Math.ceil(backlog / velocity);
        const qText = `In an Agile Scrum project, a development team maintains an average velocity of ${velocity} story points per 2-week sprint. If the remaining product backlog total is ${backlog} story points, how many full sprints are needed to complete the backlog?`;
        if (!isExcluded(qText)) {
          const { options, correctIndex } = buildOptions(
            `${sprints} sprints`,
            [`${sprints + 2} sprints`, `${sprints - 1 <= 0 ? sprints + 4 : sprints - 1} sprints`, `${Math.round(backlog / (velocity + 15))} sprints`]
          );
          candidate = {
            id: `proc_se_scrum_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `Sprints needed = ceil(Total Backlog / Sprint Velocity) = ceil(${backlog} / ${velocity}) = ${sprints} sprints.`,
            topic: "Agile Estimation",
            difficulty,
            subject: subject || "Software Engineering"
          };
        }
      } else if (seMode === 1) {
        // Cyclomatic Complexity McCabe formula V(G) = E - N + 2*P
        const n = 8 + (attempts % 6);
        const e = n + 3 + (attempts % 4);
        const p = 1; // single connected component
        const vG = e - n + 2 * p;
        const qText = `In software testing metrics, a program's Control Flow Graph has ${e} edges (E) and ${n} nodes (N) with ${p} connected component (P). According to McCabe's formula, what is its Cyclomatic Complexity V(G)?`;
        if (!isExcluded(qText)) {
          const { options, correctIndex } = buildOptions(
            `${vG}`,
            [`${vG + 2}`, `${vG - 1 < 1 ? vG + 3 : vG - 1}`, `${e + n}`]
          );
          candidate = {
            id: `proc_se_mccabe_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `McCabe's Cyclomatic Complexity V(G) = E - N + 2P = ${e} - ${n} + 2(${p}) = ${vG}.`,
            topic: "Cyclomatic Complexity",
            difficulty,
            subject: subject || "Software Engineering"
          };
        }
      } else if (seMode === 2) {
        // Cloud Instance Cost Calculation
        const instances = 4 + (attempts % 8);
        const hours = 50 + (attempts * 10) % 150;
        const rate = 0.25; // $0.25/hr
        const cost = (instances * hours * rate).toFixed(2);
        const qText = `A cloud application runs a cluster of ${instances} virtual machine instances for ${hours} hours. If each instance is billed at a spot rate of $${rate.toFixed(2)} per hour, what is the total compute cost?`;
        if (!isExcluded(qText)) {
          const { options, correctIndex } = buildOptions(
            `$${cost}`,
            [`$${(Number(cost) * 1.5).toFixed(2)}`, `$${(Number(cost) * 0.5).toFixed(2)}`, `$${(Number(cost) + 25).toFixed(2)}`]
          );
          candidate = {
            id: `proc_cloud_cost_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `Total Compute Cost = Instances * Hours * Rate = ${instances} * ${hours} * $${rate} = $${cost}.`,
            topic: "Cloud Economics",
            difficulty,
            subject: subject || "Cloud Computing"
          };
        }
      } else {
        const seConcepts = [
          {
            q: "In object-oriented software engineering, what does the Open/Closed Principle (OCP) state?",
            a: "Software entities (classes, modules, functions) should be open for extension, but closed for modification",
            d: [
              "Source code files must be open-source and publicly readable",
              "Database connections must be opened and closed within the same method",
              "Constructors cannot be overridden by subclasses"
            ],
            exp: "OCP states that systems should allow new behaviors to be added via extension (inheritance/interfaces) without altering existing verified code."
          },
          {
            q: "What software architectural pattern decouples an abstraction from its implementation so that both can vary independently?",
            a: "Bridge Pattern",
            d: ["Singleton Pattern", "Observer Pattern", "Facade Pattern"],
            exp: "The Bridge pattern separates an abstraction layer from its implementation layer using composition."
          },
          {
            q: "In Web Development, what is the primary security defense against Cross-Site Scripting (XSS) attacks?",
            a: "Context-aware output encoding, sanitization of user input, and Content Security Policy (CSP)",
            d: [
              "Using HTTP instead of HTTPS",
              "Storing sensitive tokens in plain text cookies",
              "Disabling all CSS animations"
            ],
            exp: "Escaping/encoding dynamic content before rendering into HTML prevents attackers from executing arbitrary injected scripts."
          },
          {
            q: "What does the CAP theorem state regarding distributed data stores in cloud environments?",
            a: "A distributed system can guarantee at most two out of Consistency, Availability, and Partition Tolerance simultaneously",
            d: [
              "Capacity, Availability, and Performance are always mutually exclusive",
              "All cloud databases must be ACID compliant",
              "Cloud networks cannot suffer network partitions"
            ],
            exp: "Under a network partition (P), a distributed system must choose between serving consistent data (C) or remaining available (A)."
          },
          {
            q: "In software testing, what is Mutation Testing designed to evaluate?",
            a: "The fault-detection effectiveness and quality of the test suite by introducing small artificial bugs (mutants)",
            d: [
              "The physical hardware degradation over time",
              "The security vulnerability of database ports",
              "The CPU temperature under heavy load"
            ],
            exp: "Mutation testing modifies program statements to verify whether existing automated unit tests catch the introduced bugs."
          }
        ];
        const c = seConcepts[attempts % seConcepts.length];
        if (!isExcluded(c.q)) {
          const { options, correctIndex } = buildOptions(c.a, c.d);
          candidate = {
            id: `proc_se_concept_${Date.now()}_${attempts}`,
            question: c.q,
            options,
            correctIndex,
            explanation: c.exp,
            topic: "Software Engineering & Cloud",
            difficulty,
            subject: subject || "Software Engineering"
          };
        }
      }
    }

    // ------------------------------------------------------------------------
    // DATABASE MANAGEMENT & DBMS
    // ------------------------------------------------------------------------
    else if (normSub.includes("dbms") || normSub.includes("database")) {
      const dbMode = attempts % 5;
      if (dbMode === 0) {
        // Cartesian Product / Cross Join Row Count
        const rowsA = 10 + (attempts * 7) % 40;
        const rowsB = 5 + (attempts * 3) % 20;
        const totalRows = rowsA * rowsB;
        const qText = `In relational algebra, if relation R contains ${rowsA} tuples and relation S contains ${rowsB} tuples, how many tuples are generated by their Cartesian Product (R x S)?`;
        if (!isExcluded(qText)) {
          const { options, correctIndex } = buildOptions(
            `${totalRows} tuples`,
            [`${rowsA + rowsB} tuples`, `${Math.max(rowsA, rowsB)} tuples`, `${totalRows + 50} tuples`]
          );
          candidate = {
            id: `proc_db_cartesian_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `The Cartesian Product combines every tuple of R with every tuple of S: Count = |R| * |S| = ${rowsA} * ${rowsB} = ${totalRows} tuples.`,
            topic: "Relational Algebra",
            difficulty,
            subject: "DBMS"
          };
        }
      } else {
        const dbConcepts = [
          {
            q: "What ACID property ensures that all operations in a database transaction complete successfully, or all are rolled back entirely?",
            a: "Atomicity",
            d: ["Consistency", "Isolation", "Durability"],
            exp: "Atomicity guarantees all-or-nothing execution of transaction operations."
          },
          {
            q: "In relational database normalization, what condition defines Boyce-Codd Normal Form (BCNF)?",
            a: "For every non-trivial functional dependency X -> Y, X must be a superkey",
            d: [
              "Every attribute is non-null",
              "Composite primary keys are banned",
              "Only transitive dependencies on candidate keys are allowed"
            ],
            exp: "BCNF is a stricter version of 3NF where every determinant in a functional dependency must be a superkey."
          },
          {
            q: "What is the primary difference between a Clustered Index and a Non-Clustered Index in an RDBMS?",
            a: "A clustered index dictates the physical sorting order of table rows on disk; a non-clustered index stores pointers to rows",
            d: [
              "A table can have multiple clustered indexes, but only one non-clustered index",
              "Clustered indexes cannot be used for range queries",
              "Non-clustered indexes duplicate all table columns on disk"
            ],
            exp: "Because disk data can only be physically ordered in one way, a table can possess only one clustered index."
          },
          {
            q: "What concurrency phenomenon occurs when Transaction A reads uncommitted data written by concurrent Transaction B which later rolls back?",
            a: "Dirty Read (Uncommitted Dependency)",
            d: ["Non-Repeatable Read", "Phantom Read", "Lost Update"],
            exp: "A dirty read reads uncommitted changes from another transaction that is subsequently aborted."
          }
        ];
        const c = dbConcepts[attempts % dbConcepts.length];
        if (!isExcluded(c.q)) {
          const { options, correctIndex } = buildOptions(c.a, c.d);
          candidate = {
            id: `proc_db_concept_${Date.now()}_${attempts}`,
            question: c.q,
            options,
            correctIndex,
            explanation: c.exp,
            topic: "Database Architecture",
            difficulty,
            subject: "DBMS"
          };
        }
      }
    }

    // ------------------------------------------------------------------------
    // COMPUTER SCIENCE & IT (OS, Networks, Algorithms, General CS)
    // ------------------------------------------------------------------------
    else {
      if (mode === 0 || mode === 1) {
        // CIDR subnetting hosts calculation
        const cidr = pickRandom([24, 25, 26, 27, 28, 29, 30]);
        const hostBits = 32 - cidr;
        const totalHosts = Math.pow(2, hostBits) - 2;
        const qText = `In IPv4 networking, how many usable host IP addresses are available in a subnet with prefix /${cidr}?`;
        if (!isExcluded(qText)) {
          const { options, correctIndex } = buildOptions(
            `${totalHosts} usable hosts`,
            [`${totalHosts + 2} usable hosts`, `${Math.pow(2, hostBits + 1) - 2} usable hosts`, `${Math.max(2, totalHosts - 4)} usable hosts`]
          );
          candidate = {
            id: `proc_cs_cidr_${Date.now()}_${attempts}`,
            question: qText,
            options,
            correctIndex,
            explanation: `For a /${cidr} subnet, host bits = 32 - ${cidr} = ${hostBits}. Usable hosts = 2^${hostBits} - 2 (network & broadcast reserved) = ${totalHosts}.`,
            topic: "CIDR Subnetting",
            difficulty,
            subject: subject || "Computer Networks"
          };
        }
      } else {
        const concepts = [
          {
            q: "What CPU scheduling algorithm assigns each ready process a fixed time slice (quantum) in cyclic order?",
            a: "Round Robin (RR)",
            d: ["Shortest Job First (SJF)", "First-Come First-Served (FCFS)", "Multilevel Feedback Queue"],
            exp: "Round Robin rotates processes through the CPU using fixed time quanta to provide preemptive fairness."
          },
          {
            q: "What is the worst-case asymptotic time complexity of standard QuickSort on an already-sorted array without randomized pivot selection?",
            a: "O(N²)",
            d: ["O(N log N)", "O(N)", "O(log N)"],
            exp: "Without random or median pivot selection, already sorted arrays yield completely unbalanced O(N²) recursion trees."
          },
          {
            q: "In Operating Systems, what condition is NOT one of Coffman's four necessary conditions for deadlock?",
            a: "Preemptive resource scheduling",
            d: ["Mutual exclusion", "Hold and wait", "Circular wait"],
            exp: "Preemption eliminates deadlock; non-preemption is the required condition for deadlock to occur."
          },
          {
            q: "In computer networks, what protocol in the TCP/IP stack resolves an IPv4 address to its physical hardware MAC address?",
            a: "Address Resolution Protocol (ARP)",
            d: ["Domain Name System (DNS)", "Dynamic Host Configuration Protocol (DHCP)", "Border Gateway Protocol (BGP)"],
            exp: "ARP broadcasts on the local link layer to discover the Ethernet MAC address matching a destination IP."
          }
        ];
        const c = concepts[attempts % concepts.length];
        if (!isExcluded(c.q)) {
          const { options, correctIndex } = buildOptions(c.a, c.d);
          candidate = {
            id: `proc_cs_concept_${Date.now()}_${attempts}`,
            question: c.q,
            options,
            correctIndex,
            explanation: c.exp,
            topic: "Core Computer Science",
            difficulty,
            subject: subject || "Computer Science"
          };
        }
      }
    }

    if (candidate) {
      excludeNormalizedSet.add(candidate.question.trim().toLowerCase().replace(/\s+/g, " "));
      results.push(candidate);
    }
  }

  return results;
}
