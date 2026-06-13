import { useState, useCallback, useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useTasks } from '@/hooks/useTasks';
import { useTimer } from '@/hooks/useTimer';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TimerDisplay } from '@/components/TimerDisplay';
import { TaskList } from '@/components/TaskList';
import { AddTask } from '@/components/AddTask';
import { SettingsPanel } from '@/components/SettingsPanel';
import { isRTL, t } from '@/i18n/translations';
import { Settings2 } from 'lucide-react';

const Index = () => {
  const { settings, updateSettings } = useSettings();
  const {
    tasks,
    addTask,
    deleteTask,
    updateTask,
    completeTask,
    incrementPomodoro,
    getNextIncompleteTask,
    getActiveTask,
  } = useTasks();

  const [activeTaskId, setActiveTaskId] = useLocalStorage<string | null>('pomodoro-active-task', null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const lang = settings.language;
  const rtl = isRTL(lang);
  const activeTask = getActiveTask(activeTaskId);

  const onPomodoroComplete = useCallback(() => {
    if (activeTask && !activeTask.completed) {
      incrementPomodoro(activeTask.id);
    }
  }, [activeTask, incrementPomodoro]);

  const onBreakComplete = useCallback(() => {
    // Check if current task is now completed after increment
    const current = getActiveTask(activeTaskId);
    if (current?.completed) {
      const next = getNextIncompleteTask(current.id);
      setActiveTaskId(next?.id ?? null);
    }
  }, [activeTaskId, getActiveTask, getNextIncompleteTask, setActiveTaskId]);

  const {
    timerState,
    status,
    timeLeft,
    progress,
    startTimer,
    pauseTimer,
    skipTimer,
    resetTimer,
    startFocusSession,
  } = useTimer({
    pomodoroDuration: settings.pomodoroDuration,
    breakDuration: settings.breakDuration,
    autoStartBreaks: settings.autoStartBreaks,
    onPomodoroComplete,
    onBreakComplete,
  });

  const handleCompleteTask = (id: string) => {
    completeTask(id);
    const next = getNextIncompleteTask(id);
    if (next) {
      setActiveTaskId(next.id);
      startFocusSession();
    } else {
      setActiveTaskId(null);
      resetTimer();
    }
  };

  const handleSelectTask = (id: string) => {
    setActiveTaskId(id);
  };

  const theme = settings.colorTheme;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    return () => document.documentElement.removeAttribute('data-theme');
  }, [theme]);

  const gradientClasses = {
    lavender: {
      focus: 'gradient-focus-lavender',
      break: 'gradient-break-lavender',
      idle: 'gradient-idle-lavender',
    },
    ocean: {
      focus: 'gradient-focus-ocean',
      break: 'gradient-break-ocean',
      idle: 'gradient-idle-ocean',
    },
    sunset: {
      focus: 'gradient-focus-sunset',
      break: 'gradient-break-sunset',
      idle: 'gradient-idle-sunset',
    },
  } as const;

  const gradientClass =
    timerState === 'focus'
      ? gradientClasses[theme].focus
      : timerState === 'break'
      ? gradientClasses[theme].break
      : gradientClasses[theme].idle;

  return (
    <div
      dir={rtl ? 'rtl' : 'ltr'}
      className={`min-h-screen ${gradientClass} animate-gradient transition-all duration-1000 ${rtl ? 'font-hebrew' : 'font-sans'}`}
    >
      <div className="min-h-screen flex flex-col items-center px-4 py-8 pb-24 max-w-lg mx-auto">
        {/* Settings button */}
        <button
          onClick={() => setSettingsOpen(true)}
          className="self-end glass-strong w-12 h-12 rounded-full flex items-center justify-center text-foreground/80 hover:text-foreground hover:scale-110 transition-all mb-4"
          aria-label={t('settings', lang)}
        >
          <Settings2 size={18} />
        </button>

        {/* Timer */}
        <div className="flex-1 flex items-center justify-center w-full">
          <TimerDisplay
            timeLeft={timeLeft}
            progress={progress}
            timerState={timerState}
            status={status}
            lang={lang}
            onStart={startTimer}
            onPause={pauseTimer}
            onSkip={skipTimer}
            onReset={resetTimer}
            activeTaskName={activeTask?.name}
          />
        </div>

        {/* Task section */}
        <div className="w-full mt-8 flex flex-col gap-3">
          <h2 className="text-xl font-medium uppercase tracking-[0.2em] text-foreground/90 text-shadow px-1">
            {t('tasks', lang)}
          </h2>
          <TaskList
            tasks={tasks}
            activeTaskId={activeTaskId}
            lang={lang}
            onComplete={handleCompleteTask}
            onDelete={deleteTask}
            onSelect={handleSelectTask}
            onUpdate={updateTask}
          />
          <AddTask lang={lang} onAdd={addTask} />
        </div>
      </div>

      {/* Settings */}
      <SettingsPanel
        settings={settings}
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onUpdate={updateSettings}
      />
    </div>
  );
};

export default Index;
