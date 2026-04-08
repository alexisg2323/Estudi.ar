import { useState, useRef, useEffect } from "react";

const MODOS = [
  { id: "chat",     icon: "💬", label: "Chat libre"    },
  { id: "resumir",  icon: "📄", label: "Resumir texto" },
  { id: "plan",     icon: "📅", label: "Plan de estudio" },
  { id: "explicar", icon: "💡", label: "Explicar tema" },
];

const PREGUNTAS_RAPIDAS = [
  "¿Qué debería estudiar hoy según mis tareas?",
  "Haceme un plan de estudio para esta semana",
  "¿Cuál es mi materia más atrasada?",
  "Dame tips para memorizar mejor",
  "¿Cómo organizo mi tiempo con los exámenes que tengo?",
];

function buildSystemPrompt(estudio) {
  const { data, tareasAtrasadas, proximosExamenes, horasEstudiadasHoy, horasEstudiadasSemana, rachaActual } = estudio;
  const atrasadas = tareasAtrasadas();
  const examenes  = proximosExamenes();
  const horas     = horasEstudiadasHoy().toFixed(1);
  const horasSem  = horasEstudiadasSemana().toFixed(1);
  const racha     = rachaActual();
  const hoy       = new Date().toISOString().slice(0, 10);

  return `Sos un asistente académico inteligente especializado en ayudar a estudiantes universitarios. Hablás en español argentino, sos directo, amigable y muy útil. Dás consejos prácticos y concretos.

DATOS DEL ESTUDIANTE:

Materias (${data.materias.length}):
${data.materias.map(m => `- ${m.nombre}${m.profesor ? ` (Prof. ${m.profesor})` : ""}`).join("\n") || "Sin materias cargadas"}

Tareas pendientes:
${data.tareas.filter(t => t.estado !== "completada").slice(0, 10).map(t => {
  const mat = data.materias.find(m => m.id === t.materiaId);
  const dias = t.vencimiento ? Math.ceil((new Date(t.vencimiento + "T00:00:00") - new Date(new Date().toDateString())) / 86400000) : null;
  return `- [${t.prioridad.toUpperCase()}] ${t.titulo}${mat ? ` (${mat.nombre})` : ""}${dias !== null ? ` → vence en ${dias}d` : ""}`;
}).join("\n") || "Sin tareas"}

Tareas atrasadas: ${atrasadas.length > 0 ? atrasadas.map(t => t.titulo).join(", ") : "Ninguna"}

Próximos exámenes:
${examenes.map(e => {
  const dias = Math.ceil((new Date(e.vencimiento + "T00:00:00") - new Date(new Date().toDateString())) / 86400000);
  return `- ${e.titulo}: en ${dias} días (${e.vencimiento})`;
}).join("\n") || "Sin exámenes próximos"}

Hábitos de estudio:
${data.habitos?.map(h => `- ${h.nombre}: racha de ${h.rachaActual || 0} días`).join("\n") || "Sin hábitos"}

Progreso:
- Horas estudiadas hoy: ${horas}h
- Horas esta semana: ${horasSem}h
- Racha actual: ${racha} días

Respondé siempre en español. Cuando des un plan, usá formato claro con días y horarios. Cuando expliques conceptos, usá ejemplos concretos. Sé motivador pero honesto.`;
}

