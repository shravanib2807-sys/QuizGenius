/**
 * Curated Question Banks for QuizGenius
 * Strictly partitioned by Subject and Difficulty level (Easy, Medium, Hard).
 * Each question has exactly 4 options, a valid correctIndex (0-3), an educational explanation,
 * and complies with the required difficulty definitions.
 */

export interface CuratedQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  subject: string;
}

// -------------------------------------------------------------
// PYTHON QUESTION BANK
// -------------------------------------------------------------
export const PYTHON_EASY: CuratedQuestion[] = [
  {
    id: "py_e_1",
    question: "What is the correct file extension for Python script files?",
    options: [".py", ".python", ".pt", ".pys"],
    correctIndex: 0,
    explanation: "Standard Python source files use the .py extension.",
    topic: "Basic Syntax",
    difficulty: "Easy",
    subject: "Python"
  },
  {
    id: "py_e_2",
    question: "Which keyword is used to define a function in Python?",
    options: ["func", "define", "def", "function"],
    correctIndex: 2,
    explanation: "In Python, functions are defined using the 'def' keyword followed by the function name and parentheses.",
    topic: "Functions",
    difficulty: "Easy",
    subject: "Python"
  },
  {
    id: "py_e_3",
    question: "What will print(len('QuizGenius')) output?",
    options: ["10", "9", "8", "11"],
    correctIndex: 0,
    explanation: "The string 'QuizGenius' contains exactly 10 characters (Q-u-i-z-G-e-n-i-u-s).",
    topic: "Built-in Functions",
    difficulty: "Easy",
    subject: "Python"
  },
  {
    id: "py_e_4",
    question: "Which built-in Python data type is immutable?",
    options: ["list", "set", "dict", "tuple"],
    correctIndex: 3,
    explanation: "Tuples cannot be modified after creation, making them immutable.",
    topic: "Data Types",
    difficulty: "Easy",
    subject: "Python"
  },
  {
    id: "py_e_5",
    question: "Which operator is used for exponentiation (power) in Python?",
    options: ["^", "**", "pow", "//"],
    correctIndex: 1,
    explanation: "The ** operator computes power in Python (e.g., 2 ** 3 = 8).",
    topic: "Operators",
    difficulty: "Easy",
    subject: "Python"
  },
  {
    id: "py_e_6",
    question: "How do you write a single-line comment in Python?",
    options: ["// comment", "/* comment */", "# comment", "<!-- comment -->"],
    correctIndex: 2,
    explanation: "Single-line comments in Python begin with the hash symbol (#).",
    topic: "Basic Syntax",
    difficulty: "Easy",
    subject: "Python"
  },
  {
    id: "py_e_7",
    question: "What will print(10 // 3) output in Python?",
    options: ["3.33", "3", "3.0", "1"],
    correctIndex: 1,
    explanation: "The // operator performs integer (floor) division, returning 3.",
    topic: "Operators",
    difficulty: "Easy",
    subject: "Python"
  },
  {
    id: "py_e_8",
    question: "Which function is used to accept input from a console user in Python 3?",
    options: ["cin()", "scan()", "input()", "read()"],
    correctIndex: 2,
    explanation: "Python 3 uses input() to read a line of input from standard input as a string.",
    topic: "Input/Output",
    difficulty: "Easy",
    subject: "Python"
  },
  {
    id: "py_e_9",
    question: "What is the boolean value of an empty string '' in Python?",
    options: ["True", "False", "None", "Error"],
    correctIndex: 1,
    explanation: "In Python, empty sequences including empty strings evaluate to False in a boolean context.",
    topic: "Data Types",
    difficulty: "Easy",
    subject: "Python"
  },
  {
    id: "py_e_10",
    question: "Which keyword is used to import an external module in Python?",
    options: ["using", "require", "include", "import"],
    correctIndex: 3,
    explanation: "The 'import' keyword is used to load modules into the current Python namespace.",
    topic: "Modules",
    difficulty: "Easy",
    subject: "Python"
  },
  {
    id: "py_e_11",
    question: "What will print(type(42)) output in Python?",
    options: ["<class 'int'>", "<class 'number'>", "<type 'integer'>", "int"],
    correctIndex: 0,
    explanation: "Whole numbers in Python are instances of the built-in 'int' class.",
    topic: "Data Types",
    difficulty: "Easy",
    subject: "Python"
  },
  {
    id: "py_e_12",
    question: "Which string method converts all characters in a string to lowercase?",
    options: [".toLower()", ".lower()", ".down()", ".casefold(0)"],
    correctIndex: 1,
    explanation: "The .lower() method returns a copy of the string converted to lowercase.",
    topic: "Strings",
    difficulty: "Easy",
    subject: "Python"
  },
  {
    id: "py_e_13",
    question: "Which collection in Python is ordered, changeable, and defined using square brackets []?",
    options: ["tuple", "set", "dictionary", "list"],
    correctIndex: 3,
    explanation: "Lists are mutable ordered sequences declared using square brackets [].",
    topic: "Collections",
    difficulty: "Easy",
    subject: "Python"
  },
  {
    id: "py_e_14",
    question: "What is the correct way to output 'Hello World' in Python 3?",
    options: ["echo 'Hello World'", "System.out.println('Hello World')", "print('Hello World')", "console.log('Hello World')"],
    correctIndex: 2,
    explanation: "The print() built-in function is the standard way to write text to standard output.",
    topic: "Basic Syntax",
    difficulty: "Easy",
    subject: "Python"
  },
  {
    id: "py_e_15",
    question: "Which keyword is used to create a loop that iterates over a sequence in Python?",
    options: ["loop", "repeat", "for", "foreach"],
    correctIndex: 2,
    explanation: "Python uses 'for' loops to iterate over items of any sequence such as a list or a string.",
    topic: "Control Flow",
    difficulty: "Easy",
    subject: "Python"
  }
];

export const PYTHON_MEDIUM: CuratedQuestion[] = [
  {
    id: "py_m_1",
    question: "What is the output of: print([x * 2 for x in range(4) if x % 2 == 0])?",
    options: ["[0, 4]", "[0, 2, 4]", "[0, 4, 8]", "[2, 6]"],
    correctIndex: 0,
    explanation: "range(4) produces 0, 1, 2, 3. The condition x % 2 == 0 filters 0 and 2. Multiplying each by 2 yields [0, 4].",
    topic: "List Comprehensions",
    difficulty: "Medium",
    subject: "Python"
  },
  {
    id: "py_m_2",
    question: "What will be printed by: print(bool([]), bool([0]))?",
    options: ["True True", "False False", "False True", "True False"],
    correctIndex: 2,
    explanation: "An empty list [] is falsy. A non-empty list [0] has length 1 and is truthy, regardless of containing 0.",
    topic: "Truthiness & Collections",
    difficulty: "Medium",
    subject: "Python"
  },
  {
    id: "py_m_3",
    question: "What does the dictionary method dict.get('key', 'default') do when 'key' is not present?",
    options: ["Raises KeyError", "Inserts 'key': 'default' into the dictionary", "Returns 'default' without raising KeyError", "Returns None"],
    correctIndex: 2,
    explanation: ".get(key, default) safely returns the fallback value without modifying the dictionary or raising a KeyError.",
    topic: "Dictionaries",
    difficulty: "Medium",
    subject: "Python"
  },
  {
    id: "py_m_4",
    question: "What is the output of the slice expression 'Python'[::-1]?",
    options: ["'nohtyP'", "'Python'", "'P'", "IndexError"],
    correctIndex: 0,
    explanation: "A slice with a step of -1 reverses the sequence, producing 'nohtyP'.",
    topic: "Slicing",
    difficulty: "Medium",
    subject: "Python"
  },
  {
    id: "py_m_5",
    question: "What is the primary difference between a list and a set in Python?",
    options: [
      "Sets are ordered; lists are unordered",
      "Sets store only unique elements; lists allow duplicates",
      "Lists cannot contain integers; sets can",
      "Lists are immutable; sets are mutable"
    ],
    correctIndex: 1,
    explanation: "Sets enforce unique elements and have O(1) average lookup, whereas lists preserve order and permit duplicate elements.",
    topic: "Collections",
    difficulty: "Medium",
    subject: "Python"
  },
  {
    id: "py_m_6",
    question: "What happens when a function modifies a mutable default argument across successive calls?",
    options: [
      "A new object is created on each call",
      "The default object retains modifications across calls",
      "Python raises an UnboundLocalError",
      "The parameter resets to its initial definition"
    ],
    correctIndex: 1,
    explanation: "Default parameter values are evaluated once at function definition time, so mutations persist across all subsequent calls.",
    topic: "Function Arguments",
    difficulty: "Medium",
    subject: "Python"
  },
  {
    id: "py_m_7",
    question: "What will print(type((1))) and print(type((1,))) output?",
    options: [
      "<class 'tuple'> and <class 'tuple'>",
      "<class 'int'> and <class 'tuple'>",
      "<class 'int'> and <class 'int'>",
      "<class 'list'> and <class 'tuple'>"
    ],
    correctIndex: 1,
    explanation: "(1) is evaluated as parenthesized integer math. A single-element tuple requires a trailing comma: (1,).",
    topic: "Tuples",
    difficulty: "Medium",
    subject: "Python"
  },
  {
    id: "py_m_8",
    question: "What keyword is used inside a generator function to produce values lazily?",
    options: ["return", "produce", "yield", "send"],
    correctIndex: 2,
    explanation: "The 'yield' keyword pauses execution and yields a value, transforming the function into an iterator generator.",
    topic: "Generators",
    difficulty: "Medium",
    subject: "Python"
  },
  {
    id: "py_m_9",
    question: "What block in a try-except structure executes only if NO exceptions were raised in the try block?",
    options: ["finally", "else", "catch", "then"],
    correctIndex: 1,
    explanation: "The 'else' block executes if and only if the code in the 'try' block completed without raising any exception.",
    topic: "Exception Handling",
    difficulty: "Medium",
    subject: "Python"
  },
  {
    id: "py_m_10",
    question: "What does the *args parameter syntax allow a Python function to accept?",
    options: [
      "Keyword arguments as a dictionary",
      "An arbitrary number of positional arguments as a tuple",
      "Only pointer addresses",
      "Only mandatory named arguments"
    ],
    correctIndex: 1,
    explanation: "*args packs arbitrary positional arguments passed to the function into a single tuple.",
    topic: "Functions",
    difficulty: "Medium",
    subject: "Python"
  },
  {
    id: "py_m_11",
    question: "What is the output of print({1, 2, 3} & {2, 3, 4}) in Python?",
    options: ["{1, 4}", "{2, 3}", "{1, 2, 3, 4}", "False"],
    correctIndex: 1,
    explanation: "The & operator computes the set intersection, yielding {2, 3}.",
    topic: "Sets",
    difficulty: "Medium",
    subject: "Python"
  },
  {
    id: "py_m_12",
    question: "Which built-in function pairs elements from two iterables into tuples until the shortest iterable is exhausted?",
    options: ["map()", "enumerate()", "zip()", "filter()"],
    correctIndex: 2,
    explanation: "zip() takes multiple iterables and aggregates corresponding elements into tuples.",
    topic: "Iterables",
    difficulty: "Medium",
    subject: "Python"
  },
  {
    id: "py_m_13",
    question: "What is the output of: a = [1, 2]; b = a; b.append(3); print(len(a))?",
    options: ["2", "3", "4", "AttributeError"],
    correctIndex: 1,
    explanation: "'b = a' creates a reference to the same list object in memory, so mutating 'b' mutates 'a'. len(a) is 3.",
    topic: "References & Mutability",
    difficulty: "Medium",
    subject: "Python"
  },
  {
    id: "py_m_14",
    question: "What protocol does a Python object implement to be usable in a 'with' context manager statement?",
    options: [
      "__open__ and __close__",
      "__enter__ and __exit__",
      "__start__ and __stop__",
      "__init__ and __del__"
    ],
    correctIndex: 1,
    explanation: "Context managers must implement the context management protocol via __enter__() and __exit__() methods.",
    topic: "Context Managers",
    difficulty: "Medium",
    subject: "Python"
  },
  {
    id: "py_m_15",
    question: "What does the 'is' operator test for in Python?",
    options: [
      "Equality of content values",
      "Object identity (same memory address)",
      "Type match only",
      "Subset inclusion"
    ],
    correctIndex: 1,
    explanation: "'is' checks whether two variables reference the exact same memory identity (id(a) == id(b)), whereas '==' tests value equality.",
    topic: "Object Model",
    difficulty: "Medium",
    subject: "Python"
  }
];

