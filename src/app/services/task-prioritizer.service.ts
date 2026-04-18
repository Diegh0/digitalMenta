import { Injectable } from '@angular/core';
import { TaskInput, AIResponse, PrioritizedTask } from '../models/task.models';

@Injectable({ providedIn: 'root' })
export class TaskPrioritizerService {

  async prioritizeWithAI(input: TaskInput): Promise<AIResponse> {
    return this.prioritize(input);
  }

  prioritize(input: TaskInput): AIResponse {
    const nombres = this.parsear(input.rawTasks);
    const tareas = nombres.map(n => this.puntuar(n, input.energyLevel, input.timeAvailable));
    tareas.sort((a, b) => b.score - a.score);

    const total = tareas.length;
    const nTop  = Math.min(3, total);
    const nMid  = Math.min(3, Math.max(0, total - nTop));

    const top  = tareas.slice(0, nTop);
    const mid  = tareas.slice(nTop, nTop + nMid);
    const late = tareas.slice(nTop + nMid);

    const toCard = (t: any, tipo: string): PrioritizedTask => ({
      name: t.nombre,
      reason: this.razon(t, tipo, input.energyLevel),
      estimatedTime: t.dur.t
    });

    const tC = top.map(t => toCard(t, 'priority'));
    const mC = mid.map(t => toCard(t, 'secondary'));
    const lC = late.map(t => toCard(t, 'postpone'));

    return {
      topPriority: tC,
      secondary: mC,
      postpone: lC,
      dailyPlan: { startWith: tC.slice(0, 2), thenDo: mC.slice(0, 2), leaveForLater: lC.slice(0, 2) },
      motivationalNote: this.nota(input.energyLevel, input.timeAvailable, total, nTop)
    };
  }

