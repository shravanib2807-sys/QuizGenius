/**
 * Authentication and Data Access Layer for QuizGenius
 * Supports Firebase Authentication and Firestore with local persistence fallback.
 */

import { firebaseConfig, isFirebaseConfigured, COLLECTIONS } from "./firebase-config.js";

let authInstance = null;
let firestoreInstance = null;
let firebaseInitialized = false;

// Initialize Firebase if configured
export async function initFirebase() {
  if (firebaseInitialized) return { auth: authInstance, db: firestoreInstance };

  if (isFirebaseConfigured()) {
    try {
      const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
      const { getAuth } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
      const { getFirestore } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");

      const app = initializeApp(firebaseConfig);
      authInstance = getAuth(app);
      firestoreInstance = getFirestore(app);
      firebaseInitialized = true;
      console.log("Firebase services initialized successfully.");
    } catch (err) {
      console.warn("Firebase initialization encountered an issue. Using client persistence:", err);
    }
  }

  return { auth: authInstance, db: firestoreInstance };
}

// Utility: Stable normalization and hashing for question history tracking
export function normalizeQuestion(text) {
  if (!text) return "";
  const raw = typeof text === "string" ? text : (text?.questionText || text?.question || String(text));
  let norm = String(raw).trim().toLowerCase().replace(/\s+/g, " ");
  // Remove punctuation (smart quotes, trailing punctuation, brackets, colons)
  norm = norm.replace(/[\?.,:;'"“”‘’`()[\]{}]/g, " ").replace(/\s+/g, " ").trim();
  return norm;
}

export function getQuestionHash(text) {
  const norm = normalizeQuestion(text);
  if (!norm) return "0";
  let hash = 5381;
  for (let i = 0; i < norm.length; i++) {
    hash = ((hash << 5) + hash) + norm.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export function hashString(str) {
  return getQuestionHash(str);
}

// 1. Current Session State
export function getCurrentStudent() {
  const raw = localStorage.getItem("quizgenius_current_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    localStorage.removeItem("quizgenius_current_user");
    return null;
  }
}

// 2. Authentication Protection
export function checkAuthProtection() {
  const current = getCurrentStudent();
  if (!current) {
    sessionStorage.clear();
    // Redirect unauthenticated user immediately
    window.location.replace("login.html");
    return null;
  }
  return current;
}

// Reusable Authentication Protection with Firebase listener and back-button / pageshow check
export function initAuthProtection(onAuthenticated) {
  const current = checkAuthProtection();
  if (!current) return;

  // Monitor pageshow (browser back/forward button cache restoration)
  window.addEventListener("pageshow", (event) => {
    const student = getCurrentStudent();
    if (!student) {
      window.location.replace("login.html?msg=logged_out");
    }
  });

  window.addEventListener("popstate", () => {
    const student = getCurrentStudent();
    if (!student) {
      window.location.replace("login.html?msg=logged_out");
    }
  });

  // If live Firebase auth is active, listen to onAuthStateChanged
  initFirebase().then(({ auth }) => {
    if (auth && !current.isDemo) {
      import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js").then(({ onAuthStateChanged }) => {
        onAuthStateChanged(auth, (user) => {
          if (!user) {
            localStorage.removeItem("quizgenius_current_user");
            sessionStorage.clear();
            window.location.replace("login.html?msg=logged_out");
          }
        });
      }).catch((e) => console.warn("onAuthStateChanged setup issue:", e));
    }
  });

  if (typeof onAuthenticated === "function") {
    onAuthenticated(current);
  }
}

// 3. Register Student (Automatically starts 15-day free trial)
export async function registerStudent(name, email, password, branch) {
  await initFirebase();

  const now = new Date();
  const trialStartDate = now.toISOString();
  // Exact 15 days free trial (15 * 24 * 60 * 60 * 1000 ms)
  const trialEndDate = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString();
  const subscriptionEndDate = trialEndDate;

  let uid = "usr_" + Date.now();
  let studentData = {
    uid,
    name,
    email,
    branch,
    createdAt: trialStartDate,
    trialStartDate,
    trialEndDate,
    subscriptionStatus: "trial",
    subscriptionEndDate,
    isDemo: true
  };

  if (firebaseInitialized && authInstance) {
    try {
      const { createUserWithEmailAndPassword, updateProfile } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
      const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
      uid = userCredential.user.uid;

      await updateProfile(userCredential.user, { displayName: name });

      studentData = {
        uid,
        name,
        email,
        branch,
        createdAt: trialStartDate,
        trialStartDate,
        trialEndDate,
        subscriptionStatus: "trial",
        subscriptionEndDate,
        isDemo: false
      };

      if (firestoreInstance) {
        const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
        await setDoc(doc(firestoreInstance, COLLECTIONS.STUDENTS, uid), studentData);
      }
    } catch (err) {
      console.warn("Live Firebase registration failed, using local registration:", err);
      studentData.isDemo = true;
    }
  }

  // Save in local storage
  const usersRaw = localStorage.getItem("quizgenius_users") || "[]";
  const users = JSON.parse(usersRaw);
  users.push({ ...studentData, password });
  localStorage.setItem("quizgenius_users", JSON.stringify(users));

  // Set active session
  localStorage.setItem("quizgenius_current_user", JSON.stringify(studentData));
  return studentData;
}

// 4. Login Student
export async function loginStudent(email, password) {
  await initFirebase();

  let studentData = null;

  if (firebaseInitialized && authInstance) {
    try {
      const { signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
      const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
      const uid = userCredential.user.uid;

      studentData = {
        uid,
        name: userCredential.user.displayName || "Student",
        email: userCredential.user.email,
        branch: "Computer Science Engineering",
        createdAt: new Date().toISOString(),
        isDemo: false
      };

      if (firestoreInstance) {
        try {
          const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
          const snap = await getDoc(doc(firestoreInstance, COLLECTIONS.STUDENTS, uid));
          if (snap.exists()) {
            studentData = { ...studentData, ...snap.data() };
          }
        } catch (dbErr) {
          console.warn("Could not read student profile from Firestore:", dbErr);
        }
      }
    } catch (err) {
      console.warn("Firebase sign in failed, checking local users:", err);
    }
  }

  // Check local demo users if not authenticated through Firebase
  if (!studentData) {
    const usersRaw = localStorage.getItem("quizgenius_users") || "[]";
    const users = JSON.parse(usersRaw);
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (found) {
      if (found.password && found.password !== password) {
        throw new Error("Incorrect password. Please try again.");
      }
      studentData = {
        uid: found.uid,
        name: found.name,
        email: found.email,
        branch: found.branch || "Computer Science Engineering",
        createdAt: found.createdAt || new Date().toISOString(),
        trialStartDate: found.trialStartDate || found.createdAt || new Date().toISOString(),
        subscriptionStatus: found.subscriptionStatus || "trial",
        subscriptionEndDate: found.subscriptionEndDate || new Date(new Date(found.createdAt || Date.now()).getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        isDemo: true
      };
    } else {
      // Default demo student credentials for instant testing
      if (email.toLowerCase().includes("shravani") || email.toLowerCase().includes("student")) {
        const demoCreated = new Date().toISOString();
        studentData = {
          uid: "demo_shravani_cse",
          name: "Shravani",
          email: email,
          branch: "Computer Science Engineering",
          createdAt: demoCreated,
          trialStartDate: demoCreated,
          subscriptionStatus: "trial",
          subscriptionEndDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          isDemo: true
        };
      } else {
        throw new Error("User account not found. Please register an account first.");
      }
    }
  }

  // Ensure trial dates exist and are never reset upon logging in
  if (!studentData.trialStartDate) {
    studentData.trialStartDate = studentData.createdAt || new Date().toISOString();
  }
  if (!studentData.subscriptionEndDate) {
    const startMs = new Date(studentData.trialStartDate).getTime() || Date.now();
    studentData.subscriptionEndDate = new Date(startMs + 15 * 24 * 60 * 60 * 1000).toISOString();
  }
  if (!studentData.subscriptionStatus) {
    studentData.subscriptionStatus = "trial";
  }

  // Check trial expiration automatically
  const subStatus = checkSubscriptionStatus(studentData);
  if (subStatus.status === "expired" && studentData.subscriptionStatus !== "expired") {
    studentData.subscriptionStatus = "expired";
    // Sync to Firestore
    syncSubscriptionToFirestore(studentData.uid, "expired", studentData.subscriptionEndDate);
  }

  localStorage.setItem("quizgenius_current_user", JSON.stringify(studentData));
  return studentData;
}

// 5. Logout Student (Requirement 1: Real Firebase signOut & complete session clearance)
export async function logoutStudent() {
  try {
    const { auth } = await initFirebase();
    if (auth) {
      const { signOut } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
      await signOut(auth);
      console.log("Firebase user signed out successfully with signOut(auth).");
    }
  } catch (e) {
    console.warn("Firebase sign out error:", e);
  } finally {
    // Clear all user session and state
    localStorage.removeItem("quizgenius_current_user");
    sessionStorage.clear();

    // Use replace to prevent back button from navigating back to protected pages
    window.location.replace("login.html?msg=logged_out");
  }
}

// Global exposure for any template triggers
if (typeof window !== "undefined") {
  window.logoutStudent = logoutStudent;
  window.logout = logoutStudent;
}

// 6. Update Profile
export async function updateStudentProfile(name, branch) {
  const current = getCurrentStudent();
  if (!current) throw new Error("No student currently logged in");

  const updated = {
    ...current,
    name,
    branch
  };

  await initFirebase();

  if (firebaseInitialized && firestoreInstance && !current.isDemo) {
    try {
      const { doc, updateDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      await updateDoc(doc(firestoreInstance, COLLECTIONS.STUDENTS, current.uid), {
        name,
        branch
      });
    } catch (err) {
      console.warn("Error updating Firestore document:", err);
    }
  }

  // Update in local demo list too
  const usersRaw = localStorage.getItem("quizgenius_users") || "[]";
  const users = JSON.parse(usersRaw);
  const idx = users.findIndex((u) => u.uid === current.uid);
  if (idx !== -1) {
    users[idx].name = name;
    users[idx].branch = branch;
    localStorage.setItem("quizgenius_users", JSON.stringify(users));
  }

  localStorage.setItem("quizgenius_current_user", JSON.stringify(updated));
  return updated;
}

// 6b. Subscription & 15-Day Free Trial Management
export function checkSubscriptionStatus(student) {
  const current = student || getCurrentStudent();
  if (!current) {
    return {
      status: "unauthenticated",
      isAllowed: false,
      daysRemaining: 0,
      label: "Not logged in",
      trialStartDate: null,
      subscriptionEndDate: null
    };
  }

  const now = Date.now();
  const trialStart = current.trialStartDate || current.createdAt || new Date().toISOString();
  const rawEndDate = current.subscriptionEndDate;
  const endMs = rawEndDate
    ? new Date(rawEndDate).getTime()
    : new Date(trialStart).getTime() + 15 * 24 * 60 * 60 * 1000;
  const subscriptionEndDate = new Date(endMs).toISOString();

  // Active paid subscription
  if (current.subscriptionStatus === "active") {
    if (now <= endMs) {
      const daysRemaining = Math.max(1, Math.ceil((endMs - now) / (1000 * 60 * 60 * 24)));
      return {
        status: "active",
        isAllowed: true,
        daysRemaining,
        label: "Premium Active",
        trialStartDate: trialStart,
        trialEndDate: subscriptionEndDate,
        subscriptionEndDate
      };
    } else {
      return {
        status: "expired",
        isAllowed: false,
        daysRemaining: 0,
        label: "Subscription Expired",
        trialStartDate: trialStart,
        trialEndDate: subscriptionEndDate,
        subscriptionEndDate
      };
    }
  }

  // 15-Day Free Trial
  if (now <= endMs && current.subscriptionStatus !== "expired") {
    const daysRemaining = Math.max(1, Math.ceil((endMs - now) / (1000 * 60 * 60 * 24)));
    return {
      status: "trial",
      isAllowed: true,
      daysRemaining,
      label: `15-Day Free Trial (${daysRemaining} day${daysRemaining === 1 ? "" : "s"} left)`,
      trialStartDate: trialStart,
      trialEndDate: subscriptionEndDate,
      subscriptionEndDate
    };
  }

  // Trial expired
  return {
    status: "expired",
    isAllowed: false,
    daysRemaining: 0,
    label: "Free Trial Expired",
    trialStartDate: trialStart,
    trialEndDate: subscriptionEndDate,
    subscriptionEndDate
  };
}

export async function syncSubscriptionToFirestore(uid, status, endDate) {
  try {
    await initFirebase();
    if (firebaseInitialized && firestoreInstance && uid && !uid.startsWith("demo_")) {
      const { doc, updateDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      await updateDoc(doc(firestoreInstance, COLLECTIONS.STUDENTS, uid), {
        subscriptionStatus: status,
        subscriptionEndDate: endDate
      });
    }
  } catch (err) {
    console.warn("Could not sync subscription to Firestore:", err);
  }
}

// Reusable subscription/trial access enforcement check
export function enforceQuizAccess(featureName = "Quiz") {
  const current = getCurrentStudent();
  if (!current) {
    window.location.replace("login.html");
    return false;
  }

  const sub = checkSubscriptionStatus(current);
  if (!sub.isAllowed) {
    // Automatically redirect to upgrade page with trial expired explanation
    window.location.replace(`upgrade.html?reason=expired&feature=${encodeURIComponent(featureName)}`);
    return false;
  }
  return true;
}

// Activate Paid Subscription (payment gateway integration ready)
export async function activateSubscription(uid, plan = "monthly", durationDays = 30) {
  const current = getCurrentStudent();
  const targetUid = uid || (current ? current.uid : null);
  if (!targetUid) throw new Error("No user identified to activate subscription");

  const now = new Date();
  const subscriptionEndDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString();
  const subscriptionStatus = "active";

  const updated = current && current.uid === targetUid
    ? { ...current, subscriptionStatus, subscriptionEndDate, planId: plan }
    : null;

  if (updated) {
    localStorage.setItem("quizgenius_current_user", JSON.stringify(updated));
  }

  // Update in local demo list
  const usersRaw = localStorage.getItem("quizgenius_users") || "[]";
  const users = JSON.parse(usersRaw);
  const idx = users.findIndex((u) => u.uid === targetUid);
  if (idx !== -1) {
    users[idx].subscriptionStatus = subscriptionStatus;
    users[idx].subscriptionEndDate = subscriptionEndDate;
    users[idx].planId = plan;
    localStorage.setItem("quizgenius_users", JSON.stringify(users));
  }

  // Sync to Firestore
  await syncSubscriptionToFirestore(targetUid, subscriptionStatus, subscriptionEndDate);

  return { success: true, subscriptionStatus, subscriptionEndDate };
}

// 7. Save Test Result (Quiz, Aptitude, or GATE - only for completed/submitted tests)
export async function saveTestResult(resultData) {
  const current = getCurrentStudent();
  const userId = current ? current.uid : "anonymous";
  const payload = {
    ...resultData,
    userId,
    createdAt: new Date().toISOString()
  };

  // Local storage save
  const stored = JSON.parse(localStorage.getItem("quizgenius_results") || "[]");
  stored.unshift(payload);
  localStorage.setItem("quizgenius_results", JSON.stringify(stored));

  // Firebase save if live
  await initFirebase();
  if (firebaseInitialized && firestoreInstance && current && !current.isDemo) {
    try {
      const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      const targetCol =
        resultData.type === "aptitude"
          ? COLLECTIONS.APTITUDE_RESULTS
          : resultData.type === "gate"
          ? (COLLECTIONS.GATE_RESULTS || "gateResults")
          : COLLECTIONS.QUIZ_RESULTS;
      await addDoc(collection(firestoreInstance, targetCol), payload);
    } catch (err) {
      console.warn("Could not save result to Firestore, cached locally:", err);
    }
  }

  return payload;
}

// 8. Get All Results for Student
export function getStudentResults(userId) {
  const all = JSON.parse(localStorage.getItem("quizgenius_results") || "[]");
  if (!userId) return all;
  return all.filter((r) => r.userId === userId || r.userId === "anonymous");
}

// 9. Daily Quizzes Storage (Requirement 8, 9, 10: dailyQuizzes/{dailyQuizId})
export async function getDailyQuiz(dailyQuizId) {
  // 1. Check local storage cache
  const localRaw = localStorage.getItem("quizgenius_daily_" + dailyQuizId);
  if (localRaw) {
    try {
      return JSON.parse(localRaw);
    } catch (e) {}
  }

  // 2. Check Firestore if active
  await initFirebase();
  if (firebaseInitialized && firestoreInstance) {
    try {
      const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      const snap = await getDoc(doc(firestoreInstance, COLLECTIONS.DAILY_QUIZZES, dailyQuizId));
      if (snap.exists()) {
        const data = snap.data();
        localStorage.setItem("quizgenius_daily_" + dailyQuizId, JSON.stringify(data));
        return data;
      }
    } catch (err) {
      console.warn("Could not fetch daily quiz from Firestore:", err);
    }
  }

  return null;
}

export async function saveDailyQuiz(dailyQuizId, quizData) {
  // 1. Cache locally
  localStorage.setItem("quizgenius_daily_" + dailyQuizId, JSON.stringify(quizData));

  // 2. Store in Firestore if active
  await initFirebase();
  if (firebaseInitialized && firestoreInstance) {
    try {
      const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      await setDoc(doc(firestoreInstance, COLLECTIONS.DAILY_QUIZZES, dailyQuizId), quizData);
    } catch (err) {
      console.warn("Could not save daily quiz to Firestore:", err);
    }
  }
}

// 10. Question History Storage & Two-Level Duplicate Protection
export function canonicalizeText(text) {
  if (!text) return "";
  let clean = String(text).trim().toLowerCase();
  clean = clean.replace(/%/g, " percent ").replace(/percentage/g, " percent ");
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
  return clean.replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}

const STOP_WORDS = new Set([
  "the", "is", "of", "in", "and", "to", "what", "will", "be", "by",
  "this", "following", "python", "code", "snippet", "script", "print",
  "output", "value", "result", "program", "given", "consider", "expression",
  "statement", "which", "how", "does", "would", "from", "with", "that",
  "for", "when", "executed", "run", "produce", "display", "evaluate"
]);

export function maskNumbers(text) {
  if (!text) return "";
  return String(text)
    .replace(/[-+]?\b\d+(?:\.\d+)?%?\b/g, " NUM ")
    .replace(/\b\d+\b/g, " NUM ");
}

export function canonicalizeTemplate(text) {
  if (!text) return "";
  const masked = maskNumbers(text);
  return canonicalizeText(masked);
}

export function areQuestionsDuplicate(text1, text2) {
  if (!text1 || !text2) return false;
  const raw1 = String(text1).trim().toLowerCase().replace(/\s+/g, " ");
  const raw2 = String(text2).trim().toLowerCase().replace(/\s+/g, " ");
  if (raw1 === raw2) return true;

  const norm1 = normalizeQuestion(text1);
  const norm2 = normalizeQuestion(text2);
  if (norm1 && norm2 && norm1 === norm2) return true;

  const hash1 = getQuestionHash(text1);
  const hash2 = getQuestionHash(text2);
  if (hash1 && hash2 && hash1 === hash2) return true;

  const canon1 = canonicalizeText(text1);
  const canon2 = canonicalizeText(text2);
  if (canon1 && canon2 && canon1 === canon2) return true;

  // 1. Template-level duplicate check (masks numbers to detect same-format questions)
  const tmpl1 = canonicalizeTemplate(text1);
  const tmpl2 = canonicalizeTemplate(text2);
  if (tmpl1 && tmpl2 && tmpl1 === tmpl2) return true;

  // Extract all numbers
  const nums1 = (String(text1).match(/\d+(?:\.\d+)?/g) || []).map(Number).sort((a, b) => a - b);
  const nums2 = (String(text2).match(/\d+(?:\.\d+)?/g) || []).map(Number).sort((a, b) => a - b);
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
  return union > 0 && common / union >= 0.70;
}

/**
 * Universal Question History Retrieval:
 * Supports querying by complete context:
 * (userId, { branch, subject, difficulty, quizType }) OR (userId, subject, difficulty, branch, quizType)
 * Queries both permanent localStorage and Firestore cloud collection.
 * Never resets by date or midnight.
 * Crucial teacher requirement: Prevents question repetition across all difficulties (Easy -> Medium -> Hard).
 */
export async function getQuestionHistory(userId, optionsOrSubject, difficulty, branch, quizType) {
  const userKey = userId || "guest";
  const historyKey = "quizgenius_qhistory_" + userKey;

  let optBranch = "";
  let optSubject = "";
  let optDifficulty = "";
  let optQuizType = "";
  let strictDifficulty = false;

  if (optionsOrSubject && typeof optionsOrSubject === "object") {
    optBranch = optionsOrSubject.branch || "";
    optSubject = optionsOrSubject.subject || "";
    optDifficulty = optionsOrSubject.difficulty || "";
    optQuizType = optionsOrSubject.quizType || "";
    strictDifficulty = !!optionsOrSubject.strictDifficulty;
  } else {
    optSubject = optionsOrSubject || "";
    optDifficulty = difficulty || "";
    optBranch = branch || "";
    optQuizType = quizType || "";
  }

  let localHistory = [];
  try {
    const raw = localStorage.getItem(historyKey);
    if (raw) {
      localHistory = JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error reading local question history:", e);
    // Do NOT assume empty if reading failed due to critical storage error
    throw new Error("Unable to retrieve local question history safely. Aborting to prevent question repetition.");
  }

  const normSub = optSubject ? optSubject.toLowerCase().trim() : "";
  const normDiff = (strictDifficulty && optDifficulty) ? optDifficulty.toLowerCase().trim() : "";
  const normBranch = optBranch ? optBranch.toLowerCase().trim() : "";
  const normType = optQuizType ? optQuizType.toLowerCase().trim() : "";

  let filtered = localHistory.filter((h) => {
    // Subject matching: match subject or language
    if (normSub) {
      const itemSub = (h.subject || "").toLowerCase().trim();
      const itemLang = (h.language || "").toLowerCase().trim();
      const matchSub =
        itemSub === normSub ||
        itemLang === normSub ||
        itemSub.includes(normSub) ||
        normSub.includes(itemSub);
      if (!matchSub) return false;
    }

    // Difficulty matching: By default, ignore difficulty so that questions answered in Easy
    // are still remembered and excluded in Medium and Hard!
    if (strictDifficulty && normDiff) {
      const itemDiff = (h.difficulty || "medium").toLowerCase().trim();
      if (itemDiff !== normDiff) return false;
    }

    // Branch matching: when specified, ensure branch matches
    if (normBranch && h.branch) {
      const itemBranch = (h.branch || "").toLowerCase().trim();
      if (itemBranch !== normBranch && !itemBranch.includes(normBranch) && !normBranch.includes(itemBranch)) {
        return false;
      }
    }

    // QuizType matching (e.g. "technical", "aptitude", "gate")
    if (normType && h.quizType) {
      if (h.quizType.toLowerCase().trim() !== normType) return false;
    }

    return true;
  });

  // Query Firestore cloud questionHistory collection for this user (persistent across devices, logouts, and days)
  await initFirebase();
  if (firebaseInitialized && firestoreInstance && userId && userId !== "guest") {
    try {
      const { collection, query, where, getDocs, limit } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      const q = query(
        collection(firestoreInstance, COLLECTIONS.QUESTION_HISTORY),
        where("userId", "==", userId),
        limit(2500)
      );
      const snap = await getDocs(q);
      const seenHashes = new Set(filtered.map((f) => f.questionHash || getQuestionHash(f.questionText || f.question)));

      snap.forEach((docSnap) => {
        const item = docSnap.data();
        if (!item) return;

        // Subject matching
        if (normSub) {
          const itemSub = (item.subject || "").toLowerCase().trim();
          const itemLang = (item.language || "").toLowerCase().trim();
          const matchSub =
            itemSub === normSub ||
            itemLang === normSub ||
            itemSub.includes(normSub) ||
            normSub.includes(itemSub);
          if (!matchSub) return;
        }

        // Difficulty matching: remembered across difficulties
        if (strictDifficulty && normDiff) {
          const itemDiff = (item.difficulty || "medium").toLowerCase().trim();
          if (itemDiff !== normDiff) return;
        }

        // Branch matching
        if (normBranch && item.branch) {
          const itemBranch = (item.branch || "").toLowerCase().trim();
          if (itemBranch !== normBranch && !itemBranch.includes(normBranch) && !normBranch.includes(itemBranch)) {
            return;
          }
        }

        // QuizType matching
        if (normType && item.quizType) {
          if (item.quizType.toLowerCase().trim() !== normType) return;
        }

        const qh = item.questionHash || getQuestionHash(item.questionText || item.question);
        if (!seenHashes.has(qh)) {
          seenHashes.add(qh);
          filtered.push(item);
        }
      });
    } catch (err) {
      console.warn("Could not query Firestore question history, relying on local persistent cache:", err);
    }
  }

  return filtered;
}

/**
 * Returns all questions solved by this student in the given context
 * AND also checks student's global history so no question ever repeats.
 */
export async function getQuestionHistoryTexts(userId, optionsOrSubject, difficulty, branch, quizType) {
  let optBranch = "";
  let optSubject = "";
  let optDifficulty = "";
  let optQuizType = "";

  if (optionsOrSubject && typeof optionsOrSubject === "object") {
    optBranch = optionsOrSubject.branch || "";
    optSubject = optionsOrSubject.subject || "";
    optDifficulty = optionsOrSubject.difficulty || "";
    optQuizType = optionsOrSubject.quizType || "";
  } else {
    optSubject = optionsOrSubject || "";
    optDifficulty = difficulty || "";
    optBranch = branch || "";
    optQuizType = quizType || "";
  }

  // 1. Fetch history across all difficulties so changing difficulty remembers previous questions
  const history = await getQuestionHistory(userId, {
    branch: optBranch,
    subject: optSubject,
    quizType: optQuizType,
    ignoreDifficulty: true
  });
  const seenNorm = new Set();
  const contextTexts = [];

  for (const h of history) {
    const t = (h.questionText || h.question || "").trim();
    if (!t) continue;
    const norm = t.toLowerCase().replace(/\s+/g, " ");
    if (!seenNorm.has(norm)) {
      seenNorm.add(norm);
      contextTexts.push(t);
    }
  }

  // 2. Also ensure any questions answered by this student for this subject are excluded
  // satisfying: "A question answered by a student must not appear again for the same subject"
  if (optSubject) {
    const subjectHistory = await getQuestionHistory(userId, {
      branch: optBranch,
      subject: optSubject,
      quizType: optQuizType
    });
    for (const h of subjectHistory) {
      const t = (h.questionText || h.question || "").trim();
      if (!t) continue;
      const norm = t.toLowerCase().replace(/\s+/g, " ");
      if (!seenNorm.has(norm)) {
        seenNorm.add(norm);
        contextTexts.push(t);
      }
    }
  }

  return contextTexts;
}

/**
 * Permanent Question History Saver:
 * Stores complete context:
 * studentId, branch, subject, difficulty, quizType, questionText, questionHash, quizSessionId, createdAt
 * Writes to both permanent localStorage and Firestore.
 */
export async function saveQuestionHistory(dataOrUserId, subject, difficulty, questions, date, options = {}) {
  let userId = "guest";
  let quizSessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  let branch = "";
  let targetSubject = "General";
  let targetLang = "";
  let targetDiff = "Medium";
  let targetQuizType = "technical";
  let qList = [];

  if (dataOrUserId && typeof dataOrUserId === "object" && !Array.isArray(dataOrUserId)) {
    userId = dataOrUserId.userId || dataOrUserId.studentId || "guest";
    quizSessionId = dataOrUserId.quizSessionId || quizSessionId;
    branch = dataOrUserId.branch || "";
    targetSubject = dataOrUserId.subject || "General";
    targetLang = dataOrUserId.language || targetSubject;
    targetDiff = dataOrUserId.difficulty || "Medium";
    targetQuizType = dataOrUserId.quizType || "technical";
    qList = Array.isArray(dataOrUserId.questions) ? dataOrUserId.questions : [];
  } else {
    userId = dataOrUserId || "guest";
    targetSubject = subject || "General";
    targetLang = options.language || targetSubject;
    targetDiff = difficulty || "Medium";
    qList = Array.isArray(questions) ? questions : [];
    quizSessionId = options.quizSessionId || quizSessionId;
    branch = options.branch || "";
    targetQuizType = options.quizType || "technical";
  }

  if (!qList || qList.length === 0) return;

  const historyKey = "quizgenius_qhistory_" + userId;
  let localHistory = [];
  try {
    localHistory = JSON.parse(localStorage.getItem(historyKey) || "[]");
  } catch (e) {
    localHistory = [];
  }

  await initFirebase();
  const seenLocalHashes = new Set(localHistory.map((h) => h.questionHash || getQuestionHash(h.questionText || h.question)));

  for (const q of qList) {
    const qText = typeof q === "string" ? q.trim() : (q?.questionText || q?.question || "").trim();
    if (!qText) continue;

    const qHash = getQuestionHash(qText);
    const entry = {
      userId,
      studentId: userId,
      quizSessionId,
      branch,
      subject: targetSubject,
      language: targetLang,
      difficulty: targetDiff,
      quizType: targetQuizType,
      questionHash: qHash,
      questionText: qText,
      createdAt: new Date().toISOString()
    };

    if (!seenLocalHashes.has(qHash)) {
      seenLocalHashes.add(qHash);
      localHistory.push(entry);
    }

    if (firebaseInitialized && firestoreInstance && userId && userId !== "guest") {
      try {
        const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
        await addDoc(collection(firestoreInstance, COLLECTIONS.QUESTION_HISTORY), entry);
      } catch (e) {
        console.warn("Could not save question history item to Firestore, saved to local cache:", e);
      }
    }
  }

  // Permanent storage: maintain full history without date resetting
  try {
    localStorage.setItem(historyKey, JSON.stringify(localHistory));
  } catch (e) {
    console.warn("LocalStorage save notice:", e);
  }
}