export const PYTHON_HARD: CuratedQuestion[] = [
  {
    id: "py_h_1",
    question: "In Python's Method Resolution Order (MRO), what algorithm is used to linearize multiple inheritance class hierarchies?",
    options: ["Depth First Search (DFS)", "Breadth First Search (BFS)", "C3 Linearization Algorithm", "Dijkstra's Order"],
    correctIndex: 2,
    explanation: "Python 2.3+ and Python 3 use the C3 Linearization algorithm to determine monotonic MRO in multiple inheritance.",
    topic: "MRO & OOP Internals",
    difficulty: "Hard",
    subject: "Python"
  },
  {
    id: "py_h_2",
    question: "What is the primary role of the __new__ method compared to __init__ in Python classes?",
    options: [
      "__new__ initializes attributes; __init__ allocates memory",
      "__new__ creates and returns the new instance; __init__ initializes it after creation",
      "__new__ is called only during garbage collection",
      "__new__ is executed only in subclasses of Exception"
    ],
    correctIndex: 1,
    explanation: "__new__ is the static constructor that creates and returns a new object instance. __init__ is the initializer called with the created instance.",
    topic: "Object Creation",
    difficulty: "Hard",
    subject: "Python"
  },
  {
    id: "py_h_3",
    question: "Why does defining __slots__ in a Python class reduce memory consumption?",
    options: [
      "It compresses class methods into bytecode",
      "It prevents the dynamic creation of an instance __dict__ and allocates a fixed array for attributes",
      "It runs code in C without GIL overhead",
      "It converts all instance attributes to 32-bit floats"
    ],
    correctIndex: 1,
    explanation: "__slots__ reserves space for a fixed set of attributes, avoiding the memory overhead of a per-instance dictionary (__dict__).",
    topic: "Memory Optimization",
    difficulty: "Hard",
    subject: "Python"
  },
  {
    id: "py_h_4",
    question: "What is the effect of the Global Interpreter Lock (GIL) in CPython?",
    options: [
      "It prevents multiple Python processes from running simultaneously",
      "It allows only one native thread to execute Python bytecodes at any given time per process",
      "It completely disables multiprocessing on multi-core CPUs",
      "It locks files on disk during open() calls"
    ],
    correctIndex: 1,
    explanation: "CPython's GIL is a mutex that prevents multiple native threads from executing Python bytecodes concurrently, safeguarding memory management.",
    topic: "Concurrency & CPython",
    difficulty: "Hard",
    subject: "Python"
  },
  {
    id: "py_h_5",
    question: "How does Python handle reference cycles that reference counting alone cannot reclaim?",
    options: [
      "It leaks the memory indefinitely",
      "It uses a generational cyclic garbage collector that periodically tracks container objects",
      "It terminates the process when memory reaches 90%",
      "It calls sys.exit(1)"
    ],
    correctIndex: 1,
    explanation: "CPython pairs reference counting with a cyclic generational garbage collector (gc module) that scans container objects for isolated reference loops.",
    topic: "Garbage Collection",
    difficulty: "Hard",
    subject: "Python"
  },
  {
    id: "py_h_6",
    question: "What methods must an object implement to be recognized as a descriptor in Python?",
    options: [
      "__get__, __set__, and/or __delete__",
      "__read__ and __write__",
      "__lookup__ and __assign__",
      "__attr__ and __setattr__"
    ],
    correctIndex: 0,
    explanation: "The descriptor protocol requires implementing at least one of __get__(), __set__(), or __delete__() on an attribute defined at class level.",
    topic: "Descriptors",
    difficulty: "Hard",
    subject: "Python"
  },
  {
    id: "py_h_7",
    question: "What does functools.wraps do when applied to a decorator's wrapper function?",
    options: [
      "Compiles the function to C code",
      "Copies original function metadata (such as __name__, __doc__, and annotations) to the wrapper",
      "Enforces strict type safety at runtime",
      "Executes the function inside a thread pool"
    ],
    correctIndex: 1,
    explanation: "@functools.wraps preserves introspection metadata of the decorated callable, copying attributes like __name__ and __doc__.",
    topic: "Decorators & Metaprogramming",
    difficulty: "Hard",
    subject: "Python"
  },
  {
    id: "py_h_8",
    question: "What is the return value of __exit__ in a context manager if you want to suppress an exception raised in the with block?",
    options: ["None", "A truthy value (e.g. True)", "False", "raise Exception"],
    correctIndex: 1,
    explanation: "If __exit__(self, exc_type, exc_val, exc_tb) returns True (or any truthy value), Python suppresses the exception and continues execution normally.",
    topic: "Context Managers",
    difficulty: "Hard",
    subject: "Python"
  },
  {
    id: "py_h_9",
    question: "What is the result of executing: [f() for f in [(lambda: i) for i in range(3)]]?",
    options: ["[0, 1, 2]", "[2, 2, 2]", "[0, 0, 0]", "TypeError"],
    correctIndex: 1,
    explanation: "Lambdas create closures over the variable 'i', not its value at creation. When called, the loop has completed and 'i' evaluates to 2, yielding [2, 2, 2].",
    topic: "Closures & Late Binding",
    difficulty: "Hard",
    subject: "Python"
  },
  {
    id: "py_h_10",
    question: "In asyncio, what happens if an unhandled exception occurs inside a Task that is never awaited or retrieved via task.exception()?",
    options: [
      "The Python interpreter crashes immediately",
      "A 'Task exception was never retrieved' log warning is emitted when the task is garbage collected",
      "The event loop automatically restarts",
      "It is silently converted into an exit code of 0"
    ],
    correctIndex: 1,
    explanation: "Asyncio logs a warning when a Task object is destroyed by garbage collection with an unretrieved exception.",
    topic: "Asynchronous Programming",
    difficulty: "Hard",
    subject: "Python"
  },
  {
    id: "py_h_11",
    question: "What does the 'yield from' expression accomplish in Python generators?",
    options: [
      "Terminates generator iteration prematurely",
      "Delegates iteration to a subgenerator, transparently establishing a bidirectional channel for values and exceptions",
      "Creates a multithreaded generator queue",
      "Resets the generator state to the first instruction"
    ],
    correctIndex: 1,
    explanation: "'yield from <subgen>' delegates to a subgenerator, passing .send() inputs and .throw() exceptions directly between caller and subgenerator.",
    topic: "Coroutines & Generators",
    difficulty: "Hard",
    subject: "Python"
  },
  {
    id: "py_h_12",
    question: "What is the purpose of the 'metaclass' keyword argument in a class declaration?",
    options: [
      "It specifies the database schema for the class",
      "It defines the class factory (type constructor) responsible for constructing the class object itself",
      "It restricts subclassing",
      "It creates an abstract interface"
    ],
    correctIndex: 1,
    explanation: "A metaclass is the class of a class. It controls the creation, validation, and layout of the class object upon module definition.",
    topic: "Metaclasses",
    difficulty: "Hard",
    subject: "Python"
  },
  {
    id: "py_h_13",
    question: "In Python memory management, what are arenas, pools, and blocks part of?",
    options: [
      "The OS page-swapping daemon",
      "PyMalloc, CPython's specialized small object memory allocator",
      "The ctypes dynamic library linker",
      "The dis bytecode disassembler"
    ],
    correctIndex: 1,
    explanation: "PyMalloc manages small memory allocations (<= 512 bytes) using a hierarchy of 256KB arenas, subdivided into 4KB pools, containing fixed-size blocks.",
    topic: "Memory Management",
    difficulty: "Hard",
    subject: "Python"
  },
  {
    id: "py_h_14",
    question: "What does copy.deepcopy() do when an object contains a self-referential cycle?",
    options: [
      "Raises RecursionError indefinitely",
      "Tracks already copied objects in a memo dictionary to safely reproduce the cycle without infinite recursion",
      "Replaces the cycle with None",
      "Segfaults the interpreter"
    ],
    correctIndex: 1,
    explanation: "deepcopy uses an internal memo dictionary mapping id(old_obj) -> new_obj, detecting and safely duplicating cyclic structures.",
    topic: "Object Duplication",
    difficulty: "Hard",
    subject: "Python"
  },
  {
    id: "py_h_15",
    question: "What does the weakref module allow developers to create?",
    options: [
      "Encrypted pointers to foreign functions",
      "References to objects without increasing their reference count, avoiding cyclic memory leaks",
      "Pointers that survive process termination",
      "Variables that cannot be reassigned"
    ],
    correctIndex: 1,
    explanation: "weakref allows referencing an object without incrementing its reference count, allowing it to be garbage collected when only weak references remain.",
    topic: "Weak References",
    difficulty: "Hard",
    subject: "Python"
  }
];

