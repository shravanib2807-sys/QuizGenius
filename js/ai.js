/**
 * AI Client Service for QuizGenius
 * Securely communicates with the backend AI endpoints.
 * Falls back to built-in question banks if server is unavailable.
 */

export const CLIENT_BRANCH_SUBJECTS = {
  "Computer Science Engineering": {
    recommendedLanguages: ["C", "C++", "Java", "Python"],
    recommendedSubjects: ["Data Structures","Algorithms","DBMS","Operating Systems","Computer Networks","Web Development"],
    learningPath: "Master programming fundamentals, data structures, algorithms, and core computer science systems."
  },
  "Information Technology": {
    recommendedLanguages: ["Java", "Python", "SQL", "Web Development"],
    recommendedSubjects: ["Software Engineering","Computer Networks","Cloud Computing","Database Management"],
    learningPath: "Focus on enterprise web systems, SQL data management, software engineering, and cloud infrastructure."
  },
  "Artificial Intelligence & Machine Learning": {
    recommendedLanguages: ["Python", "TensorFlow"],
    recommendedSubjects: ["Artificial Intelligence","Machine Learning","Deep Learning","Statistics","Mathematics for AI/ML","Data Structures"],
    learningPath: "Master neural networks, machine learning algorithms, deep learning architectures, and statistical mathematics."
  },
  "Data Science": {
    recommendedLanguages: ["Python", "SQL"],
    recommendedSubjects: ["Statistics","NumPy","Pandas","Data Analysis","Machine Learning","Data Visualization"],
    learningPath: "Master exploratory data analytics, NumPy/Pandas processing, SQL querying, and predictive modeling."
  },
  "Electronics & Telecommunication": {
    recommendedLanguages: ["Embedded C", "MATLAB", "Verilog"],
    recommendedSubjects: ["Digital Electronics","Analog Electronics","Microcontrollers","Embedded Systems","Communication Systems"],
    learningPath: "Focus on embedded firmware, digital logic synthesis, microcontrollers, and communication systems."
  },
  "Electrical Engineering": {
    recommendedLanguages: ["MATLAB", "Simulink", "PLC"],
    recommendedSubjects: ["Circuit Theory","Electrical Machines","Power Systems","Control Systems","Power Electronics"],
    learningPath: "Focus on power grid dynamics, electrical machines, circuit theory, and industrial PLC control."
  },
  "Mechanical Engineering": {
    recommendedLanguages: ["MATLAB", "AutoCAD", "SolidWorks"],
    recommendedSubjects: ["Engineering Mechanics","Thermodynamics","Strength of Materials","Manufacturing Processes","Fluid Mechanics"],
    learningPath: "Master CAD modeling, strength of materials, thermodynamic cycles, and manufacturing processes."
  },
  "Civil Engineering": {
    recommendedLanguages: ["AutoCAD", "STAAD.Pro"],
    recommendedSubjects: ["Surveying","Structural Engineering","Geotechnical Engineering","Construction Engineering","Environmental Engineering","Transportation Engineering"],
    learningPath: "Focus on structural analysis, civil drafting, geotechnical soil mechanics, and infrastructure design."
  },
  "Chemical Engineering": {
    recommendedLanguages: ["MATLAB", "Aspen Plus"],
    recommendedSubjects: ["Chemical Thermodynamics","Fluid Mechanics","Heat Transfer","Mass Transfer","Chemical Reaction Engineering","Process Control"],
    learningPath: "Focus on transport phenomena, reaction kinetics, chemical thermodynamics, and process automation."
  }
};

export function canonicalClientBranch(branch) {
  const b = (branch || "").trim().toLowerCase();
  if (b.includes("chem")) return "Chemical Engineering";
  if (b.includes("data sci") || b === "ds") return "Data Science";
  if (b.includes("ai") || b.includes("aiml") || b.includes("artificial") || b.includes("machine learn"))
    return "Artificial Intelligence & Machine Learning";
  if ((b.includes("elec") && b.includes("tele")) || b.includes("e&tc") || b.includes("entc") || b.includes("etc"))
    return "Electronics & Telecommunication";
  if (b.includes("elec") || b.includes("eee")) return "Electrical Engineering";
  if (b.includes("mech")) return "Mechanical Engineering";
  if (b.includes("civil")) return "Civil Engineering";
  if (b.includes("info") || b === "it") return "Information Technology";
  return "Computer Science Engineering";
}

// ============================================================
// BUILT-IN CLIENT-SIDE FALLBACK QUESTION BANKS
// Used when server API is unreachable or returns an error
// ============================================================

