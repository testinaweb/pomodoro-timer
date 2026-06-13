export type TimerState = 'idle' | 'focus' | 'break';
export type TimerStatus = 'running' | 'paused' | 'stopped';

export interface Task {
  id: string;
  name: string;
  totalPomodoros: number;
  completedPomodoros: number;
  completed: boolean;
  order: number;
}

export type ColorTheme = 'lavender' | 'ocean' | 'sunset';

export interface Settings {
  pomodoroDuration: number; // minutes
  breakDuration: number; // minutes
  autoStartBreaks: boolean;
  language: Language;
  colorTheme: ColorTheme;
}

export type Language = 'en' | 'it' | 'es' | 'he';

export const DEFAULT_SETTINGS: Settings = {
  pomodoroDuration: 25,
  breakDuration: 5,
  autoStartBreaks: false,
  language: 'en',
  colorTheme: 'lavender',
};
