import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// 1. Importamos el servicio de Firestore (Base de datos)
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBn4C16FGOH9IuyNxX6F-LJJXBbowc1z_Q",
  authDomain: "estudiar-941c4.firebaseapp.com",
  projectId: "estudiar-941c4",
  storageBucket: "estudiar-941c4.firebasestorage.app",
  messagingSenderId: "280190420704",
  appId: "1:280190420704:web:6eea0baf52daedd22fb285"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. EXPORTAMOS todo lo que tus Hooks necesitan
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// ESTO ES LO QUE TE FALTA AHORA:
export const db = getFirestore(app);