const CLIENT_QUIZ_BANK = {
  "Python": [
    { id:"py_f1", question:"What is the correct file extension for Python files?", options:[".py",".python",".pt",".pys"], correctIndex:0, explanation:"Python source files use .py extension.", topic:"Basics", difficulty:"Easy" },
    { id:"py_f2", question:"Which keyword defines a function in Python?", options:["func","define","def","function"], correctIndex:2, explanation:"Functions are defined using the 'def' keyword.", topic:"Functions", difficulty:"Easy" },
    { id:"py_f3", question:"What does len('QuizGenius') return?", options:["10","9","8","11"], correctIndex:0, explanation:"'QuizGenius' has 10 characters.", topic:"Built-ins", difficulty:"Easy" },
    { id:"py_f4", question:"Which Python data type is immutable?", options:["list","set","dict","tuple"], correctIndex:3, explanation:"Tuples are immutable in Python.", topic:"Data Types", difficulty:"Easy" },
    { id:"py_f5", question:"What operator is used for exponentiation in Python?", options:["^","**","pow","//"], correctIndex:1, explanation:"** is the power operator (e.g., 2**3 = 8).", topic:"Operators", difficulty:"Easy" },
    { id:"py_f6", question:"How do you write a single-line comment in Python?", options:["// comment","/* comment */","# comment","<!-- comment -->"], correctIndex:2, explanation:"Single-line comments start with #.", topic:"Syntax", difficulty:"Easy" },
    { id:"py_f7", question:"What is the output of print(10 // 3)?", options:["3.33","3","3.0","1"], correctIndex:1, explanation:"// is integer floor division, 10//3 = 3.", topic:"Operators", difficulty:"Easy" },
    { id:"py_f8", question:"Which function reads input from the user in Python 3?", options:["cin()","scan()","input()","read()"], correctIndex:2, explanation:"input() reads a string from standard input.", topic:"I/O", difficulty:"Easy" },
    { id:"py_f9", question:"What is the boolean value of an empty string '' in Python?", options:["True","False","None","Error"], correctIndex:1, explanation:"Empty sequences evaluate to False.", topic:"Data Types", difficulty:"Easy" },
    { id:"py_f10", question:"Which keyword imports an external module in Python?", options:["using","require","include","import"], correctIndex:3, explanation:"'import' loads modules into the namespace.", topic:"Modules", difficulty:"Easy" },
    { id:"py_f11", question:"What does print([x*2 for x in range(4) if x%2==0]) output?", options:["[0,4]","[0,2,4]","[0,4,8]","[2,6]"], correctIndex:0, explanation:"Even numbers in range(4) are 0,2; doubled gives [0,4].", topic:"List Comprehensions", difficulty:"Medium" },
    { id:"py_f12", question:"What does dict.get('key','default') return when key is absent?", options:["KeyError","Inserts key","Returns 'default'","Returns None"], correctIndex:2, explanation:".get() returns the fallback without raising an error.", topic:"Dictionaries", difficulty:"Medium" },
    { id:"py_f13", question:"What is the output of 'Python'[::-1]?", options:["'nohtyP'","'Python'","'P'","IndexError"], correctIndex:0, explanation:"Step -1 reverses the string.", topic:"Slicing", difficulty:"Medium" },
    { id:"py_f14", question:"What keyword is used inside a generator function to produce values?", options:["return","produce","yield","send"], correctIndex:2, explanation:"'yield' pauses execution and produces a value.", topic:"Generators", difficulty:"Medium" },
    { id:"py_f15", question:"What is the result of: a=[1,2]; b=a; b.append(3); print(len(a))?", options:["2","3","4","AttributeError"], correctIndex:1, explanation:"b=a creates a reference; mutating b mutates a.", topic:"References", difficulty:"Medium" }
  ],
  "C++": [
    { id:"cpp_f1", question:"Which stream object prints output to the console in C++?", options:["std::cin","std::cout","std::cerr","printf"], correctIndex:1, explanation:"std::cout sends data to standard output.", topic:"I/O", difficulty:"Easy" },
    { id:"cpp_f2", question:"What is the default access specifier for class members in C++?", options:["public","protected","private","internal"], correctIndex:2, explanation:"Class members are private by default in C++.", topic:"OOP", difficulty:"Easy" },
    { id:"cpp_f3", question:"Which keyword prevents a variable from being modified in C++?", options:["fixed","static","const","immutable"], correctIndex:2, explanation:"'const' makes a variable constant.", topic:"Keywords", difficulty:"Easy" },
    { id:"cpp_f4", question:"What is the return type of main() in C++?", options:["void","int","char","bool"], correctIndex:1, explanation:"main() must return int per the C++ standard.", topic:"Functions", difficulty:"Easy" },
    { id:"cpp_f5", question:"Which operator is used for dynamic memory allocation in C++?", options:["malloc","alloc","new","create"], correctIndex:2, explanation:"'new' allocates memory on the heap.", topic:"Memory", difficulty:"Easy" },
    { id:"cpp_f6", question:"What is the difference between a pointer and a reference in C++?", options:["Pointers can't be NULL","References must bind at creation and can't reseat; pointers can be null","References need delete","No difference"], correctIndex:1, explanation:"References alias an existing object and can't be rebound.", topic:"Pointers", difficulty:"Medium" },
    { id:"cpp_f7", question:"Why declare a base class destructor as virtual?", options:["Prevent instantiation","Ensure proper derived class destruction via base pointer","Faster allocation","Allow parameters"], correctIndex:1, explanation:"Without virtual destructor, only base destructor runs on delete.", topic:"Polymorphism", difficulty:"Medium" },
    { id:"cpp_f8", question:"What is RAII in C++?", options:["Compiler loop optimization","Resources bound to object lifetime — acquired in constructor, released in destructor","Auto garbage collector","All vars initialized to zero"], correctIndex:1, explanation:"RAII ties resource cleanup to object lifetime.", topic:"Idioms", difficulty:"Medium" }
  ],
  "Java": [
    { id:"java_f1", question:"Which keyword is used to create a class in Java?", options:["struct","object","class","type"], correctIndex:2, explanation:"Java uses the 'class' keyword to define classes.", topic:"Basics", difficulty:"Easy" },
    { id:"java_f2", question:"What is the entry point method signature in Java?", options:["public void main()","static void main(String[] args)","public static void main(String[] args)","void start()"], correctIndex:2, explanation:"Java programs start at public static void main(String[] args).", topic:"Basics", difficulty:"Easy" },
    { id:"java_f3", question:"Which collection guarantees no duplicate elements in Java?", options:["ArrayList","LinkedList","Set","Queue"], correctIndex:2, explanation:"Set interface implementations do not allow duplicates.", topic:"Collections", difficulty:"Easy" },
    { id:"java_f4", question:"What does 'final' keyword mean when applied to a variable?", options:["Variable is static","Variable cannot be reassigned after init","Variable is public","Variable is volatile"], correctIndex:1, explanation:"'final' variables are constants — cannot be changed once assigned.", topic:"Keywords", difficulty:"Easy" },
    { id:"java_f5", question:"What is polymorphism in Java?", options:["A class with many fields","An object behaving differently based on its actual type","Inheritance only","Multiple constructors"], correctIndex:1, explanation:"Polymorphism allows methods to behave differently based on object type.", topic:"OOP", difficulty:"Medium" },
    { id:"java_f6", question:"What is the difference between == and .equals() in Java?", options:["No difference","== compares references; .equals() compares content","== compares content; .equals() compares references","Both compare content"], correctIndex:1, explanation:"== checks if two references point to the same object.", topic:"Strings", difficulty:"Medium" }
  ],
  "Data Structures": [
    { id:"ds_f1", question:"What is the time complexity of searching in a Binary Search Tree (average case)?", options:["O(log n)","O(n)","O(1)","O(n log n)"], correctIndex:0, explanation:"BST search is O(log n) for balanced trees.", topic:"Trees", difficulty:"Easy" },
    { id:"ds_f2", question:"Which data structure uses LIFO (Last In, First Out) order?", options:["Queue","Stack","Deque","Priority Queue"], correctIndex:1, explanation:"Stacks process the most recently added element first.", topic:"Stacks", difficulty:"Easy" },
    { id:"ds_f3", question:"Which data structure is used for BFS traversal?", options:["Stack","Queue","Heap","Graph"], correctIndex:1, explanation:"BFS uses a queue to process nodes in level-order.", topic:"Graphs", difficulty:"Easy" },
    { id:"ds_f4", question:"What is the worst-case time complexity of QuickSort?", options:["O(n log n)","O(n)","O(n²)","O(log n)"], correctIndex:2, explanation:"QuickSort degrades to O(n²) when pivot always selects smallest/largest element.", topic:"Sorting", difficulty:"Medium" },
    { id:"ds_f5", question:"What data structure do hash maps use to handle collision via chaining?", options:["Array","Linked List","Tree","Stack"], correctIndex:1, explanation:"Chaining stores colliding elements in a linked list at each bucket.", topic:"Hashing", difficulty:"Medium" },
    { id:"ds_f6", question:"What is the height of a complete binary tree with n nodes?", options:["O(log n)","O(n)","O(n²)","O(1)"], correctIndex:0, explanation:"A complete binary tree has height floor(log2 n).", topic:"Trees", difficulty:"Medium" }
  ],
  "Algorithms": [
    { id:"algo_f1", question:"What is the time complexity of binary search?", options:["O(n)","O(log n)","O(n log n)","O(1)"], correctIndex:1, explanation:"Binary search halves the search space each step.", topic:"Search", difficulty:"Easy" },
    { id:"algo_f2", question:"Which algorithm guarantees finding the shortest path in an unweighted graph?", options:["DFS","BFS","Dijkstra","Bellman-Ford"], correctIndex:1, explanation:"BFS explores level by level, guaranteeing shortest path in unweighted graphs.", topic:"Graph Algorithms", difficulty:"Easy" },
    { id:"algo_f3", question:"What technique does Dynamic Programming primarily use?", options:["Divide and conquer without memoization","Memoization or tabulation to avoid recomputation","Greedy local choices","Backtracking"], correctIndex:1, explanation:"DP stores solutions to subproblems to avoid redundant computation.", topic:"Dynamic Programming", difficulty:"Medium" },
    { id:"algo_f4", question:"What is the time complexity of Merge Sort?", options:["O(n²)","O(n log n)","O(n)","O(log n)"], correctIndex:1, explanation:"Merge sort splits in O(log n) levels, each doing O(n) work.", topic:"Sorting", difficulty:"Easy" }
  ],
  "DBMS": [
    { id:"dbms_f1", question:"What does ACID stand for in database transactions?", options:["Atomicity, Consistency, Isolation, Durability","Add, Create, Index, Delete","Atomic, Concurrent, Indexed, Durable","None of the above"], correctIndex:0, explanation:"ACID properties ensure reliable database transactions.", topic:"Transactions", difficulty:"Easy" },
    { id:"dbms_f2", question:"Which SQL command retrieves data from a table?", options:["INSERT","UPDATE","SELECT","DELETE"], correctIndex:2, explanation:"SELECT retrieves data from one or more tables.", topic:"SQL", difficulty:"Easy" },
    { id:"dbms_f3", question:"What is a Primary Key?", options:["A key that can be null","A unique identifier for each record in a table","A foreign reference","An index only"], correctIndex:1, explanation:"Primary key uniquely identifies each row and cannot be null.", topic:"Keys", difficulty:"Easy" },
    { id:"dbms_f4", question:"What is normalization in databases?", options:["Adding redundancy","Organizing data to reduce redundancy and improve integrity","Backing up data","Indexing all columns"], correctIndex:1, explanation:"Normalization eliminates redundancy by organizing tables into normal forms.", topic:"Normalization", difficulty:"Medium" },
    { id:"dbms_f5", question:"What is the difference between INNER JOIN and LEFT JOIN?", options:["No difference","INNER JOIN returns only matching rows; LEFT JOIN returns all rows from left table with NULLs for unmatched","LEFT JOIN returns only left rows","INNER JOIN includes all rows"], correctIndex:1, explanation:"LEFT JOIN includes all rows from the left table regardless of match.", topic:"Joins", difficulty:"Medium" }
  ],
  "Operating Systems": [
    { id:"os_f1", question:"What is a deadlock in an operating system?", options:["High CPU usage","A state where processes wait indefinitely for resources held by each other","Memory overflow","System crash"], correctIndex:1, explanation:"Deadlock occurs when processes circularly wait for each other's resources.", topic:"Deadlocks", difficulty:"Easy" },
    { id:"os_f2", question:"What does CPU scheduling determine?", options:["Hard disk read order","Which process runs on the CPU at any given time","Memory allocation","File system hierarchy"], correctIndex:1, explanation:"CPU scheduling decides which ready process gets processor time.", topic:"Scheduling", difficulty:"Easy" },
    { id:"os_f3", question:"What is virtual memory?", options:["RAM on the CPU","Technique that uses disk space to extend apparent RAM","Cache memory","GPU memory"], correctIndex:1, explanation:"Virtual memory maps disk as extra RAM via paging.", topic:"Memory Management", difficulty:"Medium" },
    { id:"os_f4", question:"What is the purpose of a semaphore?", options:["Process scheduling","Control access to shared resources for synchronization","Memory allocation","File I/O"], correctIndex:1, explanation:"Semaphores are used to synchronize process access to shared resources.", topic:"Synchronization", difficulty:"Medium" }
  ],
  "Computer Networks": [
    { id:"cn_f1", question:"What does HTTP stand for?", options:["HyperText Transfer Protocol","High Transfer Text Protocol","HyperText Transport Procedure","Host Transfer Protocol"], correctIndex:0, explanation:"HTTP is the protocol for transmitting web pages over the internet.", topic:"Protocols", difficulty:"Easy" },
    { id:"cn_f2", question:"Which layer of the OSI model is responsible for routing?", options:["Physical","Data Link","Network","Transport"], correctIndex:2, explanation:"The Network layer (Layer 3) handles logical addressing and routing.", topic:"OSI Model", difficulty:"Easy" },
    { id:"cn_f3", question:"What is the purpose of DNS?", options:["Assign IP addresses","Translate domain names to IP addresses","Encrypt traffic","Route packets"], correctIndex:1, explanation:"DNS resolves human-readable domain names to IP addresses.", topic:"DNS", difficulty:"Easy" },
    { id:"cn_f4", question:"What is the difference between TCP and UDP?", options:["No difference","TCP is connection-oriented and reliable; UDP is connectionless and faster","UDP is slower","TCP is faster"], correctIndex:1, explanation:"TCP guarantees delivery; UDP sacrifices reliability for speed.", topic:"Transport Layer", difficulty:"Medium" }
  ]
};

