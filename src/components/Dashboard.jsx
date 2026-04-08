import { useState } from "react";
import { diasRestantes, labelDias, prioridadInfo, formatFecha } from "../utils/helpers";

function StatCard({ icon, label, value, sub, color = "indigo" }) {
  const colors = {
    indigo: "bg-indigo-500/10 border-indigo-500/20",
    green:  "bg-emerald-500/10 border-emerald-500/20",
    amber:  "bg-amber-500/10 border-amber-500/20",
    red:    "bg-red-500/10 border-red-500/20",
  };
  return (
    <div className={`${colors[color]} border rounded-2xl p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs text-white/40 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {sub && <div className="text-xs text-white/30 mt-1">{sub}</div>}
    </div>
  );
}

export default function Dashboard({ estudio, usuario, setVista }) {
  const {
    data, tareasDeHoy, tareasAtrasadas, proximosExamenes,
    horasEstudiadasHoy, horasEstudiadasSemana, progresoPorMateria,
    rachaActual, addSesion, toggleTarea,
  } = estudio;

  const nombre = usuario?.displayName?.split(" ")[0] || "Estudiante";
  const hora   = new Date().getHours();
  const saludo = hora < 12 ? "Buenos días" : hora < 18 ? "Buenas tardes" : "Buenas noches";

  const hoy      = tareasDeHoy();
  const atr      = tareasAtrasadas();
  const examenes = proximosExamenes();
  const horas    = horasEstudiadasHoy().toFixed(1);
  const horasSem = horasEstudiadasSemana().toFixed(1);
  const racha    = rachaActual();
  const progreso = progresoPorMateria();

  const [minSesion, setMinSesion] = useState(30);

  // Sugerencia IA simple basada en datos
  const sugerencia = () => {
    if (atr.length > 0) return `⚠ Tenés ${atr.length} tarea${atr.length > 1 ? "s" : ""} atrasada${atr.length > 1 ? "s" : ""}. Prioridad: completarlas hoy.`;
    if (examenes.length > 0) {
      const d = diasRestantes(examenes[0].vencimiento);
      if (d !== null && d <= 5) return `📝 Parcial "${examenes[0].titulo}" en ${d} días → recomendamos estudiar al menos 2h hoy.`;
    }
    if (hoy.length > 0) return `✓ Tenés ${hoy.length} tarea${hoy.length > 1 ? "s" : ""} para hoy. ¡A trabajar!`;
    return `🎉 Todo en orden. Aprovechá para adelantar material o repasar.`;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{saludo}, {nombre} 👋</h1>
          <p className="text-white/30 text-sm mt-0.5">
            {new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <button onClick={() => setVista("ia")}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors">
          <span>✦</span> Asesor IA
        </button>
      </div>

      {/* Sugerencia del día */}
      <div className="bg-indigo-500/8 border border-indigo-500/15 rounded-2xl p-4 mb-5 flex items-start gap-3">
        <span className="text-indigo-400 text-lg mt-0.5">💡</span>
        <div>
          <div className="text-xs text-indigo-300/60 uppercase tracking-wider mb-1">Sugerencia de hoy</div>
          <div className="text-sm text-indigo-200/80">{sugerencia()}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatCard icon="⏱" label="Horas hoy" value={`${horas}h`} sub={`/${data.config?.horasObjetivoDiarias || 3}h objetivo`} color="indigo" />
        <StatCard icon="📅" label="Esta semana" value={`${horasSem}h`} sub="estudiadas" color="green" />
        <StatCard icon="🔥" label="Racha" value={`${racha}d`} sub={racha > 0 ? "¡Seguí así!" : "Empezá hoy"} color="amber" />
        <StatCard icon="⚠" label="Atrasadas" value={atr.length} sub={atr.length > 0 ? "Requieren atención" : "Todo al día"} color={atr.length > 0 ? "red" : "green"} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Tareas de hoy */}
        <div className="col-span-2 bg-[#111318] border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <span className="text-sm font-medium text-white">Tareas de hoy</span>
            <button onClick={() => setVista("tareas")} className="text-xs text-indigo-400 hover:underline">Ver todas</button>
          </div>
          {hoy.length === 0 ? (
            <div className="p-8 text-center text-white/20 text-sm">
              <div className="text-3xl mb-2 opacity-30">✓</div>
              No hay tareas para hoy.
            </div>
          ) : (
            hoy.map(t => {
              const pri = prioridadInfo(t.prioridad);
              const mat = data.materias.find(m => m.id === t.materiaId);
              return (
                <div key={t.id} className="flex items-center gap-3 px-5 py-3.5 border-b border-white/3 last:border-none hover:bg-white/2 group">
                  <button onClick={() => toggleTarea(t.id)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all
                      ${t.estado === "completada" ? "bg-emerald-500 border-emerald-500" : "border-white/20 hover:border-emerald-500"}`}>
                    {t.estado === "completada" && <span className="text-white text-xs">✓</span>}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm ${t.estado === "completada" ? "line-through text-white/30" : "text-white/80"}`}>{t.titulo}</div>
                    {mat && <div className="text-xs mt-0.5" style={{ color: mat.color }}>{mat.nombre}</div>}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${pri.bg}`}>{pri.label}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Panel derecho */}
        <div className="space-y-4">
          {/* Próximos exámenes */}
          <div className="bg-[#111318] border border-white/5 rounded-2xl p-4">
            <div className="text-xs text-white/30 uppercase tracking-wider mb-3">Próximos exámenes</div>
            {examenes.length === 0 ? (
              <div className="text-xs text-white/20 text-center py-2">Sin exámenes próximos</div>
            ) : (
              examenes.slice(0, 3).map(e => {
                const dias = diasRestantes(e.vencimiento);
                return (
                  <div key={e.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-none">
                    <div className="text-xs text-white/70 truncate flex-1">{e.titulo}</div>
                    <span className={`text-xs ml-2 font-medium ${dias !== null && dias <= 3 ? "text-red-400" : dias !== null && dias <= 7 ? "text-amber-400" : "text-white/40"}`}>
                      {labelDias(dias)}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Progreso por materia */}
          <div className="bg-[#111318] border border-white/5 rounded-2xl p-4">
            <div className="text-xs text-white/30 uppercase tracking-wider mb-3">Progreso materias</div>
            {progreso.length === 0 ? (
              <div className="text-xs text-white/20 text-center py-2">Sin materias</div>
            ) : (
              progreso.map(m => (
                <div key={m.id} className="mb-3 last:mb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white/60 truncate">{m.nombre}</span>
                    <span className="text-xs text-white/30">{m.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${m.pct}%`, background: m.color }} />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Registrar sesión rápida */}
          <div className="bg-[#111318] border border-white/5 rounded-2xl p-4">
            <div className="text-xs text-white/30 uppercase tracking-wider mb-3">Registrar sesión</div>
            <div className="flex gap-2 mb-2">
              {[30, 60, 90, 120].map(m => (
                <button key={m} onClick={() => setMinSesion(m)}
                  className={`flex-1 py-1.5 rounded-lg text-xs transition-all ${minSesion === m ? "bg-indigo-600 text-white" : "bg-white/5 text-white/40 hover:bg-white/10"}`}>
                  {m >= 60 ? `${m / 60}h` : `${m}m`}
                </button>
              ))}
            </div>
            <button onClick={() => addSesion({ minutos: minSesion })}
              className="w-full py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/20 text-indigo-300 hover:text-white text-xs font-medium transition-all">
              + Registrar {minSesion >= 60 ? `${minSesion / 60}h` : `${minSesion}min`} estudiadas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
