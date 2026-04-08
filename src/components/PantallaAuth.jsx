import { useState } from "react";

export default function PantallaAuth({ onLogin, onRegistrar, onGoogle, error, cargando }) {
  const [modo, setModo] = useState("login");
  const [form, setForm] = useState({ nombre: "", email: "", password: "", password2: "" });
  const [errLocal, setErrLocal] = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    setErrLocal(null);
    if (modo === "registro") {
      if (!form.nombre.trim()) return setErrLocal("Ingresá tu nombre.");
      if (form.password !== form.password2) return setErrLocal("Las contraseñas no coinciden.");
      onRegistrar(form.email.trim(), form.password, form.nombre.trim());
    } else {
      onLogin(form.email.trim(), form.password);
    }
  };

  const err = errLocal || error;

  return (
    <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-indigo-900/50">📚</div>
          <h1 className="text-2xl font-bold text-white">Estudiar</h1>
          <p className="text-white/30 text-sm mt-1">Tu asistente de estudio universitario</p>
        </div>

        <div className="bg-[#111318] border border-white/8 rounded-2xl p-6">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-[#1a1d27] rounded-xl mb-5">
            {["login","registro"].map(m => (
              <button key={m} onClick={() => { setModo(m); setErrLocal(null); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all
                  ${modo === m ? "bg-indigo-600 text-white" : "text-white/40 hover:text-white/60"}`}>
                {m === "login" ? "Iniciar sesión" : "Crear cuenta"}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {modo === "registro" && (
              <div>
                <label className="text-xs text-white/40 mb-1 block">Nombre</label>
                <input value={form.nombre} onChange={e => set("nombre", e.target.value)} placeholder="Tu nombre"
                  className="w-full bg-[#1a1d27] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-indigo-500" />
              </div>
            )}
            <div>
              <label className="text-xs text-white/40 mb-1 block">Email</label>
              <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                onKeyDown={e => e.key === "Enter" && submit()} placeholder="tu@email.com"
                className="w-full bg-[#1a1d27] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Contraseña</label>
              <input type="password" value={form.password} onChange={e => set("password", e.target.value)}
                onKeyDown={e => e.key === "Enter" && submit()} placeholder="Mínimo 6 caracteres"
                className="w-full bg-[#1a1d27] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-indigo-500" />
            </div>
            {modo === "registro" && (
              <div>
                <label className="text-xs text-white/40 mb-1 block">Repetir contraseña</label>
                <input type="password" value={form.password2} onChange={e => set("password2", e.target.value)}
                  onKeyDown={e => e.key === "Enter" && submit()} placeholder="Repetí tu contraseña"
                  className="w-full bg-[#1a1d27] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-indigo-500" />
              </div>
            )}
          </div>

          {err && (
            <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 text-sm text-red-400">{err}</div>
          )}

          <button onClick={submit} disabled={cargando}
            className="w-full mt-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-sm transition-colors">
            {cargando ? "Cargando..." : modo === "login" ? "Entrar" : "Crear cuenta"}
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-white/25">o</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <button onClick={onGoogle} disabled={cargando}
            className="w-full py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-white/70 text-sm font-medium flex items-center justify-center gap-2 transition-colors">
            <span className="text-base">G</span> Continuar con Google
          </button>
        </div>
        <p className="text-center text-white/15 text-xs mt-4">Tus datos son privados y seguros.</p>
      </div>
    </div>
  );
}
