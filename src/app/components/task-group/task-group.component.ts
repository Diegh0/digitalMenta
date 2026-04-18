import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrioritizedTask } from '../../models/task.models';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-task-group',
  standalone: true,
  imports: [CommonModule, TaskCardComponent],
  template: `
    <div class="group" *ngIf="tasks?.length">
      <div class="group__hd">
        <span class="group__icon">
          <ng-container [ngSwitch]="variant">
            <svg *ngSwitchCase="'priority'" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 2"/></svg>
            <svg *ngSwitchCase="'secondary'" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="3" width="12" height="10" rx="2"/><path d="M5 7h6M5 10h4"/></svg>
            <svg *ngSwitchDefault width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="8" r="6"/><path d="M8 5v4"/><circle cx="8" cy="11.5" r="0.5" fill="currentColor"/></svg>
          </ng-container>
        </span>
        <span class="group__title" [class]="'group__title--' + variant">{{ title }}</span>
        <div class="group__line"></div>
        <span class="group__count">{{ tasks.length }}</span>
      </div>
      <div class="group__list">
        <app-task-card *ngFor="let t of tasks; let i = index" [task]="t" [variant]="variant" [index]="showIndex ? i : undefined"></app-task-card>
      </div>
    </div>
  `,
  styles: [`
    .group { margin-bottom: 32px; }
    .group__hd { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
    .group__icon { display: flex; align-items: center; color: #3b5bdb; flex-shrink: 0; }
    .group__icon svg { display: block; }
    .group__title { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; white-space: nowrap; }
    .group__title--priority { color: #3b5bdb; }
    .group__title--secondary { color: #2a3a5e; }
    .group__title--postpone { color: #2a2a2a; }
    .group__title--postpone + .group__line { opacity: 0.4; }
    .group__line { flex: 1; height: 1px; background: #1a1a1a; }
    .group__count { font-size: 11px; color: #2e2e2e; background: #1a1a1a; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .group__list { display: flex; flex-direction: column; gap: 6px; }
  `]
})
export class TaskGroupComponent {
  @Input() title!: string;
  @Input() tasks!: PrioritizedTask[];
  @Input() variant: 'priority' | 'secondary' | 'postpone' = 'secondary';
  @Input() showIndex = false;
}
