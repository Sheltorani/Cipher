// ==========================================
// CIPHER - Real Firebase Configuration
// ==========================================
// IMPORTANT: Update these values with YOUR Firebase Console credentials
// Go to: https://console.firebase.google.com → Your Project → Settings

const firebaseConfig = {
  apiKey: "AIzaSyAqW4kL9xZ3mK8vN2pO5rS1tU4vW6xY7zA",
  authDomain: "cipher-app-live.firebaseapp.com",
  databaseURL: "https://cipher-app-live-default-rtdb.firebaseio.com",
  projectId: "cipher-app-live",
  storageBucket: "cipher-app-live.appspot.com",
  messagingSenderId: "234567890123",
  appId: "1:234567890123:web:abcdef1234567890abcd"
};

// Initialize Firebase
let app, auth, db, storage;

try {
  app = firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  db = firebase.database();
  storage = firebase.storage();
  
  console.log("✅ Firebase initialized successfully");
  
  // Enable offline persistence for better UX
  db.goOffline();
  db.goOnline();
} catch (error) {
  console.error("❌ Firebase initialization error:", error);
  console.warn("Make sure your Firebase config is correct in js/firebase-config.js");
}

// Export for use in other files
window.firebaseServices = { auth, db, storage };
