import { useState, useMemo } from "react";
import { PRIORIDADES, TIPOS_TAREA, diasRestantes, labelDias, prioridadInfo, formatFecha } from "../utils/helpers";

function ModalTarea({ onClose, onSave, materias, inicial = {} }) {
  const [form, setForm] = useState({
    titulo: "", descripcion: "", tipo: "tarea", prioridad: "media",
    materiaId: "", vencimiento: "", estado: "pendiente", subtareas: [],
    ...inicial
  });
  const [newSub, setNewSub] = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addSub = () => {
    if (!newSub.trim()) return;
    setForm(f => ({ ...f, subtareas: [...(f.subtareas||[]), { id: Date.now()+"", texto: newSub.trim(), done: false }] }));
    setNewSub("");
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#13161e] border border-white/10 rounded-2xl w-full max-w-lg p-6 my-4">
        <div className="text-base font-semibold text-white mb-5">{inicial.id ? "Editar tarea" : "Nueva tarea"}</div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-white/40 mb-1 block">Título *</label>
            <input value={form.titulo} onChange={e => set("titulo", e.target.value)} placeholder="¿Qué hay que hacer?"
              className="w-full bg-[#1a1d27] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">Descripción</label>
            <textarea value={form.descripcion} onChange={e => set("descripcion", e.target.value)} rows={2}
              placeholder="Detalles adicionales..."
              className="w-full bg-[#1a1d27] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-indigo-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/40 mb-1 block">Tipo</label>
              <select value={form.tipo} onChange={e => set("tipo", e.target.value)}
                className="w-full bg-[#1a1d27] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500">
                {TIPOS_TAREA.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Prioridad</label>
              <select value={form.prioridad} onChange={e => set("prioridad", e.target.value)}
                className="w-full bg-[#1a1d27] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500">
                {PRIORIDADES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/40 mb-1 block">Materia</label>
              <select value={form.materiaId} onChange={e => set("materiaId", e.target.value)}
                className="w-full bg-[#1a1d27] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500">
                <option value="">Sin materia</option>
                {materias.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Fecha límite</label>
              <input type="date" value={form.vencimiento} onChange={e => set("vencimiento", e.target.value)}
                className="w-full bg-[#1a1d27] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
          </div>

          {/* Subtareas */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">Subtareas</label>
            {(form.subtareas||[]).map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 mb-1.5">
                <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${s.done ? "bg-emerald-500 border-emerald-500" : "border-white/20"}`}>
                  {s.done && <span className="text-white text-[10px]">✓</span>}
                </div>
                <span className={`text-xs flex-1 ${s.done ? "line-through text-white/30" : "text-white/60"}`}>{s.texto}</span>
                <button onClick={() => setForm(f => ({...f, subtareas: f.subtareas.filter((_, j) => j !== i)}))}
                  className="text-xs text-white/20 hover:text-red-400">✕</button>
              </div>
            ))}
            <div className="flex gap-2 mt-1">
              <input value={newSub} onChange={e => setNewSub(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addSub()}
                placeholder="Agregar subtarea..."
                className="flex-1 bg-[#1a1d27] border border-white/8 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-white/20 outline-none" />
              <button onClick={addSub} className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-indigo-500">+</button>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-white/50 hover:bg-white/5">Cancelar</button>
          <button onClick={() => { if (!form.titulo.trim()) return alert("El título es obligatorio"); onSave(form); }}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white">
            {inicial.id ? "Guardar" : "Crear tarea"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TareaItem({ t, mat, onToggle, onEdit, onDelete, onToggleSub }) {
  const [abierto, setAbierto] = useState(false);
  const dias = diasRestantes(t.vencimiento);
  const pri  = prioridadInfo(t.prioridad);
  const tipoIcon = { tarea: "✓", examen: "📝", proyecto: "📁", lectura: "📖" }[t.tipo] || "✓";

  return (
    <div className={`bg-[#111318] border rounded-2xl overflow-hidden transition-all ${t.estado === "completada" ? "border-white/3 opacity-60" : "border-white/5 hover:border-white/10"}`}>
      <div className="flex items-center gap-3 px-4 py-3.5">
        <button onClick={() => onToggle(t.id)}
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all
            ${t.estado === "completada" ? "bg-emerald-500 border-emerald-500" : "border-white/20 hover:border-emerald-500"}`}>
          {t.estado === "completada" && <span className="text-white text-xs">✓</span>}
        </button>

        <span className="text-sm flex-shrink-0">{tipoIcon}</span>

        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setAbierto(!abierto)}>
          <div className={`text-sm font-medium ${t.estado === "completada" ? "line-through text-white/30" : "text-white/80"}`}>
            {t.titulo}
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {mat && <span className="text-xs" style={{ color: mat.color }}>{mat.nombre}</span>}
            {t.vencimiento && (
              <span className={`text-xs ${dias !== null && dias < 0 ? "text-red-400" : dias !== null && dias <= 3 ? "text-amber-400" : "text-white/25"}`}>
                {formatFecha(t.vencimiento)} · {labelDias(dias)}
              </span>
            )}
            {(t.subtareas||[]).length > 0 && (
              <span className="text-xs text-white/20">
                {(t.subtareas||[]).filter(s => s.done).length}/{t.subtareas.length} subtareas
              </span>
            )}
          </div>
        </div>

        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${pri.bg}`}>{pri.label}</span>

        <div className="flex gap-1 flex-shrink-0">
          <button onClick={() => onEdit(t)} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white/30 text-xs flex items-center justify-center">✎</button>
          <button onClick={() => { if (confirm("¿Eliminar tarea?")) onDelete(t.id); }} className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs flex items-center justify-center">×</button>
        </div>
      </div>

      {abierto && (
        <div className="px-4 pb-3 border-t border-white/5 pt-3">
          {t.descripcion && <p className="text-xs text-white/40 mb-3">{t.descripcion}</p>}
          {(t.subtareas||[]).length > 0 && (
            <div className="space-y-1.5">
              {t.subtareas.map(s => (
                <div key={s.id} className="flex items-center gap-2 cursor-pointer" onClick={() => onToggleSub(t.id, s.id)}>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all
                    ${s.done ? "bg-emerald-500 border-emerald-500" : "border-white/20 hover:border-emerald-500"}`}>
                    {s.done && <span className="text-white text-[9px]">✓</span>}
                  </div>
                  <span className={`text-xs ${s.done ? "line-through text-white/25" : "text-white/55"}`}>{s.texto}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Tareas({ estudio }) {
  const [modal, setModal] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [filtroMateria, setFiltroMateria] = useState("todas");
  const [filtroPrioridad, setFiltroPrioridad] = useState("todas");
  const [busqueda, setBusqueda] = useState("");

  const { data, addTarea, editTarea, delTarea, toggleTarea, addSubtarea, toggleSubtarea, tareasAtrasadas } = estudio;

  const tareasFiltradas = useMemo(() => {
    return data.tareas.filter(t => {
      if (filtroEstado !== "todas" && t.estado !== filtroEstado) return false;
      if (filtroMateria !== "todas" && t.materiaId !== filtroMateria) return false;
      if (filtroPrioridad !== "todas" && t.prioridad !== filtroPrioridad) return false;
      if (busqueda && !t.titulo.toLowerCase().includes(busqueda.toLowerCase())) return false;
      return true;
    }).sort((a, b) => {
      const ord = { alta: 0, media: 1, baja: 2 };
      if (ord[a.prioridad] !== ord[b.prioridad]) return ord[a.prioridad] - ord[b.prioridad];
      if (a.vencimiento && b.vencimiento) return a.vencimiento.localeCompare(b.vencimiento);
      return 0;
    });
  }, [data.tareas, filtroEstado, filtroMateria, filtroPrioridad, busqueda]);

  const atr = tareasAtrasadas();

  const handleSave = (form) => {
    if (modal?.id) editTarea(modal.id, form);
    else addTarea(form);
    setModal(null);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {modal !== null && (
        <ModalTarea inicial={modal} materias={data.materias} onClose={() => setModal(null)} onSave={handleSave} />
      )}

      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Tareas</h1>
          <p className="text-white/30 text-sm mt-0.5">{data.tareas.filter(t => t.estado !== "completada").length} pendientes</p>
        </div>
        <button onClick={() => setModal({})} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl">
          + Nueva tarea
        </button>
      </div>

      {/* Atrasadas */}
      {atr.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-4 flex items-center gap-3">
          <span className="text-red-400 text-lg">⚠</span>
          <div className="text-sm text-red-300/80">
            {atr.length} tarea{atr.length > 1 ? "s" : ""} atrasada{atr.length > 1 ? "s" : ""}:
            {atr.slice(0, 2).map(t => <span key={t.id} className="ml-1 font-medium">"{t.titulo}"</span>)}
            {atr.length > 2 && ` y ${atr.length - 2} más`}.
          </div>
        </div>
      )}

      {/* Búsqueda */}
      <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar tareas..."
        className="w-full bg-[#111318] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-indigo-500 mb-3" />

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap mb-5">
        {["todas","pendiente","en_progreso","completada"].map(e => (
          <button key={e} onClick={() => setFiltroEstado(e)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${filtroEstado === e ? "bg-indigo-600 border-indigo-600 text-white" : "border-white/10 text-white/40 hover:text-white/60"}`}>
            {e === "todas" ? "Todas" : e === "pendiente" ? "Pendientes" : e === "en_progreso" ? "En progreso" : "Completadas"}
          </button>
        ))}
        <div className="w-px bg-white/10 mx-1" />
        {data.materias.map(m => (
          <button key={m.id} onClick={() => setFiltroMateria(filtroMateria === m.id ? "todas" : m.id)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${filtroMateria === m.id ? "text-white border-transparent" : "border-white/10 text-white/30 hover:text-white/50"}`}
            style={filtroMateria === m.id ? { background: m.color + "30", borderColor: m.color + "50", color: m.color } : {}}>
            {m.nombre}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-2">
        {tareasFiltradas.length === 0 ? (
          <div className="bg-[#111318] border border-dashed border-white/10 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-3 opacity-20">✓</div>
            <p className="text-white/20 text-sm">No hay tareas que coincidan</p>
          </div>
        ) : (
          tareasFiltradas.map(t => (
            <TareaItem
              key={t.id}
              t={t}
              mat={data.materias.find(m => m.id === t.materiaId)}
              onToggle={toggleTarea}
              onEdit={setModal}
              onDelete={delTarea}
              onToggleSub={toggleSubtarea}
            />
          ))
        )}
      </div>
    </div>
  );
}
