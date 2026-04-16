import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AppSettings, defaultSettings } from '../types/settings'

interface SettingsStore extends AppSettings {
  updateSettings: (settings: Partial<AppSettings>) => void
  resetSettings: () => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,
      
      updateSettings: (newSettings) => set((state) => ({
        ...state,
        ...newSettings
      })),
      
      resetSettings: () => set(defaultSettings)
    }),
    {
      name: 'image-optimizer-settings'
    }
  )
)
