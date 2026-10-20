import { CuratedQuestion } from "./quiz-question-banks.js";

/**
 * Curated question banks for:
 * 1. Chemical Engineering
 * 2. Artificial Intelligence & Machine Learning (AI/ML)
 * 3. Data Science
 */

export const CHEMICAL_THERMODYNAMICS: CuratedQuestion[] = [
  {
    id: "chem_thermo_1",
    question: "According to the Second Law of Thermodynamics, what happens to the total entropy of an isolated system undergoing an irreversible process?",
    options: [
      "It always increases",
      "It always decreases",
      "It remains exactly zero",
      "It fluctuates cyclically"
    ],
    correctIndex: 0,
    explanation: "For any spontaneous or irreversible process in an isolated system, the total entropy must strictly increase (dS > 0).",
    topic: "Second Law & Entropy",
    difficulty: "Medium",
    subject: "Chemical Thermodynamics"
  },
  {
    id: "chem_thermo_2",
    question: "What thermodynamic state function is minimized at equilibrium for a system at constant temperature and pressure?",
    options: [
      "Gibbs Free Energy (G)",
      "Helmholtz Free Energy (A)",
      "Internal Energy (U)",
      "Enthalpy (H)"
    ],
    correctIndex: 0,
    explanation: "At constant temperature and pressure, thermodynamic equilibrium is reached when the Gibbs Free Energy is minimized (dG = 0).",
    topic: "Gibbs Free Energy",
    difficulty: "Easy",
    subject: "Chemical Thermodynamics"
  },
  {
    id: "chem_thermo_3",
    question: "Which law describes the vapor-liquid equilibrium of ideal mixtures by stating that partial vapor pressure equals the mole fraction times the pure component vapor pressure?",
    options: [
      "Raoult's Law",
      "Henry's Law",
      "Dalton's Law",
      "Amagat's Law"
    ],
    correctIndex: 0,
    explanation: "Raoult's law states that P_i = x_i * P_i_sat for an ideal liquid solution in equilibrium with an ideal vapor.",
    topic: "Phase Equilibrium",
    difficulty: "Easy",
    subject: "Chemical Thermodynamics"
  },
  {
    id: "chem_thermo_4",
    question: "What does the fugacity coefficient (phi) represent in real fluid thermodynamics?",
    options: [
      "The ratio of fugacity to the system pressure (f/P)",
      "The ratio of critical pressure to boiling temperature",
      "The rate of enthalpy generation during expansion",
      "The compressibility factor minus unity"
    ],
    correctIndex: 0,
    explanation: "The fugacity coefficient phi_i = f_i / P quantifies non-ideality and approaches 1 as pressure approaches zero.",
    topic: "Fugacity & Real Fluids",
    difficulty: "Hard",
    subject: "Chemical Thermodynamics"
  },
  {
    id: "chem_thermo_5",
    question: "According to the Gibbs Phase Rule, how many degrees of freedom (F) exist for a single-component system with liquid and vapor in equilibrium?",
    options: [
      "1",
      "2",
      "0",
      "3"
    ],
    correctIndex: 0,
    explanation: "F = C - P + 2. Here C = 1 and P = 2 (liquid and vapor), so F = 1 - 2 + 2 = 1 (univariant system).",
    topic: "Phase Rule",
    difficulty: "Medium",
    subject: "Chemical Thermodynamics"
  }
];

export const FLUID_MECHANICS_CHEM: CuratedQuestion[] = [
  {
    id: "chem_fluid_1",
    question: "What dimensionless quantity determines whether fluid flow inside a circular pipe is laminar or turbulent?",
    options: [
      "Reynolds Number (Re)",
      "Nusselt Number (Nu)",
      "Prandtl Number (Pr)",
      "Schmidt Number (Sc)"
    ],
    correctIndex: 0,
    explanation: "The Reynolds number (Re = rho * v * D / mu) represents the ratio of inertial forces to viscous forces.",
    topic: "Flow Regimes",
    difficulty: "Easy",
    subject: "Fluid Mechanics"
  },
  {
    id: "chem_fluid_2",
    question: "For incompressible, fully developed laminar flow in a horizontal pipe, which equation relates pressure drop to fluid viscosity and flow rate?",
    options: [
      "Hagen-Poiseuille Equation",
      "Ergun Equation",
      "Bernoulli Equation",
      "Navier-Stokes Unsteady Equation"
    ],
    correctIndex: 0,
    explanation: "The Hagen-Poiseuille equation states that Delta_P = (32 * mu * L * v) / D^2 for laminar pipe flow.",
    topic: "Laminar Pipe Flow",
    difficulty: "Medium",
    subject: "Fluid Mechanics"
  },
  {
    id: "chem_fluid_3",
    question: "Which equation is specifically used in chemical engineering to compute pressure drop through packed beds of solid particles?",
    options: [
      "Ergun Equation",
      "Darcy-Weisbach Equation",
      "Fanning Friction Factor Equation",
      "Chezy Equation"
    ],
    correctIndex: 0,
    explanation: "The Ergun equation combines viscous loss (Kozeny-Carman term) and inertial loss (Burke-Plummer term) across a packed bed.",
    topic: "Packed Beds",
    difficulty: "Hard",
    subject: "Fluid Mechanics"
  },
  {
    id: "chem_fluid_4",
    question: "A fluid whose apparent viscosity decreases as the applied shear rate increases (shear-thinning) is classified as:",
    options: [
      "Pseudoplastic fluid",
      "Dilatant fluid",
      "Bingham plastic",
      "Newtonian fluid"
    ],
    correctIndex: 0,
    explanation: "Pseudoplastic (shear-thinning) fluids like polymer melts and paint exhibit lower viscosity under high shear rates.",
    topic: "Non-Newtonian Fluids",
    difficulty: "Medium",
    subject: "Fluid Mechanics"
  },
  {
    id: "chem_fluid_5",
    question: "What is the physical interpretation of the continuity equation in fluid dynamics?",
    options: [
      "Conservation of Mass",
      "Conservation of Momentum",
      "Conservation of Energy",
      "Second Law of Thermodynamics"
    ],
    correctIndex: 0,
    explanation: "The continuity equation div(rho * v) + d(rho)/dt = 0 expresses the fundamental law of mass conservation.",
    topic: "Conservation Equations",
    difficulty: "Easy",
    subject: "Fluid Mechanics"
  }
];

export const HEAT_TRANSFER_CHEM: CuratedQuestion[] = [
  {
    id: "chem_heat_1",
    question: "Which fundamental law governs rate of conductive heat transfer through a solid medium?",
    options: [
      "Fourier's Law of Thermal Conduction",
      "Newton's Law of Cooling",
      "Stefan-Boltzmann Law",
      "Fick's First Law"
    ],
    correctIndex: 0,
    explanation: "Fourier's Law states that heat flux q = -k * dT/dx, where k is thermal conductivity.",
    topic: "Conduction",
    difficulty: "Easy",
    subject: "Heat Transfer"
  },
  {
    id: "chem_heat_2",
    question: "In shell-and-tube heat exchanger design, why is the Log Mean Temperature Difference (LMTD) used instead of an arithmetic average?",
    options: [
      "Because the temperature profile along the exchanger surface varies logarithmically",
      "Because fluid density remains strictly constant",
      "Because conduction dominates over convection",
      "To eliminate the need for baffle plates"
    ],
    correctIndex: 0,
    explanation: "The local temperature driving force varies exponentially with length, making the logarithmic mean (LMTD) the exact mathematical representation.",
    topic: "Heat Exchangers",
    difficulty: "Medium",
    subject: "Heat Transfer"
  },
  {
    id: "chem_heat_3",
    question: "The dimensionless Prandtl number (Pr) is defined as the ratio of which two physical transport properties?",
    options: [
      "Kinematic viscosity (momentum diffusivity) to thermal diffusivity",
      "Thermal conductivity to heat capacity",
      "Convective heat transfer coefficient to thermal conductivity",
      "Buoyancy force to viscous drag"
    ],
    correctIndex: 0,
    explanation: "Pr = nu / alpha = (C_p * mu) / k, representing the ratio of momentum diffusivity to thermal diffusivity.",
    topic: "Dimensionless Numbers",
    difficulty: "Medium",
    subject: "Heat Transfer"
  },
  {
    id: "chem_heat_4",
    question: "When is the lumped capacitance method mathematically valid for transient heat conduction analysis in a solid body?",
    options: [
      "When the Biot number is significantly less than 0.1 (Bi < 0.1)",
      "When the Biot number is greater than 100",
      "When thermal conductivity approaches zero",
      "When the Fourier number is exactly zero"
    ],
    correctIndex: 0,
    explanation: "A Biot number Bi = (h * L_c) / k < 0.1 signifies negligible internal conductive resistance, yielding a uniform internal temperature.",
    topic: "Transient Conduction",
    difficulty: "Hard",
    subject: "Heat Transfer"
  },
  {
    id: "chem_heat_5",
    question: "According to the Stefan-Boltzmann law, the total emissive power of a blackbody is proportional to which power of its absolute temperature?",
    options: [
      "Fourth power (T^4)",
      "Second power (T^2)",
      "First power (T)",
      "Third power (T^3)"
    ],
    correctIndex: 0,
    explanation: "E_b = sigma * T^4, where sigma is the Stefan-Boltzmann constant (5.67 x 10^-8 W/m^2*K^4).",
    topic: "Radiation",
    difficulty: "Easy",
    subject: "Heat Transfer"
  }
];

