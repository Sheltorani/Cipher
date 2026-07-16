// ==========================================
// CIPHER - Firebase Configuration
// ==========================================
// This file sets up Firebase for production
// Currently using localStorage for demo
// Replace with your Firebase config when ready

// TODO: Add your Firebase config from Firebase Console
// Go to: https://console.firebase.google.com
// Project Settings → Service Accounts → Generate New Private Key

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase (only when config is complete)
// Uncomment when you have real Firebase config
/*
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
*/

console.log("Firebase config loaded. Using localStorage for demo.");
