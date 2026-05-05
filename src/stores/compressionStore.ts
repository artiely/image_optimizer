import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CompressionSettings {
  quality: number
  format: 'original' | 'jpeg' | 'png' | 'webp' | 'avif'
  progressive: boolean
  lossless: boolean
  stripMetadata: boolean
}

export type OutputFormat = 'original' | 'jpeg' | 'png' | 'webp' | 'avif'

export interface OutputSettings {
  directory: string
  namingRule: 'original' | 'suffix' | 'prefix' | 'sequence'
  suffix: string
  prefix: string
  formats: OutputFormat[]
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
  formats: ['original']
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
      name: 'compression-settings',
      merge: (persisted, current) => {
        const persistedState = persisted as any
        const merged = { ...current, ...persistedState }

        // Migrate old output.format -> output.formats
        if (persistedState?.output && 'format' in persistedState.output && !('formats' in persistedState.output)) {
          merged.output = {
            ...defaultOutput,
            ...persistedState.output,
            formats: [persistedState.output.format]
          }
          delete merged.output.format
        }

        // Ensure output.formats is always a valid array
        if (!Array.isArray(merged.output?.formats) || merged.output.formats.length === 0) {
          merged.output = { ...merged.output, formats: defaultOutput.formats }
        }

        return merged
      }
    }
  )
)
