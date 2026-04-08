import { useState } from "react";

const ICONOS = ["📚","⏰","🏃","💧","🧘","✍","📖","🎯","💪","🌅"];

function ModalHabito({ onClose, onSave, inicial = {} }) {
  const [form, setForm] = useState({ nombre: "", icono: "📚", meta: 1, unidad: "veces", frecuencia: "diario", ...inicial });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-[#13161e] border border-white/10 rounded-2xl w-full max-w-sm p-6">
        <div className="text-base font-semibold text-white mb-5">{inicial.id ? "Editar hábito" : "Nuevo hábito"}</div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-white/40 mb-2 block">Ícono</label>
            <div className="flex gap-2 flex-wrap">{ICONOS.map(ic => (
              <button key={ic} onClick={() => set("icono", ic)}
                className={`w-9 h-9 rounded-xl text-lg transition-all ${form.icono === ic ? "bg-indigo-600 scale-110" : "bg-[#1a1d27] hover:bg-white/10"}`}>{ic}</button>
            ))}</div>
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">Nombre</label>
            <input value={form.nombre} onChange={e => set("nombre", e.target.value)} placeholder="Ej: Estudiar 2 horas"
              className="w-full bg-[#1a1d27] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-indigo-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/40 mb-1 block">Meta</label>
              <input type="number" min="1" value={form.meta} onChange={e => set("meta", Number(e.target.value))}
                className="w-full bg-[#1a1d27] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Unidad</label>
              <select value={form.unidad} onChange={e => set("unidad", e.target.value)}
                className="w-full bg-[#1a1d27] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500">
                <option value="veces">veces</option>
                <option value="horas">horas</option>
                <option value="minutos">minutos</option>
                <option value="páginas">páginas</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-white/50 hover:bg-white/5">Cancelar</button>
          <button onClick={() => { if (!form.nombre.trim()) return alert("Nombre obligatorio"); onSave(form); }}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white">{inicial.id ? "Guardar" : "Crear"}</button>
        </div>
      </div>
    </div>
  );
}

export default function Habitos({ estudio }) {
  const [modal, setModal] = useState(null);
  const { data, addHabito, editHabito, delHabito, completarHabito } = estudio;
  const hoy = new Date().toISOString().slice(0, 10);

  const handleSave = (form) => {
    if (modal?.id) editHabito(modal.id, form);
    else addHabito(form);
    setModal(null);
  };

  const totalRacha = data.habitos?.reduce((s, h) => s + (h.rachaActual || 0), 0) || 0;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {modal !== null && <ModalHabito inicial={modal} onClose={() => setModal(null)} onSave={handleSave} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Hábitos</h1>
          <p className="text-white/30 text-sm mt-0.5">Racha total acumulada: {totalRacha} días</p>
        </div>
        <button onClick={() => setModal({})} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl">
          + Nuevo hábito
        </button>
      </div>

      {(!data.habitos || data.habitos.length === 0) ? (
        <div className="bg-[#111318] border border-dashed border-white/10 rounded-2xl p-16 text-center">
          <div className="text-5xl mb-4 opacity-20">🔥</div>
          <p className="text-white/30 mb-4">Creá tus primeros hábitos de estudio</p>
          <button onClick={() => setModal({})} className="text-indigo-400 hover:underline text-sm">Crear hábito</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {data.habitos.map(h => {
            const completadoHoy = (h.completadosHoy || []).includes(hoy);
            const racha = h.rachaActual || 0;
            const rachaMax = h.rachaMax || 0;

            return (
              <div key={h.id} className={`bg-[#111318] border rounded-2xl p-5 transition-all group ${completadoHoy ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/5 hover:border-white/10"}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all ${completadoHoy ? "bg-emerald-500/20" : "bg-white/5"}`}>
                      {h.icono || "📚"}
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">{h.nombre}</div>
                      <div className="text-xs text-white/30 mt-0.5">Meta: {h.meta} {h.unidad}</div>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                    <button onClick={() => setModal(h)} className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 text-white/30 text-xs flex items-center justify-center">✎</button>
                    <button onClick={() => { if (confirm("¿Eliminar?")) delHabito(h.id); }} className="w-6 h-6 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs flex items-center justify-center">×</button>
                  </div>
                </div>

                {/* Racha */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-orange-400">🔥</span>
                    <span className="text-xl font-bold text-white">{racha}</span>
                    <span className="text-xs text-white/30">días</span>
                  </div>
                  <div className="text-xs text-white/20">Máx: {rachaMax}</div>
                </div>

                <button
                  onClick={() => completarHabito(h.id)}
                  disabled={completadoHoy}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                    completadoHoy
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 cursor-default"
                      : "bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/20 text-indigo-300 hover:text-white"
                  }`}>
                  {completadoHoy ? "✓ Completado hoy" : "Marcar como hecho"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
