import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// ✅ Hardcoded Firebase configuration
 {
  apiKey: "AIzaSyDsXposBSU6ihgPvU9_A1Oblzl5dfhixmY",
  appId: "1:495203902677:web:78dc89bfda88ca5daf6e5c",
  authDomain: "midnight-explorer-df5bf.firebaseapp.com",
  databaseURL: "",
  messagingSenderId: "495203902677",
  projectId: "midnight-explorer-df5bf",
  storageBucket: "midnight-explorer-df5bf.firebasestorage.app",
};
/*
// ✅ Use a regular config object, not cert()
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "localhost", // or your custom domain
  projectId: "midnight-explorer",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};*/

// ✅ Initialize Firebase once
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Connect to Firestore emulator (optional, for local use)
if (process.env.REACT_APP_FIREBASE_USE_EMULATOR === "true") {
  connectFirestoreEmulator(db, "localhost", 8080);
  console.log("Connected to Firestore emulator");
}

export { db };
