import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBn4C16FGOH9IuyNxX6F-LJJXBbowc1z_Q",
  authDomain: "estudiar-941c4.firebaseapp.com",
  projectId: "estudiar-941c4",
  storageBucket: "estudiar-941c4.firebasestorage.app",
  messagingSenderId: "280190420704",
  appId: "1:280190420704:web:6eea0baf52daedd22fb285"
};

const app = initializeApp(firebaseConfig);

// Exportaciones necesarias
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;