const CLIENT_APTITUDE_BANK = {
  "Quantitative Aptitude": [
    { id:"qa_f1", section:"Quantitative Aptitude", topic:"Percentages", question:"What is 20% of 500?", options:["100","80","120","150"], correctIndex:0, explanation:"20% of 500 = (20/100) × 500 = 100." },
    { id:"qa_f2", section:"Quantitative Aptitude", topic:"Percentages", question:"What is 35% of 200?", options:["70","60","75","80"], correctIndex:0, explanation:"35% of 200 = (35/100) × 200 = 70." },
    { id:"qa_f3", section:"Quantitative Aptitude", topic:"Profit & Loss", question:"An item bought for ₹400 is sold for ₹500. What is the profit percentage?", options:["25%","20%","30%","15%"], correctIndex:0, explanation:"Profit = 100, Profit% = (100/400)×100 = 25%." },
    { id:"qa_f4", section:"Quantitative Aptitude", topic:"Time & Work", question:"A and B together finish a job in 8 days. A alone takes 12 days. How many days does B alone take?", options:["24","20","16","18"], correctIndex:0, explanation:"1/B = 1/8 - 1/12 = 1/24, so B takes 24 days." },
    { id:"qa_f5", section:"Quantitative Aptitude", topic:"Speed & Distance", question:"A train 150m long crosses a pole in 10 seconds. What is its speed in km/h?", options:["54","45","60","72"], correctIndex:0, explanation:"Speed = 150/10 = 15 m/s = 15 × 18/5 = 54 km/h." },
    { id:"qa_f6", section:"Quantitative Aptitude", topic:"Ratio & Proportion", question:"Two numbers are in ratio 3:5 and their sum is 240. Find the larger number.", options:["150","90","140","160"], correctIndex:0, explanation:"5 parts = 5 × (240/8) = 150." },
    { id:"qa_f7", section:"Quantitative Aptitude", topic:"Simple Interest", question:"Simple interest on ₹5000 at 8% per annum for 3 years?", options:["₹1200","₹1000","₹1400","₹960"], correctIndex:0, explanation:"SI = (5000 × 8 × 3)/100 = ₹1200." },
    { id:"qa_f8", section:"Quantitative Aptitude", topic:"Averages", question:"Average of 5 numbers is 42. If 60 is added, what is the new average?", options:["45","44","46","48"], correctIndex:0, explanation:"New sum = 5×42+60 = 270. New avg = 270/6 = 45." },
    { id:"qa_f9", section:"Quantitative Aptitude", topic:"Compound Interest", question:"₹2000 at 10% p.a. compounded annually for 2 years gives?", options:["₹2420","₹2400","₹2200","₹2440"], correctIndex:0, explanation:"A = 2000 × (1.1)² = ₹2420." },
    { id:"qa_f10", section:"Quantitative Aptitude", topic:"Probability", question:"A fair die is rolled. Probability of getting a prime number?", options:["1/2","1/3","2/3","1/6"], correctIndex:0, explanation:"Primes on die: 2, 3, 5 = 3 outcomes. P = 3/6 = 1/2." }
  ],
  "Logical Reasoning": [
    { id:"lr_f1", section:"Logical Reasoning", topic:"Direction Sense", question:"A person walks 4 km North then 3 km East. Distance from start?", options:["5 km","7 km","6 km","1 km"], correctIndex:0, explanation:"√(4²+3²) = √25 = 5 km." },
    { id:"lr_f2", section:"Logical Reasoning", topic:"Number Series", question:"Next in: 3, 7, 15, 31, 63, ?", options:["127","126","125","128"], correctIndex:0, explanation:"Each term = previous × 2 + 1. So 63×2+1 = 127." },
    { id:"lr_f3", section:"Logical Reasoning", topic:"Number Series", question:"Missing term: 2, 6, 12, 20, 30, ?", options:["42","40","44","46"], correctIndex:0, explanation:"Differences: +4,+6,+8,+10,+12. Next: 30+12 = 42." },
    { id:"lr_f4", section:"Logical Reasoning", topic:"Coding-Decoding", question:"If LIGHT = MJHIU (+1 shift), how is SOUND coded?", options:["TPVOE","TOVPE","RNTMC","UQWPF"], correctIndex:0, explanation:"Each letter shifted +1: S→T, O→P, U→V, N→O, D→E = TPVOE." },
    { id:"lr_f5", section:"Logical Reasoning", topic:"Blood Relations", question:"A's mother's only son is B's father. How is B related to A?", options:["Nephew/Niece","Son","Brother","Cousin"], correctIndex:0, explanation:"A's mother's only son = A. A is B's father. So B is A's child (nephew/niece context: B is A's child).", },
    { id:"lr_f6", section:"Logical Reasoning", topic:"Syllogism", question:"All roses are flowers. All flowers are plants. Are all roses plants?", options:["Yes, definitely","No","Cannot determine","Only some"], correctIndex:0, explanation:"By transitivity: roses ⊂ flowers ⊂ plants, so all roses are plants." },
    { id:"lr_f7", section:"Logical Reasoning", topic:"Analogy", question:"Clock : Time :: Thermometer : ?", options:["Temperature","Heat","Mercury","Energy"], correctIndex:0, explanation:"Clock measures time; thermometer measures temperature." },
    { id:"lr_f8", section:"Logical Reasoning", topic:"Calendar", question:"If today is Wednesday, what day is it 50 days later?", options:["Thursday","Friday","Wednesday","Tuesday"], correctIndex:0, explanation:"50 = 7×7+1. Wednesday + 1 = Thursday." },
    { id:"lr_f9", section:"Logical Reasoning", topic:"Clocks", question:"Angle between hour and minute hands at 3:00?", options:["90°","80°","75°","100°"], correctIndex:0, explanation:"Each hour = 30°. At 3:00, angle = 3×30 = 90°." },
    { id:"lr_f10", section:"Logical Reasoning", topic:"Odd One Out", question:"Which is NOT a perfect cube: 8, 27, 64, 100, 125?", options:["100","64","27","125"], correctIndex:0, explanation:"8=2³, 27=3³, 64=4³, 125=5³. 100 is not a cube." }
  ],
  "Verbal Ability": [
    { id:"va_f1", section:"Verbal Ability", topic:"Antonyms", question:"Antonym of 'CANDID':", options:["Guarded / Deceptive","Honest","Frank","Transparent"], correctIndex:0, explanation:"Candid means frank; antonym is guarded or deceptive." },
    { id:"va_f2", section:"Verbal Ability", topic:"Sentence Correction", question:"Choose the grammatically correct sentence:", options:["Neither the principal nor the teachers were present.","Neither the principal nor the teachers was present.","Neither the principal or the teachers were present.","Neither of the principal and teachers were present."], correctIndex:0, explanation:"With 'neither...nor', verb agrees with the closer subject (teachers = plural → were)." },
    { id:"va_f3", section:"Verbal Ability", topic:"Synonyms", question:"Synonym of 'METICULOUS':", options:["Painstaking / Thorough","Careless","Rapid","Superficial"], correctIndex:0, explanation:"Meticulous means showing great attention to detail." },
    { id:"va_f4", section:"Verbal Ability", topic:"Idioms", question:"What does 'Bite the bullet' mean?", options:["Face a difficult situation with fortitude","Fire a weapon","Avoid danger","Give up in defeat"], correctIndex:0, explanation:"'Bite the bullet' means to endure a painful situation bravely." },
    { id:"va_f5", section:"Verbal Ability", topic:"Spelling", question:"Choose the correctly spelled word:", options:["Accommodate","Acommodate","Accomodate","Acomodate"], correctIndex:0, explanation:"Accommodate has double 'c' and double 'm'." },
    { id:"va_f6", section:"Verbal Ability", topic:"One Word Substitution", question:"One word for 'A person who looks on the bright side':", options:["Optimist","Pessimist","Altruist","Pacifist"], correctIndex:0, explanation:"An optimist expects positive outcomes." },
    { id:"va_f7", section:"Verbal Ability", topic:"Spotting Errors", question:"Error in: 'Each of the students (A) / are required to submit (B) / their assignments today (C)'", options:["Part B – should be 'is required'","Part A","Part C","No error"], correctIndex:0, explanation:"'Each' is singular, so verb should be 'is required'." },
    { id:"va_f8", section:"Verbal Ability", topic:"Active & Passive Voice", question:"Passive voice of: 'The engineer designed the hydraulic system.'", options:["The hydraulic system was designed by the engineer.","The hydraulic system is designed by the engineer.","The hydraulic system has been designed by the engineer.","The hydraulic system had designed by the engineer."], correctIndex:0, explanation:"Simple past active → 'was + past participle'." },
    { id:"va_f9", section:"Verbal Ability", topic:"Vocabulary", question:"Best word: 'The theory was so _______ that experts struggled to understand it.'", options:["Abstruse","Lucid","Accessible","Pragmatic"], correctIndex:0, explanation:"Abstruse means difficult to understand." },
    { id:"va_f10", section:"Verbal Ability", topic:"Analogies", question:"OASIS : DESERT :: _____ : OCEAN", options:["Island","Tree","Peak","Stream"], correctIndex:0, explanation:"An oasis is in a desert; an island is in an ocean." }
  ]
};