export const MASS_TRANSFER_CHEM: CuratedQuestion[] = [
  {
    id: "chem_mass_1",
    question: "Which law establishes that diffusive mass flux is directly proportional to the negative concentration gradient?",
    options: [
      "Fick's First Law of Diffusion",
      "Fourier's Law",
      "Henry's Law",
      "Graham's Law"
    ],
    correctIndex: 0,
    explanation: "Fick's First Law: J_A = -D_AB * (dC_A / dz), describing molecular mass diffusion under steady state.",
    topic: "Molecular Diffusion",
    difficulty: "Easy",
    subject: "Mass Transfer"
  },
  {
    id: "chem_mass_2",
    question: "In the McCabe-Thiele method for binary distillation, what does the slope of the feed (q-line) depend on?",
    options: [
      "The thermal condition and enthalpy of the incoming feed mixture",
      "The column diameter and condenser height",
      "The reboiler steam pressure",
      "The plate spacing between trays"
    ],
    correctIndex: 0,
    explanation: "The q-line slope is q / (q - 1), where q is the heat required to vaporize 1 mole of feed divided by the latent heat.",
    topic: "Distillation Columns",
    difficulty: "Medium",
    subject: "Mass Transfer"
  },
  {
    id: "chem_mass_3",
    question: "What happens to the number of theoretical stages in a distillation column when operating at total reflux (R = infinity)?",
    options: [
      "The required number of stages reaches its minimum theoretical value (N_min)",
      "The required number of stages approaches infinity",
      "The distillate product rate reaches maximum",
      "The reboiler duty decreases to zero"
    ],
    correctIndex: 0,
    explanation: "At total reflux, no product is withdrawn (D = 0), resulting in the absolute minimum number of trays calculated by Fenske's equation.",
    topic: "Total Reflux & Fenske",
    difficulty: "Medium",
    subject: "Mass Transfer"
  },
  {
    id: "chem_mass_4",
    question: "What is the Schmidt number (Sc) in boundary layer mass transfer theory?",
    options: [
      "Ratio of kinematic viscosity to molecular mass diffusivity (nu / D_AB)",
      "Ratio of surface tension to momentum transfer",
      "Ratio of convective mass transfer coefficient to interfacial area",
      "Ratio of reaction rate to diffusion rate"
    ],
    correctIndex: 0,
    explanation: "The Schmidt number Sc = mu / (rho * D_AB) = nu / D_AB characterizes mass transport relative to momentum transport.",
    topic: "Dimensionless Numbers",
    difficulty: "Hard",
    subject: "Mass Transfer"
  },
  {
    id: "chem_mass_5",
    question: "Which gas-liquid contacting operation involves transferring a soluble gas component into a liquid solvent?",
    options: [
      "Gas Absorption",
      "Liquid-liquid extraction",
      "Crystallization",
      "Sublimation"
    ],
    correctIndex: 0,
    explanation: "Gas absorption (scrubbing) removes one or more gas phase solutes by dissolving them into a liquid solvent stream.",
    topic: "Absorption",
    difficulty: "Easy",
    subject: "Mass Transfer"
  }
];

export const CHEMICAL_REACTION_ENG: CuratedQuestion[] = [
  {
    id: "cre_1",
    question: "How is the performance equation for an ideal Continuous Stirred Tank Reactor (CSTR) expressed at steady state?",
    options: [
      "V / F_A0 = X_A / (-r_A)",
      "V / F_A0 = integral(dX_A / -r_A)",
      "V / F_A0 = -r_A * X_A",
      "V / F_A0 = ln(1 - X_A)"
    ],
    correctIndex: 0,
    explanation: "In an ideal CSTR, composition is uniform throughout the tank, giving the algebraic design equation V / F_A0 = X_A / (-r_A_exit).",
    topic: "CSTR Design",
    difficulty: "Easy",
    subject: "Chemical Reaction Engineering"
  },
  {
    id: "cre_2",
    question: "For an isothermal, positive-order homogeneous reaction, which reactor configuration requires the smallest volume for a specified conversion?",
    options: [
      "Plug Flow Reactor (PFR)",
      "Single Continuous Stirred Tank Reactor (CSTR)",
      "Fluidized Bed Reactor without catalyst",
      "CSTR with high recycle ratio"
    ],
    correctIndex: 0,
    explanation: "Because reactant concentration decreases monotonically along a PFR, reaction rate remains higher on average than in a CSTR, requiring less volume.",
    topic: "Reactor Comparison",
    difficulty: "Medium",
    subject: "Chemical Reaction Engineering"
  },
  {
    id: "cre_3",
    question: "According to the Arrhenius equation (k = A * exp(-E_a / (R*T))), what happens to the reaction rate constant k as temperature T increases?",
    options: [
      "k increases exponentially",
      "k decreases logarithmically",
      "k remains constant",
      "k oscillates with frequency A"
    ],
    correctIndex: 0,
    explanation: "Because the exponent (-E_a / RT) becomes less negative as temperature rises, k increases exponentially.",
    topic: "Reaction Kinetics",
    difficulty: "Easy",
    subject: "Chemical Reaction Engineering"
  },
  {
    id: "cre_4",
    question: "In heterogeneous catalysis, what does the Thiele Modulus (phi) compare?",
    options: [
      "Surface reaction rate to the internal pore diffusion rate",
      "Fluid viscosity to thermal conductivity",
      "Catalyst pellet density to fluid density",
      "Inlet velocity to acoustic speed"
    ],
    correctIndex: 0,
    explanation: "The Thiele modulus phi represents the ratio of intrinsic kinetic reaction rate to intraparticle diffusion rate in porous catalyst pellets.",
    topic: "Heterogeneous Catalysis",
    difficulty: "Hard",
    subject: "Chemical Reaction Engineering"
  },
  {
    id: "cre_5",
    question: "What is space time (tau) in continuous reactor engineering?",
    options: [
      "The time required to process one reactor volume of feed (V / v_0)",
      "The total operating lifespan of the reactor catalyst",
      "The time elapsed during emergency shutdown",
      "The reciprocal of the Arrhenius pre-exponential factor"
    ],
    correctIndex: 0,
    explanation: "Space time tau = V / v_0 (where V is reactor volume and v_0 is volumetric feed rate at entrance conditions).",
    topic: "Reactor Kinetics",
    difficulty: "Medium",
    subject: "Chemical Reaction Engineering"
  }
];

