import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskInputComponent } from './components/task-input/task-input.component';
import { ResultsComponent } from './components/results/results.component';
import { TaskPrioritizerService } from './services/task-prioritizer.service';
import { TaskInput, AIResponse } from './models/task.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TaskInputComponent, ResultsComponent],
  template: `
    <div class="shell">
      <main class="container">
        <header class="header">
          <span class="header__eyebrow">Today's focus</span>
          <h1 class="header__title">¿Qué necesitas hacer hoy?</h1>
          <p class="header__sub">{{ loading ? 'Analizando tus tareas...' : result ? 'Aquí está tu plan. Un paso a la vez.' : 'Dime tus tareas y cómo estás. Organizo tu día.' }}</p>
        </header>
        <div class="divider"></div>

        <div class="loading" *ngIf="loading">
          <div class="loading__dots"><span></span><span></span><span></span></div>
        </div>

        <app-task-input *ngIf="!result && !loading" (submitted)="onSubmit($event)"></app-task-input>
        <app-results *ngIf="result && !loading" [response]="result" (reset)="onReset()"></app-results>
      </main>

      <footer class="footer">
        <p>Hecho para ayudarte a empezar, no a planificar perfectamente.</p>
      </footer>
    </div>
  `,
  styles: [`
    .shell { min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 64px 20px 48px; background: #0f0f0f; }
    .container { width: 100%; max-width: 640px; }
    .header { margin-bottom: 40px; }
    .header__eyebrow { display: block; font-size: 10px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #333; margin-bottom: 16px; }
    .header__title { font-size: 28px; font-weight: 600; color: #f0f0f0; letter-spacing: -0.5px; line-height: 1.2; margin-bottom: 10px; }
    .header__sub { font-size: 14px; color: #555; line-height: 1.6; }
    .divider { height: 1px; background: #1a1a1a; margin-bottom: 40px; }

    .loading { display: flex; justify-content: center; padding: 64px 0; }
    .loading__dots { display: flex; gap: 6px; align-items: center; }
    .loading__dots span { width: 6px; height: 6px; border-radius: 50%; background: #3b5bdb; opacity: 0.4; animation: pulse 1.2s infinite ease-in-out; }
    .loading__dots span:nth-child(2) { animation-delay: 0.2s; }
    .loading__dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes pulse { 0%,80%,100% { transform: scale(0.7); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }

    .footer { margin-top: 64px; text-align: center; }
    .footer p { font-size: 11px; color: #2a2a2a; letter-spacing: 0.02em; }
  `]
})
export class AppComponent {
  result: AIResponse | null = null;
  loading = false;

  constructor(private svc: TaskPrioritizerService) {}

  async onSubmit(input: TaskInput) {
    this.loading = true;
    this.result = await this.svc.prioritizeWithAI(input);
    this.loading = false;
  }
  onReset() { this.result = null; }
}
