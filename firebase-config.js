// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, connectFirestoreEmulator } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, connectAuthEmulator } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, connectStorageEmulator } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCOHNffS4IqqSrwPS7G9rF_50sQ5RZJyMI",
  authDomain: "sigap-firebase.firebaseapp.com",
  projectId: "sigap-firebase",
  storageBucket: "sigap-firebase.firebasestorage.app",
  messagingSenderId: "135290011155",
  appId: "1:135290011155:web:02c2f719ad73a6d99cc9e6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// connectFirestoreEmulator(db, 'localhost', 8080);
// connectAuthEmulator(auth, 'http://localhost:9099');
// connectStorageEmulator(storage, 'localhost', 9199);