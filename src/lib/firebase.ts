import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBUjgc0yRDBDAbS8oNvv6ci-TV5_MFWpM",
  authDomain: "wellcare-hospitals.firebaseapp.com",
  projectId: "wellcare-hospitals",
  storageBucket: "wellcare-hospitals.firebasestorage.app",
  messagingSenderId: "465021802162",
  appId: "1:465021802162:web:5c53f14484ef9f6a505bab"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
