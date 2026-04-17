import { Info } from 'lucide-react'
import { useCompressionStore, type CompressionSettings } from '../../stores/compressionStore'

export function CompressionPanel() {
  const { compression, updateCompression } = useCompressionStore()
  const { quality, format, progressive, lossless, stripMetadata } = compression

  return (
    <div className="p-4 space-y-6">
      <div>
        <label className="block text-sm font-medium mb-3">输出格式</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'original', label: '原格式' },
            { id: 'jpeg', label: 'JPEG' },
            { id: 'png', label: 'PNG' },
            { id: 'webp', label: 'WebP' },
            { id: 'avif', label: 'AVIF' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => updateCompression({ format: f.id as CompressionSettings['format'] })}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                format === f.id
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-primary-400'
              }`}
            >
              {f.label}
            </button>
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

      {(format === 'jpeg' || format === 'png' || format === 'original') && (
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

      {(format === 'webp' || format === 'avif') && (
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
