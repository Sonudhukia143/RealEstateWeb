// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAERxJp561WAXdj-MmgxVUXnHVUlkgQPVs",
  authDomain: "realestatehub-29818.firebaseapp.com",
  projectId: "realestatehub-29818",
  storageBucket: "realestatehub-29818.firebasestorage.app",
  messagingSenderId: "534839177675",
  appId: "1:534839177675:web:bdd0e263845aa23cda064e",
  measurementId: "G-4Y77NSSKVX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app , analytics};