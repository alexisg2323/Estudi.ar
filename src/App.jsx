import { useState } from "react";
import Sidebar from "./components/Sidebar";
import PantallaAuth from "./components/PantallaAuth";
import Dashboard from "./components/Dashboard";
import Materias from "./components/Materias";
import Tareas from "./components/Tareas";
import Calendario from "./components/Calendario";
import Habitos from "./components/Habitos";
import AsesorIA from "./components/AsesorIA";
import { useAuth } from "./hooks/useAuth";
import { useEstudio } from "./hooks/useEstudio";

export default function App() {
  const [vista, setVista] = useState("dashboard");
  const { usuario, cargando: cargandoAuth, error: errorAuth, login, registrar, loginGoogle, logout } = useAuth();
  const estudio = useEstudio(usuario?.uid);

  // Cargando sesión
  if (usuario === undefined) return (
    <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl mx-auto mb-3 animate-pulse">📚</div>
        <p className="text-white/30 text-sm">Cargando...</p>
      </div>
    </div>
  );

  // No logueado
  if (!usuario) return (
    <PantallaAuth
      onLogin={login}
      onRegistrar={registrar}
      onGoogle={loginGoogle}
      error={errorAuth}
      cargando={cargandoAuth}
    />
  );

  // Cargando datos
  if (estudio.cargando) return (
    <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl mx-auto mb-3 animate-pulse">📚</div>
        <p className="text-white/30 text-sm">Sincronizando tus datos...</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0d0f14] text-white overflow-hidden">
      {/* Indicador guardando */}
      {estudio.guardando && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#1a1d27] border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs text-white/50">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Guardando...
        </div>
      )}

      <Sidebar
        vista={vista}
        setVista={setVista}
        usuario={usuario}
        guardando={estudio.guardando}
        onLogout={logout}
      />

      <main className="flex-1 overflow-y-auto">
        {vista === "dashboard"  && <Dashboard   estudio={estudio} usuario={usuario} setVista={setVista} />}
        {vista === "materias"   && <Materias    estudio={estudio} setVista={setVista} />}
        {vista === "tareas"     && <Tareas      estudio={estudio} />}
        {vista === "calendario" && <Calendario  estudio={estudio} setVista={setVista} />}
        {vista === "habitos"    && <Habitos     estudio={estudio} />}
        {vista === "ia"         && <AsesorIA    estudio={estudio} />}
      </main>
    </div>
  );
}
