import path from 'path'
import fs from 'fs/promises'

let _sharp: any = null
function getSharp() {
  if (!_sharp) {
    if (process.platform === 'darwin' && process.type === 'browser') {
      const frameworksDir = path.join(path.dirname(process.execPath), '..', 'Frameworks')
      const existing = process.env.DYLD_FALLBACK_LIBRARY_PATH || ''
      if (!existing.includes(frameworksDir)) {
        process.env.DYLD_FALLBACK_LIBRARY_PATH = existing ? `${frameworksDir}:${existing}` : frameworksDir
      }
    }
    _sharp = require('sharp')
  }
  return _sharp
}

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

export interface ProcessSettings {
  compression: {
    quality?: number
    format?: 'jpeg' | 'png' | 'webp' | 'avif'
    progressive?: boolean
    lossless?: boolean
    stripMetadata?: boolean
  }
  resize?: {
    width?: number
    height?: number
    fit?: 'contain' | 'cover' | 'fill' | 'inside' | 'outside'
    kernel?: 'nearest' | 'cubic' | 'mitchell' | 'lanczos2' | 'lanczos3'
    withoutEnlargement?: boolean
  }
  output: {
    directory: string
    namingRule: 'original' | 'suffix' | 'prefix' | 'sequence'
    suffix?: string
    prefix?: string
    formats?: ('original' | 'jpeg' | 'png' | 'webp' | 'avif')[]
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

export class ImageProcessor {
  async getMetadata(filePath: string): Promise<ImageMetadata> {
    const stats = await fs.stat(filePath)
    const metadata = await getSharp()(filePath).metadata()
    
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || 'unknown',
      size: stats.size,
      space: metadata.space,
      channels: metadata.channels,
      depth: metadata.depth,
      density: metadata.density,
      hasAlpha: metadata.hasAlpha
    }
  }

  async generateThumbnail(filePath: string): Promise<string> {
    const thumbnail = await getSharp()(filePath)
      .resize(200, 200, { fit: 'inside' })
      .jpeg({ quality: 80 })
      .toBuffer()
    
    return `data:image/jpeg;base64,${thumbnail.toString('base64')}`
  }

  async processImage(
    filePath: string,
    settings: ProcessSettings,
    onProgress?: (progress: number) => void
  ): Promise<ProcessResult> {
    const inputStats = await fs.stat(filePath)
    const sharp = getSharp()
    const inputMetadata = await sharp(filePath).metadata()
    
    let image = sharp(filePath)
    
    if (settings.resize) {
      image = image.resize(settings.resize.width, settings.resize.height, {
        fit: settings.resize.fit || 'inside',
        kernel: settings.resize.kernel || 'lanczos3',
        withoutEnlargement: settings.resize.withoutEnlargement
      })
    }
    
    const requestedFormat = settings.output.formats?.[0] || 'original'
    const outputFormat = requestedFormat === 'original'
      ? inputMetadata.format
      : requestedFormat || inputMetadata.format

    const quality = settings.compression.quality || 85
    
    switch (outputFormat) {
      case 'jpeg':
        image = image.jpeg({
          quality,
          progressive: settings.compression.progressive,
          mozjpeg: true
        })
        break
      case 'png': {
        const hasAlpha = inputMetadata.hasAlpha || inputMetadata.channels === 4
        const isPaletteCandidate = !hasAlpha || (inputMetadata.channels || 3) <= 4
        const usePalette = isPaletteCandidate && quality < 100

        if (usePalette) {
          const colours = Math.max(2, Math.min(256, Math.round(quality * 2.56)))
          image = image.png({
            palette: true,
            quality,
            colours,
            effort: 10,
            compressionLevel: 9
          })
        } else {
          image = image.png({
            compressionLevel: 9,
            effort: 10,
            progressive: settings.compression.progressive,
            adaptiveFiltering: true
          })
        }
        break
      }
      case 'webp':
        image = image.webp({
          quality,
          lossless: settings.compression.lossless,
          effort: 6
        })
        break
      case 'avif':
        image = image.avif({
          quality,
          lossless: settings.compression.lossless,
          effort: 6
        })
        break
    }
    
    if (settings.compression.stripMetadata) {
      // don't call withMetadata() — this effectively strips metadata
    } else {
      image = image.withMetadata()
    }
    
    onProgress?.(50)
    
    const ext = outputFormat === 'jpeg' ? 'jpg' : outputFormat || 'jpg'
    const inputName = path.parse(filePath).name
    let outputName = inputName
    
    switch (settings.output.namingRule) {
      case 'suffix':
        outputName = `${inputName}${settings.output.suffix || '_optimized'}`
        break
      case 'prefix':
        outputName = `${settings.output.prefix || 'optimized_'}${inputName}`
        break
      case 'sequence':
        outputName = `image_${Date.now()}`
        break
    }
    
    let outputDir = settings.output.directory
    if (!outputDir || outputDir.trim() === '') {
      const inputDir = path.dirname(filePath)
      outputDir = path.join(inputDir, '__image_optimizer_output')
    }
    
    try {
      await fs.access(outputDir)
    } catch {
      await fs.mkdir(outputDir, { recursive: true })
    }
    
    const outputPath = path.join(outputDir, `${outputName}.${ext}`)
    
    await image.toFile(outputPath)
    
    const outputStats = await fs.stat(outputPath)
    
    if (outputStats.size >= inputStats.size) {
      await fs.unlink(outputPath)
      const originalExt = inputMetadata.format === 'jpeg' ? 'jpg' : inputMetadata.format || ext
      const originalOutputPath = path.join(outputDir, `${outputName}.${originalExt}`)
      await fs.copyFile(filePath, originalOutputPath)
      
      onProgress?.(100)
      
      const finalStats = await fs.stat(originalOutputPath)
      
      return {
        input: filePath,
        output: originalOutputPath,
        originalSize: inputStats.size,
        outputSize: finalStats.size,
        dimensions: {
          width: inputMetadata.width || 0,
          height: inputMetadata.height || 0
        },
        compressionRatio: 0
      }
    }
    
    onProgress?.(100)
    
    const outputMetadata = await sharp(outputPath).metadata()
    
    return {
      input: filePath,
      output: outputPath,
      originalSize: inputStats.size,
      outputSize: outputStats.size,
      dimensions: {
        width: outputMetadata.width || 0,
        height: outputMetadata.height || 0
      },
      compressionRatio: ((inputStats.size - outputStats.size) / inputStats.size) * 100
    }
  }

  async processImageMultiFormat(
    filePath: string,
    settings: ProcessSettings,
    onProgress?: (progress: number) => void
  ): Promise<ProcessResult[]> {
    const formats = settings.output.formats || ['original']
    const results: ProcessResult[] = []

    for (let i = 0; i < formats.length; i++) {
      const format = formats[i]
      const formatSettings: ProcessSettings = {
        ...settings,
        output: { ...settings.output, formats: [format] }
      }

      const formatProgress = (p: number) => {
        const base = (i / formats.length) * 100
        const range = 100 / formats.length
        onProgress?.(base + (p / 100) * range)
      }

      const result = await this.processImage(filePath, formatSettings, formatProgress)
      results.push(result)
    }

    return results
  }

  async getFilesInDirectory(dirPath: string): Promise<string[]> {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'tiff', 'avif']
    const files: string[] = []

    const scan = async (currentPath: string) => {
      const entries = await fs.readdir(currentPath, { withFileTypes: true })
      for (const entry of entries) {
        if (entry.name.startsWith('.')) continue
        const fullPath = path.join(currentPath, entry.name)
        if (entry.isDirectory()) {
          await scan(fullPath)
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase().slice(1)
          if (imageExtensions.includes(ext)) {
            files.push(fullPath)
          }
        }
      }
    }

    await scan(dirPath)
    return files
  }
}
