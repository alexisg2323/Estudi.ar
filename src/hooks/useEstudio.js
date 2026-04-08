import { useState, useEffect, useCallback, useRef } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const empty = () => ({
  materias: [],
  tareas: [],
  habitos: [],
  sesiones: [], // sesiones de estudio
  config: { horasObjetivoDiarias: 3, recordatorios: true },
});

export function useEstudio(uid) {
  const [data, setData]           = useState(empty());
  const [cargando, setCargando]   = useState(true);
  const [guardando, setGuardando] = useState(false);
  const timer  = useRef(null);
  const skip   = useRef(false);

  useEffect(() => {
    if (!uid) { setCargando(false); return; }
    const ref = doc(db, "estudiar", uid);
    const unsub = onSnapshot(ref, snap => {
      if (!skip.current)
        setData(snap.exists() ? { ...empty(), ...snap.data() } : empty());
      skip.current = false;
      setCargando(false);
    }, () => setCargando(false));
    return unsub;
  }, [uid]);

  const save = useCallback((next) => {
    if (!uid) return;
    skip.current = true;
    clearTimeout(timer.current);
    setGuardando(true);
    timer.current = setTimeout(() => {
      setDoc(doc(db, "estudiar", uid), next, { merge: true })
        .finally(() => setGuardando(false));
    }, 600);
  }, [uid]);

  const set = useCallback((updater) => {
    setData(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      save(next);
      return next;
    });
  }, [save]);

  const id = () => Date.now() + Math.random().toString(36).slice(2);
  const hoy = () => new Date().toISOString().slice(0, 10);

  // ── MATERIAS ──
  const addMateria = (m) => set(d => ({ ...d, materias: [...d.materias, { id: id(), color: "#6366f1", ...m }] }));
  const editMateria = (mid, c) => set(d => ({ ...d, materias: d.materias.map(m => m.id === mid ? { ...m, ...c } : m) }));
  const delMateria  = (mid) => set(d => ({ ...d, materias: d.materias.filter(m => m.id !== mid), tareas: d.tareas.filter(t => t.materiaId !== mid) }));

  // ── TAREAS ──
  const addTarea = (t) => set(d => ({ ...d, tareas: [...d.tareas, { id: id(), estado: "pendiente", prioridad: "media", subtareas: [], ...t, creadaEn: hoy() }] }));
  const editTarea = (tid, c) => set(d => ({ ...d, tareas: d.tareas.map(t => t.id === tid ? { ...t, ...c } : t) }));
  const delTarea  = (tid) => set(d => ({ ...d, tareas: d.tareas.filter(t => t.id !== tid) }));
  const toggleTarea = (tid) => set(d => ({
    ...d,
    tareas: d.tareas.map(t => t.id === tid
      ? { ...t, estado: t.estado === "completada" ? "pendiente" : "completada", completadaEn: t.estado !== "completada" ? hoy() : null }
      : t)
  }));
  const addSubtarea = (tid, texto) => set(d => ({
    ...d,
    tareas: d.tareas.map(t => t.id === tid
      ? { ...t, subtareas: [...(t.subtareas || []), { id: id(), texto, done: false }] }
      : t)
  }));
  const toggleSubtarea = (tid, sid) => set(d => ({
    ...d,
    tareas: d.tareas.map(t => t.id === tid
      ? { ...t, subtareas: t.subtareas.map(s => s.id === sid ? { ...s, done: !s.done } : s) }
      : t)
  }));

  // ── HÁBITOS ──
  const addHabito = (h) => set(d => ({ ...d, habitos: [...d.habitos, { id: id(), rachaActual: 0, rachaMax: 0, completadosHoy: [], ...h }] }));
  const editHabito = (hid, c) => set(d => ({ ...d, habitos: d.habitos.map(h => h.id === hid ? { ...h, ...c } : h) }));
  const delHabito  = (hid) => set(d => ({ ...d, habitos: d.habitos.filter(h => h.id !== hid) }));
  const completarHabito = (hid) => {
    const fecha = hoy();
    set(d => ({
      ...d,
      habitos: d.habitos.map(h => {
        if (h.id !== hid) return h;
        const yaCompletado = (h.completadosHoy || []).includes(fecha);
        if (yaCompletado) return h;
        const ayer = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const rachaActual = (h.completadosHoy || []).includes(ayer) ? (h.rachaActual || 0) + 1 : 1;
        return { ...h, rachaActual, rachaMax: Math.max(rachaActual, h.rachaMax || 0), completadosHoy: [...(h.completadosHoy || []), fecha] };
      })
    }));
  };

  // ── SESIONES DE ESTUDIO ──
  const addSesion = (s) => set(d => ({ ...d, sesiones: [...(d.sesiones || []), { id: id(), fecha: hoy(), ...s }] }));

  // ── COMPUTED ──
  const tareasDeHoy = () => {
    const h = hoy();
    return data.tareas.filter(t => t.vencimiento === h && t.estado !== "completada");
  };

  const tareasAtrasadas = () => {
    const h = hoy();
    return data.tareas.filter(t => t.vencimiento && t.vencimiento < h && t.estado !== "completada");
  };

  const proximosExamenes = () => {
    const h = hoy();
    return data.tareas
      .filter(t => t.tipo === "examen" && t.vencimiento >= h && t.estado !== "completada")
      .sort((a, b) => a.vencimiento.localeCompare(b.vencimiento))
      .slice(0, 5);
  };

  const horasEstudiadasHoy = () => {
    const h = hoy();
    return (data.sesiones || [])
      .filter(s => s.fecha === h)
      .reduce((sum, s) => sum + (s.minutos || 0), 0) / 60;
  };

  const horasEstudiadasSemana = () => {
    const desde = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
    return (data.sesiones || [])
      .filter(s => s.fecha >= desde)
      .reduce((sum, s) => sum + (s.minutos || 0), 0) / 60;
  };

  const progresoPorMateria = () => {
    return data.materias.map(m => {
      const tareas = data.tareas.filter(t => t.materiaId === m.id);
      const comp   = tareas.filter(t => t.estado === "completada").length;
      return { ...m, total: tareas.length, completadas: comp, pct: tareas.length > 0 ? Math.round((comp / tareas.length) * 100) : 0 };
    });
  };

  const rachaHoy = () => {
    const h = hoy();
    return (data.sesiones || []).some(s => s.fecha === h);
  };

  const rachaActual = () => {
    let racha = 0;
    const d = new Date();
    while (true) {
      const fecha = d.toISOString().slice(0, 10);
      if (!(data.sesiones || []).some(s => s.fecha === fecha)) break;
      racha++;
      d.setDate(d.getDate() - 1);
    }
    return racha;
  };

  return {
    data, cargando, guardando,
    addMateria, editMateria, delMateria,
    addTarea, editTarea, delTarea, toggleTarea, addSubtarea, toggleSubtarea,
    addHabito, editHabito, delHabito, completarHabito,
    addSesion,
    tareasDeHoy, tareasAtrasadas, proximosExamenes,
    horasEstudiadasHoy, horasEstudiadasSemana,
    progresoPorMateria, rachaHoy, rachaActual,
  };
}
