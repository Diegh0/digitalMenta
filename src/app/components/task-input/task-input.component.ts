import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskInput, EnergyLevel, TimeAvailable } from '../../models/task.models';

@Component({
  selector: 'app-task-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form" [@.disabled]="true">

      <div class="field">
        <label class="field__label">Tareas de hoy</label>
        <p class="field__hint">Una por línea o separadas por coma — sin filtros, sin orden.</p>
        <textarea
          class="field__textarea"
          [(ngModel)]="rawTasks"
          (ngModelChange)="onTasksChange()"
          rows="7"
          placeholder="Preparar presentación del cliente
Llamar al banco
Sesión de gimnasio
Revisar contrato Q3
Responder emails urgentes">
        </textarea>
      </div>

      <div class="selectors">
        <div class="field">
          <label class="field__label">Nivel de energía</label>
          <div class="seg">
            <button *ngFor="let o of energyOpts" class="seg__btn" [class.seg__btn--on]="energyLevel === o.value" (click)="energyLevel = o.value">
              {{ o.label }}
            </button>
          </div>
        </div>

        <div class="field">
          <label class="field__label">Tiempo disponible</label>
          <div class="time-stack">
            <button *ngFor="let o of timeOpts" class="time-btn" [class.time-btn--on]="timeAvailable === o.value" (click)="timeAvailable = o.value">
              {{ o.label }}
            </button>
          </div>
        </div>
      </div>

      <div class="cta-wrap">
        <button class="cta" [class.cta--disabled]="!isValid()" [disabled]="!isValid()" (click)="submit()">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
          Organizar mi día
        </button>
        <span class="cta-hint" *ngIf="!isValid()">Añade al menos una tarea para continuar</span>
      </div>

    </div>
  `,
  styles: [`
    .form { display: flex; flex-direction: column; gap: 32px; animation: fadeUp 0.35s ease; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

    .field { display: flex; flex-direction: column; gap: 8px; }
    .field__label { font-size: 10px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #3a3a3a; }
    .field__hint { font-size: 12px; color: #333; margin-top: -2px; line-height: 1.5; }

    .field__textarea {
      width: 100%;
      background: #141414;
      border: 1px solid #1e1e1e;
      border-radius: 10px;
      padding: 16px;
      color: #b0b0b0;
      font-size: 13.5px;
      line-height: 1.75;
      font-family: inherit;
      resize: none;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      caret-color: #3b5bdb;
    }
    .field__textarea::placeholder { color: #2e2e2e; line-height: 1.75; }
    .field__textarea:hover { border-color: #262626; }
    .field__textarea:focus { border-color: rgba(59,91,219,0.5); box-shadow: 0 0 0 3px rgba(59,91,219,0.07); }

    .selectors { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    @media (max-width: 500px) { .selectors { grid-template-columns: 1fr; } }

    .seg { display: flex; gap: 4px; }
    .seg__btn {
      flex: 1; padding: 9px 0;
      background: #141414; border: 1px solid #1e1e1e; border-radius: 8px;
      color: #3a3a3a; font-size: 12px; font-weight: 500; font-family: inherit;
      cursor: pointer; text-align: center; transition: all 0.15s;
    }
    .seg__btn:hover { border-color: #2a2a2a; color: #666; }
    .seg__btn--on { background: #1a1f2e; border-color: #3b5bdb; color: #7c9ef8; }

    .time-stack { display: flex; flex-direction: column; gap: 4px; }
    .time-btn {
      padding: 9px 14px;
      background: #141414; border: 1px solid #1e1e1e; border-radius: 8px;
      color: #3a3a3a; font-size: 12px; font-weight: 500; font-family: inherit;
      cursor: pointer; text-align: left; transition: all 0.15s;
    }
    .time-btn:hover { border-color: #2a2a2a; color: #666; }
    .time-btn--on { background: #1a1f2e; border-color: #3b5bdb; color: #7c9ef8; }

    .cta-wrap { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }

    .cta {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 13px 22px;
      background: #3b5bdb; color: #fff;
      border: none; border-radius: 10px;
      font-size: 13.5px; font-weight: 500; font-family: inherit;
      cursor: pointer; transition: background 0.2s, transform 0.1s;
      letter-spacing: 0.01em;
    }
    .cta:hover:not(.cta--disabled) { background: #3451c7; }
    .cta:active:not(.cta--disabled) { transform: scale(0.98); }
    .cta--disabled { background: #1a1a1a; color: #2e2e2e; cursor: not-allowed; }
    .cta--disabled svg { opacity: 0.3; }

    .cta-hint { font-size: 11px; color: #2e2e2e; }
  `]
})
export class TaskInputComponent {
  @Output() submitted = new EventEmitter<TaskInput>();

  rawTasks = '';
  energyLevel: EnergyLevel = 'media';
  timeAvailable: TimeAvailable = '1-2h';

  energyOpts: { value: EnergyLevel; label: string }[] = [
    { value: 'baja', label: 'Baja' },
    { value: 'media', label: 'Media' },
    { value: 'alta', label: 'Alta' },
  ];

  timeOpts: { value: TimeAvailable; label: string }[] = [
    { value: '<1h', label: 'Menos de 1 h' },
    { value: '1-2h', label: '1 – 2 horas' },
    { value: '2-4h', label: '2 – 4 horas' },
    { value: '4h+', label: 'Más de 4 h' },
  ];

  onTasksChange() {}
  isValid() { return this.rawTasks.trim().length > 3; }
  submit() { if (this.isValid()) this.submitted.emit({ rawTasks: this.rawTasks, energyLevel: this.energyLevel, timeAvailable: this.timeAvailable }); }
}
