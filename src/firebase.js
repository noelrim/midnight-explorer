import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Try to use the Firebase App Hosting WEBAPP config if available
const firebaseConfigString = process.env.FIREBASE_WEBAPP_CONFIG; // <-- Use FIREBASE_WEBAPP_CONFIG here!
console.log("Value of process.env.FIREBASE_WEBAPP_CONFIG:", firebaseConfigString); // Log the correct variable

let firebaseConfig;

if (firebaseConfigString) {
  try {
    console.log("Using Firebase App Hosting WEBAPP config");
    firebaseConfig = JSON.parse(firebaseConfigString);
  } catch (e) {
    console.error("Failed to parse FIREBASE_WEBAPP_CONFIG:", e);
    // Decide how to handle this error - maybe re-throw or use a default config?
    throw new Error("Invalid Firebase web app configuration format.");
  }
} else {
  console.log("FALLBACK DEV ENV");
  // Fallback for local development using .env variables
  // Make sure your .env variables match the structure needed by firebase/app
  firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    // measurementId might also be here if you use Analytics
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  };
  // You might want a check here to ensure required local env vars are set
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
       console.error("Missing required Firebase config variables in local environment.");
       // Handle this case appropriately for your local setup
  }
}

// Ensure firebaseConfig object is valid before initializing
if (!firebaseConfig || !firebaseConfig.projectId || !firebaseConfig.appId) {
    console.error("Firebase config is missing required properties.");
    // You might want to throw an error or handle this gracefully
    // depending on your app's needs if it can't initialize Firebase.
} else {
    console.log("Initializing Firebase app with config:", firebaseConfig);
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Optional: connect to Firestore emulator if set
    if (process.env.REACT_APP_FIREBASE_USE_EMULATOR === "true") {
      // Make sure you handle the emulator host/port if needed
      console.log("Connecting to Firestore emulator on localhost:8080");
      connectFirestoreEmulator(db, "localhost", 8080);
    }

    export { db };
}

// You might need to export 'app' as well if you use other services like Auth or Storage
// export { app, db };

