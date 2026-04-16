import { create } from 'zustand'
import { Task } from '../types/image'

interface TaskStore {
  tasks: Task[]
  currentTask: Task | null
  
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  removeTask: (id: string) => void
  clearTasks: () => void
  
  setCurrentTask: (task: Task | null) => void
  updateCurrentTask: (updates: Partial<Task>) => void
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  currentTask: null,
  
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, task]
  })),
  
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
  
  removeTask: (id) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== id)
  })),
  
  clearTasks: () => set({ tasks: [] }),
  
  setCurrentTask: (task) => set({ currentTask: task }),
  
  updateCurrentTask: (updates) => set((state) => ({
    currentTask: state.currentTask ? { ...state.currentTask, ...updates } : null
  }))
}))
