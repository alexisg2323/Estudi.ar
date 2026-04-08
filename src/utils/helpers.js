export const PRIORIDADES = [
  { id: "alta",  label: "Alta",  color: "#ef4444", bg: "bg-red-500/15 text-red-400" },
  { id: "media", label: "Media", color: "#f59e0b", bg: "bg-amber-500/15 text-amber-400" },
  { id: "baja",  label: "Baja",  color: "#10b981", bg: "bg-emerald-500/15 text-emerald-400" },
];

export const ESTADOS = [
  { id: "pendiente",   label: "Pendiente",   color: "#6b7280" },
  { id: "en_progreso", label: "En progreso", color: "#3b82f6" },
  { id: "completada",  label: "Completada",  color: "#10b981" },
];

export const TIPOS_TAREA = [
  { id: "tarea",    label: "Tarea",    icon: "✓" },
  { id: "examen",   label: "Examen",   icon: "📝" },
  { id: "proyecto", label: "Proyecto", icon: "📁" },
  { id: "lectura",  label: "Lectura",  icon: "📖" },
];

export const COLORES_MATERIA = [
  "#6366f1","#8b5cf6","#ec4899","#ef4444",
  "#f59e0b","#10b981","#06b6d4","#3b82f6",
  "#84cc16","#f97316",
];

export const diasRestantes = (fecha) => {
  if (!fecha) return null;
  const diff = new Date(fecha + "T00:00:00") - new Date(new Date().toDateString());
  return Math.ceil(diff / 86400000);
};

export const formatFecha = (iso) => {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
};

export const labelDias = (n) => {
  if (n === null) return "";
  if (n < 0) return `${Math.abs(n)}d atrasada`;
  if (n === 0) return "Hoy";
  if (n === 1) return "Mañana";
  return `en ${n}d`;
};

export const prioridadInfo = (id) => PRIORIDADES.find(p => p.id === id) || PRIORIDADES[1];
export const estadoInfo    = (id) => ESTADOS.find(e => e.id === id) || ESTADOS[0];
