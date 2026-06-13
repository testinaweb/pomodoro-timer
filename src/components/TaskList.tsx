import { useState } from 'react';
import { Task, Language } from '@/types/pomodoro';
import { t } from '@/i18n/translations';
import { Check, Trash2, GripVertical, Pencil } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  activeTaskId: string | null;
  lang: Language;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
}

export function TaskList({
  tasks,
  activeTaskId,
  lang,
  onComplete,
  onDelete,
  onSelect,
  onUpdate,
}: TaskListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPomodoros, setEditPomodoros] = useState(1);

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditName(task.name);
    setEditPomodoros(task.totalPomodoros);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      onUpdate(editingId, { name: editName.trim(), totalPomodoros: editPomodoros });
      setEditingId(null);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 text-center text-foreground/80 text-lg">
        {t('no_tasks', lang)}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {tasks.map(task => {
        const isActive = task.id === activeTaskId;
        const isEditing = task.id === editingId;

        return (
          <div
            key={task.id}
            className={`glass rounded-2xl p-4 transition-all animate-fade-in ${
              isActive ? 'ring-2 ring-foreground/30 scale-[1.02]' : ''
            } ${task.completed ? 'opacity-50' : 'cursor-pointer hover:scale-[1.01]'}`}
            onClick={() => !task.completed && !isEditing && onSelect(task.id)}
          >
            {isEditing ? (
              <div className="flex flex-col gap-3" onClick={e => e.stopPropagation()}>
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="bg-foreground/10 rounded-lg px-3 py-2.5 text-foreground text-base outline-none focus:ring-2 focus:ring-foreground/30"
                  autoFocus
                />
                <div className="flex items-center gap-3">
                  <label className="text-base text-foreground/80">{t('num_pomodoros', lang)}</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={editPomodoros}
                    onChange={e => setEditPomodoros(Number(e.target.value))}
                    className="bg-foreground/10 rounded-lg px-3 py-1.5 w-16 text-foreground text-base outline-none focus:ring-2 focus:ring-foreground/30"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="glass-strong px-4 py-2 rounded-lg text-base font-medium text-foreground hover:scale-105 transition-transform"
                  >
                    {t('save', lang)}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 rounded-lg text-base text-foreground/80 hover:text-foreground transition-colors"
                  >
                    {t('cancel', lang)}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <GripVertical size={18} className="text-foreground/40 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className={`text-lg font-medium text-foreground truncate ${task.completed ? 'line-through' : ''}`}>
                    {task.name}
                  </div>
                  <div className="text-base text-foreground/80 mt-0.5">
                    {task.completedPomodoros} {t('of', lang)} {task.totalPomodoros} {t('pomodoros', lang)}
                  </div>
                  <div className="mt-2 h-1.5 w-full bg-foreground/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-foreground/40 rounded-full transition-all duration-500"
                      style={{ width: `${(task.completedPomodoros / task.totalPomodoros) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                  {!task.completed && (
                    <>
                      <button
                        onClick={() => startEditing(task)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-all"
                        aria-label={t('edit', lang)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => onComplete(task.id)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-foreground/60 hover:text-green-300 hover:bg-green-300/10 transition-all"
                        aria-label={t('mark_complete', lang)}
                      >
                        <Check size={18} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => onDelete(task.id)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-foreground/60 hover:text-red-300 hover:bg-red-300/10 transition-all"
                    aria-label={t('delete', lang)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