const CLIENT_GATE_BANK = [
  { id:"gate_cf1", question:"What is the worst-case time complexity of searching in a Red-Black Tree?", options:["O(log n)","O(n)","O(n log n)","O(1)"], correctIndex:0, explanation:"Red-Black Trees maintain height ≤ 2log₂(n+1), so all operations are O(log n).", topic:"Balanced Trees", difficulty:"Medium", subject:"Data Structures" },
  { id:"gate_cf2", question:"Using the Master Theorem, solve T(n) = 2T(n/2) + Θ(n).", options:["Θ(n log n)","Θ(n)","Θ(n²)","Θ(log n)"], correctIndex:0, explanation:"log_b(a) = 1 = degree of f(n), Case 2 gives Θ(n log n).", topic:"Recurrences", difficulty:"Medium", subject:"Algorithms" },
  { id:"gate_cf3", question:"Which page replacement algorithm suffers from Belady's Anomaly?", options:["FIFO","LRU","Optimal","LFU"], correctIndex:0, explanation:"FIFO is not a stack algorithm, so more frames can increase page faults.", topic:"Virtual Memory", difficulty:"Easy", subject:"Operating Systems" },
  { id:"gate_cf4", question:"Usable host count for a /27 IPv4 subnet?", options:["30","32","28","31"], correctIndex:0, explanation:"2^5 - 2 = 30 usable hosts.", topic:"Subnetting", difficulty:"Easy", subject:"Computer Networks" },
  { id:"gate_cf5", question:"What does LL(1) parsing represent?", options:["Top-down predictive parsing","Bottom-up shift-reduce","LR parsing","LALR parsing"], correctIndex:0, explanation:"LL(1) reads Left-to-right, Leftmost derivation, 1 lookahead — top-down.", topic:"Parsing", difficulty:"Easy", subject:"Compiler Design" },
  { id:"gate_cf6", question:"IEEE 754 single-precision exponent bias?", options:["127","128","255","1023"], correctIndex:0, explanation:"Single-precision bias = 2^(8-1) - 1 = 127.", topic:"Data Representation", difficulty:"Easy", subject:"Computer Organization and Architecture" },
  { id:"gate_cf7", question:"A relation R(A,B,C) has FD: A→B, B→C. What is the closure of A?", options:["{A,B,C}","{A,B}","{A}","{B,C}"], correctIndex:0, explanation:"A→B and B→C means A⁺ = {A,B,C}.", topic:"Functional Dependencies", difficulty:"Medium", subject:"DBMS" },
  { id:"gate_cf8", question:"Minimum DFA states for binary strings containing '01' as substring?", options:["3","2","4","5"], correctIndex:0, explanation:"States: q0 (start), q1 (seen 0), q2 (seen 01, accept). Exactly 3.", topic:"Finite Automata", difficulty:"Easy", subject:"Theory of Computation" },
  { id:"gate_cf9", question:"Eigenvalues of A are 2, 3, 5. What is det(A)?", options:["30","10","15","25"], correctIndex:0, explanation:"det(A) = product of eigenvalues = 2×3×5 = 30.", topic:"Linear Algebra", difficulty:"Easy", subject:"Engineering Mathematics" },
  { id:"gate_cf10", question:"What is the time complexity of building a binary heap from an array?", options:["O(n)","O(n log n)","O(n²)","O(log n)"], correctIndex:0, explanation:"Bottom-up heapify runs in O(n) due to geometric series convergence.", topic:"Heaps", difficulty:"Hard", subject:"Data Structures" }
];

