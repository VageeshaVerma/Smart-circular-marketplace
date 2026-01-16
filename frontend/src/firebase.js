// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1zwcJd_isOs5XAnkIdxFpXkKOo1t_FcE",
  authDomain: "smart-circular-marketplace.firebaseapp.com",
  projectId: "smart-circular-marketplace",
  storageBucket: "smart-circular-marketplace.firebasestorage.app",
  messagingSenderId: "842650244036",
  appId: "1:842650244036:web:ec7d01522836689cab0a91",
  measurementId: "G-VZ83VD58GX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