export const PROCESS_CONTROL_CHEM: CuratedQuestion[] = [
  {
    id: "pc_1",
    question: "What are the three control modes comprising a standard industrial PID controller?",
    options: [
      "Proportional, Integral, and Derivative",
      "Periodic, Infinite, and Discrete",
      "Parallel, Intermittent, and Dynamic",
      "Polynomial, Inverse, and Differential"
    ],
    correctIndex: 0,
    explanation: "PID stands for Proportional (gain), Integral (eliminates steady-state offset), and Derivative (anticipates rate of error change).",
    topic: "PID Control",
    difficulty: "Easy",
    subject: "Process Control"
  },
  {
    id: "pc_2",
    question: "Which control action is primarily responsible for eliminating steady-state error (offset) in closed-loop systems?",
    options: [
      "Integral Action",
      "Proportional Action alone",
      "Derivative Action alone",
      "Feedforward Action without feedback"
    ],
    correctIndex: 0,
    explanation: "Integral action continuously accumulates error over time, adjusting output until the error is reduced to zero.",
    topic: "Integral Action",
    difficulty: "Easy",
    subject: "Process Control"
  },
  {
    id: "pc_3",
    question: "What is the primary advantage of Feedforward Control compared to standard Feedback Control in chemical process plants?",
    options: [
      "It takes corrective action before a measured disturbance affects the controlled process variable",
      "It does not require any mathematical model of the process",
      "It guarantees zero error even with unmeasured sensor failures",
      "It eliminates the need for control valves"
    ],
    correctIndex: 0,
    explanation: "Feedforward control measures disturbances directly and counteracts them before they propagate to the controlled variable.",
    topic: "Feedforward Control",
    difficulty: "Medium",
    subject: "Process Control"
  },
  {
    id: "pc_4",
    question: "For a dynamic system described by transfer function G(s), where must all closed-loop poles lie in the complex s-plane for bounded-input bounded-output (BIBO) stability?",
    options: [
      "Entirely in the open Left-Half Plane (real parts < 0)",
      "On the positive real axis (real parts > 0)",
      "Strictly on the imaginary axis",
      "Inside a unit circle centered at +1"
    ],
    correctIndex: 0,
    explanation: "In continuous Laplace s-plane analysis, all roots of the characteristic equation must have negative real parts (left-half plane) for asymptotic stability.",
    topic: "Stability Criteria",
    difficulty: "Hard",
    subject: "Process Control"
  },
  {
    id: "pc_5",
    question: "In a Bode frequency response plot, what critical metric measures how much the system gain can increase before reaching instability at the phase crossover frequency?",
    options: [
      "Gain Margin (GM)",
      "Phase Margin (PM)",
      "Resonant Peak",
      "Damping Factor"
    ],
    correctIndex: 0,
    explanation: "Gain margin is the factor by which the open-loop gain can be increased before the system becomes unstable (evaluated where phase is -180 deg).",
    topic: "Frequency Response",
    difficulty: "Hard",
    subject: "Process Control"
  }
];

// -------------------------------------------------------------
// DATA SCIENCE & AI/ML QUESTION BANKS
// -------------------------------------------------------------

export const DATA_SCIENCE_PYTHON: CuratedQuestion[] = [
  {
    id: "ds_py_1",
    question: "In NumPy, how do you perform element-wise multiplication between two 1D arrays 'a' and 'b' of the same shape?",
    options: [
      "a * b",
      "np.dot(a, b)",
      "a.multiply(b)",
      "a @ b"
    ],
    correctIndex: 0,
    explanation: "In NumPy, the '*' operator performs vectorized element-wise multiplication, whereas '@' or 'np.dot' performs matrix multiplication / dot product.",
    topic: "NumPy Vectorization",
    difficulty: "Easy",
    subject: "Python"
  },
  {
    id: "ds_py_2",
    question: "What is the key difference between pandas loc[] and iloc[] indexers?",
    options: [
      "loc[] uses label-based indexing; iloc[] uses integer position-based indexing",
      "loc[] is for columns; iloc[] is for rows",
      "loc[] operates on NumPy; iloc[] operates on PyTorch",
      "loc[] is deprecated in pandas 2.0"
    ],
    correctIndex: 0,
    explanation: "df.loc accesses rows/columns by labels or boolean arrays; df.iloc accesses rows/columns strictly by zero-based integer indices.",
    topic: "Pandas Indexing",
    difficulty: "Easy",
    subject: "Python"
  },
  {
    id: "ds_py_3",
    question: "In pandas, which method is used to replace missing values (NaN) with a designated default or mean value?",
    options: [
      "df.fillna()",
      "df.dropna()",
      "df.replace_null()",
      "df.impute()"
    ],
    correctIndex: 0,
    explanation: "df.fillna(value) fills NA/NaN values using the specified fill method or scalar value.",
    topic: "Missing Values",
    difficulty: "Easy",
    subject: "Python"
  },
  {
    id: "ds_py_4",
    question: "Why is vectorized computation in NumPy and Pandas faster than iterating through a Python list with a for-loop?",
    options: [
      "NumPy operations execute in optimized, contiguous C-level memory loops without Python bytecode interpretation overhead",
      "Python for-loops disable CPU caches",
      "NumPy compiles code into JavaScript",
      "NumPy eliminates RAM usage completely"
    ],
    correctIndex: 0,
    explanation: "NumPy arrays have contiguous homogenous memory buffers, allowing vector SIMD instructions and pre-compiled C/Fortran loop execution without type checks.",
    topic: "Vectorization Internals",
    difficulty: "Medium",
    subject: "Python"
  },
  {
    id: "ds_py_5",
    question: "In scikit-learn, what method must be called to fit transformers (like StandardScaler) on training data and transform it simultaneously?",
    options: [
      "fit_transform()",
      "predict()",
      "score()",
      "execute()"
    ],
    correctIndex: 0,
    explanation: "fit_transform() learns parameters (e.g. mean and std) on the training set and outputs the transformed dataset in a single call.",
    topic: "Scikit-Learn Transformers",
    difficulty: "Medium",
    subject: "Python"
  }
];

export const SQL_DATA_SCIENCE: CuratedQuestion[] = [
  {
    id: "ds_sql_1",
    question: "In SQL, which clause is used to filter groups created by a GROUP BY clause based on aggregate conditions?",
    options: [
      "HAVING",
      "WHERE",
      "ORDER BY",
      "LIMIT"
    ],
    correctIndex: 0,
    explanation: "WHERE filters individual rows prior to grouping; HAVING filters aggregated groups after GROUP BY.",
    topic: "Aggregations",
    difficulty: "Easy",
    subject: "SQL"
  },
  {
    id: "ds_sql_2",
    question: "What is the purpose of the SQL window function ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC)?",
    options: [
      "Assigns a unique sequential integer (1, 2, ...) to rows within each department partition ordered by salary",
      "Calculates the cumulative sum of salaries in each department",
      "Deletes duplicate salaries in each department",
      "Creates a new physical table partitioned by salary"
    ],
    correctIndex: 0,
    explanation: "ROW_NUMBER() computes a continuous ranking 1..N across each window partition without collapsing rows.",
    topic: "Window Functions",
    difficulty: "Medium",
    subject: "SQL"
  },
  {
    id: "ds_sql_3",
    question: "Which JOIN returns all rows from the left table, and matching rows from the right table, populating NULLs when no match exists?",
    options: [
      "LEFT OUTER JOIN",
      "INNER JOIN",
      "CROSS JOIN",
      "FULL OUTER JOIN"
    ],
    correctIndex: 0,
    explanation: "LEFT JOIN preserves every record from the left table and appends matching records from the right table or NULL.",
    topic: "Joins",
    difficulty: "Easy",
    subject: "SQL"
  },
  {
    id: "ds_sql_4",
    question: "What is a Common Table Expression (CTE) in SQL defined with the WITH keyword?",
    options: [
      "A temporary named result set that can be referenced within the execution scope of a SELECT, INSERT, UPDATE, or DELETE query",
      "A permanent index stored on disk",
      "A trigger that executes on row insert",
      "A stored procedure that encrypts table passwords"
    ],
    correctIndex: 0,
    explanation: "CTEs provide cleaner, modular query architecture by defining auxiliary temporary result sets using 'WITH cte_name AS (...)'.",
    topic: "CTEs",
    difficulty: "Medium",
    subject: "SQL"
  },
  {
    id: "ds_sql_5",
    question: "How does the DENSE_RANK() window function differ from standard RANK() in SQL?",
    options: [
      "DENSE_RANK() does not leave gaps in the ranking sequence following tied values",
      "DENSE_RANK() only works on integer primary keys",
      "DENSE_RANK() resets ranking to zero on ties",
      "DENSE_RANK() sorts values in descending order only"
    ],
    correctIndex: 0,
    explanation: "If two rows tie for rank 1, standard RANK() skips to rank 3 next (1, 1, 3); DENSE_RANK() does not skip numbers (1, 1, 2).",
    topic: "Window Functions",
    difficulty: "Hard",
    subject: "SQL"
  }
];