// ============================================================
// HELPER: Shuffle array (Fisher-Yates)
// ============================================================
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ============================================================
// HELPER: Shuffle options while keeping correctIndex accurate
// ============================================================
function shuffleOptions(q) {
  if (!q || !Array.isArray(q.options) || q.options.length !== 4) return q;
  const orig = [...q.options];
  const correctText = orig[q.correctIndex];
  const shuffled = shuffleArray(orig);
  return { ...q, options: shuffled, correctIndex: shuffled.indexOf(correctText) };
}

// ============================================================
// HELPER: Get fallback questions from built-in bank
// ============================================================
function getClientFallbackQuestions(subject, difficulty, count, previousQuestions) {
  const subjectKey = Object.keys(CLIENT_QUIZ_BANK).find(k =>
    k.toLowerCase() === subject.toLowerCase() ||
    subject.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(subject.toLowerCase())
  );

  let pool = subjectKey ? [...CLIENT_QUIZ_BANK[subjectKey]] : [];

  // If no subject match, use a generic pool from all subjects
  if (pool.length === 0) {
    pool = Object.values(CLIENT_QUIZ_BANK).flat();
  }

  const prevSet = new Set((previousQuestions || []).map(p =>
    (typeof p === "string" ? p : p?.question || "").trim().toLowerCase()
  ));

  const diffFiltered = pool.filter(q => {
    if (q.difficulty && q.difficulty.toLowerCase() !== difficulty.toLowerCase()) return false;
    const norm = q.question.trim().toLowerCase();
    return !prevSet.has(norm);
  });

  // If not enough after difficulty filter, use all regardless of difficulty
  const finalPool = diffFiltered.length >= 3 ? diffFiltered : pool.filter(q => {
    const norm = q.question.trim().toLowerCase();
    return !prevSet.has(norm);
  });

  const picked = shuffleArray(finalPool).slice(0, count);
  return picked.map((q, i) => shuffleOptions({
    ...q,
    id: `client_fb_${Date.now()}_${i}`,
    subject: subject,
    difficulty: difficulty
  }));
}

