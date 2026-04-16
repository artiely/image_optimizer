import { ImageMetadata, ProcessResult } from './src/types/image'

export interface ElectronAPI {
  selectFiles: () => Promise<string[]>
  selectFolder: () => Promise<string>
  getImageMetadata: (filePath: string) => Promise<ImageMetadata>
  generateThumbnail: (filePath: string) => Promise<string>
  processImages: (files: string[], settings: any) => Promise<ProcessResult[]>
  getSystemTheme: () => Promise<string>
  
  onProcessProgress: (callback: (data: {
    fileId: string
    progress: number
    status: 'processing' | 'completed' | 'error'
    error?: string
  }) => void) => void
  
  onProcessComplete: (callback: (data: {
    fileId: string
    output: ProcessResult
  }) => void) => void
  
  onSystemThemeChanged: (callback: (theme: string) => void) => void
  
  removeAllListeners: (channel: string) => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