export const STATISTICS_DS: CuratedQuestion[] = [
  {
    id: "stat_1",
    question: "Which measure of central tendency is least sensitive to extreme outliers in a skewed data distribution?",
    options: [
      "Median",
      "Mean",
      "Midrange",
      "Root Mean Square"
    ],
    correctIndex: 0,
    explanation: "The median depends on the order of values and the central position, making it robust against extreme tail outliers unlike the mean.",
    topic: "Descriptive Statistics",
    difficulty: "Easy",
    subject: "Statistics"
  },
  {
    id: "stat_2",
    question: "According to the Central Limit Theorem (CLT), what happens to the distribution of sample means as the sample size n becomes large (n >= 30)?",
    options: [
      "It approaches a normal distribution regardless of the underlying population shape",
      "It becomes a uniform distribution",
      "Its variance grows linearly with n",
      "It degenerates into a single point"
    ],
    correctIndex: 0,
    explanation: "The CLT states that sums/means of independent random variables tend toward a Gaussian normal distribution with variance sigma^2 / n.",
    topic: "Central Limit Theorem",
    difficulty: "Medium",
    subject: "Statistics"
  },
  {
    id: "stat_3",
    question: "In statistical hypothesis testing, what does a p-value represent?",
    options: [
      "The probability of observing test results at least as extreme as the observed data, assuming the null hypothesis is true",
      "The probability that the alternate hypothesis is completely false",
      "The exact percentage of errors in the dataset",
      "The probability of rejecting the true alternate hypothesis"
    ],
    correctIndex: 0,
    explanation: "A p-value measures evidence against the null hypothesis H_0: smaller p-values indicate strong evidence to reject H_0.",
    topic: "Hypothesis Testing",
    difficulty: "Medium",
    subject: "Statistics"
  },
  {
    id: "stat_4",
    question: "What is a Type I error in statistical inference?",
    options: [
      "Rejecting the null hypothesis when it is actually true (False Positive)",
      "Failing to reject the null hypothesis when it is false (False Negative)",
      "Calculating standard deviation using n instead of n-1",
      "Using a two-tailed test instead of a one-tailed test"
    ],
    correctIndex: 0,
    explanation: "A Type I error (alpha) occurs when an investigator falsely rejects a null hypothesis that is true.",
    topic: "Errors in Inference",
    difficulty: "Easy",
    subject: "Statistics"
  },
  {
    id: "stat_5",
    question: "What does the Pearson correlation coefficient (r) equal to -0.92 indicate about two continuous variables?",
    options: [
      "A strong negative linear relationship",
      "No relationship between the variables",
      "A strong non-linear parabolic relationship",
      "A 92% probability of causal causation"
    ],
    correctIndex: 0,
    explanation: "Pearson r values close to -1 indicate that as one variable increases, the other decreases in a strong linear fashion.",
    topic: "Correlation",
    difficulty: "Easy",
    subject: "Statistics"
  }
];

export const MACHINE_LEARNING_DS: CuratedQuestion[] = [
  {
    id: "ml_1",
    question: "What occurs when a machine learning model has high variance and low bias?",
    options: [
      "Overfitting (it memorizes training noise and fails to generalize to test data)",
      "Underfitting (it fails to learn underlying patterns)",
      "Optimal convergence with zero generalization error",
      "Vanishing gradients in output layers"
    ],
    correctIndex: 0,
    explanation: "High variance models fit training data too closely, modeling random noise and degrading performance on unseen validation/test data (overfitting).",
    topic: "Bias-Variance Tradeoff",
    difficulty: "Easy",
    subject: "Machine Learning"
  },
  {
    id: "ml_2",
    question: "Which evaluation metric is preferred when evaluating a classification model on an imbalanced dataset where the positive class is rare (e.g., fraud detection)?",
    options: [
      "Precision-Recall AUC or F1-Score",
      "Standard Accuracy",
      "Mean Squared Error (MSE)",
      "R-squared"
    ],
    correctIndex: 0,
    explanation: "Standard accuracy is misleading on imbalanced datasets (e.g. 99% accuracy by predicting all negatives). F1-Score and PR-AUC measure true minority detection.",
    topic: "Evaluation Metrics",
    difficulty: "Medium",
    subject: "Machine Learning"
  },
  {
    id: "ml_3",
    question: "What is the primary difference between L1 Regularization (Lasso) and L2 Regularization (Ridge)?",
    options: [
      "L1 adds the absolute sum of weights and encourages sparse feature weights (can zero out coefficients); L2 adds squared weights and shrinks coefficients smoothly",
      "L1 only applies to neural networks; L2 only applies to decision trees",
      "L1 minimizes training time; L2 doubles the learning rate",
      "L1 prevents underfitting; L2 causes overfitting"
    ],
    correctIndex: 0,
    explanation: "Lasso (L1 norm) penalizes |w|, driving irrelevant feature weights to exactly 0 (automatic feature selection). Ridge (L2 norm) penalizes w^2.",
    topic: "Regularization",
    difficulty: "Medium",
    subject: "Machine Learning"
  },
  {
    id: "ml_4",
    question: "How does the Random Forest ensemble algorithm build diverse decision trees?",
    options: [
      "By using bootstrap aggregation (bagging) of data samples and random feature subset selection at each split",
      "By training one tree on errors of previous trees in sequential order",
      "By using a single global hyperplane to divide data",
      "By converting numerical features into categorical labels"
    ],
    correctIndex: 0,
    explanation: "Random Forest combines bagging (bootstrap aggregation) with random feature sub-spacing to decorrelate individual decision trees and reduce variance.",
    topic: "Ensemble Methods",
    difficulty: "Medium",
    subject: "Machine Learning"
  },
  {
    id: "ml_5",
    question: "What is the main objective of Principal Component Analysis (PCA) in unsupervised learning?",
    options: [
      "Dimensionality reduction by finding orthogonal axes of maximal variance in the feature space",
      "Classifying categorical targets using Bayes theorem",
      "Clustering points into K distinct spherical centroids",
      "Imputing missing values using nearest neighbors"
    ],
    correctIndex: 0,
    explanation: "PCA projects high-dimensional data onto orthogonal principal components that capture maximum variance, minimizing information loss.",
    topic: "Dimensionality Reduction",
    difficulty: "Hard",
    subject: "Machine Learning"
  }
];

export const DEEP_LEARNING_AIML: CuratedQuestion[] = [
  {
    id: "dl_1",
    question: "Why is the Rectified Linear Unit (ReLU: f(x) = max(0, x)) widely used over Sigmoid in deep neural network hidden layers?",
    options: [
      "It mitigates the vanishing gradient problem for positive inputs and is computationally efficient to evaluate",
      "It restricts outputs strictly between -1 and +1",
      "It guarantees zero loss on the first training epoch",
      "It has zero derivative everywhere"
    ],
    correctIndex: 0,
    explanation: "Sigmoid saturates at both tails with derivatives near 0, causing vanishing gradients. ReLU has derivative 1 for positive activations.",
    topic: "Activation Functions",
    difficulty: "Easy",
    subject: "Deep Learning"
  },
  {
    id: "dl_2",
    question: "What optimization technique maintains per-parameter moving averages of both past gradients and squared gradients (momentum + RMSprop)?",
    options: [
      "Adam (Adaptive Moment Estimation)",
      "Standard Stochastic Gradient Descent (SGD)",
      "Batch Normalization",
      "Newton-Raphson Method"
    ],
    correctIndex: 0,
    explanation: "Adam calculates adaptive learning rates by combining first-order moments (mean of gradients) and second-order moments (uncentered variance).",
    topic: "Optimization",
    difficulty: "Medium",
    subject: "Deep Learning"
  },
  {
    id: "dl_3",
    question: "In Convolutional Neural Networks (CNNs), what is the primary role of a Pooling layer (such as Max Pooling)?",
    options: [
      "Downsamples feature maps to reduce spatial dimensions, parameter count, and computational burden while providing translation invariance",
      "Calculates the final classification probabilities using softmax",
      "Backpropagates gradients into the input image",
      "Doubles the number of color channels"
    ],
    correctIndex: 0,
    explanation: "Pooling progressively reduces spatial resolution (width x height), controlling overfitting and lowering computational complexity.",
    topic: "CNN Architecture",
    difficulty: "Easy",
    subject: "Deep Learning"
  },
  {
    id: "dl_4",
    question: "What is the key innovation of the Transformer architecture introduced in 'Attention Is All You Need'?",
    options: [
      "Self-Attention mechanism that processes all sequence tokens in parallel, replacing sequential recurrence (RNNs)",
      "Using decision trees as activation layers",
      "Eliminating the need for loss backpropagation",
      "Restricting attention to only the immediate neighboring word"
    ],
    correctIndex: 0,
    explanation: "Transformers rely on multi-head self-attention to model long-range token relationships simultaneously without sequential recurrent steps.",
    topic: "Transformers & Attention",
    difficulty: "Hard",
    subject: "Deep Learning"
  },
  {
    id: "dl_5",
    question: "What regularization method randomly deactivates a fraction p of neurons during each forward-backward training pass?",
    options: [
      "Dropout",
      "Batch Normalization",
      "Early Stopping",
      "Weight Clipping"
    ],
    correctIndex: 0,
    explanation: "Dropout prevents co-adaptation of feature detectors by forcing the network to learn redundant, robust representations.",
    topic: "Regularization",
    difficulty: "Easy",
    subject: "Deep Learning"
  }
];