function getClientAptitudeFallback(section, count, previousQuestions) {
  const prevSet = new Set((previousQuestions || []).map(p =>
    (typeof p === "string" ? p : p?.question || "").trim().toLowerCase()
  ));

  let pool;
  if (section === "Quantitative Aptitude") pool = CLIENT_APTITUDE_BANK["Quantitative Aptitude"];
  else if (section === "Logical Reasoning") pool = CLIENT_APTITUDE_BANK["Logical Reasoning"];
  else if (section === "Verbal Ability") pool = CLIENT_APTITUDE_BANK["Verbal Ability"];
  else pool = Object.values(CLIENT_APTITUDE_BANK).flat();

  const filtered = pool.filter(q => !prevSet.has(q.question.trim().toLowerCase()));
  const finalPool = filtered.length >= 3 ? filtered : pool;
  const picked = shuffleArray(finalPool).slice(0, count);

  return picked.map((q, i) => shuffleOptions({
    ...q,
    id: `client_apt_${Date.now()}_${i}`,
    correctIndex: q.correctIndex
  }));
}

function getClientGateFallback(subject, difficulty, count, previousQuestions) {
  const prevSet = new Set((previousQuestions || []).map(p =>
    (typeof p === "string" ? p : p?.question || "").trim().toLowerCase()
  ));

  let pool = CLIENT_GATE_BANK.filter(q => {
    if (q.difficulty && q.difficulty.toLowerCase() !== difficulty.toLowerCase()) return false;
    return !prevSet.has(q.question.trim().toLowerCase());
  });

  if (pool.length < 3) {
    pool = CLIENT_GATE_BANK.filter(q => !prevSet.has(q.question.trim().toLowerCase()));
  }
  if (pool.length === 0) pool = [...CLIENT_GATE_BANK];

  const picked = shuffleArray(pool).slice(0, count);
  return picked.map((q, i) => shuffleOptions({
    ...q,
    id: `client_gate_${Date.now()}_${i}`,
    subject: subject || q.subject,
    difficulty: difficulty
  }));
}

