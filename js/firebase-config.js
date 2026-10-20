/**
 * Firebase Configuration for QuizGenius
 * 
 * Replace placeholder values below with your Firebase project credentials
 * from the Firebase Console (Project Settings > General > Your apps > SDK setup/config).
 */

export const firebaseConfig = {
  apiKey: "AIzaSyDemo-QuizGeniusKeyPlaceholder12345",
  authDomain: "quizgenius-app-demo.firebaseapp.com",
  projectId: "quizgenius-app-demo",
  storageBucket: "quizgenius-app-demo.appspot.com",
  messagingSenderId: "109876543210",
  appId: "1:109876543210:web:abcdef1234567890"
};

// Check if Firebase credentials have been configured with real project keys
export function isFirebaseConfigured() {
  return (
    Boolean(firebaseConfig.apiKey) &&
    !firebaseConfig.apiKey.includes("Placeholder") &&
    Boolean(firebaseConfig.projectId) &&
    !firebaseConfig.projectId.includes("demo")
  );
}

export const COLLECTIONS = {
  STUDENTS: "students",
  QUIZ_RESULTS: "quizResults",
  APTITUDE_RESULTS: "aptitudeResults",
  GATE_RESULTS: "gateResults",
  DAILY_QUIZZES: "dailyQuizzes",
  QUESTION_HISTORY: "questionHistory"
};