export const MATH_FOR_AIML: CuratedQuestion[] = [
  {
    id: "math_ai_1",
    question: "For a square matrix A, if A * v = lambda * v (where v != 0), what are v and lambda called?",
    options: [
      "v is an eigenvector and lambda is its corresponding eigenvalue",
      "v is a gradient and lambda is the learning rate",
      "v is a pseudo-inverse and lambda is the determinant",
      "v is an orthogonal projection and lambda is the rank"
    ],
    correctIndex: 0,
    explanation: "In linear algebra, non-zero vectors v satisfying A*v = lambda*v are eigenvectors, and scalars lambda are eigenvalues.",
    topic: "Linear Algebra",
    difficulty: "Easy",
    subject: "Mathematics for AI/ML"
  },
  {
    id: "math_ai_2",
    question: "In multivariate calculus, what does the gradient vector grad(f) of a scalar function f(x, y, z) represent?",
    options: [
      "The vector of partial derivatives pointing in the direction of greatest rate of increase of f",
      "The curvature matrix containing all second derivatives",
      "The scalar projection of f onto the x-axis",
      "The volume enclosed by the contour surfaces"
    ],
    correctIndex: 0,
    explanation: "The gradient grad(f) points in the direction of steepest ascent; in gradient descent, parameters step in the opposite direction (-grad(f)).",
    topic: "Calculus & Optimization",
    difficulty: "Easy",
    subject: "Mathematics for AI/ML"
  },
  {
    id: "math_ai_3",
    question: "What is the Jacobian matrix of a vector-valued function f: R^n -> R^m?",
    options: [
      "The m x n matrix of all first-order partial derivatives of f",
      "The symmetric n x n matrix of second-order partial derivatives",
      "The scalar determinant of matrix eigenvectors",
      "The covariance matrix of training samples"
    ],
    correctIndex: 0,
    explanation: "The Jacobian matrix J contains elements J_ij = df_i / dx_j, describing the local linear mapping of vector function f.",
    topic: "Multivariate Calculus",
    difficulty: "Medium",
    subject: "Mathematics for AI/ML"
  },
  {
    id: "math_ai_4",
    question: "What does Bayes' Theorem state for events A and B (P(B) > 0)?",
    options: [
      "P(A|B) = [P(B|A) * P(A)] / P(B)",
      "P(A|B) = P(A) * P(B)",
      "P(A|B) = P(A) + P(B) - P(A and B)",
      "P(A|B) = P(B|A) / P(A)"
    ],
    correctIndex: 0,
    explanation: "Bayes' Theorem updates posterior probability P(A|B) based on prior P(A), likelihood P(B|A), and marginal evidence P(B).",
    topic: "Probability & Bayes",
    difficulty: "Easy",
    subject: "Mathematics for AI/ML"
  },
  {
    id: "math_ai_5",
    question: "In optimization theory, what is a necessary condition for a differentiable function f(x) to have a local minimum at point x*?",
    options: [
      "The gradient grad(f(x*)) must be 0, and the Hessian matrix H(x*) must be positive semi-definite",
      "The determinant of the matrix must be strictly negative",
      "The function value must be zero",
      "All elements of x* must be positive integers"
    ],
    correctIndex: 0,
    explanation: "A stationary point where grad(f) = 0 is a local minimum if the second-derivative Hessian matrix is positive semi-definite.",
    topic: "Optimization",
    difficulty: "Hard",
    subject: "Mathematics for AI/ML"
  }
];

// =============================================================
// ELECTRONICS & TELECOMMUNICATION (E&TC) QUESTION BANKS
// =============================================================
export const EMBEDDED_C_ETC: CuratedQuestion[] = [
  {
    id: "emb_c_1",
    question: "Why is the 'volatile' keyword critical when declaring a pointer to a hardware memory-mapped peripheral register in Embedded C?",
    options: [
      "It informs the compiler optimizer that the register value may change outside the program's control, preventing caching in CPU registers",
      "It allocates the register in non-volatile flash ROM",
      "It converts 8-bit registers into 32-bit registers",
      "It automatically enables nested interrupts"
    ],
    correctIndex: 0,
    explanation: "Hardware registers can be modified by external events or interrupts; 'volatile' forces the compiler to read directly from memory on every access.",
    topic: "Volatile Keyword",
    difficulty: "Medium",
    subject: "Embedded C"
  },
  {
    id: "emb_c_2",
    question: "Which bitwise operation clears bit 3 in an 8-bit microcontroller register named PORTB without modifying other bits?",
    options: [
      "PORTB &= ~(1 << 3)",
      "PORTB |= (1 << 3)",
      "PORTB ^= (1 << 3)",
      "PORTB = ~(1 << 3)"
    ],
    correctIndex: 0,
    explanation: "Bitwise AND with the bitwise NOT of the mask (~(1 << 3)) clears the 3rd bit while preserving all other bits.",
    topic: "Bit Manipulation",
    difficulty: "Easy",
    subject: "Embedded C"
  },
  {
    id: "emb_c_3",
    question: "Why should dynamic memory allocation (malloc/free) be strictly avoided or limited in hard real-time embedded firmware?",
    options: [
      "It causes non-deterministic execution times and heap fragmentation, risking allocation failures during mission-critical tasks",
      "It cannot allocate more than 16 bytes at a time",
      "It turns off the internal crystal oscillator",
      "It is unsupported by all ARM Cortex-M compilers"
    ],
    correctIndex: 0,
    explanation: "Dynamic allocation introduces unbounded latencies and heap fragmentation, which can cause unexpected runtime crashes in real-time control systems.",
    topic: "Memory Management",
    difficulty: "Hard",
    subject: "Embedded C"
  }
];

export const VERILOG_ETC: CuratedQuestion[] = [
  {
    id: "verilog_1",
    question: "In synthesizable Verilog, what type of assignment must be used inside an 'always @(posedge clk)' block to model sequential edge-triggered flip-flops?",
    options: [
      "Non-blocking assignments (<=)",
      "Blocking assignments (=)",
      "Continuous assignments (assign)",
      "Force assignments (force)"
    ],
    correctIndex: 0,
    explanation: "Non-blocking assignments (<=) schedule updates in the NBA event region, accurately modeling synchronous register transfers without race conditions.",
    topic: "Sequential Logic",
    difficulty: "Medium",
    subject: "Verilog"
  },
  {
    id: "verilog_2",
    question: "Which Verilog keyword defines an input or output that represents a continuous physical connecting wire?",
    options: ["wire", "reg", "integer", "real"],
    correctIndex: 0,
    explanation: "The 'wire' datatype models physical connections driven continuously by logic gates or assign statements.",
    topic: "Data Types",
    difficulty: "Easy",
    subject: "Verilog"
  },
  {
    id: "verilog_3",
    question: "What hardware defect occurs if an incomplete case statement or if-else ladder without default is written in a combinational 'always @(*)' block?",
    options: [
      "Unintended transparent latches are synthesized",
      "The circuit synthesizes into read-only memory (ROM)",
      "The FPGA clock frequency is automatically doubled",
      "The synthesis tool permanently burns the pins"
    ],
    correctIndex: 0,
    explanation: "If a combinational signal is not assigned for all possible branch conditions, the synthesis tool must infer memory latches to hold previous state.",
    topic: "Synthesis Latches",
    difficulty: "Hard",
    subject: "Verilog"
  }
];