  private parsear(raw: string): string[] {
    return raw.split(/\n|,|;/).map(t => t.replace(/^[-•*\d.)]+\s*/, '').trim()).filter(t => t.length > 2);
  }

  private readonly SIGNALS: Record<string, { palabras: string[]; peso: number }> = {
    urgencia:     { palabras: ['urgente','asap','hoy mismo','deadline','fecha límite','vence','entregar','enviar','reunión','meeting','llamar','confirmar','pagar','factura','firmar','cliente','jefe','jefa','director','bloqueado','necesitan'], peso: 35 },
    cognitivo:    { palabras: ['crear','diseñar','desarrollar','programar','escribir','redactar','analizar','revisar contrato','revisar propuesta','preparar presentación','preparar informe','planificar proyecto','arquitectura','resolver'], peso: 12 },
    rutina:       { palabras: ['revisar email','responder email','leer','ver','mirar','organizar','ordenar','actualizar','subir','descargar','imprimir','escanear','comprar','recoger'], peso: -5 },
    desbloqueador:{ palabras: ['para poder','depende de','necesario para','sin esto no','bloqueante'], peso: 20 },
    aplazable:    { palabras: ['cuando pueda','si hay tiempo','algún día','eventualmente','me gustaría','explorar','quizás','tal vez','a largo plazo','para el futuro','idealmente'], peso: -30 },
    estaSemana:   { palabras: ['esta semana','antes del viernes','antes del jueves','antes del miércoles','antes del martes','antes del lunes'], peso: 15 },
    bienestar:    { palabras: ['ejercicio','entrenar','gimnasio','gym','correr','running','caminar','yoga','pilates','estirar','meditar','meditación','descansar','dormir','terapia','médico','doctor','deporte','bicicleta','nadar','natación','mindfulness'], peso: 22 }
  };

  private readonly DURACION = [
    { pat: /\b(llamar|confirmar|responder|email|correo|slack|mensaje|whatsapp|imprimir|escanear|subir|descargar)\b/i, t: '~15 min', m: 15 },
    { pat: /\b(revisar|leer|ver|mirar|actualizar|ordenar|organizar|comprar|meditar|estirar|desayunar)\b/i,           t: '~30 min', m: 30 },
    { pat: /\b(ejercicio|entrenar|gimnasio|correr|caminar|yoga|pilates|bicicleta|nadar|deporte|preparar|redactar|escribir|crear|diseñar|analizar|investigar|reunión|meeting)\b/i, t: '~1 h', m: 60 },
    { pat: /\b(desarrollar|programar|construir|implementar|arquitectura|proyecto)\b/i,                               t: '~2–4 h', m: 180 }
  ];

  private readonly TMIN: Record<string, number> = { '<1h': 60, '1-2h': 120, '2-4h': 240, '4h+': 480 };

  private estDur(nombre: string) {
    for (const d of this.DURACION) { if (d.pat.test(nombre)) return d; }
    return { t: '~30–60 min', m: 45 };
  }

  private puntuar(nombre: string, energia: string, tiempo: string) {
    const low = nombre.toLowerCase();
    let score = 50;
    const fac: { tipo: string; peso: number }[] = [];

    for (const [tipo, cfg] of Object.entries(this.SIGNALS)) {
      for (const kw of cfg.palabras) {
        if (low.includes(kw)) { score += cfg.peso; if (cfg.peso > 0) fac.push({ tipo, peso: cfg.peso }); break; }
      }
    }

    const dur = this.estDur(nombre);
    const maxM = this.TMIN[tiempo] ?? 120;
    if (dur.m > maxM)          { score -= 25; fac.push({ tipo: 'no_cabe',  peso: -25 }); }
    else if (dur.m <= maxM * 0.25) score += 8;

    const esCog  = this.SIGNALS['cognitivo'].palabras.some(k => low.includes(k));
    const esRut  = this.SIGNALS['rutina'].palabras.some(k => low.includes(k));
    const esBien = this.SIGNALS['bienestar'].palabras.some(k => low.includes(k));

    if (energia === 'alta' && esCog)  { score += 15; fac.push({ tipo: 'energia_match',  peso: 15 }); }
    if (energia === 'baja' && esCog)  { score -= 20; fac.push({ tipo: 'energia_mismatch', peso: -20 }); }
    if (energia === 'baja' && esRut)  { score += 10; fac.push({ tipo: 'rutina_ok',       peso: 10 }); }
    if (energia === 'media' && esCog)   score += 5;
    if (esBien) {
      if (energia === 'baja') { score += 10; fac.push({ tipo: 'bienestar_boost', peso: 10 }); }
      fac.push({ tipo: 'bienestar', peso: 0 });
    }

    return { nombre, score: Math.max(0, Math.min(100, score)), fac, dur };
  }

  private razon(t: any, tipo: string, energia: string): string {
    const { fac, dur } = t;
    const has = (x: string) => fac.some((f: any) => f.tipo === x);
    const urg    = has('urgencia');
    const desb   = has('desbloqueador');
    const noCabe = has('no_cabe');
    const mism   = has('energia_mismatch');
    const aplaz  = has('aplazable');
    const rut    = has('rutina_ok');
    const bien   = has('bienestar') || has('bienestar_boost');
    const bienB  = has('bienestar_boost');

    if (tipo === 'priority') {
      if (bien && urg)  return 'Urgente y además cuida tu energía. Hazlo: el resto del día irá mejor.';
      if (bien)         return bienB ? 'Con poca energía, esto es lo que necesitas. Te recarga para el resto.' : 'Cuida tu cuerpo y tu mente. Rindes mejor en todo lo demás cuando lo haces.';
      if (urg && desb)  return 'Es urgente y además desbloquea otras tareas. Va primero.';
      if (urg)          return 'Alguien espera una respuesta o acción de tu parte. No puede esperar más.';
      if (desb)         return 'Otras cosas dependen de que esto esté hecho. Hazlo y desbloquea el resto.';
      if (energia === 'alta') return `Tienes energía para abordarlo bien ahora. ${dur.t} de foco y listo.`;
      return 'Es la tarea con mayor impacto real en tu día según tu contexto.';
    }
    if (tipo === 'secondary') {
      if (bien)          return 'Importante para tu bienestar. Si acabas las prioridades, no te lo saltes.';
      if (noCabe)        return `Puede que no te dé tiempo hoy (${dur.t}), pero empiézalo si terminas antes.`;
      if (energia === 'baja') return 'Importante, pero espera a que hayas hecho lo esencial primero.';
      if (rut)           return `Tarea de rutina (${dur.t}). Fácil de meter entre medias.`;
      return 'Vale la pena hacerlo hoy si terminas las prioridades. Sin urgencia inmediata.';
    }
    if (aplaz)  return 'Lo marcaste como algo sin urgencia. Agéndalo para otro día sin culpa.';
    if (mism)   return 'Requiere foco profundo y hoy tienes poca energía. Mejor mañana.';
    if (noCabe) return `Con el tiempo disponible hoy (${dur.t} estimado) no encaja. Apártalo.`;
    return 'Sin urgencia real hoy. Queda registrado para que no lo pierdas.';
  }

  private nota(energia: string, tiempo: string, total: number, nTop: number): string {
    if (tiempo === '<1h' && energia === 'baja') return 'Solo tienes poco tiempo y poca energía. Una tarea. Solo una. Ya es suficiente.';
    if (energia === 'baja')                    return 'Hoy no es un día de máximo rendimiento, y está bien. Céntrate en lo esencial.';
    if (tiempo === '<1h')                      return `Poco tiempo, pero enfocado. ${nTop} tareas claras es todo lo que necesitas ahora.`;
    if (energia === 'alta' && tiempo === '4h+') return 'Tienes energía y tiempo. Buen día para cerrar cosas importantes.';
    return 'No tienes que hacer todo. Solo tienes que empezar. El resto va cayendo solo.';
  }
}