// ============================================================
// PUBLIC API — All functions never throw; always return data
// ============================================================

export async function fetchBranchRecommendations(branch) {
  const canon = canonicalClientBranch(branch);
  const fallback = CLIENT_BRANCH_SUBJECTS[canon] || CLIENT_BRANCH_SUBJECTS["Computer Science Engineering"];

  try {
    const res = await fetch("/api/ai/recommend-subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ branch: canon })
    });
    if (!res.ok) throw new Error("Server error");
    const data = await res.json();
    return {
      branch: canon,
      recommendedLanguages: data.recommendedLanguages || fallback.recommendedLanguages,
      recommendedSubjects: data.recommendedSubjects || fallback.recommendedSubjects,
      allSubjects: data.allSubjects || [...(data.recommendedLanguages || fallback.recommendedLanguages), ...(data.recommendedSubjects || fallback.recommendedSubjects)],
      learningPath: data.learningPath || fallback.learningPath,
      isAiGenerated: Boolean(data.isAiGenerated)
    };
  } catch (err) {
    console.warn("Branch recommendation fallback (client-side):", err);
    return {
      branch: canon,
      recommendedLanguages: [...fallback.recommendedLanguages],
      recommendedSubjects: [...fallback.recommendedSubjects],
      allSubjects: [...fallback.recommendedLanguages, ...fallback.recommendedSubjects],
      learningPath: fallback.learningPath,
      isAiGenerated: false
    };
  }
}

