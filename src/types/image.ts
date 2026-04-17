export interface ImageMetadata {
  width: number
  height: number
  format: string
  size: number
  space?: string
  channels?: number
  depth?: string
  density?: number
  hasAlpha?: boolean
}

export interface ImageFile {
  id: string
  path: string
  name: string
  size: number
  format: string
  dimensions: { width: number; height: number }
  thumbnail?: string
  metadata?: ImageMetadata
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress: number
  error?: string
  output?: ProcessResult
}

export interface ProcessSettings {
  compression: {
    quality: number
    format: 'original' | 'jpeg' | 'png' | 'webp' | 'avif'
    progressive: boolean
    lossless: boolean
    stripMetadata: boolean
  }
  resize?: {
    width?: number
    height?: number
    fit: 'contain' | 'cover' | 'fill' | 'inside' | 'outside'
    kernel: 'nearest' | 'cubic' | 'mitchell' | 'lanczos2' | 'lanczos3'
    withoutEnlargement: boolean
  }
  output: {
    directory: string
    namingRule: 'original' | 'suffix' | 'prefix' | 'sequence'
    suffix: string
    prefix: string
    format: 'original' | 'jpeg' | 'png' | 'webp' | 'avif'
  }
}

export interface ProcessResult {
  input: string
  output: string
  originalSize: number
  outputSize: number
  dimensions: { width: number; height: number }
  compressionRatio: number
}

export interface Task {
  id: string
  files: ImageFile[]
  settings: ProcessSettings
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress: number
  startTime?: number
  endTime?: number
}
