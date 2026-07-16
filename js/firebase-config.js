// Firebase Configuration
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
try {
  firebase.initializeApp(firebaseConfig);
  console.log("✅ Firebase initialized");
} catch (error) {
  console.log("Firebase already initialized");
}
