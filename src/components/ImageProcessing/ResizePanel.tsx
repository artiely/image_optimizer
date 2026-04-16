import { useState } from 'react'
import { Lock, Unlock } from 'lucide-react'

const PRESET_SIZES = [
  { label: '4K', width: 3840, height: 2160 },
  { label: 'Full HD', width: 1920, height: 1080 },
  { label: 'HD', width: 1280, height: 720 },
  { label: '社交媒体', width: 1080, height: 1080 },
  { label: '缩略图', width: 800, height: 600 },
  { label: '小图', width: 400, height: 300 }
]

export function ResizePanel() {
  const [mode, setMode] = useState<'width' | 'height' | 'percent' | 'custom'>('width')
  const [width, setWidth] = useState(1920)
  const [height, setHeight] = useState(1080)
  const [percent, setPercent] = useState(50)
  const [lockRatio, setLockRatio] = useState(true)
  const [fit, setFit] = useState<'contain' | 'cover' | 'fill' | 'inside' | 'outside'>('inside')
  const [kernel, setKernel] = useState<'nearest' | 'cubic' | 'mitchell' | 'lanczos2' | 'lanczos3'>('lanczos3')

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth)
    if (lockRatio) {
      setHeight(Math.round(newWidth * 9 / 16))
    }
  }

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight)
    if (lockRatio) {
      setWidth(Math.round(newHeight * 16 / 9))
    }
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <label className="block text-sm font-medium mb-3">调整方式</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'width', label: '按宽度' },
            { id: 'height', label: '按高度' },
            { id: 'percent', label: '按百分比' },
            { id: 'custom', label: '自定义' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id as any)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                mode === m.id
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-primary-400'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {mode === 'width' && (
        <div>
          <label className="block text-sm font-medium mb-2">宽度 (像素)</label>
          <input
            type="number"
            value={width}
            onChange={(e) => handleWidthChange(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      )}

      {mode === 'height' && (
        <div>
          <label className="block text-sm font-medium mb-2">高度 (像素)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => handleHeightChange(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      )}

      {mode === 'percent' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">缩放比例</label>
            <span className="text-sm text-primary-500 font-mono">{percent}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="200"
            value={percent}
            onChange={(e) => setPercent(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
        </div>
      )}

      {mode === 'custom' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">尺寸</label>
            <button
              onClick={() => setLockRatio(!lockRatio)}
              className={`p-1.5 rounded transition-colors ${
                lockRatio 
                  ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              {lockRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">宽度</label>
              <input
                type="number"
                value={width}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">高度</label>
              <input
                type="number"
                value={height}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-3">预设尺寸</label>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_SIZES.map(preset => (
            <button
              key={preset.label}
              onClick={() => {
                setWidth(preset.width)
                setHeight(preset.height)
                setMode('custom')
              }}
              className="px-3 py-2 text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary-400 transition-colors text-left"
            >
              <div className="font-medium">{preset.label}</div>
              <div className="text-gray-500 dark:text-gray-400">{preset.width}×{preset.height}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">适应模式</label>
        <select
          value={fit}
          onChange={(e) => setFit(e.target.value as any)}
          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="inside">内部适应 (保持比例)</option>
          <option value="outside">外部适应 (保持比例)</option>
          <option value="cover">覆盖 (可能裁剪)</option>
          <option value="contain">包含 (可能留白)</option>
          <option value="fill">填充 (拉伸)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">缩放算法</label>
        <select
          value={kernel}
          onChange={(e) => setKernel(e.target.value as any)}
          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="lanczos3">Lanczos3 (推荐)</option>
          <option value="lanczos2">Lanczos2</option>
          <option value="cubic">Cubic</option>
          <option value="mitchell">Mitchell</option>
          <option value="nearest">Nearest (像素风格)</option>
        </select>
      </div>
    </div>
  )
}
