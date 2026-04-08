import { useState } from "react";
import { diasRestantes, formatFecha, prioridadInfo } from "../utils/helpers";

const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function getSemanaDias(baseDate) {
  const d = new Date(baseDate);
  const dow = d.getDay();
  const lunes = new Date(d);
  lunes.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const dia = new Date(lunes);
    dia.setDate(lunes.getDate() + i);
    return dia;
  });
}

export default function Calendario({ estudio, setVista }) {
  const [base, setBase] = useState(new Date());
  const dias = getSemanaDias(base);
  const { data, toggleTarea } = estudio;

  const hoyStr = new Date().toISOString().slice(0, 10);

  const irSemana = (n) => {
    const d = new Date(base);
    d.setDate(d.getDate() + n * 7);
    setBase(d);
  };

  const tareasDesDia = (isoDate) =>
    data.tareas.filter(t => t.vencimiento === isoDate && t.tipo !== "examen")
      .sort((a, b) => (a.prioridad === "alta" ? -1 : b.prioridad === "alta" ? 1 : 0));

  const examenesDesDia = (isoDate) =>
    data.tareas.filter(t => t.vencimiento === isoDate && t.tipo === "examen");

  const primerDia = dias[0];
  const ultimoDia = dias[6];
  const labelSemana = primerDia.getMonth() === ultimoDia.getMonth()
    ? `${MESES[primerDia.getMonth()]} ${primerDia.getFullYear()}`
    : `${MESES[primerDia.getMonth()]} — ${MESES[ultimoDia.getMonth()]} ${ultimoDia.getFullYear()}`;

  // Próximos eventos (exámenes)
  const proximosExamenes = data.tareas
    .filter(t => t.tipo === "examen" && t.vencimiento >= hoyStr && t.estado !== "completada")
    .sort((a, b) => a.vencimiento.localeCompare(b.vencimiento))
    .slice(0, 6);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Calendario</h1>
          <p className="text-white/30 text-sm mt-0.5">{labelSemana}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setBase(new Date())}
            className="border border-white/10 text-white/50 hover:bg-white/5 px-3 py-2 rounded-xl text-sm">Hoy</button>
          <button onClick={() => irSemana(-1)} className="border border-white/10 text-white/50 hover:bg-white/5 w-9 h-9 rounded-xl flex items-center justify-center">←</button>
          <button onClick={() => irSemana(1)}  className="border border-white/10 text-white/50 hover:bg-white/5 w-9 h-9 rounded-xl flex items-center justify-center">→</button>
        </div>
      </div>

      {/* Semana */}
      <div className="grid grid-cols-7 gap-2 mb-5">
        {dias.map((dia, i) => {
          const iso = dia.toISOString().slice(0, 10);
          const esHoy = iso === hoyStr;
          const tareas = tareasDesDia(iso);
          const examenes = examenesDesDia(iso);

          return (
            <div key={iso} className={`rounded-2xl p-3 border min-h-[120px] ${esHoy ? "border-indigo-500/40 bg-indigo-500/8" : "border-white/5 bg-[#111318]"}`}>
              <div className="text-center mb-2">
                <div className="text-[10px] text-white/30 uppercase">{DIAS_SEMANA[dia.getDay()]}</div>
                <div className={`text-lg font-semibold mt-0.5 ${esHoy ? "text-indigo-400" : "text-white/70"}`}>{dia.getDate()}</div>
              </div>

              {examenes.map(e => {
                const mat = data.materias.find(m => m.id === e.materiaId);
                return (
                  <div key={e.id} className="mb-1 px-2 py-1 rounded-lg bg-red-500/20 border border-red-500/20 text-[10px] text-red-300 truncate">
                    📝 {e.titulo}
                  </div>
                );
              })}

              {tareas.slice(0, 3).map(t => {
                const mat = data.materias.find(m => m.id === t.materiaId);
                const pri = prioridadInfo(t.prioridad);
                return (
                  <div key={t.id} onClick={() => toggleTarea(t.id)}
                    className={`mb-1 px-2 py-1 rounded-lg text-[10px] truncate cursor-pointer transition-all
                      ${t.estado === "completada" ? "line-through opacity-40 bg-white/5 text-white/30" : "hover:opacity-80"}`}
                    style={t.estado !== "completada" ? { background: (mat?.color || "#6366f1") + "20", color: mat?.color || "#a5b4fc" } : {}}>
                    {t.titulo}
                  </div>
                );
              })}
              {tareas.length > 3 && (
                <div className="text-[10px] text-white/20 text-center mt-1">+{tareas.length - 3} más</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Próximos exámenes */}
      {proximosExamenes.length > 0 && (
        <div className="bg-[#111318] border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <span className="text-sm font-medium text-white">Próximos exámenes</span>
          </div>
          {proximosExamenes.map(e => {
            const dias = diasRestantes(e.vencimiento);
            const mat  = data.materias.find(m => m.id === e.materiaId);
            return (
              <div key={e.id} className="flex items-center justify-between px-5 py-3.5 border-b border-white/3 last:border-none">
                <div className="flex items-center gap-3">
                  <span className="text-base">📝</span>
                  <div>
                    <div className="text-sm text-white/80">{e.titulo}</div>
                    {mat && <div className="text-xs mt-0.5" style={{ color: mat.color }}>{mat.nombre}</div>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/50">{formatFecha(e.vencimiento)}</div>
                  <div className={`text-xs font-medium ${dias !== null && dias <= 3 ? "text-red-400" : dias !== null && dias <= 7 ? "text-amber-400" : "text-white/30"}`}>
                    {dias !== null && dias === 0 ? "HOY" : dias !== null && dias > 0 ? `En ${dias} días` : `Hace ${Math.abs(dias || 0)} días`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
