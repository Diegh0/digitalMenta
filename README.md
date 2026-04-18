# 📋 Organiza tu día

Una aplicación web minimalista construida con **Angular 19** que ayuda a los usuarios a priorizar sus tareas del día según su nivel de energía y el tiempo disponible.

---

## 🎯 Problema que resuelve

Los usuarios se sienten abrumados cuando tienen muchas tareas y no saben por dónde empezar. Esto genera estrés y procrastinación. Esta app ayuda a tomar acción rápida con un plan claro y sin fricción.

---

## ✨ Funcionalidades

- Entrada libre de tareas (una por línea o separadas por coma)
- Selector de nivel de energía: baja / media / alta
- Selector de tiempo disponible: <1h / 1-2h / 2-4h / 4h+
- Resultado con:
  - **Top 3 tareas prioritarias** (con razón explicada)
  - **Tareas secundarias** (si quedan energía y tiempo)
  - **Tareas a posponer** (sin culpa)
  - **Plan diario simple** (empieza con → luego haz → deja para después)

---

## 🛠 Tecnología

| Elemento         | Detalle                          |
|------------------|----------------------------------|
| Framework        | Angular 19 (Standalone Components) |
| Formularios      | `FormsModule` con `ngModel`      |
| Estilos          | CSS encapsulado por componente   |
| Fuente           | DM Sans (Google Fonts)           |
| Lógica de IA     | Algoritmo de puntuación local    |
| Backend          | Ninguno (100% frontend)          |

---

## 📁 Estructura del proyecto

```
task-prioritizer/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── task-input/         # Formulario de entrada
│   │   │   │   └── task-input.component.ts
│   │   │   ├── results/            # Vista de resultados
│   │   │   │   └── results.component.ts
│   │   │   ├── task-group/         # Grupo de tareas (prioritarias, secundarias, etc.)
│   │   │   │   └── task-group.component.ts
│   │   │   └── task-card/          # Tarjeta individual de tarea
│   │   │       └── task-card.component.ts
│   │   ├── models/
│   │   │   └── task.models.ts      # Interfaces TypeScript
│   │   ├── services/
│   │   │   └── task-prioritizer.service.ts  # Lógica de priorización
│   │   └── app.component.ts        # Componente raíz
│   ├── main.ts                     # Bootstrap de la app
│   ├── index.html                  # HTML principal
│   └── styles.css                  # Estilos globales
├── index.html                      # ⚡ Versión standalone (sin build)
├── angular.json
├── package.json
└── tsconfig.json
```

---

## 🚀 Cómo usar

### Opción 1 — Versión standalone (sin instalación)

Abre directamente el archivo `index.html` en tu navegador. Funciona sin build ni dependencias.

### Opción 2 — Proyecto Angular completo

```bash
# 1. Instalar dependencias
npm install

# 2. Arrancar el servidor de desarrollo
npm start

# 3. Abrir en el navegador
# http://localhost:4200
```

### Build de producción

```bash
npm run build
# Los archivos se generan en dist/task-prioritizer/
```

---

## 🧠 Lógica de priorización

El servicio `TaskPrioritizerService` asigna una puntuación (0–100) a cada tarea basándose en:

| Factor                     | Ajuste de puntuación       |
|----------------------------|----------------------------|
| Palabras de urgencia       | +20 puntos                 |
| Tareas pesadas + energía alta | +10 puntos              |
| Tareas ligeras + energía baja | +10 puntos              |
| Tareas pesadas + energía baja | -10 puntos              |
| Tarea larga + poco tiempo  | -15 puntos                 |
| Mucho tiempo disponible    | +5 puntos                  |

Las tareas se ordenan por puntuación y se distribuyen:
- **Top 3** → Prioritarias
- **4ª a 6ª** → Secundarias
- **7ª en adelante** → Posponer

---

## 🎨 Decisiones de diseño

- **Una sola pantalla**: el input se reemplaza visualmente por los resultados
- **Sin sidebar, sin dashboard**: foco total en la tarea actual
- **Paleta monocromática** con un único acento azul (`#3B82F6`)
- **Tipografía DM Sans**: moderna, legible y sin exceso de carácter
- **Max-width 660px**: columna centrada que no fatiga la vista
- **Animación mínima**: solo `fadeIn` en la transición al resultado

---

## 📐 Interfaces TypeScript

```typescript
export type EnergyLevel = 'baja' | 'media' | 'alta';
export type TimeAvailable = '<1h' | '1-2h' | '2-4h' | '4h+';

export interface TaskInput {
  rawTasks: string;
  energyLevel: EnergyLevel;
  timeAvailable: TimeAvailable;
}

export interface PrioritizedTask {
  name: string;
  reason: string;
  estimatedTime?: string;
}

export interface AIResponse {
  topPriority: PrioritizedTask[];
  secondary: PrioritizedTask[];
  postpone: PrioritizedTask[];
  dailyPlan: DailyPlan;
  motivationalNote: string;
}
```

---

## 📦 Componentes principales

| Componente              | Responsabilidad                                      |
|-------------------------|------------------------------------------------------|
| `AppComponent`          | Estado global: muestra input o resultados            |
| `TaskInputComponent`    | Formulario con textarea, selectores y botón submit   |
| `ResultsComponent`      | Renderiza grupos de tareas y el plan diario          |
| `TaskGroupComponent`    | Agrupa tarjetas con título, ícono y contador         |
| `TaskCardComponent`     | Muestra una tarea con nombre, tiempo y razón         |
| `TaskPrioritizerService`| Parsea, puntúa y ordena las tareas                   |

---

## 💡 Posibles mejoras futuras

- [ ] Integración con Claude API para razonamiento más inteligente
- [ ] Exportar el plan como texto o PDF
- [ ] Historial de sesiones (localStorage)
- [ ] Modo oscuro
- [ ] Animaciones de entrada por tarea (stagger)
- [ ] Arrastrar para reordenar tareas manualmente

---

> *"No necesitas hacer todo. Solo necesitas empezar."*