/**
 * Fetch quiz questions — NEVER throws.
 * Falls back to built-in client-side bank if server is unavailable.
 */
export async function fetchQuizQuestions(subject, difficulty = "Medium", count = 10, previousQuestions = [], branch = "") {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    const res = await fetch("/api/ai/generate-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, difficulty, count, previousQuestions, branch }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("Quiz API error", res.status, errText);
      throw new Error(`Server returned ${res.status}`);
    }
    const data = await res.json();
    // If server returned empty questions, use client fallback
    if (!Array.isArray(data?.questions) || data.questions.length === 0) {
      throw new Error("Server returned empty questions");
    }
    return data;
  } catch (err) {
    console.warn("Quiz generation — using client-side fallback bank:", err?.message || err);
    const fallbackQs = getClientFallbackQuestions(subject, difficulty, count, previousQuestions);
    return { questions: fallbackQs, isAiGenerated: false };
  }
}

/**
 * Fetch aptitude questions — NEVER throws.
 * Falls back to built-in client-side bank if server is unavailable.
 */
export async function fetchAptitudeQuestions(section, topic, difficulty = "Medium", count = 10, previousQuestions = []) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    const res = await fetch("/api/ai/generate-aptitude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, topic, difficulty, count, previousQuestions }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("Aptitude API error", res.status, errText);
      throw new Error(`Server returned ${res.status}`);
    }
    const data = await res.json();
    if (!Array.isArray(data?.questions) || data.questions.length === 0) {
      throw new Error("Server returned empty aptitude questions");
    }
    return data;
  } catch (err) {
    console.warn("Aptitude generation — using client-side fallback bank:", err?.message || err);
    const fallbackQs = getClientAptitudeFallback(section, count, previousQuestions);
    return { questions: fallbackQs, isAiGenerated: false };
  }
}

/**
 * Fetch GATE questions — NEVER throws.
 * Falls back to built-in client-side bank if server is unavailable.
 */
export async function fetchGateQuestions(subject, difficulty = "Medium", count = 10, previousQuestions = [], branch = "Computer Science Engineering") {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    const res = await fetch("/api/ai/generate-gate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, difficulty, count, previousQuestions, branch }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("GATE API error", res.status, errText);
      throw new Error(`Server returned ${res.status}`);
    }
    const data = await res.json();
    if (!Array.isArray(data?.questions) || data.questions.length === 0) {
      throw new Error("Server returned empty GATE questions");
    }
    return data;
  } catch (err) {
    console.warn("GATE generation — using client-side fallback bank:", err?.message || err);
    const fallbackQs = getClientGateFallback(subject, difficulty, count, previousQuestions);
    return { questions: fallbackQs, isAiGenerated: false };
  }
}

export async function fetchPerformanceAnalysis(payload) {
  try {
    const res = await fetch("/api/ai/analyze-performance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Server error");
    return await res.json();
  } catch (err) {
    console.warn("Performance analysis fallback:", err);
    const pct = Math.round((payload.score / (payload.totalQuestions || 1)) * 100);
    return {
      strongAreas: pct >= 70 ? ["Core Concepts", "Problem Solving"] : ["Basic Understanding"],
      needsPractice: pct < 70 ? ["Advanced Concepts", "Speed & Accuracy"] : ["Edge Cases"],
      recommendation: pct >= 80
        ? `Excellent performance in ${payload.subject}! Move to harder difficulty next.`
        : pct >= 50
        ? `Good base in ${payload.subject}. Review weak topics and practice more.`
        : `Focus on ${payload.subject} fundamentals through regular practice.`,
      summary: `Scored ${payload.score}/${payload.totalQuestions} (${pct}%) in ${payload.subject}.`,
      accuracyRate: `${pct}%`
    };
  }
}