export const DIGITAL_ELECTRONICS_ETC: CuratedQuestion[] = [
  {
    id: "dig_elec_1",
    question: "What is the two's complement representation of -5 in an 8-bit signed binary system?",
    options: ["11111011", "10000101", "11111010", "11110101"],
    correctIndex: 0,
    explanation: "+5 is 00000101. Inverting bits gives 11111010, and adding 1 gives 11111011.",
    topic: "Binary Arithmetic",
    difficulty: "Easy",
    subject: "Digital Electronics"
  },
  {
    id: "dig_elec_2",
    question: "What is the primary condition required to eliminate static hazard glitches in combinational logic circuits?",
    options: [
      "Include redundant consensus prime implicants in the Karnaugh map (K-map)",
      "Increase the clock frequency beyond 1 GHz",
      "Replace all NAND gates with XOR gates",
      "Remove all ground connections"
    ],
    correctIndex: 0,
    explanation: "Covering adjacent 1-cells with overlapping consensus product terms prevents output drops during single-variable input transitions.",
    topic: "Hazards in Logic",
    difficulty: "Hard",
    subject: "Digital Electronics"
  }
];

export const COMMUNICATION_SYSTEMS_ETC: CuratedQuestion[] = [
  {
    id: "comm_sys_1",
    question: "According to Nyquist's sampling theorem, what is the minimum sampling frequency required to perfectly reconstruct a signal with maximum frequency f_max?",
    options: ["2 * f_max", "f_max / 2", "4 * f_max", "f_max"],
    correctIndex: 0,
    explanation: "The Nyquist criterion states that the sampling rate must be at least twice the highest frequency present in the bandlimited signal.",
    topic: "Nyquist Rate",
    difficulty: "Easy",
    subject: "Communication Systems"
  },
  {
    id: "comm_sys_2",
    question: "In digital modulation, why does 16-QAM achieve higher spectral efficiency than QPSK?",
    options: [
      "16-QAM transmits 4 bits per symbol using both amplitude and phase modulation, whereas QPSK transmits 2 bits per symbol",
      "16-QAM eliminates the need for carrier synchronization",
      "16-QAM uses optical fiber instead of electromagnetic waves",
      "16-QAM operates only at baseband"
    ],
    correctIndex: 0,
    explanation: "QPSK has 4 constellation points (log2(4) = 2 bits/symbol), whereas 16-QAM has 16 points (log2(16) = 4 bits/symbol), doubling throughput per Hz.",
    topic: "Digital Modulation",
    difficulty: "Medium",
    subject: "Communication Systems"
  }
];

// =============================================================
// ELECTRICAL ENGINEERING QUESTION BANKS
// =============================================================
export const CIRCUIT_THEORY_EE: CuratedQuestion[] = [
  {
    id: "ee_circ_1",
    question: "According to Thevenin's Theorem, any linear two-terminal DC network can be replaced by an equivalent circuit consisting of:",
    options: [
      "A single voltage source V_th in series with a single resistance R_th",
      "A single current source I_n in parallel with a single resistance R_n",
      "An ideal inductor in parallel with an ideal capacitor",
      "A pure transformer with unity turns ratio"
    ],
    correctIndex: 0,
    explanation: "Thevenin's theorem proves equivalence to an open-circuit voltage V_th in series with the look-back resistance R_th.",
    topic: "Network Theorems",
    difficulty: "Easy",
    subject: "Circuit Theory"
  },
  {
    id: "ee_circ_2",
    question: "In a series RLC resonant circuit, what is the value of the impedance at the resonant frequency omega_0 = 1 / sqrt(L*C)?",
    options: [
      "Minimum and purely resistive (Z = R)",
      "Maximum and purely inductive (Z = omega*L)",
      "Infinite (open circuit)",
      "Zero"
    ],
    correctIndex: 0,
    explanation: "At series resonance, the inductive reactance cancels the capacitive reactance (X_L = X_C), leaving the net impedance at its minimum value R.",
    topic: "Resonance",
    difficulty: "Medium",
    subject: "Circuit Theory"
  }
];

export const ELECTRICAL_MACHINES_EE: CuratedQuestion[] = [
  {
    id: "ee_mach_1",
    question: "What is the slip (s) of a 3-phase induction motor under locked-rotor (standstill) conditions?",
    options: ["1.0 (or 100%)", "0.0", "0.05", "Infinity"],
    correctIndex: 0,
    explanation: "Slip is defined as (N_s - N_r) / N_s. At standstill, rotor speed N_r = 0, so slip = N_s / N_s = 1.0.",
    topic: "Induction Motors",
    difficulty: "Easy",
    subject: "Electrical Machines"
  },
  {
    id: "ee_mach_2",
    question: "In a transformer, why is the core constructed using laminated silicon steel sheets rather than a solid iron block?",
    options: [
      "To minimize eddy current losses by breaking electrical conduction loops in the core",
      "To increase mechanical weight and structural strength",
      "To completely eliminate copper resistance losses in windings",
      "To step down DC voltage directly"
    ],
    correctIndex: 0,
    explanation: "Eddy current power dissipation is proportional to lamination thickness squared. Thin insulated laminations dramatically reduce these losses.",
    topic: "Transformer Design",
    difficulty: "Medium",
    subject: "Electrical Machines"
  }
];

export const POWER_SYSTEMS_EE: CuratedQuestion[] = [
  {
    id: "ee_pwr_1",
    question: "In power system load flow studies, what quantities are explicitly specified at a Generator Bus (PV Bus)?",
    options: [
      "Active Power (P) and Voltage Magnitude (|V|)",
      "Active Power (P) and Reactive Power (Q)",
      "Voltage Magnitude (|V|) and Voltage Phase Angle (delta)",
      "Reactive Power (Q) and Phase Angle (delta)"
    ],
    correctIndex: 0,
    explanation: "A PV bus represents a regulated generator with fixed real power output P and automatic excitation maintaining voltage magnitude |V|.",
    topic: "Load Flow Analysis",
    difficulty: "Medium",
    subject: "Power Systems"
  },
  {
    id: "ee_pwr_2",
    question: "What is the primary function of a Buchholz Relay in an oil-immersed power transformer?",
    options: [
      "To detect incipient internal faults through gas accumulation and rapid oil surges",
      "To regulate output voltage levels during peak hours",
      "To measure ambient ambient humidity outside the tank",
      "To disconnect the lightning arrester"
    ],
    correctIndex: 0,
    explanation: "Buchholz relays are gas-actuated protective devices mounted in the pipe connecting the main transformer tank to the conservator.",
    topic: "Transformer Protection",
    difficulty: "Medium",
    subject: "Power Systems"
  }
];

export const POWER_ELECTRONICS_EE: CuratedQuestion[] = [
  {
    id: "ee_pe_1",
    question: "In a DC-DC Buck converter operating in continuous conduction mode (CCM), what is the relationship between output voltage V_out, input voltage V_in, and duty cycle D (0 < D < 1)?",
    options: ["V_out = D * V_in", "V_out = V_in / D", "V_out = V_in / (1 - D)", "V_out = D * (1 - D) * V_in"],
    correctIndex: 0,
    explanation: "A Buck converter steps down voltage by averaging switch pulses: V_out = D * V_in.",
    topic: "DC-DC Converters",
    difficulty: "Easy",
    subject: "Power Electronics"
  },
  {
    id: "ee_pe_2",
    question: "Which semiconductor device combines the simple gate-drive characteristics of a MOSFET with the high-current, low-saturation-voltage capability of a bipolar transistor?",
    options: [
      "IGBT (Insulated Gate Bipolar Transistor)",
      "TRIAC",
      "Schottky Barrier Diode",
      "JFET"
    ],
    correctIndex: 0,
    explanation: "The IGBT is a hybrid device with a voltage-controlled insulated gate input and a bipolar PNP/NPN conduction channel.",
    topic: "Power Semiconductor Devices",
    difficulty: "Easy",
    subject: "Power Electronics"
  }
];

