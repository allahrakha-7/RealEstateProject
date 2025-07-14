// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "estate-project-ca9b0.firebaseapp.com",
  projectId: "estate-project-ca9b0",
  storageBucket: "estate-project-ca9b0.firebasestorage.app",
  messagingSenderId: "482219145241",
  appId: "1:482219145241:web:724998f6ea9d567c3d9288"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;