# Organizador de tareas por contexto

Aplicación web que ayuda a priorizar tareas del día cruzando lo que tienes pendiente con tu energía y tiempo disponibles.

---
## Demo

[Ver demo en Loom](https://www.loom.com/share/5fe3d5aab96d473d9055ecaeafcec73e)

---

## Problema

Las listas de tareas no resuelven el problema real: saber por cuál empezar.

Tener diez cosas pendientes con poca energía o poco tiempo genera parálisis. La mayoría de apps de productividad te piden que organices, etiquetes y planifiques, cuando lo que el usuario necesita en ese momento es una respuesta clara: *¿qué hago ahora mismo?*

---

## Solución

El usuario introduce sus tareas en texto libre, indica su nivel de energía actual (baja / media / alta) y el tiempo disponible (menos de 1h hasta más de 4h). La app procesa esa información con un algoritmo de puntuación semántica y devuelve:

- Las 3 tareas más relevantes para ese contexto concreto
- Tareas secundarias si sobra tiempo
- Tareas a posponer sin culpa
- Un plan de acción secuencial: empieza con → luego haz → deja para después

No requiere cuenta, no guarda datos, no tiene backend. Funciona en el momento.

---

## Funcionalidades

- Entrada de tareas en texto libre (una por línea, coma o punto y coma)
- Selector de energía con tres niveles: baja, media, alta
- Selector de tiempo disponible: menos de 1h / 1–2h / 2–4h / más de 4h
- Algoritmo de priorización que cruza urgencia, carga cognitiva, bienestar físico, duración estimada y energía disponible
- Razón específica por tarea explicando por qué está en ese grupo
- Plan diario en tres pasos con orden de ejecución
- Nota motivacional adaptada al contexto del usuario
- Diseño dark UI, responsive, con iconografía SVG

---

## Tech Stack

| Elemento | Detalle |
|---|---|
| Framework | Angular 19 — Standalone Components, sin NgModule |
| Formularios | `FormsModule` con `ngModel` |
| Estilos | CSS encapsulado por componente + variables CSS globales |
| Lógica de priorización | Algoritmo de puntuación local en TypeScript puro |
| Backend | Ninguno — 100% frontend |

---

## Estructura del proyecto

```
task-prioritizer/
├── index.html                          # Versión standalone (sin build ni npm)
└── src/
    ├── styles.css                      # Variables CSS y reset global
    ├── main.ts                         # Bootstrap Angular
    ├── index.html                      # Entry point Angular
    └── app/
        ├── app.component.ts            # Raíz — gestiona el estado global
        ├── models/
        │   └── task.models.ts          # Interfaces TypeScript
        ├── services/
        │   └── task-prioritizer.service.ts   # Motor de priorización
        └── components/
            ├── task-input/             # Formulario de entrada
            ├── results/                # Vista de resultados
            ├── task-group/             # Grupo de tareas con cabecera
            └── task-card/             # Tarjeta individual de tarea
```

---

## Cómo ejecutar en local

**Proyecto Angular completo**

```bash
# Clonar o descomprimir el proyecto
cd task-prioritizer

# Instalar dependencias
npm install

# Arrancar servidor de desarrollo
ng serve

# Abrir en el navegador
# http://localhost:4200
```

```bash
# Build de producción
npm run build
# Salida en dist/task-prioritizer/
```

Requisitos: Node.js 18+ y Angular CLI instalado globalmente (`npm install -g @angular/cli`).

---

## Uso de IA

**Herramientas utilizadas: Claude (Anthropic) y ChatGPT (OpenAI)**

El flujo de trabajo fue deliberado: ChatGPT actuó como asistente de prompt engineering para estructurar y redactar en inglés los prompts más importantes antes de enviarlos a Claude. El criterio, la dirección y el detalle de qué construir eran propios — ChatGPT ayudó a formularlos con precisión técnica. La ejecución real (código, diseño, lógica) la realizó Claude.

**Arquitectura y scaffolding**
La idea de qué construir y cómo estructurarlo era propia. ChatGPT ayudó a convertir ese criterio en un prompt técnico en inglés con los requisitos bien delimitados. Claude tomó ese prompt y generó la base del proyecto: estructura de carpetas, interfaces TypeScript y componentes standalone de Angular 19.

**Diseño del algoritmo de priorización**
Las necesidades concretas partían del criterio propio — por ejemplo, dar peso al bienestar físico porque ayuda a rendir mejor el resto del día. Claude tradujo esa lógica en señales semánticas con pesos diferenciados, cruce con energía disponible y tiempo, y razones específicas por tarea en lugar de mensajes genéricos.

**Rediseño visual**
La dirección estética (dark UI, sin emojis, iconografía SVG, tipografía técnica) era una decisión propia. ChatGPT ayudó a estructurar el prompt de diseño en inglés con las restricciones técnicas necesarias para que Claude lo interpretara sin ambigüedad. Claude generó el mockup de referencia y aplicó el sistema de diseño a todos los componentes.

---

## Registro de prompts

**Prompt 1 — Especificación inicial del proyecto**

> *"Build a simple, clean and high-quality web app using Angular (latest version). The user inputs a raw list of tasks, their energy level and available time. The app outputs top 3 priority tasks, secondary tasks, tasks to postpone, a short reason for each task, and a simple daily plan."*

Funcionó porque era específico en inputs, outputs y estructura esperada. No dejaba espacio a interpretación sobre qué construir. Claude generó la arquitectura de componentes y los modelos TypeScript directamente desde este prompt sin necesidad de aclaraciones.

---

**Prompt 2 — Mejora del algoritmo de priorización**

> *"Me gusta el nuevo algoritmo pero quiero que cosas como el ejercicio se le dé cierto peso ya que es salud y te ayuda a despejar la mente para futuras tareas."*

Prompt corto pero con razonamiento propio incluido ("ayuda a despejar la mente"). Eso fue clave: Claude no solo añadió palabras clave de bienestar sino que diseñó una lógica adicional donde las tareas de bienestar reciben un boost extra cuando la energía es baja, que es exactamente cuando más se necesitan.

---

**Prompt 3 — Rediseño visual completo**

> *"Redesign my task organization app UI to achieve a premium, minimal, and elegant aesthetic. The current design feels too basic, childish (emojis), and lacks visual impact. Dark UI (primary background: #0f0f0f). Remove all emojis, replace with subtle SVG iconography. Accent color: muted blue. Make the input area feel important and central."*

Funcionó por la combinación de problema concreto ("childish, emojis"), referencia de productos reales (Linear, Notion dark mode) y restricciones técnicas claras (color hex, tipo de iconografía). Claude generó primero un mockup visual de referencia y después aplicó el diseño a todos los componentes Angular.

*"El prompt 1 y 3 al ser tan extensos no estan puestos aqui en su totalidad, por eso adjunto en el proyecto un txt con los promps completos"*
---

## Mejoras con más tiempo

- **Persistencia local**: guardar el historial de sesiones con `localStorage` para que el usuario pueda revisar planes anteriores
- **Exportación**: generar el plan diario como texto plano o PDF descargable
- **Arrastrar para reordenar**: permitir al usuario ajustar manualmente el orden antes de confirmar el plan
- **Integración opcional con LLM**: conectar a Claude API o similar para tareas con contexto complejo que el algoritmo semántico no puede inferir (ej: "terminar lo de ayer con Pedro")
- **Modo de revisión nocturna**: variante del flujo donde el usuario planifica el día siguiente antes de dormir

---

> La IA se usó como acelerador técnico, no como sustituto del criterio de diseño. Cada decisión de arquitectura, lógica y UI fue revisada, cuestionada e iterada durante el proceso.
