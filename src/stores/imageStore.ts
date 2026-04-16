import { create } from 'zustand'
import { ImageFile } from '../types/image'

interface ImageStore {
  files: ImageFile[]
  selectedFiles: string[]
  
  addFiles: (files: ImageFile[]) => void
  removeFile: (id: string) => void
  removeFiles: (ids: string[]) => void
  clearFiles: () => void
  
  updateFile: (id: string, updates: Partial<ImageFile>) => void
  updateFileProgress: (id: string, progress: number, status: ImageFile['status'], error?: string) => void
  
  selectFile: (id: string) => void
  deselectFile: (id: string) => void
  selectAll: () => void
  deselectAll: () => void
  toggleFileSelection: (id: string) => void
}

export const useImageStore = create<ImageStore>((set, get) => ({
  files: [],
  selectedFiles: [],
  
  addFiles: (newFiles) => set((state) => ({
    files: [...state.files, ...newFiles]
  })),
  
  removeFile: (id) => set((state) => ({
    files: state.files.filter(f => f.id !== id),
    selectedFiles: state.selectedFiles.filter(fid => fid !== id)
  })),
  
  removeFiles: (ids) => set((state) => ({
    files: state.files.filter(f => !ids.includes(f.id)),
    selectedFiles: state.selectedFiles.filter(fid => !ids.includes(fid))
  })),
  
  clearFiles: () => set({ files: [], selectedFiles: [] }),
  
  updateFile: (id, updates) => set((state) => ({
    files: state.files.map(f => f.id === id ? { ...f, ...updates } : f)
  })),
  
  updateFileProgress: (id, progress, status, error) => set((state) => ({
    files: state.files.map(f => f.id === id ? { ...f, progress, status, error } : f)
  })),
  
  selectFile: (id) => set((state) => ({
    selectedFiles: [...state.selectedFiles, id]
  })),
  
  deselectFile: (id) => set((state) => ({
    selectedFiles: state.selectedFiles.filter(fid => fid !== id)
  })),
  
  selectAll: () => set((state) => ({
    selectedFiles: state.files.map(f => f.id)
  })),
  
  deselectAll: () => set({ selectedFiles: [] }),
  
  toggleFileSelection: (id) => {
    const { selectedFiles } = get()
    if (selectedFiles.includes(id)) {
      set({ selectedFiles: selectedFiles.filter(fid => fid !== id) })
    } else {
      set({ selectedFiles: [...selectedFiles, id] })
    }
  }
}))