export default function AsesorIA({ estudio }) {
  const [modo, setModo]         = useState("chat");
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "¡Hola! Soy tu asistente académico. Analicé tus materias, tareas y hábitos. ¿En qué te puedo ayudar hoy?\n\nPodés preguntarme sobre tu plan de estudio, pedirme que resuma un texto, explicarte un concepto o ayudarte a organizar tu semana.",
  }]);
  const [input, setInput]   = useState("");
  const [texto, setTexto]   = useState(""); // para modo resumir/explicar
  const [cargando, setCargando] = useState(false);
  const [error, setError]   = useState(null);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const buildPrompt = () => {
    if (modo === "resumir" && texto.trim()) return `Resumí el siguiente texto de manera clara y concisa para estudiar:\n\n${texto}`;
    if (modo === "plan") return input || "Creame un plan de estudio detallado para esta semana basado en mis materias, tareas y exámenes próximos.";
    if (modo === "explicar" && texto.trim()) return `Explicame el siguiente tema de manera simple y con ejemplos:\n\n${texto}`;
    return input;
  };

  const enviar = async () => {
    const msg = buildPrompt().trim();
    if (!msg || cargando) return;
    setInput(""); setTexto(""); setError(null);

    const newMessages = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setCargando(true);

    try {
      const systemPrompt = buildSystemPrompt(estudio);
      const historial = newMessages.slice(1).map(m => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: systemPrompt,
          messages: historial,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message || `Error ${response.status}`);

      const text = data.content?.find(b => b.type === "text")?.text;
      if (!text) throw new Error("Respuesta vacía");

      setMessages(prev => [...prev, { role: "assistant", content: text }]);
    } catch (err) {
      setError(err.message || "Error de conexión");
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto flex flex-col" style={{ height: "calc(100vh - 0px)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-lg">✦</div>
        <div>
          <h1 className="text-xl font-bold text-white">Asesor IA</h1>
          <p className="text-white/30 text-xs">Powered by Claude · Conoce tus materias y tareas</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400">En línea</span>
        </div>
      </div>

      {/* Modos */}
      <div className="flex gap-2 mb-4 flex-shrink-0">
        {MODOS.map(m => (
          <button key={m.id} onClick={() => setModo(m.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all
              ${modo === m.id ? "bg-indigo-600 border-indigo-600 text-white" : "border-white/10 text-white/40 hover:text-white/60 hover:bg-white/5"}`}>
            <span>{m.icon}</span>{m.label}
          </button>
        ))}
      </div>

      {/* Contexto */}
      <div className="bg-indigo-500/8 border border-indigo-500/15 rounded-xl p-3 mb-4 flex-shrink-0">
        <div className="flex gap-4 text-xs flex-wrap">
          <span className="text-white/30">Materias <span className="text-white/60">{estudio.data.materias.length}</span></span>
          <span className="text-white/30">Pendientes <span className="text-white/60">{estudio.data.tareas.filter(t=>t.estado!=="completada").length}</span></span>
          <span className="text-white/30">Racha <span className="text-amber-400 font-medium">{estudio.rachaActual()}d 🔥</span></span>
          <span className="text-white/30">Hoy <span className="text-white/60">{estudio.horasEstudiadasHoy().toFixed(1)}h</span></span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-0">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 flex items-center justify-center text-sm mr-2 mt-0.5 flex-shrink-0">✦</div>
            )}
            <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap
              ${m.role === "user"
                ? "bg-indigo-600 text-white rounded-br-sm"
                : "bg-[#1a1d27] border border-white/8 text-white/80 rounded-bl-sm"}`}>
              {m.content}
            </div>
          </div>
        ))}
        {cargando && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 flex items-center justify-center mr-2 flex-shrink-0">✦</div>
            <div className="bg-[#1a1d27] border border-white/8 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1.5">{[0,150,300].map(d => (
                <div key={d} className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{animationDelay:`${d}ms`}} />
              ))}</div>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">⚠ {error}</div>
        )}
        <div ref={endRef} />
      </div>

      {/* Texto para resumir/explicar */}
      {(modo === "resumir" || modo === "explicar") && (
        <textarea value={texto} onChange={e => setTexto(e.target.value)} rows={3}
          placeholder={modo === "resumir" ? "Pegá el texto a resumir..." : "Escribí el tema que querés que te explique..."}
          className="flex-shrink-0 bg-[#1a1d27] border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-indigo-500 resize-none mb-3" />
      )}

      {/* Preguntas rápidas */}
      {modo === "chat" && (
        <div className="flex gap-2 flex-wrap mb-3 flex-shrink-0">
          {PREGUNTAS_RAPIDAS.map((q, i) => (
            <button key={i} onClick={() => { setInput(q); }} disabled={cargando}
              className="text-xs bg-white/5 hover:bg-white/10 border border-white/8 text-white/50 hover:text-white/70 px-3 py-1.5 rounded-xl transition-colors disabled:opacity-30">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3 flex-shrink-0">
        {(modo === "chat" || modo === "plan") && (
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && enviar()}
            disabled={cargando}
            placeholder={modo === "plan" ? "Agregá detalles opcionales..." : "Preguntá sobre tus estudios..."}
            className="flex-1 bg-[#1a1d27] border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-indigo-500 disabled:opacity-50"
          />
        )}
        <button onClick={enviar} disabled={cargando || (modo === "chat" && !input.trim()) || ((modo === "resumir" || modo === "explicar") && !texto.trim())}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white px-5 py-3 rounded-xl text-sm font-medium transition-colors">
          {cargando ? "..." : "→"}
        </button>
      </div>
    </div>
  );
}