// -------------------------------------------------------------
// C++ QUESTION BANK
// -------------------------------------------------------------
export const CPP_EASY: CuratedQuestion[] = [
  {
    id: "cpp_e_1",
    question: "Which stream object is used to print output to the console in C++?",
    options: ["std::cin", "std::cout", "std::cerr", "printf"],
    correctIndex: 1,
    explanation: "std::cout (character output) in the <iostream> header prints formatted data to the standard console.",
    topic: "Input/Output",
    difficulty: "Easy",
    subject: "C++"
  },
  {
    id: "cpp_e_2",
    question: "What is the correct file extension for standard C++ source files?",
    options: [".cpp", ".cp", ".cxx", "Both .cpp and .cxx"],
    correctIndex: 3,
    explanation: "Both .cpp and .cxx are widely recognized standard extensions for C++ source files.",
    topic: "Basics",
    difficulty: "Easy",
    subject: "C++"
  },
  {
    id: "cpp_e_3",
    question: "Which keyword is used to declare a variable that cannot be modified in C++?",
    options: ["fixed", "static", "const", "immutable"],
    correctIndex: 2,
    explanation: "'const' specifies that a variable's value is constant and cannot be modified after initialization.",
    topic: "Keywords",
    difficulty: "Easy",
    subject: "C++"
  },
  {
    id: "cpp_e_4",
    question: "What is the return type of the main() function according to C++ standards?",
    options: ["void", "int", "char", "bool"],
    correctIndex: 1,
    explanation: "According to the ISO C++ standard, main() must have a return type of int.",
    topic: "Functions",
    difficulty: "Easy",
    subject: "C++"
  },
  {
    id: "cpp_e_5",
    question: "Which header file is required to use std::cout and std::cin?",
    options: ["<stdio.h>", "<iostream>", "<string>", "<stdlib.h>"],
    correctIndex: 1,
    explanation: "<iostream> defines the standard I/O stream objects including cin, cout, cerr, and clog.",
    topic: "Headers",
    difficulty: "Easy",
    subject: "C++"
  },
  {
    id: "cpp_e_6",
    question: "What operator is used to insert data into the std::cout stream?",
    options: [">>", "<<", "->", "::"],
    correctIndex: 1,
    explanation: "The stream insertion operator (<<) sends formatted data into an output stream.",
    topic: "Operators",
    difficulty: "Easy",
    subject: "C++"
  },
  {
    id: "cpp_e_7",
    question: "What is the default access specifier for members of a 'class' in C++?",
    options: ["public", "protected", "private", "internal"],
    correctIndex: 2,
    explanation: "Members of a class in C++ are private by default, whereas members of a struct are public by default.",
    topic: "OOP Basics",
    difficulty: "Easy",
    subject: "C++"
  },
  {
    id: "cpp_e_8",
    question: "Which operator is used to access members of a class through an object instance?",
    options: [".", "->", "::", "*"],
    correctIndex: 0,
    explanation: "The dot operator (.) accesses members of an object directly.",
    topic: "OOP Basics",
    difficulty: "Easy",
    subject: "C++"
  },
  {
    id: "cpp_e_9",
    question: "How do you create a single-line comment in C++?",
    options: ["# comment", "// comment", "/* comment */", "-- comment"],
    correctIndex: 1,
    explanation: "// indicates a single-line comment in C++.",
    topic: "Syntax",
    difficulty: "Easy",
    subject: "C++"
  },
  {
    id: "cpp_e_10",
    question: "What symbol denotes the address-of operator in C++?",
    options: ["*", "&", "@", "->"],
    correctIndex: 1,
    explanation: "The ampersand (&) operator retrieves the memory address of an lvalue variable.",
    topic: "Pointers & References",
    difficulty: "Easy",
    subject: "C++"
  },
  {
    id: "cpp_e_11",
    question: "What operator is used for dynamic memory allocation in C++?",
    options: ["malloc", "alloc", "new", "create"],
    correctIndex: 2,
    explanation: "The 'new' operator allocates memory dynamically on the free store (heap) and invokes the constructor.",
    topic: "Memory",
    difficulty: "Easy",
    subject: "C++"
  },
  {
    id: "cpp_e_12",
    question: "Which operator releases memory allocated with 'new'?",
    options: ["free", "delete", "destroy", "dealloc"],
    correctIndex: 1,
    explanation: "'delete' invokes the destructor and frees the heap memory allocated by 'new'.",
    topic: "Memory",
    difficulty: "Easy",
    subject: "C++"
  },
  {
    id: "cpp_e_13",
    question: "What is the boolean data type in C++?",
    options: ["boolean", "bool", "bit", "logical"],
    correctIndex: 1,
    explanation: "C++ includes 'bool' as a fundamental primitive type taking values true or false.",
    topic: "Data Types",
    difficulty: "Easy",
    subject: "C++"
  },
  {
    id: "cpp_e_14",
    question: "What does std::endl do in addition to printing a newline character?",
    options: ["Closes the stream", "Clears the screen", "Flushes the output stream buffer", "Stops program execution"],
    correctIndex: 2,
    explanation: "std::endl inserts a newline '\\n' and immediately flushes the associated stream buffer.",
    topic: "Streams",
    difficulty: "Easy",
    subject: "C++"
  },
  {
    id: "cpp_e_15",
    question: "Which scope resolution operator is used to access global variables or namespace members in C++?",
    options: ["::", "->", ".", ":"],
    correctIndex: 0,
    explanation: "The double colon (::) is the scope resolution operator in C++.",
    topic: "Syntax",
    difficulty: "Easy",
    subject: "C++"
  }
];

