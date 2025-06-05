import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Decide whether we are in local mode based on environment
const isLocal = process.env.REACT_APP_FIREBASE_USE_EMULATOR === "true";

// Choose config based on environment
const firebaseConfig = isLocal
  ? {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "local-api-key",
      authDomain: "localhost",
      projectId: "midnight-explorer",
      storageBucket: "",
      messagingSenderId: "",
      appId: "",
    }
  : {
      apiKey: "AIzaSyDsXposBSU6ihgPvU9_A1Oblzl5dfhixmY",
      appId: "1:495203902677:web:78dc89bfda88ca5daf6e5c",
      authDomain: "midnight-explorer-df5bf.firebaseapp.com",
      projectId: "midnight-explorer-df5bf",
      storageBucket: "midnight-explorer-df5bf.appspot.com",
      messagingSenderId: "495203902677",
    };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Use Firestore emulator in local dev mode
if (isLocal) {
  console.log("🟡 Connecting to Firestore Emulator at localhost:8080");
  connectFirestoreEmulator(db, "localhost", 8080);
}

export { db };