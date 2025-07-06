import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Decide whether we are in local mode based on environment
const isLocal = process.env.FIREBASE_USE_EMULATOR === "true";

// Choose config based on environment
const firebaseConfig =  JSON.parse(process.env.FIREBASE_CONFIG);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Use Firestore emulator in local dev mode
if (isLocal) {
  console.log("🟡 Connecting to Firestore Emulator at localhost:8080");
  connectFirestoreEmulator(db, "localhost", 8080);
}

export { db };