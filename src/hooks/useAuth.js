import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithPopup, signOut, onAuthStateChanged, updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export function useAuth() {
  const [usuario, setUsuario] = useState(undefined);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUsuario(u));
    return unsub;
  }, []);

  const traducir = (code) => ({
    "auth/email-already-in-use": "Ya existe una cuenta con ese email.",
    "auth/invalid-credential": "Email o contraseña incorrectos.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/invalid-email": "Email no válido.",
    "auth/too-many-requests": "Demasiados intentos. Esperá un momento.",
  }[code] || "Error al autenticar.");

  const login = async (email, pw) => {
    setCargando(true); setError(null);
    try { await signInWithEmailAndPassword(auth, email, pw); }
    catch (e) { setError(traducir(e.code)); }
    finally { setCargando(false); }
  };

  const registrar = async (email, pw, nombre) => {
    setCargando(true); setError(null);
    try {
      const c = await createUserWithEmailAndPassword(auth, email, pw);
      await updateProfile(c.user, { displayName: nombre });
    }
    catch (e) { setError(traducir(e.code)); }
    finally { setCargando(false); }
  };

  const loginGoogle = async () => {
    setCargando(true); setError(null);
    try { await signInWithPopup(auth, googleProvider); }
    catch (e) { setError(traducir(e.code)); }
    finally { setCargando(false); }
  };

  const logout = () => signOut(auth);

  return { usuario, cargando, error, login, registrar, loginGoogle, logout };
}
