import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// ✅ Hardcoded Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsXposBSU6ihgPvU9_A1Oblzl5dfhixmY",
  appId: "1:495203902677:web:78dc89bfda88ca5daf6e5c",
  authDomain: "midnight-explorer-df5bf.firebaseapp.com",
  databaseURL: "",
  messagingSenderId: "495203902677",
  projectId: "midnight-explorer-df5bf",
  storageBucket: "midnight-explorer-df5bf.firebasestorage.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Optional: connect to Firestore emulator if running locally
if (process.env.REACT_APP_FIREBASE_USE_EMULATOR === "true") {
  connectFirestoreEmulator(db, "localhost", 8080);
}

export { db };
