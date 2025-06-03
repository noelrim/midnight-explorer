import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Try to use the Firebase App Hosting config if available
const firebaseConfigString = process.env.FIREBASE_CONFIG;

let firebaseConfig;

if (firebaseConfigString) {
  try {
    firebaseConfig = JSON.parse(firebaseConfigString);
  } catch (e) {
    console.error("Failed to parse FIREBASE_CONFIG:", e);
    throw new Error("Invalid Firebase configuration format.");
  }
} else {
  // Fallback for local development using .env variables
  firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  };
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Optional: connect to Firestore emulator if set
if (process.env.REACT_APP_FIREBASE_USE_EMULATOR === "true") {
  connectFirestoreEmulator(db, "localhost", 8080);
}

export { db };
