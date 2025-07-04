// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: "shop-a-lot-fb9cc.firebaseapp.com",
  projectId: "shop-a-lot-fb9cc",
  storageBucket: "shop-a-lot-fb9cc.firebasestorage.app",
  messagingSenderId: "723286685404",
  appId: "1:723286685404:web:5037c661db49b7c260e619",
  measurementId: "G-XF89W2E9WL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);