export const PLC_SIMULINK_EE: CuratedQuestion[] = [
  {
    id: "ee_plc_1",
    question: "In PLC Ladder Logic programming, what does an 'XIC' (Examine If Closed / Normally Open) contact instruction do?",
    options: [
      "Evaluates as TRUE (passes logic continuity) if its addressed bit memory status is 1 (energized)",
      "Always forces output coils to turn OFF",
      "Resets the PLC microprocessor clock",
      "Creates an analog voltage ramp"
    ],
    correctIndex: 0,
    explanation: "An XIC instruction checks the memory address: if the bit is 1 (closed), logic power flows through the contact rung.",
    topic: "Ladder Logic Basics",
    difficulty: "Easy",
    subject: "PLC"
  },
  {
    id: "ee_sim_1",
    question: "In MATLAB / Simulink power simulation, what solver is best suited for stiff systems with high-frequency power electronics switching?",
    options: [
      "Variable-step stiff solvers such as ode23tb or ode15s",
      "Fixed-step explicit Euler (ode1)",
      "Simple forward difference numerical approximation",
      "Fourier transform integrator"
    ],
    correctIndex: 0,
    explanation: "Stiff solvers (like ode15s or ode23tb) maintain stability and accuracy across fast switching transients and inductive discontinuities.",
    topic: "Simulink Solvers",
    difficulty: "Hard",
    subject: "Simulink"
  }
];

// =============================================================
// MECHANICAL ENGINEERING QUESTION BANKS
// =============================================================
export const SOLIDWORKS_AUTOCAD_MECH: CuratedQuestion[] = [
  {
    id: "mech_cad_1",
    question: "In parametric 3D CAD software such as SolidWorks, what is the effect of creating a 'Fully Defined' 2D sketch before applying an Extrude feature?",
    options: [
      "All geometric relations and dimensions are completely locked relative to the coordinate origin, preventing unintended parametric deformation",
      "The 3D model becomes transparent and uneditable",
      "The file size increases tenfold",
      "It automatically exports the file to G-code"
    ],
    correctIndex: 0,
    explanation: "Fully defined sketches turn black in SolidWorks, ensuring that dimensions and geometric mates explicitly constrain the geometry.",
    topic: "Parametric Sketching",
    difficulty: "Easy",
    subject: "SolidWorks"
  },
  {
    id: "mech_cad_2",
    question: "In mechanical engineering drawings, what does the GD&T symbol representing two concentric circles indicate?",
    options: ["Concentricity", "Flatness", "Perpendicularity", "Cylindricity"],
    correctIndex: 0,
    explanation: "Two concentric circles represent the Concentricity tolerance symbol in ASME Y14.5 GD&T standards.",
    topic: "GD&T Standards",
    difficulty: "Medium",
    subject: "AutoCAD"
  }
];

export const ENG_MECHANICS_STRENGTH_MECH: CuratedQuestion[] = [
  {
    id: "mech_som_1",
    question: "What is Hooke's Law within the proportional elastic limit of an isotropic engineering material?",
    options: [
      "Stress is directly proportional to strain (sigma = E * epsilon)",
      "Strain is proportional to velocity squared",
      "Force equals mass times acceleration",
      "Thermal expansion equals hydrostatic pressure"
    ],
    correctIndex: 0,
    explanation: "Hooke's law states that uniaxial normal stress is linearly related to axial normal strain via Young's Modulus E.",
    topic: "Stress-Strain Behavior",
    difficulty: "Easy",
    subject: "Strength of Materials"
  },
  {
    id: "mech_som_2",
    question: "In pure bending of a symmetric beam according to Euler-Bernoulli beam theory, what is the magnitude of bending stress at the neutral axis?",
    options: ["Zero", "Maximum tensile stress", "Maximum compressive stress", "Infinity"],
    correctIndex: 0,
    explanation: "The neutral axis experiences zero longitudinal strain and therefore zero normal bending stress (sigma = M * y / I, where y = 0).",
    topic: "Beam Bending",
    difficulty: "Medium",
    subject: "Strength of Materials"
  },
  {
    id: "mech_som_3",
    question: "For ductile metals such as structural mild steel, which failure theory provides the most accurate yield prediction under multi-axial state of stress?",
    options: [
      "Von Mises (Maximum Distortion Energy Theory)",
      "Rankine (Maximum Normal Stress Theory)",
      "Coulomb-Mohr Theory",
      "Saint-Venant (Maximum Strain Theory)"
    ],
    correctIndex: 0,
    explanation: "Von Mises distortion energy theory accurately predicts yielding in ductile materials because shear distortion causes plastic slip along crystal planes.",
    topic: "Failure Theories",
    difficulty: "Hard",
    subject: "Strength of Materials"
  }
];

export const MANUFACTURING_PROCESSES_MECH: CuratedQuestion[] = [
  {
    id: "mech_mfg_1",
    question: "In machining operations, what equation expresses Taylor's Tool Life formula relating cutting speed V and tool life T?",
    options: [
      "V * T^n = C (where n is the tool exponent and C is a constant)",
      "V / T = constant",
      "V + T = C",
      "V^2 * T = C"
    ],
    correctIndex: 0,
    explanation: "F.W. Taylor established the empirical relation V * T^n = C, showing cutting speed drastically impacts cutting tool wear rate.",
    topic: "Machining Economics",
    difficulty: "Medium",
    subject: "Manufacturing Processes"
  },
  {
    id: "mech_mfg_2",
    question: "Which metal forming process forces a heated cylindrical metal billet through a shaped die opening to produce continuous profiles of constant cross-section?",
    options: ["Extrusion", "Die Casting", "Deep Drawing", "Shot Peening"],
    correctIndex: 0,
    explanation: "Extrusion forces metal plastically through a die opening to fabricate rods, structural channels, tubes, and complex cross-sections.",
    topic: "Bulk Deformation",
    difficulty: "Easy",
    subject: "Manufacturing Processes"
  }
];

// =============================================================
// CIVIL ENGINEERING QUESTION BANKS
// =============================================================
export const CIVIL_STRUCTURAL_STAAD: CuratedQuestion[] = [
  {
    id: "civ_staad_1",
    question: "In structural analysis software such as STAAD.Pro, what is the primary purpose of performing a P-Delta analysis on multi-story building frames?",
    options: [
      "To account for second-order geometric non-linearity caused by lateral sway deflection under heavy vertical gravity loads",
      "To calculate concrete hydration curing temperature",
      "To simulate paint thickness on exterior beams",
      "To calculate crane rental costs"
    ],
    correctIndex: 0,
    explanation: "P-Delta effects capture secondary bending moments induced by axial loads acting on displaced joint positions during lateral drift.",
    topic: "Second-Order Analysis",
    difficulty: "Hard",
    subject: "STAAD.Pro"
  },
  {
    id: "civ_struct_1",
    question: "In Limit State Design of reinforced concrete (RCC) beams, why are beams intentionally designed as 'under-reinforced' sections?",
    options: [
      "To ensure tensile steel yields before concrete crushes in compression, providing ductile warning signs prior to ultimate failure",
      "To use less concrete and maximize structural dead load",
      "To prevent moisture intrusion into the ceiling",
      "To speed up formwork striking time"
    ],
    correctIndex: 0,
    explanation: "Under-reinforced beams guarantee ductile flexural behavior: longitudinal steel yields first, producing noticeable deflection and cracks before failure.",
    topic: "RCC Design",
    difficulty: "Medium",
    subject: "Structural Engineering"
  },
  {
    id: "civ_surv_1",
    question: "In surveying, what is the condition called when the line of collimation is perpendicular to the vertical axis and passes through the optical center of the objective lens?",
    options: ["Collimation Adjustment", "Parallax Error", "Refraction Angle", "Curvature Offset"],
    correctIndex: 0,
    explanation: "Collimation adjustment aligns the line of sight (collimation line) truly horizontal when the bubble tube is centered.",
    topic: "Levelling & Theodolite",
    difficulty: "Easy",
    subject: "Surveying"
  },
  {
    id: "civ_geotech_1",
    question: "What parameter does Terzaghi's bearing capacity equation calculate for shallow continuous strip footings on cohesive-frictional soils?",
    options: [
      "Ultimate bearing capacity q_ult = c*Nc + q*Nq + 0.5*gamma*B*Ngamma",
      "Hydraulic head loss through pipe joints",
      "Concrete compressive strength after 28 days",
      "Bituminous binder viscosity"
    ],
    correctIndex: 0,
    explanation: "Terzaghi's bearing capacity formula determines the ultimate pressure that soil can sustain before shear failure occurs beneath the footing.",
    topic: "Soil Mechanics",
    difficulty: "Medium",
    subject: "Geotechnical Engineering"
  }
];

