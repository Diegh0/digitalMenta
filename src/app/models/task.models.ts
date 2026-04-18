// src/app/models/task.models.ts

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

export interface DailyPlan {
  startWith: PrioritizedTask[];
  thenDo: PrioritizedTask[];
  leaveForLater: PrioritizedTask[];
}

export interface AIResponse {
  topPriority: PrioritizedTask[];
  secondary: PrioritizedTask[];
  postpone: PrioritizedTask[];
  dailyPlan: DailyPlan;
  motivationalNote: string;
}
