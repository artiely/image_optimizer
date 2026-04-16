import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'

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
    format?: 'original' | 'jpeg' | 'png' | 'webp' | 'avif'
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
    const metadata = await sharp(filePath).metadata()
    
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
    const thumbnail = await sharp(filePath)
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
    const inputMetadata = await sharp(filePath).metadata()
    
    let image = sharp(filePath)
    
    if (settings.resize) {
      image = image.resize(settings.resize.width, settings.resize.height, {
        fit: settings.resize.fit || 'inside',
        kernel: settings.resize.kernel || 'lanczos3',
        withoutEnlargement: settings.resize.withoutEnlargement
      })
    }
    
    const outputFormat = settings.output.format === 'original' 
      ? inputMetadata.format 
      : settings.output.format || inputMetadata.format
    
    switch (outputFormat) {
      case 'jpeg':
        image = image.jpeg({
          quality: settings.compression.quality || 85,
          progressive: settings.compression.progressive,
          mozjpeg: true
        })
        break
      case 'png':
        const pngCompressionLevel = Math.min(9, Math.max(6, Math.floor((100 - (settings.compression.quality || 85)) / 10)))
        image = image.png({
          compressionLevel: pngCompressionLevel,
          progressive: settings.compression.progressive,
          adaptiveFiltering: true
        })
        break
      case 'webp':
        image = image.webp({
          quality: settings.compression.quality || 85,
          lossless: settings.compression.lossless
        })
        break
      case 'avif':
        image = image.avif({
          quality: settings.compression.quality || 85,
          lossless: settings.compression.lossless
        })
        break
    }
    
    if (!settings.compression.stripMetadata) {
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
}
