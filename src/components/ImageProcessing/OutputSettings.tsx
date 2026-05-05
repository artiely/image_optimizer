import { FolderOpen } from 'lucide-react'
import { useCompressionStore, type OutputSettings as OutputSettingsType, type OutputFormat } from '../../stores/compressionStore'

const FORMAT_OPTIONS: { id: OutputFormat; label: string }[] = [
  { id: 'original', label: '原格式' },
  { id: 'jpeg', label: 'JPEG' },
  { id: 'png', label: 'PNG' },
  { id: 'webp', label: 'WebP' },
  { id: 'avif', label: 'AVIF' }
]

export function OutputSettings() {
  const { output, updateOutput } = useCompressionStore()
  const { directory: outputDir, namingRule, suffix, prefix, formats: outputFormats } = output

  const toggleFormat = (format: OutputFormat) => {
    if (format === 'original') {
      updateOutput({ formats: ['original'] })
      return
    }
    const withoutOriginal = outputFormats.filter(f => f !== 'original')
    if (withoutOriginal.includes(format)) {
      const next = withoutOriginal.filter(f => f !== format)
      updateOutput({ formats: next.length > 0 ? next : ['original'] })
    } else {
      updateOutput({ formats: [...withoutOriginal, format] })
    }
  }

  const handleSelectDirectory = async () => {
    const dir = await window.electronAPI.selectFolder()
    if (dir) {
      updateOutput({ directory: dir })
    }
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">输出目录</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={outputDir}
            onChange={(e) => updateOutput({ directory: e.target.value })}
            placeholder="选择输出目录..."
            className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
          <button
            onClick={handleSelectDirectory}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <FolderOpen className="w-5 h-5" />
          </button>
        </div>
        {!outputDir && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            未选择目录时将在原文件所在目录创建 __image_optimizer_output 文件夹
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">命名规则</label>
        <div className="space-y-2">
          {[
            { id: 'original', label: '保持原文件名', desc: '覆盖原文件' },
            { id: 'suffix', label: '添加后缀', desc: '例如: image_optimized.jpg' },
            { id: 'prefix', label: '添加前缀', desc: '例如: optimized_image.jpg' },
            { id: 'sequence', label: '序号命名', desc: '例如: image_1234567890.jpg' }
          ].map(rule => (
            <label
              key={rule.id}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                namingRule === rule.id
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500'
                  : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-primary-400'
              }`}
            >
              <input
                type="radio"
                name="namingRule"
                value={rule.id}
                checked={namingRule === rule.id}
                onChange={(e) => updateOutput({ namingRule: e.target.value as OutputSettingsType['namingRule'] })}
                className="mt-0.5"
              />
              <div>
                <div className="text-sm font-medium">{rule.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{rule.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {namingRule === 'suffix' && (
        <div>
          <label className="block text-sm font-medium mb-2">后缀</label>
          <input
            type="text"
            value={suffix}
            onChange={(e) => updateOutput({ suffix: e.target.value })}
            placeholder="_optimized"
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      )}

      {namingRule === 'prefix' && (
        <div>
          <label className="block text-sm font-medium mb-2">前缀</label>
          <input
            type="text"
            value={prefix}
            onChange={(e) => updateOutput({ prefix: e.target.value })}
            placeholder="optimized_"
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-3">输出格式 <span className="text-xs text-gray-400 font-normal">可多选</span></label>
        <div className="grid grid-cols-3 gap-2">
          {FORMAT_OPTIONS.map(f => {
            const isSelected = outputFormats.includes(f.id)
            return (
              <label
                key={f.id}
                className={`flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg border cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-primary-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleFormat(f.id)}
                  className="sr-only"
                />
                {f.label}
              </label>
            )
          })}
        </div>
        {outputFormats.length > 1 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            将同时输出 {outputFormats.filter(f => f !== 'original').map(f => f.toUpperCase()).join(', ')} 格式
          </p>
        )}
      </div>
    </div>
  )
}
