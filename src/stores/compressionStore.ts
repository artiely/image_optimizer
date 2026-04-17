import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CompressionSettings {
  quality: number
  format: 'original' | 'jpeg' | 'png' | 'webp' | 'avif'
  progressive: boolean
  lossless: boolean
  stripMetadata: boolean
}

export interface OutputSettings {
  directory: string
  namingRule: 'original' | 'suffix' | 'prefix' | 'sequence'
  suffix: string
  prefix: string
  format: 'original' | 'jpeg' | 'png' | 'webp' | 'avif'
}

interface CompressionStore {
  compression: CompressionSettings
  output: OutputSettings

  updateCompression: (settings: Partial<CompressionSettings>) => void
  updateOutput: (settings: Partial<OutputSettings>) => void
  resetCompression: () => void
  resetOutput: () => void
}

const defaultCompression: CompressionSettings = {
  quality: 85,
  format: 'original',
  progressive: true,
  lossless: false,
  stripMetadata: true
}

const defaultOutput: OutputSettings = {
  directory: '',
  namingRule: 'suffix',
  suffix: '_optimized',
  prefix: 'optimized_',
  format: 'original'
}

export const useCompressionStore = create<CompressionStore>()(
  persist(
    (set) => ({
      compression: defaultCompression,
      output: defaultOutput,

      updateCompression: (settings) => set((state) => ({
        compression: { ...state.compression, ...settings }
      })),

      updateOutput: (settings) => set((state) => ({
        output: { ...state.output, ...settings }
      })),

      resetCompression: () => set({ compression: defaultCompression }),
      resetOutput: () => set({ output: defaultOutput })
    }),
    {
      name: 'compression-settings'
    }
  )
)
