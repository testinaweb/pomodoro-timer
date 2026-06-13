import { useState } from 'react';
import { Language } from '@/types/pomodoro';
import { t } from '@/i18n/translations';
import { Plus } from 'lucide-react';

interface AddTaskProps {
  lang: Language;
  onAdd: (name: string, pomodoros: number) => void;
}

export function AddTask({ lang, onAdd }: AddTaskProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [pomodoros, setPomodoros] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), pomodoros);
      setName('');
      setPomodoros(1);
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="glass w-full rounded-2xl p-4 flex items-center gap-3 text-foreground/80 hover:text-foreground hover:scale-[1.01] transition-all"
      >
        <Plus size={20} />
        <span className="text-base font-medium">{t('add_task', lang)}</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-4 flex flex-col gap-3 animate-scale-in">
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder={t('task_name', lang)}
        className="bg-foreground/10 rounded-lg px-3 py-3 text-foreground text-base placeholder:text-foreground/60 outline-none focus:ring-2 focus:ring-foreground/30"
        autoFocus
      />
      <div className="flex items-center gap-3">
        <label className="text-base text-foreground/80">{t('num_pomodoros', lang)}</label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => setPomodoros(n)}
              className={`w-10 h-10 rounded-full text-base font-medium transition-all ${
                pomodoros === n
                  ? 'glass-strong text-foreground scale-110'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="glass-strong px-4 py-2.5 rounded-lg text-base font-medium text-foreground hover:scale-105 transition-transform flex-1"
        >
          {t('add_task', lang)}
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="px-4 py-2.5 rounded-lg text-base text-foreground/80 hover:text-foreground transition-colors"
        >
          {t('cancel', lang)}
        </button>
      </div>
    </form>
  );
}
