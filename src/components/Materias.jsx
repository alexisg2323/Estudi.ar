import { useState } from "react";
import { COLORES_MATERIA } from "../utils/helpers";

const DIAS = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];

function ModalMateria({ onClose, onSave, inicial = {} }) {
  const [form, setForm] = useState({
    nombre: "", profesor: "", aula: "", color: "#6366f1",
    horarios: [], notas: "", links: [],
    ...inicial
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const [nuevoLink, setNuevoLink] = useState("");
  const [newHorario, setNewHorario] = useState({ dia: "Lun", inicio: "08:00", fin: "10:00" });

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#13161e] border border-white/10 rounded-2xl w-full max-w-lg p-6 my-4">
        <div className="text-base font-semibold text-white mb-5">{inicial.id ? "Editar materia" : "Nueva materia"}</div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-white/40 mb-1 block">Nombre de la materia *</label>
            <input value={form.nombre} onChange={e => set("nombre", e.target.value)} placeholder="Ej: Cálculo II"
              className="w-full bg-[#1a1d27] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-indigo-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/40 mb-1 block">Profesor/a</label>
              <input value={form.profesor} onChange={e => set("profesor", e.target.value)} placeholder="Nombre del docente"
                className="w-full bg-[#1a1d27] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Aula</label>
              <input value={form.aula} onChange={e => set("aula", e.target.value)} placeholder="Ej: Aula 15"
                className="w-full bg-[#1a1d27] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-indigo-500" />
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORES_MATERIA.map(c => (
                <button key={c} onClick={() => set("color", c)}
                  className={`w-8 h-8 rounded-full transition-all ${form.color === c ? "ring-2 ring-offset-2 ring-white/40 scale-110" : "opacity-60 hover:opacity-100"}`}
                  style={{ background: c }} />
              ))}
            </div>
          </div>

          {/* Horarios */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">Horarios</label>
            {(form.horarios || []).map((h, i) => (
              <div key={i} className="flex items-center gap-2 mb-1.5">
                <span className="text-xs bg-white/8 text-white/60 px-2 py-1 rounded-lg">{h.dia}</span>
                <span className="text-xs text-white/50">{h.inicio} — {h.fin}</span>
                <button onClick={() => set("horarios", form.horarios.filter((_, j) => j !== i))}
                  className="ml-auto text-xs text-white/20 hover:text-red-400">✕</button>
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <select value={newHorario.dia} onChange={e => setNewHorario(h => ({...h, dia: e.target.value}))}
                className="bg-[#1a1d27] border border-white/8 rounded-lg px-2 py-1.5 text-xs text-white outline-none">
                {DIAS.map(d => <option key={d}>{d}</option>)}
              </select>
              <input type="time" value={newHorario.inicio} onChange={e => setNewHorario(h => ({...h, inicio: e.target.value}))}
                className="bg-[#1a1d27] border border-white/8 rounded-lg px-2 py-1.5 text-xs text-white outline-none flex-1" />
              <input type="time" value={newHorario.fin} onChange={e => setNewHorario(h => ({...h, fin: e.target.value}))}
                className="bg-[#1a1d27] border border-white/8 rounded-lg px-2 py-1.5 text-xs text-white outline-none flex-1" />
              <button onClick={() => { set("horarios", [...(form.horarios||[]), newHorario]); }}
                className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-indigo-500">+</button>
            </div>
          </div>

          {/* Links */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">Links / recursos</label>
            {(form.links || []).map((l, i) => (
              <div key={i} className="flex items-center gap-2 mb-1.5">
                <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:underline truncate flex-1">{l.titulo || l.url}</a>
                <button onClick={() => set("links", form.links.filter((_, j) => j !== i))} className="text-xs text-white/20 hover:text-red-400">✕</button>
              </div>
            ))}
            <div className="flex gap-2 mt-1">
              <input value={nuevoLink} onChange={e => setNuevoLink(e.target.value)} placeholder="https://..."
                className="flex-1 bg-[#1a1d27] border border-white/8 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-white/20 outline-none" />
              <button onClick={() => { if (nuevoLink.trim()) { set("links", [...(form.links||[]), { url: nuevoLink.trim(), titulo: nuevoLink.trim() }]); setNuevoLink(""); }}}
                className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-indigo-500">+</button>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="text-xs text-white/40 mb-1 block">Notas</label>
            <textarea value={form.notas} onChange={e => set("notas", e.target.value)} rows={2}
              placeholder="Información adicional, bibliografía..."
              className="w-full bg-[#1a1d27] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-indigo-500 resize-none" />
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-white/50 hover:bg-white/5">Cancelar</button>
          <button onClick={() => { if (!form.nombre.trim()) return alert("El nombre es obligatorio"); onSave(form); }}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white">
            {inicial.id ? "Guardar" : "Crear materia"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Materias({ estudio, setVista }) {
  const [modal, setModal] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const { data, addMateria, editMateria, delMateria, progresoPorMateria } = estudio;
  const progreso = progresoPorMateria();

  const handleSave = (form) => {
    if (modal?.id) editMateria(modal.id, form);
    else addMateria(form);
    setModal(null);
  };

  if (detalle) {
    const m = data.materias.find(x => x.id === detalle);
    const prog = progreso.find(p => p.id === detalle);
    const tareas = data.tareas.filter(t => t.materiaId === detalle);
    if (!m) { setDetalle(null); return null; }
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <button onClick={() => setDetalle(null)} className="text-sm text-white/40 hover:text-indigo-400 mb-4 flex items-center gap-1">← Volver</button>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
            style={{ background: m.color + "30", border: `2px solid ${m.color}40` }}>
            {m.nombre.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{m.nombre}</h1>
            {m.profesor && <p className="text-sm text-white/40 mt-0.5">Prof. {m.profesor}{m.aula ? ` · ${m.aula}` : ""}</p>}
          </div>
          <button onClick={() => setModal(m)} className="border border-white/10 text-white/50 hover:bg-white/5 px-4 py-2 rounded-xl text-sm">✎ Editar</button>
        </div>

        {/* Horarios */}
        {(m.horarios || []).length > 0 && (
          <div className="bg-[#111318] border border-white/5 rounded-2xl p-4 mb-4">
            <div className="text-xs text-white/30 uppercase tracking-wider mb-3">Horarios</div>
            <div className="flex flex-wrap gap-2">
              {m.horarios.map((h, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                  <span className="text-xs font-medium text-white/70">{h.dia}</span>
                  <span className="text-xs text-white/40">{h.inicio} — {h.fin}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        {(m.links || []).length > 0 && (
          <div className="bg-[#111318] border border-white/5 rounded-2xl p-4 mb-4">
            <div className="text-xs text-white/30 uppercase tracking-wider mb-3">Recursos</div>
            {m.links.map((l, i) => (
              <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 py-2 border-b border-white/5 last:border-none hover:text-indigo-400 text-sm text-white/60 transition-colors">
                🔗 {l.titulo || l.url}
              </a>
            ))}
          </div>
        )}

        {/* Notas */}
        {m.notas && (
          <div className="bg-[#111318] border border-white/5 rounded-2xl p-4 mb-4">
            <div className="text-xs text-white/30 uppercase tracking-wider mb-2">Notas</div>
            <p className="text-sm text-white/60 whitespace-pre-wrap">{m.notas}</p>
          </div>
        )}

        {/* Tareas */}
        <div className="bg-[#111318] border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <span className="text-sm font-medium text-white">Tareas ({tareas.length})</span>
            {prog && <span className="text-xs text-white/30">{prog.pct}% completado</span>}
          </div>
          {tareas.length === 0 ? (
            <div className="p-8 text-center text-white/20 text-sm">Sin tareas para esta materia</div>
          ) : (
            tareas.map(t => (
              <div key={t.id} className="flex items-center gap-3 px-5 py-3 border-b border-white/3 last:border-none">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.estado === "completada" ? "bg-emerald-500" : t.estado === "en_progreso" ? "bg-blue-500" : "bg-white/20"}`} />
                <span className={`text-sm flex-1 ${t.estado === "completada" ? "line-through text-white/30" : "text-white/70"}`}>{t.titulo}</span>
                {t.vencimiento && <span className="text-xs text-white/25">{t.vencimiento}</span>}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {modal !== null && <ModalMateria inicial={modal} onClose={() => setModal(null)} onSave={handleSave} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Materias</h1>
          <p className="text-white/30 text-sm mt-0.5">{data.materias.length} materias registradas</p>
        </div>
        <button onClick={() => setModal({})} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl">
          + Nueva materia
        </button>
      </div>

      {data.materias.length === 0 ? (
        <div className="bg-[#111318] border border-dashed border-white/10 rounded-2xl p-16 text-center">
          <div className="text-5xl mb-4 opacity-20">📚</div>
          <p className="text-white/30 mb-4">No tenés materias cargadas</p>
          <button onClick={() => setModal({})} className="text-indigo-400 hover:underline text-sm">Agregar primera materia</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {progreso.map(m => (
            <div key={m.id} className="bg-[#111318] border border-white/5 rounded-2xl p-5 hover:border-white/10 cursor-pointer transition-all group"
              onClick={() => setDetalle(m.id)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm"
                    style={{ background: m.color + "25", border: `1.5px solid ${m.color}40` }}>
                    {m.nombre.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm">{m.nombre}</div>
                    {m.profesor && <div className="text-xs text-white/30 mt-0.5">{m.profesor}</div>}
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                  <button onClick={e => { e.stopPropagation(); setModal(m); }}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 text-xs flex items-center justify-center">✎</button>
                  <button onClick={e => { e.stopPropagation(); if (confirm("¿Eliminar materia?")) delMateria(m.id); }}
                    className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs flex items-center justify-center">×</button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/30">{m.completadas}/{m.total} tareas</span>
                <span className="text-xs font-medium" style={{ color: m.color }}>{m.pct}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${m.pct}%`, background: m.color }} />
              </div>

              {(m.horarios || []).length > 0 && (
                <div className="flex gap-1.5 mt-3 flex-wrap">
                  {m.horarios.map((h, i) => (
                    <span key={i} className="text-[10px] bg-white/5 text-white/30 px-2 py-0.5 rounded-full">{h.dia} {h.inicio}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
