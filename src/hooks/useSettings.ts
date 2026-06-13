import { useLocalStorage } from './useLocalStorage';
import { Settings, DEFAULT_SETTINGS } from '@/types/pomodoro';

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<Settings>('pomodoro-settings', DEFAULT_SETTINGS);

  const updateSettings = (partial: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

  return { settings, updateSettings };
}
