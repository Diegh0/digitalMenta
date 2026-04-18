import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrioritizedTask } from '../../models/task.models';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class]="'card--' + variant">
      <div class="card__body">
        <div class="card__header">
          <span class="card__index" *ngIf="index !== undefined">{{ index + 1 }}</span>
          <span class="card__name">{{ task.name }}</span>
        </div>
        <p class="card__reason">{{ task.reason }}</p>
      </div>
      <span class="card__time" *ngIf="task.estimatedTime">{{ task.estimatedTime }}</span>
    </div>
  `,
  styles: [`
    .card {
      display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
      padding: 14px 16px;
      background: #141414; border: 1px solid #1e1e1e; border-radius: 10px;
      transition: border-color 0.15s;
    }
    .card:hover { border-color: #262626; }
    .card--priority { border-left: 2px solid #3b5bdb; padding-left: 14px; }
    .card--postpone { opacity: 0.5; }

    .card__body { flex: 1; min-width: 0; }
    .card__header { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; }

    .card__index {
      width: 18px; height: 18px; border-radius: 50%;
      background: rgba(59,91,219,0.15); color: #7c9ef8;
      font-size: 10px; font-weight: 600;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }

    .card__name { font-size: 13.5px; font-weight: 500; color: #d0d0d0; line-height: 1.4; }
    .card--postpone .card__name { text-decoration: line-through; color: #3a3a3a; }

    .card__reason { font-size: 12px; color: #3a3a3a; line-height: 1.55; padding-left: 28px; }
    .card--priority .card__reason { padding-left: 28px; }

    .card__time {
      font-size: 11px; color: #2e2e2e;
      background: #1a1a1a; padding: 2px 8px; border-radius: 20px;
      white-space: nowrap; flex-shrink: 0; margin-top: 1px;
    }
  `]
})
export class TaskCardComponent {
  @Input() task!: PrioritizedTask;
  @Input() variant: 'priority' | 'secondary' | 'postpone' = 'secondary';
  @Input() index?: number;
}
