export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatDimensions(width: number, height: number): string {
  return `${width} × ${height}`
}

export function formatCompressionRatio(ratio: number): string {
  if (ratio > 0) {
    return `-${ratio.toFixed(1)}%`
  } else if (ratio < 0) {
    return `+${Math.abs(ratio).toFixed(1)}%`
  }
  return '0%'
}
