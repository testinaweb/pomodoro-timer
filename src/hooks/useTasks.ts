import { useLocalStorage } from './useLocalStorage';
import { Task } from '@/types/pomodoro';

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('pomodoro-tasks', []);

  const addTask = (name: string, totalPomodoros: number) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      name,
      totalPomodoros,
      completedPomodoros: 0,
      completed: false,
      order: tasks.length,
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const completeTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: true } : t));
  };

  const incrementPomodoro = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const newCompleted = t.completedPomodoros + 1;
      return {
        ...t,
        completedPomodoros: newCompleted,
        completed: newCompleted >= t.totalPomodoros ? true : t.completed,
      };
    }));
  };

  const getNextIncompleteTask = (afterId?: string): Task | undefined => {
    const incomplete = tasks.filter(t => !t.completed);
    if (!afterId) return incomplete[0];
    const idx = incomplete.findIndex(t => t.id === afterId);
    return incomplete[idx + 1] ?? incomplete[0];
  };

  const getActiveTask = (activeTaskId: string | null): Task | undefined => {
    if (!activeTaskId) return tasks.find(t => !t.completed);
    return tasks.find(t => t.id === activeTaskId);
  };

  const reorderTasks = (fromIndex: number, toIndex: number) => {
    setTasks(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      return arr.map((t, i) => ({ ...t, order: i }));
    });
  };

  return {
    tasks,
    addTask,
    deleteTask,
    updateTask,
    completeTask,
    incrementPomodoro,
    getNextIncompleteTask,
    getActiveTask,
    reorderTasks,
  };
}