export const CPP_MEDIUM: CuratedQuestion[] = [
  {
    id: "cpp_m_1",
    question: "What is the difference between a pointer and a reference in C++?",
    options: [
      "Pointers cannot be NULL; references can",
      "References must be initialized upon declaration and cannot be reseated; pointers can be reassigned and can be null",
      "References require manual delete; pointers do not",
      "There is no difference in C++"
    ],
    correctIndex: 1,
    explanation: "A reference is an alias that must bind to a valid object upon creation and cannot be rebound. A pointer holds an address, can be null, and can be reassigned.",
    topic: "References & Pointers",
    difficulty: "Medium",
    subject: "C++"
  },
  {
    id: "cpp_m_2",
    question: "What is the purpose of declaring a base class destructor as 'virtual'?",
    options: [
      "To prevent the class from being instantiated",
      "To ensure proper polymorphic destruction of derived class objects when deleted through a base class pointer",
      "To make memory allocation faster",
      "To allow the destructor to accept parameters"
    ],
    correctIndex: 1,
    explanation: "Without a virtual destructor, deleting a derived object via a base pointer leads to undefined behavior because only the base destructor runs.",
    topic: "Polymorphism",
    difficulty: "Medium",
    subject: "C++"
  },
  {
    id: "cpp_m_3",
    question: "What happens when an exception is thrown in a C++ function and stack unwinding occurs?",
    options: [
      "Memory on the heap is automatically freed",
      "Destructors of all fully constructed automatic (local stack) objects in scope are invoked in reverse order",
      "All threads are terminated immediately",
      "The program re-executes main()"
    ],
    correctIndex: 1,
    explanation: "Stack unwinding guarantees that destructors for automatic objects constructed in the try block are executed in reverse construction order.",
    topic: "Exception Handling",
    difficulty: "Medium",
    subject: "C++"
  },
  {
    id: "cpp_m_4",
    question: "What is RAII (Resource Acquisition Is Initialization) in C++?",
    options: [
      "A compiler optimization for loops",
      "A pattern where resource lifecycle is bound to object lifetime, acquiring resources in constructors and releasing them in destructors",
      "An automated garbage collector library",
      "A rule that all variables must be initialized to zero"
    ],
    correctIndex: 1,
    explanation: "RAII ties resource management (files, sockets, heap memory) to local object lifetimes, guaranteeing cleanup via destructors even during exceptions.",
    topic: "Design Idioms",
    difficulty: "Medium",
    subject: "C++"
  },
  {
    id: "cpp_m_5",
    question: "What is the time complexity of inserting an element at the end of a std::vector when capacity is sufficient?",
    options: ["O(N)", "O(1) amortized", "O(log N)", "O(N^2)"],
    correctIndex: 1,
    explanation: "push_back() on a std::vector operates in O(1) amortized time.",
    topic: "STL Containers",
    difficulty: "Medium",
    subject: "C++"
  },
  {
    id: "cpp_m_6",
    question: "What does the 'explicit' keyword prevent when placed on a single-argument constructor?",
    options: [
      "Explicit type conversions",
      "Implicit conversions and copy-initialization from the argument type",
      "Inheritance from the class",
      "Overloading the constructor"
    ],
    correctIndex: 1,
    explanation: "'explicit' prevents the compiler from using the constructor for implicit type conversions and copy-initialization.",
    topic: "Constructors",
    difficulty: "Medium",
    subject: "C++"
  },
  {
    id: "cpp_m_7",
    question: "What does std::unique_ptr enforce regarding ownership?",
    options: [
      "Shared reference-counted ownership",
      "Exclusive, non-copyable ownership of a dynamically allocated object",
      "Weak non-owning observation",
      "Raw pointer aliasing"
    ],
    correctIndex: 1,
    explanation: "std::unique_ptr models strict single ownership: it cannot be copied, only moved, and automatically frees its resource when destroyed.",
    topic: "Smart Pointers",
    difficulty: "Medium",
    subject: "C++"
  },
  {
    id: "cpp_m_8",
    question: "Which STL container is typically implemented as a self-balancing Red-Black binary search tree?",
    options: ["std::unordered_map", "std::vector", "std::map", "std::deque"],
    correctIndex: 2,
    explanation: "std::map stores ordered key-value pairs with O(log N) operations, conventionally implemented as a Red-Black tree.",
    topic: "STL Internals",
    difficulty: "Medium",
    subject: "C++"
  },
  {
    id: "cpp_m_9",
    question: "What is operator overloading in C++?",
    options: [
      "Executing operators on multiple threads",
      "Giving custom, user-defined meanings to standard operators for user-defined types (classes/structs)",
      "Changing the precedence of operators",
      "Creating new operator symbols like $$ or @@"
    ],
    correctIndex: 1,
    explanation: "Operator overloading allows programmers to redefine how built-in operators behave when applied to class instances.",
    topic: "Operator Overloading",
    difficulty: "Medium",
    subject: "C++"
  },
  {
    id: "cpp_m_10",
    question: "What does declaring a member function as 'const' guarantee (e.g. int getValue() const)?",
    options: [
      "The function returns a constant value",
      "The function cannot modify any non-mutable member variables of the calling instance",
      "The function can only be called from const global scopes",
      "The function executes at compile time"
    ],
    correctIndex: 1,
    explanation: "A const member function cannot alter non-mutable member variables of *this and can be safely invoked on const object instances.",
    topic: "Const-Correctness",
    difficulty: "Medium",
    subject: "C++"
  },
  {
    id: "cpp_m_11",
    question: "What is the primary difference between a struct and a class in C++?",
    options: [
      "Structs cannot have methods",
      "Structs have default public member access and public inheritance, while classes default to private",
      "Structs are allocated on the stack; classes on the heap",
      "Structs cannot use templates"
    ],
    correctIndex: 1,
    explanation: "In C++, the only difference between struct and class is the default access specifier (public for struct, private for class).",
    topic: "OOP Basics",
    difficulty: "Medium",
    subject: "C++"
  },
  {
    id: "cpp_m_12",
    question: "What is an abstract class in C++?",
    options: [
      "A class that contains only static methods",
      "A class that has at least one pure virtual function (= 0) and cannot be directly instantiated",
      "A class defined without any member variables",
      "A class defined inside a namespace"
    ],
    correctIndex: 1,
    explanation: "A class containing at least one pure virtual function (e.g. virtual void fn() = 0;) is abstract and cannot be instantiated.",
    topic: "Polymorphism",
    difficulty: "Medium",
    subject: "C++"
  },
  {
    id: "cpp_m_13",
    question: "What does the copy constructor signature look like for class Widget?",
    options: [
      "Widget(Widget w)",
      "Widget(const Widget& other)",
      "Widget(Widget* other)",
      "void copy(Widget other)"
    ],
    correctIndex: 1,
    explanation: "The standard copy constructor accepts a const reference: Widget(const Widget& other) to prevent infinite recursion during parameter passing.",
    topic: "Constructors",
    difficulty: "Medium",
    subject: "C++"
  },
  {
    id: "cpp_m_14",
    question: "What header contains algorithms like std::sort, std::find, and std::binary_search?",
    options: ["<numeric>", "<utility>", "<algorithm>", "<vector>"],
    correctIndex: 2,
    explanation: "The <algorithm> header provides standard generic algorithms for iterating and transforming sequences.",
    topic: "STL Algorithms",
    difficulty: "Medium",
    subject: "C++"
  },
  {
    id: "cpp_m_15",
    question: "What does dynamic_cast return when casting a base pointer to an incompatible derived pointer fails?",
    options: ["Throws std::bad_cast", "nullptr", "Undefined memory address", "Terminates the program"],
    correctIndex: 1,
    explanation: "For pointer types, a failed dynamic_cast returns nullptr. For reference types, it throws std::bad_cast.",
    topic: "Casting",
    difficulty: "Medium",
    subject: "C++"
  }
];

