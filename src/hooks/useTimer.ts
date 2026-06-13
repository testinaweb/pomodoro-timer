import { useState, useEffect, useRef, useCallback } from 'react';
import { TimerState, TimerStatus } from '@/types/pomodoro';

interface UseTimerProps {
  pomodoroDuration: number;
  breakDuration: number;
  autoStartBreaks: boolean;
  onPomodoroComplete: () => void;
  onBreakComplete: () => void;
}

export function useTimer({
  pomodoroDuration,
  breakDuration,
  autoStartBreaks,
  onPomodoroComplete,
  onBreakComplete,
}: UseTimerProps) {
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [status, setStatus] = useState<TimerStatus>('stopped');
  const [timeLeft, setTimeLeft] = useState(pomodoroDuration * 60);
  const intervalRef = useRef<number | null>(null);

  const totalTime = timerState === 'break' ? breakDuration * 60 : pomodoroDuration * 60;
  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (timerState === 'idle') {
      setTimerState('focus');
      setTimeLeft(pomodoroDuration * 60);
    }
    setStatus('running');
  }, [timerState, pomodoroDuration]);

  const pauseTimer = useCallback(() => {
    setStatus('paused');
    clearTimer();
  }, [clearTimer]);

  const resetTimer = useCallback(() => {
    clearTimer();
    setTimerState('idle');
    setStatus('stopped');
    setTimeLeft(pomodoroDuration * 60);
  }, [clearTimer, pomodoroDuration]);

  const skipTimer = useCallback(() => {
    clearTimer();
    if (timerState === 'focus') {
      // Trigger pomodoro complete before transitioning
      onPomodoroComplete();
      setTimerState('break');
      setTimeLeft(breakDuration * 60);
      if (autoStartBreaks) {
        setStatus('running');
      } else {
        setStatus('paused');
      }
    } else if (timerState === 'break') {
      onBreakComplete();
      setTimerState('focus');
      setTimeLeft(pomodoroDuration * 60);
      setStatus('paused');
    } else {
      setTimerState('focus');
      setTimeLeft(pomodoroDuration * 60);
      setStatus('paused');
    }
  }, [timerState, clearTimer, breakDuration, pomodoroDuration, autoStartBreaks, onPomodoroComplete, onBreakComplete]);

  const startFocusSession = useCallback(() => {
    clearTimer();
    setTimerState('focus');
    setTimeLeft(pomodoroDuration * 60);
    setStatus('running');
  }, [clearTimer, pomodoroDuration]);

  // Tick
  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearTimer();
            if (timerState === 'focus') {
              onPomodoroComplete();
              setTimerState('break');
              if (autoStartBreaks) {
                setStatus('running');
              } else {
                setStatus('paused');
              }
              return breakDuration * 60;
            } else {
              onBreakComplete();
              setTimerState('focus');
              setStatus('paused');
              return pomodoroDuration * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return clearTimer;
  }, [status, timerState, clearTimer, autoStartBreaks, breakDuration, pomodoroDuration, onPomodoroComplete, onBreakComplete]);

  // Update timeLeft when durations change while idle/stopped
  useEffect(() => {
    if (status === 'stopped' || timerState === 'idle') {
      setTimeLeft(pomodoroDuration * 60);
    }
  }, [pomodoroDuration, status, timerState]);

  return {
    timerState,
    status,
    timeLeft,
    progress,
    totalTime,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
    startFocusSession,
  };
}
