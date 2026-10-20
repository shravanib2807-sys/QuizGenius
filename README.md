# QuizGenius — AI-Powered Interactive Quiz & Aptitude Platform

QuizGenius is a modern, responsive web application engineered for university students across multiple engineering branches (Computer Science, Information Technology, Electronics & Telecommunication, Electrical, Mechanical, and Civil Engineering).

The platform features:
- **Exact Homepage**: Aesthetic landing interface with high-contrast typography and interactive quiz preview.
- **Student Authentication**: Secure sign-up, login, and profile management with Firebase Authentication & Firestore (plus zero-configuration Demo Mode for instant local testing).
- **Branch-Based AI Recommendation System**: Dynamically curates programming languages, core technical subjects, and learning roadmaps tailored to each engineering student's discipline.
- **AI Technical Quizzes**: Timed interactive quizzes generating MCQs with instant feedback and pedagogical explanations.
- **Comprehensive Aptitude Platform**: Quantitative Aptitude, Logical Reasoning, and Verbal Ability tests for campus placement and GATE preparation.
- **AI Performance Analysis**: Evaluates student results to isolate strong topics, areas needing practice, and actionable recommendations.
- **Progress Tracking**: Tracks attempted quizzes, scores, averages, and historic performance logs.

---

## 🚀 Beginner-Friendly Setup & Deployment Guide

Follow these 10 straightforward steps to run QuizGenius on your machine or deploy it live to the web.

### 1. Install VS Code
- Download and install [Visual Studio Code](https://code.visualstudio.com/) for your operating system (Windows, macOS, or Linux).
- Ensure [Node.js](https://nodejs.org/) (version 18 or higher) is installed on your computer.

### 2. Open the QuizGenius Folder
- Launch VS Code.
- Click **File > Open Folder...** and select the `QuizGenius` project folder.
- Open a terminal inside VS Code by pressing `` Ctrl + ` `` (or **Terminal > New Terminal**).

### 3. Configure Firebase
- Go to the [Firebase Console](https://console.firebase.google.com/).
- Click **Add project** and name your project (e.g. `quizgenius-engineering`).
- Complete the project creation wizard.

### 4. Enable Firebase Authentication
- In your Firebase project dashboard, click **Authentication** in the left sidebar.
- Click **Get Started**.
- Under the **Sign-in method** tab, enable **Email/Password**.
- Click **Save**.

### 5. Create Firestore Database
- In the left sidebar of the Firebase Console, click **Firestore Database**.
- Click **Create database**.
- Choose a location close to your users and start in **Production mode** (or test mode for local development).
- Use the following security rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /students/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /quizResults/{resultId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    match /aptitudeResults/{resultId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

### 6. Add Firebase Configuration
- In Firebase Project Settings, scroll down to **Your apps** and click the **Web icon (`</>`)**.
- Register the web app and copy the `firebaseConfig` object.
- Open `js/firebase-config.js` in VS Code and paste your credentials:
```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```
*(Note: If you leave the placeholder credentials, QuizGenius will automatically run in Demo Mode using local storage persistence so you can test all features immediately!)*

### 7. Configure the AI Backend
- QuizGenius handles AI requests securely via its backend server (`functions/ai-service.ts` and `server.ts`), keeping your API keys completely hidden from the browser.
- Create a `.env` file in the root directory (based on `.env.example`):
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```
- You can get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/).

### 8. Install Required Dependencies
- In the VS Code terminal, run:
```bash
npm install
```

### 9. Run the Project Locally
- Start the development server with:
```bash
npm run dev
```
- Open your browser and navigate to `http://localhost:3000`.
- You can now test registration, login, branch recommendations, technical quizzes, aptitude tests, and AI performance analysis!

### 10. Deploy to Firebase Hosting
- Install the Firebase CLI globally if you haven't already:
```bash
npm install -g firebase-tools
```
- Log in to your Firebase account:
```bash
firebase login
```
- Initialize Firebase Hosting in the root directory:
```bash
firebase init hosting
```
  - Choose **Use an existing project** and pick your project.
  - Set your public directory to `dist`.
  - Configure as single-page app: `Yes`.
- Build the production bundle:
```bash
npm run build
```
- Deploy to the live web:
```bash
firebase deploy --only hosting
```
- Your QuizGenius platform is now live!

---

## 📁 Project Structure

```text
QuizGenius/
│
├── index.html          # Existing aesthetic homepage with working links
├── register.html       # Student sign up & engineering branch selection
├── login.html          # Authentication with credentials & demo autofill
├── dashboard.html      # Welcome greeting, branch recommendations, stats
├── language.html       # Branch-curated languages & core engineering subjects
├── quiz.html           # Interactive technical quiz session with AI generation
├── aptitude.html       # Quantitative, Logical, and Verbal aptitude assessments
├── result.html         # Performance scorecard, meter, & AI analysis
├── profile.html        # View/update student name, branch, & metrics
│
├── css/
│   ├── dashboard.css   # Dashboard styles
│   ├── language.css    # Subject cards & difficulty selectors
│   ├── quiz.css        # Interactive quiz layout & feedback
│   ├── aptitude.css    # Aptitude category tabs & timer
│   ├── result.css      # Scorecard meter & AI analysis grid
│   └── profile.css     # Profile editor & security banner
│
├── js/
│   ├── firebase-config.js  # Firebase configuration & Demo Mode detector
│   ├── auth.js             # Auth state, Firestore integration & fallback
│   ├── register.js         # Student registration & branch validator
│   ├── login.js            # Login handler & error reporter
│   ├── dashboard.js        # Dashboard state & activity manager
│   ├── language.js         # Branch curriculum loader & search
│   ├── quiz.js             # Interactive quiz runner & scoring engine
│   ├── aptitude.js         # Aptitude test manager & timer
│   ├── result.js           # Result visualizer & AI analysis renderer
│   ├── profile.js          # Profile editor & metrics calculator
│   └── ai.js               # Client AI fetch module
│
├── functions/
│   └── ai-service.ts   # Secure server-side Gemini AI integration & fallbacks
│
├── server.ts           # Express server proxy for AI & Vite MPA middleware
├── package.json        # Project manifest & scripts
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Multi-page build configuration
└── README.md           # Documentation & deployment guide
```

---

## 🛡️ Security Best Practices
- **API Key Protection**: AI API keys are never exposed on client HTML/JS files; all requests flow through `/api/ai/*` server endpoints.
- **Password Security**: Passwords are authenticated strictly through Firebase Auth and are never written to Firestore documents.
- **User Isolation**: Firestore rules enforce that students can only read and write their own assessment records.