export const CPP_HARD: CuratedQuestion[] = [
  {
    id: "cpp_h_1",
    question: "What does SFINAE stand for in modern C++ template metaprogramming?",
    options: [
      "Static Function Interface and Name Access Evaluation",
      "Substitution Failure Is Not An Error",
      "Standard Function Instantiation And Namespace Enforcement",
      "Sequential Fast Iteration and Node Access Execution"
    ],
    correctIndex: 1,
    explanation: "SFINAE allows template overloads to be cleanly discarded from the candidate set if type substitution produces invalid code.",
    topic: "Template Metaprogramming",
    difficulty: "Hard",
    subject: "C++"
  },
  {
    id: "cpp_h_2",
    question: "How does the vtable (virtual method table) mechanism enable runtime dynamic dispatch in C++?",
    options: [
      "The compiler injects a hidden vptr pointer into the object pointing to a table of function pointers for virtual methods",
      "The OS loader binds symbols dynamically upon each method call",
      "Methods are evaluated as strings in a hash table at runtime",
      "Calls are routed through an operating system trap"
    ],
    correctIndex: 0,
    explanation: "Polymorphic classes store a hidden vptr per instance that points to the class vtable containing function pointers to the resolved virtual implementations.",
    topic: "Runtime Polymorphism",
    difficulty: "Hard",
    subject: "C++"
  },
  {
    id: "cpp_h_3",
    question: "What does std::move(x) actually do at runtime?",
    options: [
      "Copies the memory of x to a new register",
      "Unconditionally casts x to an rvalue reference (static_cast<T&&>(x)) without moving any bytes",
      "Destroys x and frees its heap memory",
      "Re-allocates x on the thread stack"
    ],
    correctIndex: 1,
    explanation: "std::move performs a compile-time static cast to an rvalue reference (T&&), enabling move constructors or move assignments without doing runtime data copying.",
    topic: "Move Semantics",
    difficulty: "Hard",
    subject: "C++"
  },
  {
    id: "cpp_h_4",
    question: "In C++11 and later, what does std::forward<T>(arg) achieve in forwarding templates?",
    options: [
      "Converts all types into lvalues",
      "Preserves the value category (lvalue or rvalue) of the argument as originally passed (Perfect Forwarding)",
      "Forwards function calls across asynchronous threads",
      "Prevents inlining of the function"
    ],
    correctIndex: 1,
    explanation: "std::forward preserves the exact value category (lvalue vs rvalue) of a universal/forwarding reference.",
    topic: "Perfect Forwarding",
    difficulty: "Hard",
    subject: "C++"
  },
  {
    id: "cpp_h_5",
    question: "What problem arises when two std::shared_ptr instances reference each other cyclically?",
    options: [
      "Stack overflow during compilation",
      "A memory leak because their reference counts never reach zero, preventing destructors from running",
      "A segmentation fault on program exit",
      "Automatic conversion to std::unique_ptr"
    ],
    correctIndex: 1,
    explanation: "Cyclic shared_ptr ownership keeps reference counts >= 1 indefinitely, leaking both objects. std::weak_ptr must be used to break the cycle.",
    topic: "Smart Pointers & Memory",
    difficulty: "Hard",
    subject: "C++"
  },
  {
    id: "cpp_h_6",
    question: "What does the 'constexpr' specifier on a function indicate to the C++ compiler?",
    options: [
      "The function must always execute on a GPU thread",
      "The function can be evaluated at compile time if its arguments are constant expressions",
      "The function cannot contain any conditional statements",
      "The function has no return value"
    ],
    correctIndex: 1,
    explanation: "constexpr specifies that a function or variable can be evaluated at compile time when supplied with constant expressions.",
    topic: "Compile-Time Evaluation",
    difficulty: "Hard",
    subject: "C++"
  },
  {
    id: "cpp_h_7",
    question: "What is Memory Order Relaxed (std::memory_order_relaxed) in C++ atomic operations?",
    options: [
      "Guarantees sequential consistency across all CPU cores",
      "Ensures atomicity for the operation itself, but provides no synchronization or ordering constraints on surrounding reads/writes",
      "Acquires a mutex before executing the load/store",
      "Flushes CPU cache lines on every instruction"
    ],
    correctIndex: 1,
    explanation: "memory_order_relaxed guarantees atomicity and modification order consistency for the target variable without establishing happens-before relationships.",
    topic: "Atomics & Concurrency",
    difficulty: "Hard",
    subject: "C++"
  },
  {
    id: "cpp_h_8",
    question: "What is the Rule of Five in modern C++?",
    options: [
      "A rule that no class may have more than five member variables",
      "If a class requires custom management for destructor, copy constructor, or copy assignment, it likely needs move constructor and move assignment as well",
      "A rule that classes cannot inherit from more than five interfaces",
      "A guideline to limit function arguments to five"
    ],
    correctIndex: 1,
    explanation: "The Rule of Five states that if you declare any of destructor, copy ctor, copy assign, move ctor, or move assign, you should explicitly declare all five.",
    topic: "Resource Management",
    difficulty: "Hard",
    subject: "C++"
  },
  {
    id: "cpp_h_9",
    question: "What happens if a move constructor throws an exception during std::vector reallocation when the move constructor is NOT marked 'noexcept'?",
    options: [
      "The program terminates immediately",
      "std::vector falls back to using the copy constructor to preserve the strong exception guarantee",
      "Memory is corrupted",
      "The vector is truncated"
    ],
    correctIndex: 1,
    explanation: "std::vector uses std::move_if_noexcept; if the move constructor is not marked noexcept, it copies elements to satisfy the strong exception guarantee.",
    topic: "Exception Safety",
    difficulty: "Hard",
    subject: "C++"
  },
  {
    id: "cpp_h_10",
    question: "What is an Anonymous / Inaccessible Union with Placement New typically used to implement in C++17?",
    options: [
      "std::any and std::variant type-safe discriminated unions without heap overhead",
      "Virtual memory paging",
      "Dynamic array resizing",
      "Standard input buffers"
    ],
    correctIndex: 0,
    explanation: "std::variant is implemented as a tagged union with aligned storage and placement new/manual destructor invocation to hold types in-place.",
    topic: "Type-Safe Unions",
    difficulty: "Hard",
    subject: "C++"
  },
  {
    id: "cpp_h_11",
    question: "In C++ class layout, what is empty base optimization (EBO)?",
    options: [
      "Deleting classes with no methods",
      "Ensuring that an inherited empty class does not increase the size of the derived class beyond alignment requirements",
      "Inlining all base functions",
      "Optimizing memory allocation in std::vector"
    ],
    correctIndex: 1,
    explanation: "EBO permits an empty base class to occupy 0 bytes of storage within a derived class object, rather than the mandatory 1 byte for standalone objects.",
    topic: "Object Layout",
    difficulty: "Hard",
    subject: "C++"
  },
  {
    id: "cpp_h_12",
    question: "What does the C++ volatile keyword guarantee regarding multithreaded memory access?",
    options: [
      "Atomic operations and thread safety",
      "Sequential memory fencing across threads",
      "It only prevents compiler load/store caching optimizations; it does NOT provide thread synchronization or atomicity",
      "It locks the variable during writes"
    ],
    correctIndex: 2,
    explanation: "In C++, volatile informs the compiler that a variable can be changed by hardware/signals; it does NOT establish memory barriers or thread safety.",
    topic: "Concurrency",
    difficulty: "Hard",
    subject: "C++"
  },
  {
    id: "cpp_h_13",
    question: "What is an rvalue reference to a cv-unqualified template parameter T&& in a function template (e.g. template<class T> void f(T&& arg)) called?",
    options: ["Constant reference", "Forwarding reference (universal reference)", "Dead reference", "Null reference"],
    correctIndex: 1,
    explanation: "T&& in a type-deducing context is a forwarding reference (or universal reference), which collapses to lvalue reference if passed an lvalue, and rvalue reference otherwise.",
    topic: "Reference Collapsing",
    difficulty: "Hard",
    subject: "C++"
  },
  {
    id: "cpp_h_14",
    question: "What is the consequence of violating the One Definition Rule (ODR) in C++ across translation units?",
    options: [
      "The program raises a SIGFPE",
      "Undefined behavior at runtime, often producing silent memory corruption or conflicting binary calls",
      "Automatic fallback to interpretation",
      "Strict compile error always guaranteed"
    ],
    correctIndex: 1,
    explanation: "Violating ODR across translation units does not require a diagnostic from compilers/linkers and results in dangerous undefined behavior.",
    topic: "Compilation & Linkage",
    difficulty: "Hard",
    subject: "C++"
  },
  {
    id: "cpp_h_15",
    question: "What does the C++20 'concepts' feature provide over traditional SFINAE?",
    options: [
      "Garbage collection for classes",
      "First-class language syntax for specifying named compile-time constraints on template arguments, with readable compiler errors",
      "Runtime reflection",
      "Automatic multithreading for loops"
    ],
    correctIndex: 1,
    explanation: "Concepts formalize template requirements in clean syntax, improving compile times and replacing cryptic template error logs with clear failure messages.",
    topic: "C++20 Concepts",
    difficulty: "Hard",
    subject: "C++"
  }
];

// -------------------------------------------------------------
// DATA STRUCTURES QUESTION BANK
// -------------------------------------------------------------
export const DS_EASY: CuratedQuestion[] = [
  {
    id: "ds_e_1",
    question: "What principle governs the operation of a Stack data structure?",
    options: ["FIFO (First In First Out)", "LIFO (Last In First Out)", "Random Access", "Priority Based"],
    correctIndex: 1,
    explanation: "A Stack operates on the Last-In, First-Out (LIFO) principle: the element inserted last is the first to be removed.",
    topic: "Stack",
    difficulty: "Easy",
    subject: "Data Structures"
  },
  {
    id: "ds_e_2",
    question: "What principle governs the operation of a standard Queue data structure?",
    options: ["LIFO (Last In First Out)", "FIFO (First In First Out)", "FILO (First In Last Out)", "Random Order"],
    correctIndex: 1,
    explanation: "A standard queue operates on the First-In, First-Out (FIFO) principle.",
    topic: "Queue",
    difficulty: "Easy",
    subject: "Data Structures"
  },
  {
    id: "ds_e_3",
    question: "What is the time complexity to access an element by its index in a contiguous array?",
    options: ["O(1)", "O(N)", "O(log N)", "O(N^2)"],
    correctIndex: 0,
    explanation: "Arrays offer O(1) constant-time direct access using base address + index * element_size offset calculation.",
    topic: "Arrays",
    difficulty: "Easy",
    subject: "Data Structures"
  },
  {
    id: "ds_e_4",
    question: "What does each node in a singly linked list contain?",
    options: [
      "Only the data value",
      "The data value and a reference/pointer to the next node",
      "Pointers to parent and left child",
      "An array of child nodes"
    ],
    correctIndex: 1,
    explanation: "Each node in a singly linked list stores its payload data and a pointer/reference to the subsequent node.",
    topic: "Linked List",
    difficulty: "Easy",
    subject: "Data Structures"
  },
  {
    id: "ds_e_5",
    question: "What is the top pointer in a stack pointing to?",
    options: [
      "The oldest element added",
      "The most recently pushed element",
      "The middle element",
      "The bottom of the memory segment"
    ],
    correctIndex: 1,
    explanation: "The top pointer tracks the most recently added item in the stack.",
    topic: "Stack",
    difficulty: "Easy",
    subject: "Data Structures"
  },
  {
    id: "ds_e_6",
    question: "What condition occurs when an attempt is made to pop an element from an empty stack?",
    options: ["Stack Overflow", "Stack Underflow", "Memory Fault", "Null Pointer Exception"],
    correctIndex: 1,
    explanation: "Popping from an empty stack causes Stack Underflow.",
    topic: "Stack",
    difficulty: "Easy",
    subject: "Data Structures"
  },
  {
    id: "ds_e_7",
    question: "What is the maximum number of children a node can have in a binary tree?",
    options: ["1", "2", "3", "Unlimited"],
    correctIndex: 1,
    explanation: "In a binary tree, every node has at most two children, typically referred to as the left child and right child.",
    topic: "Trees",
    difficulty: "Easy",
    subject: "Data Structures"
  },
  {
    id: "ds_e_8",
    question: "What is the first node in a tree hierarchy called?",
    options: ["Leaf", "Root", "Stem", "Branch"],
    correctIndex: 1,
    explanation: "The uppermost node with no parent in a tree data structure is called the root.",
    topic: "Trees",
    difficulty: "Easy",
    subject: "Data Structures"
  },
  {
    id: "ds_e_9",
    question: "What are nodes with no children in a tree called?",
    options: ["Root nodes", "Internal nodes", "Leaf nodes", "Ancestor nodes"],
    correctIndex: 2,
    explanation: "Nodes with degree 0 (no children) are called leaves or terminal nodes.",
    topic: "Trees",
    difficulty: "Easy",
    subject: "Data Structures"
  },
  {
    id: "ds_e_10",
    question: "Which data structure is naturally used to implement recursion behind the scenes?",
    options: ["Queue", "Stack (Call Stack)", "Hash Table", "Binary Search Tree"],
    correctIndex: 1,
    explanation: "Program runtimes use an internal call stack to preserve function activation records during recursive calls.",
    topic: "Stack",
    difficulty: "Easy",
    subject: "Data Structures"
  },
  {
    id: "ds_e_11",
    question: "In a doubly linked list, what two pointers does each node maintain?",
    options: [
      "Left child and Right child",
      "Next node and Previous node",
      "Head pointer and Tail pointer",
      "Parent and Child"
    ],
    correctIndex: 1,
    explanation: "A doubly linked list node maintains a 'next' pointer and a 'prev' pointer, permitting bidirectional traversal.",
    topic: "Linked List",
    difficulty: "Easy",
    subject: "Data Structures"
  },
  {
    id: "ds_e_12",
    question: "What is the operation of adding an element to a stack called?",
    options: ["Enqueue", "Insert", "Push", "Append"],
    correctIndex: 2,
    explanation: "The operation to insert an item onto the top of a stack is called 'push'.",
    topic: "Stack",
    difficulty: "Easy",
    subject: "Data Structures"
  },
  {
    id: "ds_e_13",
    question: "What is the operation of removing an element from a queue called?",
    options: ["Dequeue", "Pop", "Delete", "Shift"],
    correctIndex: 0,
    explanation: "'Dequeue' removes the element at the front of the queue.",
    topic: "Queue",
    difficulty: "Easy",
    subject: "Data Structures"
  },
  {
    id: "ds_e_14",
    question: "What is a linear collection of data elements whose order is not given by their physical placement in memory called?",
    options: ["Array", "Linked List", "Matrix", "Tuple"],
    correctIndex: 1,
    explanation: "In a linked list, elements are connected via pointers rather than being placed in contiguous physical memory.",
    topic: "Linked List",
    difficulty: "Easy",
    subject: "Data Structures"
  },
  {
    id: "ds_e_15",
    question: "Which data structure maps keys directly to values for fast lookup?",
    options: ["Hash Table / Dictionary", "Linked List", "Queue", "Stack"],
    correctIndex: 0,
    explanation: "A Hash Table maps keys to values using a hash function, providing O(1) average lookup time.",
    topic: "Hashing",
    difficulty: "Easy",
    subject: "Data Structures"
  }
];

