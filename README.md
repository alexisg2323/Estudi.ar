# Estudiar — App de gestión universitaria

App completa para estudiantes universitarios con IA integrada.

## Funcionalidades

- **Dashboard** — resumen del día, sugerencias inteligentes, progreso
- **Materias** — gestión completa con horarios, links y notas
- **Tareas** — sistema completo con subtareas, prioridad y filtros
- **Calendario** — vista semanal con tareas y exámenes
- **Hábitos** — sistema de rachas y objetivos diarios
- **Asesor IA** — chat con Claude que conoce tus materias y tareas

## Setup

### 1. Instalá dependencias
```bash
npm install
```

### 2. Configurá Firebase
Editá `src/firebase.js` con tu configuración:
- Creá un proyecto en console.firebase.google.com
- Habilitá Authentication (Email/Contraseña + Google)
- Creá una base de datos Firestore en modo prueba
- Copiá la configuración del SDK web

### 3. Configurá las reglas de Firestore
En Firebase Console → Firestore → Reglas:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /estudiar/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Corré la app
```bash
npm run dev
```

## Deploy en Vercel

1. Subí el proyecto a GitHub
2. Conectá con Vercel
3. En Build Settings:
   - Build Command: `node node_modules/vite/bin/vite.js build`
   - Output Directory: `dist`
4. La carpeta `api/` se convierte automáticamente en serverless functions

## Estructura

```
src/
├── App.jsx
├── firebase.js
├── main.jsx
├── index.css
├── components/
│   ├── PantallaAuth.jsx
│   ├── Sidebar.jsx
│   ├── Dashboard.jsx
│   ├── Materias.jsx
│   ├── Tareas.jsx
│   ├── Calendario.jsx
│   ├── Habitos.jsx
│   └── AsesorIA.jsx
├── hooks/
│   ├── useAuth.js
│   └── useEstudio.js
└── utils/
    └── helpers.js
api/
└── claude.js    ← Proxy para Anthropic (evita CORS)
```
