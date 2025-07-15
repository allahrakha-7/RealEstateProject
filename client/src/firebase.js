// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "estateproject-ep.firebaseapp.com",
  projectId: "estateproject-ep",
  storageBucket: "estateproject-ep.firebasestorage.app",
  messagingSenderId: "792865984815",
  appId: "1:792865984815:web:b16226cfe245e3b15d11da"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;