export const DS_MEDIUM: CuratedQuestion[] = [
  {
    id: "ds_m_1",
    question: "What property must a Binary Search Tree (BST) satisfy for every node N?",
    options: [
      "Left subtree values <= N < Right subtree values",
      "All leaves must be at the same depth",
      "Every node must have exactly two children",
      "Parent value must be smaller than both children"
    ],
    correctIndex: 0,
    explanation: "In a BST, all keys in the left subtree must be less than the node's key, and all keys in the right subtree must be greater.",
    topic: "BST",
    difficulty: "Medium",
    subject: "Data Structures"
  },
  {
    id: "ds_m_2",
    question: "Which tree traversal of a Binary Search Tree (BST) visits nodes in strictly ascending sorted order?",
    options: ["Pre-order traversal", "In-order traversal", "Post-order traversal", "Level-order traversal"],
    correctIndex: 1,
    explanation: "In-order traversal (Left -> Node -> Right) on a BST processes keys in non-decreasing sorted order.",
    topic: "Tree Traversals",
    difficulty: "Medium",
    subject: "Data Structures"
  },
  {
    id: "ds_m_3",
    question: "How does a circular queue overcome the memory limitation of a standard linear array-based queue?",
    options: [
      "By doubling the array size on every insertion",
      "By wrapping around rear and front pointers using modulo arithmetic ((index + 1) % size)",
      "By moving all elements forward on every dequeue",
      "By storing elements in a linked list"
    ],
    correctIndex: 1,
    explanation: "A circular queue uses modulo indexing to reuse empty slots at the beginning created by previous dequeues.",
    topic: "Circular Queue",
    difficulty: "Medium",
    subject: "Data Structures"
  },
  {
    id: "ds_m_4",
    question: "What is the worst-case time complexity of searching for an element in an unbalanced Binary Search Tree of N nodes?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    correctIndex: 2,
    explanation: "When a BST degenerates into a linear skewed linked list (e.g. inserting sorted keys), search degrades to O(N).",
    topic: "BST Complexity",
    difficulty: "Medium",
    subject: "Data Structures"
  },
  {
    id: "ds_m_5",
    question: "What technique resolves hash table collisions by storing colliding elements in a linked list at the bucket index?",
    options: ["Linear Probing", "Quadratic Probing", "Separate Chaining", "Double Hashing"],
    correctIndex: 2,
    explanation: "Separate chaining handles collisions by maintaining a linked list (or dynamic bucket) of all records hashing to that same slot.",
    topic: "Hashing",
    difficulty: "Medium",
    subject: "Data Structures"
  },
  {
    id: "ds_m_6",
    question: "What is the primary operational property of a Min-Heap binary tree?",
    options: [
      "The root contains the maximum element",
      "The value of every node is less than or equal to the values of its children",
      "Left children must be smaller than right children",
      "The tree cannot have more than 7 nodes"
    ],
    correctIndex: 1,
    explanation: "In a min-heap, the key at any node is less than or equal to the keys of its children, guaranteeing the smallest element is at the root.",
    topic: "Heaps",
    difficulty: "Medium",
    subject: "Data Structures"
  },
  {
    id: "ds_m_7",
    question: "What classic algorithm detects a cycle in a singly linked list using two pointers moving at different speeds?",
    options: [
      "Dijkstra's Algorithm",
      "Floyd's Cycle-Finding Algorithm (Tortoise and Hare)",
      "Kadane's Algorithm",
      "Kruskal's Algorithm"
    ],
    correctIndex: 1,
    explanation: "Floyd's algorithm uses a slow pointer (1 step) and a fast pointer (2 steps). If a cycle exists, they must eventually meet.",
    topic: "Linked List Algorithms",
    difficulty: "Medium",
    subject: "Data Structures"
  },
  {
    id: "ds_m_8",
    question: "Which data structure is optimal for evaluating postfix (Reverse Polish Notation) expressions?",
    options: ["Queue", "Stack", "Binary Tree", "Heap"],
    correctIndex: 1,
    explanation: "Postfix evaluation pushes operands onto a stack; when an operator is encountered, operands are popped, computed, and the result is pushed back.",
    topic: "Stack Applications",
    difficulty: "Medium",
    subject: "Data Structures"
  },
  {
    id: "ds_m_9",
    question: "What is the time complexity to extract the minimum/maximum element from a binary heap of size N?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    correctIndex: 1,
    explanation: "Extracting the root takes O(log N) because heapify-down must restore the heap property down the height of the tree.",
    topic: "Heaps",
    difficulty: "Medium",
    subject: "Data Structures"
  },
  {
    id: "ds_m_10",
    question: "What is the balance factor of a node in an AVL tree defined as?",
    options: [
      "Height(Left Subtree) - Height(Right Subtree)",
      "Number of left nodes * Number of right nodes",
      "Depth(Node) - Height(Node)",
      "Key value / Height"
    ],
    correctIndex: 0,
    explanation: "In an AVL tree, the balance factor is defined as height(left) - height(right) and must always be -1, 0, or +1 for every node.",
    topic: "AVL Trees",
    difficulty: "Medium",
    subject: "Data Structures"
  },
  {
    id: "ds_m_11",
    question: "What traversal method traverses a graph level by level, starting from a source vertex?",
    options: ["Depth First Search (DFS)", "Breadth First Search (BFS)", "Topological Sort", "Preorder Traversal"],
    correctIndex: 1,
    explanation: "BFS explores all immediate neighbors at current depth before moving to vertices at the next depth level, using a Queue.",
    topic: "Graph Traversal",
    difficulty: "Medium",
    subject: "Data Structures"
  },
  {
    id: "ds_m_12",
    question: "What data structure is standardly used to implement Breadth First Search (BFS) on graphs?",
    options: ["Stack", "Queue", "Priority Queue", "Disjoint Set"],
    correctIndex: 1,
    explanation: "BFS requires a FIFO Queue to process vertices in order of discovery.",
    topic: "Graph Traversal",
    difficulty: "Medium",
    subject: "Data Structures"
  },
  {
    id: "ds_m_13",
    question: "What data structure is standardly used to implement iterative Depth First Search (DFS)?",
    options: ["Stack", "Queue", "Heap", "Hash Table"],
    correctIndex: 0,
    explanation: "DFS follows a LIFO path exploration, utilizing a Stack (either the call stack recursively or an explicit stack iteratively).",
    topic: "Graph Traversal",
    difficulty: "Medium",
    subject: "Data Structures"
  },
  {
    id: "ds_m_14",
    question: "In open addressing with Linear Probing, what issue occurs when occupied slots group together in long consecutive runs?",
    options: ["Thrashing", "Primary Clustering", "Secondary Clustering", "Fragmentation"],
    correctIndex: 1,
    explanation: "Primary clustering occurs in linear probing when occupied slots form contiguous blocks, degrading insertion and lookup times.",
    topic: "Hashing",
    difficulty: "Medium",
    subject: "Data Structures"
  },
  {
    id: "ds_m_15",
    question: "What is the time complexity of building a binary heap from an unsorted array of N elements using the bottom-up buildHeap algorithm?",
    options: ["O(N log N)", "O(N)", "O(N^2)", "O(log N)"],
    correctIndex: 1,
    explanation: "Bottom-up heap construction (sifting down from N/2 down to 1) runs in O(N) linear time due to the converging mathematical series.",
    topic: "Heaps",
    difficulty: "Medium",
    subject: "Data Structures"
  }
];

