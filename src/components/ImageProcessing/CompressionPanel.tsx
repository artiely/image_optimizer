import { Info } from 'lucide-react'
import { useCompressionStore } from '../../stores/compressionStore'

export function CompressionPanel() {
  const { compression, output, updateCompression } = useCompressionStore()
  const { quality, progressive, lossless, stripMetadata } = compression
  const formats = output.formats

  // Determine which UI options to show based on selected output formats
  const hasOriginal = formats.includes('original')
  const hasJpeg = formats.includes('jpeg')
  const hasPng = formats.includes('png')
  const hasWebp = formats.includes('webp')
  const hasAvif = formats.includes('avif')
  const showProgressive = hasOriginal || hasJpeg || hasPng
  const showLossless = hasWebp || hasAvif

  return (
    <div className="p-4 space-y-6">
      <div>
        <label className="block text-sm font-medium mb-3">输出格式</label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">在右侧"输出设置"中可多选格式</p>
        <div className="flex flex-wrap gap-2">
          {formats.map(f => (
            <span
              key={f}
              className="px-3 py-1.5 text-sm rounded-lg bg-primary-500 text-white border border-primary-500"
            >
              {f === 'original' ? '原格式' : f.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium">压缩质量</label>
          <span className="text-sm text-primary-500 font-mono">{quality}</span>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          value={quality}
          onChange={(e) => updateCompression({ quality: Number(e.target.value) })}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>最小体积</span>
          <span>最佳质量</span>
        </div>
      </div>

      {showProgressive && (
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={progressive}
              onChange={(e) => updateCompression({ progressive: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-500 focus:ring-primary-500"
            />
            <div>
              <span className="text-sm font-medium">渐进式加载</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                图片将逐步显示，适合网页使用（仅适用于 JPEG/PNG）
              </p>
            </div>
          </label>
        </div>
      )}

      {showLossless && (
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={lossless}
              onChange={(e) => updateCompression({ lossless: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-500 focus:ring-primary-500"
            />
            <div>
              <span className="text-sm font-medium">无损压缩</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                保持原始质量，文件体积较大
              </p>
            </div>
          </label>
        </div>
      )}

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={stripMetadata}
            onChange={(e) => updateCompression({ stripMetadata: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-500 focus:ring-primary-500"
          />
          <div>
            <span className="text-sm font-medium">移除元数据</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              删除 EXIF、ICC 等元数据信息
            </p>
          </div>
        </label>
      </div>

      <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-primary-700 dark:text-primary-300">
            <p className="font-medium mb-1">压缩提示</p>
            <p>JPEG 适合照片，PNG 适合图标，WebP 和 AVIF 提供更好的压缩率。</p>
          </div>
        </div>
      </div>
    </div>
  )
}
