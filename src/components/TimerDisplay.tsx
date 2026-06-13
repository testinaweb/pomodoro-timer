import { TimerState, TimerStatus } from '@/types/pomodoro';
import { Language } from '@/types/pomodoro';
import { t } from '@/i18n/translations';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

interface TimerDisplayProps {
  timeLeft: number;
  progress: number;
  timerState: TimerState;
  status: TimerStatus;
  lang: Language;
  onStart: () => void;
  onPause: () => void;
  onSkip: () => void;
  onReset: () => void;
  activeTaskName?: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function TimerDisplay({
  timeLeft,
  progress,
  timerState,
  status,
  lang,
  onStart,
  onPause,
  onSkip,
  onReset,
  activeTaskName,
}: TimerDisplayProps) {
  const stateLabel = timerState === 'focus'
    ? t('focus', lang)
    : timerState === 'break'
    ? t('break_time', lang)
    : t('idle', lang);

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center gap-6 animate-fade-in">
      {/* State label */}
      <div className="text-lg font-medium uppercase tracking-[0.3em] text-foreground/90 text-shadow">
        {stateLabel}
      </div>

      {/* Active task */}
      {activeTaskName && timerState !== 'idle' && (
        <div className="glass-strong px-5 py-2.5 rounded-full text-base font-medium text-foreground animate-scale-in">
          {t('active_task', lang)}: {activeTaskName}
        </div>
      )}

      {/* Timer circle */}
      <div className="relative flex items-center justify-center">
        <svg width="280" height="280" className="transform -rotate-90">
          <circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="6"
          />
          <circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-7xl font-light text-foreground text-shadow tabular-nums tracking-tight">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={onReset}
          className="glass-strong w-14 h-14 rounded-full flex items-center justify-center text-foreground/90 hover:text-foreground hover:scale-110 transition-all active:scale-95"
          aria-label={t('reset', lang)}
        >
          <RotateCcw size={22} />
        </button>

        <button
          onClick={status === 'running' ? onPause : onStart}
          className="glass-strong w-20 h-20 rounded-full flex items-center justify-center text-foreground hover:scale-110 transition-all active:scale-95 shadow-lg"
          aria-label={status === 'running' ? t('pause', lang) : t('start', lang)}
        >
          {status === 'running' ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
        </button>

        <button
          onClick={onSkip}
          className="glass-strong w-14 h-14 rounded-full flex items-center justify-center text-foreground/90 hover:text-foreground hover:scale-110 transition-all active:scale-95"
          aria-label={t('skip', lang)}
        >
          <SkipForward size={22} />
        </button>
      </div>
    </div>
  );
}