export const DS_HARD: CuratedQuestion[] = [
  {
    id: "ds_h_1",
    question: "In an AVL tree, what rotation sequence is required to restore balance when an insertion occurs in the right subtree of the left child (Left-Right Case)?",
    options: [
      "Single Left Rotation",
      "Single Right Rotation",
      "Left Rotation on left child, followed by Right Rotation on the unbalanced node",
      "Right Rotation on root, followed by Left Rotation on child"
    ],
    correctIndex: 2,
    explanation: "The LR imbalance is resolved by a double rotation: first a Left rotation on the left child, then a Right rotation on the unbalanced root.",
    topic: "AVL Tree Rotations",
    difficulty: "Hard",
    subject: "Data Structures"
  },
  {
    id: "ds_h_2",
    question: "What is the fundamental invariant governing Red-Black trees regarding black nodes?",
    options: [
      "Every path from a node to any of its descendant NIL leaves must contain the exact same number of black nodes (Black-Height invariant)",
      "Red nodes can have red children",
      "The root must always be red",
      "Leaves can be red"
    ],
    correctIndex: 0,
    explanation: "The black-height rule ensures that no simple path from root to leaf is more than twice as long as any other path, ensuring O(log N) height.",
    topic: "Red-Black Trees",
    difficulty: "Hard",
    subject: "Data Structures"
  },
  {
    id: "ds_h_3",
    question: "What is the amortized time complexity per operation of the Disjoint Set Union (DSU) data structure when using both Path Compression and Union by Rank?",
    options: ["O(1)", "O(α(N)) where α is the inverse Ackermann function", "O(log N)", "O(N)"],
    correctIndex: 1,
    explanation: "Path compression combined with union by rank yields an amortized time complexity of O(α(N)), effectively constant (<= 4) for all practical N.",
    topic: "Disjoint Set Union",
    difficulty: "Hard",
    subject: "Data Structures"
  },
  {
    id: "ds_h_4",
    question: "What specialized tree data structure maintains prefix hierarchies for fast string lookups, prefix searches, and autocompletion?",
    options: ["Segment Tree", "Trie (Prefix Tree)", "Fenwick Tree", "B-Tree"],
    correctIndex: 1,
    explanation: "A Trie represents characters of strings along edges or nodes, allowing string searches and prefix checks in O(L) time where L is string length.",
    topic: "Trie",
    difficulty: "Hard",
    subject: "Data Structures"
  },
  {
    id: "ds_h_5",
    question: "What data structure answers range sum queries in O(log N) time while also updating single elements in O(log N) time with minimal O(N) memory overhead?",
    options: ["Fenwick Tree (Binary Indexed Tree)", "Splay Tree", "Cartesian Tree", "Treap"],
    correctIndex: 0,
    explanation: "A Binary Indexed Tree (Fenwick Tree) uses bit manipulation of lowest set bits (i & -i) to handle range sums and point updates in O(log N).",
    topic: "Advanced Range Queries",
    difficulty: "Hard",
    subject: "Data Structures"
  },
  {
    id: "ds_h_6",
    question: "What operation does a Splay Tree perform on every access, insertion, or deletion?",
    options: [
      "Splits the tree into two equal halves",
      "Splays (rotates) the accessed node to the root of the tree using zig, zig-zig, or zig-zag rotations",
      "Destroys all leaf nodes",
      "Converts the tree into an array"
    ],
    correctIndex: 1,
    explanation: "Splay trees rotate the accessed node to the root, guaranteeing O(log N) amortized time and exploiting temporal locality of access.",
    topic: "Splay Trees",
    difficulty: "Hard",
    subject: "Data Structures"
  },
  {
    id: "ds_h_7",
    question: "Why are B-Trees and B+ Trees preferred over binary search trees for disk-based storage and relational databases?",
    options: [
      "They use less RAM than binary search trees",
      "Their high branching factor (fan-out) minimizes disk I/O operations by keeping tree height extremely shallow",
      "They are not sorted, making inserts instant",
      "They do not require pointers"
    ],
    correctIndex: 1,
    explanation: "B-Trees have huge fan-outs (hundreds of keys per node fitting in disk blocks), reducing the number of costly disk seek operations to 3-4 accesses.",
    topic: "B-Trees & Database Storage",
    difficulty: "Hard",
    subject: "Data Structures"
  },
  {
    id: "ds_h_8",
    question: "In a B+ Tree, where are the actual record pointers / data records stored?",
    options: [
      "Evenly across all internal nodes",
      "Exclusively in the leaf nodes, which are linked as a contiguous doubly linked list for fast range scanning",
      "Only in the root node",
      "In a separate hash map"
    ],
    correctIndex: 1,
    explanation: "In B+ Trees, internal nodes only store routing keys. All actual data resides in leaves, which form a linked sequence for sequential range scans.",
    topic: "B+ Trees",
    difficulty: "Hard",
    subject: "Data Structures"
  },
  {
    id: "ds_h_9",
    question: "What is the time complexity of finding the shortest path from a single source to all vertices using Dijkstra's algorithm with a Fibonacci Heap?",
    options: ["O(V^2)", "O(E + V log V)", "O(V E)", "O((E + V) log V)"],
    correctIndex: 1,
    explanation: "Fibonacci heaps support O(1) amortized decrease-key operations, reducing Dijkstra's runtime to O(E + V log V).",
    topic: "Shortest Path & Heaps",
    difficulty: "Hard",
    subject: "Data Structures"
  },
  {
    id: "ds_h_10",
    question: "What probabilistic data structure tests whether an element is a member of a set with possible false positives but NO false negatives?",
    options: ["Skip List", "Bloom Filter", "Treap", "Count-Min Sketch"],
    correctIndex: 1,
    explanation: "A Bloom filter uses a bit array and k hash functions. It can report false positives, but if it returns False, the element is guaranteed absent.",
    topic: "Probabilistic Data Structures",
    difficulty: "Hard",
    subject: "Data Structures"
  },
  {
    id: "ds_h_11",
    question: "What property combines a Binary Search Tree and a Heap in a Treap?",
    options: [
      "Keys follow BST ordering, while node priorities follow Heap ordering",
      "All nodes are colored red or black",
      "Every node has 4 children",
      "Priorities must match key lengths"
    ],
    correctIndex: 0,
    explanation: "A Treap maintains BST ordering on keys and Heap ordering on randomly assigned priorities, yielding O(log N) expected tree depth.",
    topic: "Treaps",
    difficulty: "Hard",
    subject: "Data Structures"
  },
  {
    id: "ds_h_12",
    question: "What is the primary advantage of a Fibonacci Heap over a Binary Heap?",
    options: [
      "O(1) worst case delete-min",
      "O(1) amortized insertion and O(1) amortized decrease-key operations",
      "Smaller memory footprint than an array",
      "No pointer overhead"
    ],
    correctIndex: 1,
    explanation: "Fibonacci heaps allow O(1) amortized decrease-key and insertion, deferring heap consolidation work to extract-min.",
    topic: "Fibonacci Heaps",
    difficulty: "Hard",
    subject: "Data Structures"
  },
  {
    id: "ds_h_13",
    question: "What algorithm finds all Strongly Connected Components (SCCs) in a directed graph in linear O(V + E) time using a single DFS traversal?",
    options: ["Tarjan's SCC Algorithm", "Bellman-Ford Algorithm", "Floyd-Warshall Algorithm", "Prim's Algorithm"],
    correctIndex: 0,
    explanation: "Tarjan's algorithm uses DFS discovery timestamps and low-link values on an explicit stack to identify SCCs in a single pass.",
    topic: "Graph Algorithms",
    difficulty: "Hard",
    subject: "Data Structures"
  },
  {
    id: "ds_h_14",
    question: "What data structure answers range minimum queries (RMQ) in static arrays in O(1) time after O(N log N) preprocessing?",
    options: ["Sparse Table", "Linked List", "Queue", "Fenwick Tree"],
    correctIndex: 0,
    explanation: "A Sparse Table precalculates answers for power-of-two length intervals (2^k), enabling idempotent O(1) range minimum queries.",
    topic: "Range Queries",
    difficulty: "Hard",
    subject: "Data Structures"
  },
  {
    id: "ds_h_15",
    question: "What technique in Segment Trees defers updates to descendants until the nodes are explicitly queried, achieving O(log N) range updates?",
    options: ["Branch and Bound", "Lazy Propagation", "Path Halving", "Alpha-Beta Pruning"],
    correctIndex: 1,
    explanation: "Lazy propagation stores pending updates in a lazy array and pushes them down to child nodes only when accessed.",
    topic: "Segment Trees",
    difficulty: "Hard",
    subject: "Data Structures"
  }
];

import { getBranchSpecificQuestions } from "./branch-question-banks.js";
import { areQuestionsDuplicate } from "./aptitude-question-bank";
import {
  generateProceduralPythonQuestions,
  generateProceduralBranchQuestions
} from "./procedural-question-generators";

function shuffleCuratedOptions<T extends { options: [string, string, string, string] | string[]; correctIndex: number }>(q: T): T {
  if (!q || !Array.isArray(q.options) || q.options.length !== 4) return q;
  const originalOptions = [...q.options];
  const origIndex = typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex <= 3 ? q.correctIndex : 0;
  const correctText = originalOptions[origIndex];

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

  const newCorrectIndex = newOptions.indexOf(correctText);
  return {
    ...q,
    options: newOptions as [string, string, string, string],
    correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : origIndex
  };
}

