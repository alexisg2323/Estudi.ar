const NAV = [
  { id: "dashboard",  icon: "⊞", label: "Dashboard"  },
  { id: "materias",   icon: "📚", label: "Materias"   },
  { id: "tareas",     icon: "✓",  label: "Tareas"     },
  { id: "calendario", icon: "📅", label: "Calendario" },
  { id: "habitos",    icon: "🔥", label: "Hábitos"    },
  { id: "ia",         icon: "✦",  label: "Asesor IA", badge: "IA" },
];

export default function Sidebar({ vista, setVista, usuario, guardando, onLogout }) {
  const nombre = usuario?.displayName || usuario?.email?.split("@")[0] || "Estudiante";
  const inicial = nombre.charAt(0).toUpperCase();

  return (
    <aside className="w-[220px] bg-[#0e1018] border-r border-white/5 flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-lg shadow-lg shadow-indigo-900/40">📚</div>
          <div>
            <div className="text-sm font-semibold text-white">Estudiar</div>
            <div className="text-[10px] text-white/30 uppercase tracking-widest">App universitaria</div>
          </div>
        </div>
      </div>

      {/* Usuario */}
      <div className="px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300 flex-shrink-0">
            {inicial}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-white/80 truncate">{nombre}</div>
            <div className="text-[10px] text-white/25 truncate">{usuario?.email}</div>
          </div>
          {guardando && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse flex-shrink-0" />}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(item => (
          <button key={item.id} onClick={() => setVista(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left border
              ${vista === item.id
                ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/20"
                : "text-white/40 hover:text-white/70 hover:bg-white/5 border-transparent"}`}>
            <span className="text-base w-5 text-center leading-none flex-shrink-0">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {item.badge && <span className="text-[9px] bg-indigo-500/30 text-indigo-300 px-1.5 py-0.5 rounded-full">{item.badge}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-white/5 pt-3">
        <button onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/30 hover:text-red-400 hover:bg-red-500/8 transition-all text-left">
          <span className="text-base w-5 text-center">⏻</span>Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
