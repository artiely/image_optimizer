import { useTheme } from '../../hooks/useTheme'
import { Sun, Moon, Settings } from 'lucide-react'

export function Header() {
  const { setTheme, effectiveTheme } = useTheme()

  return (
    <header className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
      <div className="flex items-center gap-3">
        <div className="w-20" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}></div>
        <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">IO</span>
        </div>
        <h1 className="text-lg font-semibold">Image Optimizer</h1>
      </div>
      
      <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <button
          onClick={() => setTheme(effectiveTheme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={effectiveTheme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
        >
          {effectiveTheme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
        <button
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="设置"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