// -------------------------------------------------------------
// GENERAL / JAVA / C FALLBACK GETTER
// -------------------------------------------------------------
export function getCuratedFallbackQuestions(
  subject: string,
  difficulty: "Easy" | "Medium" | "Hard",
  count: number = 10,
  excludeNormalizedSet: Set<string> = new Set(),
  branch: string = "",
  previousTexts: string[] = []
): CuratedQuestion[] {
  const normSubject = subject.toLowerCase().trim();
  const normBranch = (branch || "").toLowerCase().trim();
  let candidatePool: CuratedQuestion[] = [];

  const branchPool = getBranchSpecificQuestions(subject, branch);
  if (branchPool && branchPool.length > 0) {
    candidatePool = branchPool;
  } else if (normSubject.includes("python")) {
    candidatePool = difficulty === "Easy" ? PYTHON_EASY : difficulty === "Hard" ? PYTHON_HARD : PYTHON_MEDIUM;
  } else if (normSubject.includes("c++") || normSubject.includes("cpp")) {
    candidatePool = difficulty === "Easy" ? CPP_EASY : difficulty === "Hard" ? CPP_HARD : CPP_MEDIUM;
  } else if (normSubject.includes("data structure") || normSubject.includes("structure") || normSubject.includes("dsa") || normSubject.includes("algorithm")) {
    candidatePool = difficulty === "Easy" ? DS_EASY : difficulty === "Hard" ? DS_HARD : DS_MEDIUM;
  } else {
    // For other subjects, tailor questions using difficulty principles
    if (difficulty === "Easy") {
      candidatePool = [
        {
          id: `${normSubject}_e_1`,
          question: `What is the fundamental purpose of ${subject}?`,
          options: [
            `To provide structured engineering solutions and standards in ${subject}`,
            "To replace operating system kernels",
            "To eliminate the need for computer hardware",
            "To simulate analogue audio signals"
          ],
          correctIndex: 0,
          explanation: `${subject} provides standard specifications, abstractions, and tools for engineering implementations.`,
          topic: "Fundamentals",
          difficulty: "Easy",
          subject
        },
        {
          id: `${normSubject}_e_2`,
          question: `Which of the following is a basic, core concept in ${subject}?`,
          options: [
            "Modular architecture and structured syntax",
            "Quantum entanglement registers",
            "Analog magnetic hysteresis",
            "Electrolytic capacitive discharge"
          ],
          correctIndex: 0,
          explanation: `Modularity and clear syntax structure form the baseline principles of ${subject}.`,
          topic: "Core Concepts",
          difficulty: "Easy",
          subject
        },
        {
          id: `${normSubject}_e_3`,
          question: `What is standard best practice when beginning development in ${subject}?`,
          options: [
            "Write unformatted code without comments",
            "Follow structured conventions, clear naming, and verify basic syntax",
            "Disable all compiler warnings and error checks",
            "Commit credentials to public repositories"
          ],
          correctIndex: 1,
          explanation: `Adhering to standard style guides, clear naming, and compiler diagnostics is essential in ${subject}.`,
          topic: "Best Practices",
          difficulty: "Easy",
          subject
        },
        {
          id: `${normSubject}_e_4`,
          question: `Which fundamental principle is prioritized in introductory ${subject}?`,
          options: ["Readability, clarity, and correct logic", "Micro-optimizing instruction cycles", "Obfuscating variable names", "Hardcoding file paths"],
          correctIndex: 0,
          explanation: "Beginner engineering focuses on logical correctness, standard readability, and predictable behavior.",
          topic: "Foundations",
          difficulty: "Easy",
          subject
        },
        {
          id: `${normSubject}_e_5`,
          question: `In ${subject}, how are standard errors or exceptions typically categorized?`,
          options: ["Syntax errors, runtime errors, and logical errors", "Thermal errors and mechanical errors", "Optical errors and sonic errors", "Magnetic errors"],
          correctIndex: 0,
          explanation: "Standard software classification divides bugs into syntax (compilation/parsing), runtime (exceptions), and logic errors.",
          topic: "Error Handling",
          difficulty: "Easy",
          subject
        }
      ];
    } else if (difficulty === "Medium") {
      candidatePool = [
        {
          id: `${normSubject}_m_1`,
          question: `How does memory management or state lifecycle typically operate in ${subject}?`,
          options: [
            "By managing resource lifetimes through scoped allocations or managed garbage collection",
            "By rewriting the CPU BIOS on each cycle",
            "By bypassing the system RAM completely",
            "By allocating static disk blocks permanently"
          ],
          correctIndex: 0,
          explanation: `Intermediate mastery of ${subject} requires understanding memory lifecycles, allocation scopes, and cleanup routines.`,
          topic: "Resource Lifecycle",
          difficulty: "Medium",
          subject
        },
        {
          id: `${normSubject}_m_2`,
          question: `What is the recommended design pattern for modular separation of concerns in ${subject}?`,
          options: [
            "Coupling all logic into a single monolithic script",
            "Decoupling interface definitions from underlying business logic implementations",
            "Using global mutable variables across all modules",
            "Eliminating function parameters"
          ],
          correctIndex: 1,
          explanation: "Decoupling interfaces from implementations promotes testability and maintainability.",
          topic: "Architecture",
          difficulty: "Medium",
          subject
        },
        {
          id: `${normSubject}_m_3`,
          question: `When optimizing execution performance in ${subject}, what should be analyzed first?`,
          options: [
            "Time and space asymptotic complexity (Big-O analysis)",
            "Font size of the IDE",
            "Operating system background wallpaper",
            "Length of variable identifiers"
          ],
          correctIndex: 0,
          explanation: "Algorithmic complexity analysis reveals performance bottlenecks before low-level micro-optimizations.",
          topic: "Optimization",
          difficulty: "Medium",
          subject
        }
      ];
    } else {
      candidatePool = [
        {
          id: `${normSubject}_h_1`,
          question: `What is an advanced concurrency pitfall that must be prevented in ${subject}?`,
          options: [
            "Race conditions and deadlocks caused by uncoordinated shared mutable state",
            "Using too many comments in code",
            "Formatting code with 4 spaces instead of tabs",
            "Exporting functions as public"
          ],
          correctIndex: 0,
          explanation: "Concurrent systems require synchronization primitives, memory barriers, or immutability to avert race conditions and deadlocks.",
          topic: "Concurrency Internals",
          difficulty: "Hard",
          subject
        },
        {
          id: `${normSubject}_h_2`,
          question: `In high-throughput systems using ${subject}, how is tail latency typically minimized?`,
          options: [
            "By avoiding stop-the-world pauses, lock contention, and excessive heap allocations",
            "By increasing disk logging to maximum verbosity",
            "By running on single-core microcontrollers",
            "By disabling TCP keepalive"
          ],
          correctIndex: 0,
          explanation: "High-performance systems focus on lock-free data structures, allocation pooling, and tuning pause times.",
          topic: "Performance & Low-Latency",
          difficulty: "Hard",
          subject
        }
      ];
    }
  }

  // Shuffle the candidate pool so different questions appear each session
  const shuffledPool = [...candidatePool];
  for (let i = shuffledPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledPool[i], shuffledPool[j]] = [shuffledPool[j], shuffledPool[i]];
  }

  // Filter out questions present in excludeNormalizedSet, previousTexts, or duplicate with filtered
  const localExclude = new Set(excludeNormalizedSet);
  const filtered: CuratedQuestion[] = [];
  for (const q of shuffledPool) {
    if (filtered.length >= count) break;
    // Strictly enforce difficulty separation: Easy -> Easy, Medium -> Medium, Hard -> Hard
    if (q.difficulty && q.difficulty.toLowerCase().trim() !== difficulty.toLowerCase().trim()) continue;

    const norm = q.question.trim().toLowerCase().replace(/\s+/g, " ");
    if (localExclude.has(norm)) continue;
    if (previousTexts.some((prev) => areQuestionsDuplicate(prev, q.question))) continue;
    if (filtered.some((f) => areQuestionsDuplicate(f.question, q.question))) continue;

    filtered.push(shuffleCuratedOptions({
      ...q,
      subject,
      difficulty
    }));
    localExclude.add(norm);
  }

  // If still need more questions, invoke procedural generator to provide 100% unique, non-repeating questions
  // Works equally for ALL 9 branches and every subject without CSE-only special casing
  if (filtered.length < count) {
    const needed = count - filtered.length;
    if (normSubject.includes("python") && (!branch || normBranch.includes("comp") || normBranch.includes("cse"))) {
      const proceduralPy = generateProceduralPythonQuestions(difficulty, needed, localExclude, previousTexts);
      for (const pq of proceduralPy) {
        if (filtered.length >= count) break;
        filtered.push(shuffleCuratedOptions({
          id: pq.id,
          question: pq.question,
          options: pq.options as [string, string, string, string],
          correctIndex: pq.correctIndex,
          explanation: pq.explanation,
          topic: pq.topic || "General",
          difficulty: pq.difficulty as "Easy" | "Medium" | "Hard",
          subject
        }));
      }
    }

    if (filtered.length < count) {
      const branchNeeded = count - filtered.length;
      const proceduralBranch = generateProceduralBranchQuestions(
        branch,
        subject,
        difficulty,
        branchNeeded,
        localExclude,
        previousTexts
      );
      for (const bq of proceduralBranch) {
        if (filtered.length >= count) break;
        filtered.push(shuffleCuratedOptions({
          id: bq.id,
          question: bq.question,
          options: bq.options as [string, string, string, string],
          correctIndex: bq.correctIndex,
          explanation: bq.explanation,
          topic: bq.topic || subject,
          difficulty: bq.difficulty as "Easy" | "Medium" | "Hard",
          subject
        }));
      }
    }
  }

  return filtered.slice(0, count);
}