// =============================================================
// INFORMATION TECHNOLOGY & CLOUD QUESTION BANKS
// =============================================================
export const IT_CLOUD_SOFTWARE_ENG: CuratedQuestion[] = [
  {
    id: "it_cloud_1",
    question: "What is the primary difference between horizontal scaling (scaling out) and vertical scaling (scaling up) in cloud computing?",
    options: [
      "Horizontal scaling adds more machine instances to distribute load, while vertical scaling adds CPU/RAM resources to a single existing instance",
      "Horizontal scaling replaces optical cables with wireless signals",
      "Vertical scaling requires switching cloud providers",
      "Horizontal scaling works only for relational databases"
    ],
    correctIndex: 0,
    explanation: "Scaling out (horizontal) distributes computing demand across multiple nodes, whereas scaling up (vertical) increases the size of a single instance.",
    topic: "Cloud Architecture",
    difficulty: "Easy",
    subject: "Cloud Computing"
  },
  {
    id: "it_se_1",
    question: "In software engineering, what principle does the 'S' in SOLID object-oriented design stand for?",
    options: [
      "Single Responsibility Principle: A class should have one, and only one, reason to change",
      "Synchronous Execution Principle",
      "Static Memory Allocation Principle",
      "Standard Interface Design Principle"
    ],
    correctIndex: 0,
    explanation: "The Single Responsibility Principle (SRP) states that every class or module should have responsibility over a single part of software functionality.",
    topic: "SOLID Principles",
    difficulty: "Easy",
    subject: "Software Engineering"
  },
  {
    id: "it_db_1",
    question: "What does the ACID property 'Isolation' guarantee in a relational database management system?",
    options: [
      "Concurrent transaction execution results in a system state equivalent to transactions being executed serially one after another",
      "Database data files are isolated from disk crashes",
      "Every table must be stored in its own operating system directory",
      "Foreign keys cannot reference primary keys"
    ],
    correctIndex: 0,
    explanation: "Transaction isolation ensures that concurrent execution of transactions does not leave the database in an inconsistent state due to race conditions.",
    topic: "ACID Properties",
    difficulty: "Medium",
    subject: "Database Management"
  }
];

// =============================================================
// AI/ML & DATA SCIENCE (TENSORFLOW & NUMPY) QUESTION BANKS
// =============================================================
export const TENSORFLOW_NUMPY_BANK: CuratedQuestion[] = [
  {
    id: "tf_aiml_1",
    question: "In TensorFlow and Keras, what is the role of the 'tf.GradientTape' context API?",
    options: [
      "It records operations executed inside its context to automatically compute gradients with respect to trainable variables via automatic differentiation",
      "It saves model weights directly to magnetic tape drives",
      "It compiles Python bytecode into machine assembly",
      "It normalizes categorical labels into one-hot vectors"
    ],
    correctIndex: 0,
    explanation: "tf.GradientTape tracks tensor forward-pass operations, enabling automatic backpropagation gradient calculations for custom training loops.",
    topic: "Automatic Differentiation",
    difficulty: "Medium",
    subject: "TensorFlow"
  },
  {
    id: "np_ds_1",
    question: "In NumPy, what is array 'broadcasting'?",
    options: [
      "The set of rules that allows arithmetic operations between arrays of different but compatible shapes without making needless copies of data",
      "Streaming matrix values over a network socket",
      "Printing arrays to the terminal",
      "Converting floating-point values to integers"
    ],
    correctIndex: 0,
    explanation: "Broadcasting automatically expands trailing dimensions of size 1 across larger arrays during vectorized arithmetic operations.",
    topic: "Vectorized Broadcasting",
    difficulty: "Easy",
    subject: "NumPy"
  }
];

/**
 * Lookup fallback questions for all 9 Engineering Branches.
 */
export function getBranchSpecificQuestions(subject: string, branch: string = ""): CuratedQuestion[] | null {
  const normSub = subject.toLowerCase().trim();
  const normBranch = branch.toLowerCase().trim();

  // E&TC Subjects
  if (normSub.includes("embedded c")) {
    return EMBEDDED_C_ETC;
  }
  if (normSub.includes("verilog")) {
    return VERILOG_ETC;
  }
  if (normSub.includes("digital electron")) {
    return DIGITAL_ELECTRONICS_ETC;
  }
  if (normSub.includes("communication system")) {
    return COMMUNICATION_SYSTEMS_ETC;
  }

  // Electrical Engineering Subjects
  if (normSub.includes("circuit theory")) {
    return CIRCUIT_THEORY_EE;
  }
  if (normSub.includes("electrical machine") || normSub.includes("electric machine")) {
    return ELECTRICAL_MACHINES_EE;
  }
  if (normSub.includes("power system")) {
    return POWER_SYSTEMS_EE;
  }
  if (normSub.includes("power electron")) {
    return POWER_ELECTRONICS_EE;
  }
  if (normSub === "plc" || normSub.includes("plc")) {
    return PLC_SIMULINK_EE;
  }
  if (normSub.includes("simulink")) {
    return PLC_SIMULINK_EE;
  }

  // Mechanical Engineering Subjects
  if (normSub.includes("solidworks")) {
    return SOLIDWORKS_AUTOCAD_MECH;
  }
  if (normSub.includes("strength of material") || normSub.includes("mechanics of material")) {
    return ENG_MECHANICS_STRENGTH_MECH;
  }
  if (normSub.includes("manufacturing process") || normSub.includes("manufacturing")) {
    return MANUFACTURING_PROCESSES_MECH;
  }

  // Civil Engineering Subjects
  if (normSub.includes("staad")) {
    return CIVIL_STRUCTURAL_STAAD;
  }
  if (normSub.includes("structural engineering") || normSub.includes("structural analysis")) {
    return CIVIL_STRUCTURAL_STAAD;
  }
  if (normSub.includes("surveying")) {
    return CIVIL_STRUCTURAL_STAAD;
  }
  if (normSub.includes("geotechnical") || normSub.includes("soil")) {
    return CIVIL_STRUCTURAL_STAAD;
  }

  // IT & Cloud
  if (normSub.includes("cloud computing")) {
    return IT_CLOUD_SOFTWARE_ENG;
  }
  if (normSub.includes("software engineering")) {
    return IT_CLOUD_SOFTWARE_ENG;
  }
  if (normSub.includes("database management")) {
    return IT_CLOUD_SOFTWARE_ENG;
  }

  // TensorFlow / NumPy
  if (normSub.includes("tensorflow")) {
    return TENSORFLOW_NUMPY_BANK;
  }
  if (normSub.includes("numpy")) {
    return TENSORFLOW_NUMPY_BANK;
  }

  // Chemical Engineering Subjects
  if (normSub.includes("chemical thermo") || (normSub.includes("thermo") && normBranch.includes("chem"))) {
    return CHEMICAL_THERMODYNAMICS;
  }
  if (normSub.includes("fluid") && (normBranch.includes("chem") || normSub.includes("chemical"))) {
    return FLUID_MECHANICS_CHEM;
  }
  if (normSub.includes("heat transfer")) {
    return HEAT_TRANSFER_CHEM;
  }
  if (normSub.includes("mass transfer")) {
    return MASS_TRANSFER_CHEM;
  }
  if (normSub.includes("reaction") || normSub.includes("cre")) {
    return CHEMICAL_REACTION_ENG;
  }
  if (normSub.includes("process control") || normSub.includes("control engineering")) {
    return PROCESS_CONTROL_CHEM;
  }

  // Data Science & AI/ML Subjects
  if (normSub === "sql" || normSub.includes("sql")) {
    return SQL_DATA_SCIENCE;
  }
  if (normSub.includes("statistic")) {
    return STATISTICS_DS;
  }
  if (normSub.includes("deep learning")) {
    return DEEP_LEARNING_AIML;
  }
  if (normSub.includes("machine learning")) {
    return MACHINE_LEARNING_DS;
  }
  if (normSub.includes("math") && (normSub.includes("ai") || normBranch.includes("ai") || normBranch.includes("ml"))) {
    return MATH_FOR_AIML;
  }
  if (normSub.includes("python") && (normBranch.includes("data science") || normBranch.includes("ai") || normBranch.includes("machine"))) {
    return DATA_SCIENCE_PYTHON;
  }
  if (normSub.includes("pandas") || normSub.includes("data analysis") || normSub.includes("visualization")) {
    return DATA_SCIENCE_PYTHON;
  }

  return null;
}
