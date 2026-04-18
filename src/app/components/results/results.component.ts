import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AIResponse } from '../../models/task.models';
import { TaskGroupComponent } from '../task-group/task-group.component';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, TaskGroupComponent],
  template: `
    <div class="results">

      <div class="note">
        <div class="note__dot"></div>
        <p class="note__text">{{ response.motivationalNote }}</p>
      </div>

      <app-task-group title="Hazlo ahora" [tasks]="response.topPriority" variant="priority" [showIndex]="true"></app-task-group>
      <app-task-group title="Después, si puedes" [tasks]="response.secondary" variant="secondary"></app-task-group>
      <app-task-group title="Para otro día" [tasks]="response.postpone" variant="postpone"></app-task-group>

      <div class="plan">
        <p class="plan__label">Plan del día</p>
        <div class="plan__steps">
          <div class="step" *ngIf="response.dailyPlan?.startWith?.length">
            <div class="step__dot step__dot--start"></div>
            <div class="step__body">
              <span class="step__label">Empieza con</span>
              <p class="step__item" *ngFor="let t of response.dailyPlan.startWith">{{ t.name }}</p>
            </div>
          </div>
          <div class="step" *ngIf="response.dailyPlan?.thenDo?.length">
            <div class="step__dot step__dot--then"></div>
            <div class="step__body">
              <span class="step__label">Luego haz</span>
              <p class="step__item" *ngFor="let t of response.dailyPlan.thenDo">{{ t.name }}</p>
            </div>
          </div>
          <div class="step" *ngIf="response.dailyPlan?.leaveForLater?.length">
            <div class="step__dot step__dot--later"></div>
            <div class="step__body">
              <span class="step__label">Deja para después</span>
              <p class="step__item" *ngFor="let t of response.dailyPlan.leaveForLater">{{ t.name }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="reset">
        <button class="reset__btn" (click)="reset.emit()">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M13 8a5 5 0 1 1-5-5"/><path d="M13 3v3h-3"/></svg>
          Reorganizar con otras tareas
        </button>
      </div>

    </div>
  `,
  styles: [`
    .results { animation: fadeUp 0.4s ease; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    .note {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 14px 16px;
      background: #141414; border: 1px solid #1e1e1e; border-radius: 10px;
      margin-bottom: 36px;
    }
    .note__dot { width: 5px; height: 5px; border-radius: 50%; background: #3b5bdb; flex-shrink: 0; margin-top: 7px; }
    .note__text { font-size: 13px; color: #555; line-height: 1.65; }

    .plan {
      background: #0d0d0d; border: 1px solid #1a1a1a; border-radius: 10px;
      padding: 22px; margin-bottom: 36px;
    }
    .plan__label { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #2e2e2e; margin-bottom: 20px; }

    .step { display: flex; gap: 14px; position: relative; }
    .step:not(:last-child) { margin-bottom: 20px; }
    .step:not(:last-child)::before { content: ''; position: absolute; left: 6px; top: 18px; bottom: -20px; width: 1px; background: #1e1e1e; }

    .step__dot { width: 13px; height: 13px; border-radius: 50%; flex-shrink: 0; margin-top: 2px; }
    .step__dot--start { background: #3b5bdb; }
    .step__dot--then { background: #0f0f0f; border: 1.5px solid #3b5bdb; }
    .step__dot--later { background: #0f0f0f; border: 1.5px solid #242424; }

    .step__body { flex: 1; }
    .step__label { display: block; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #2e2e2e; margin-bottom: 6px; }
    .step__item { font-size: 13px; color: #3a3a3a; line-height: 1.5; }
    .step__item::before { content: '— '; color: #222; }

    .reset { display: flex; justify-content: center; padding-top: 4px; }
    .reset__btn {
      display: inline-flex; align-items: center; gap: 8px;
      font-size: 12px; color: #2e2e2e; background: none; border: none;
      cursor: pointer; font-family: inherit; padding: 8px 14px;
      border-radius: 8px; transition: all 0.15s;
    }
    .reset__btn:hover { color: #555; background: #141414; }
  `]
})
export class ResultsComponent {
  @Input() response!: AIResponse;
  @Output() reset = new EventEmitter<void>();
}
