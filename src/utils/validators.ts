const SUPPORTED_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'tiff', 'avif']

export function isValidImageFile(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase()
  return ext ? SUPPORTED_FORMATS.includes(ext) : false
}

export function isValidImageFormat(format: string): boolean {
  return SUPPORTED_FORMATS.includes(format.toLowerCase())
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

export function getFileNameWithoutExtension(filename: string): string {
  const parts = filename.split('.')
  parts.pop()
  return parts.join('.')
}
