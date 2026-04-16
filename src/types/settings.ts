export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  lastOutputDirectory: string
  defaultCompressionQuality: number
  defaultResizeFit: 'contain' | 'cover' | 'fill' | 'inside' | 'outside'
  preserveMetadata: boolean
}

export const defaultSettings: AppSettings = {
  theme: 'system',
  lastOutputDirectory: '',
  defaultCompressionQuality: 85,
  defaultResizeFit: 'inside',
  preserveMetadata: false
}
