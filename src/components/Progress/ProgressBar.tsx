import { useTaskStore } from '../../stores/taskStore'
import { formatBytes } from '../../utils/formatBytes'
import { Loader } from 'lucide-react'

export function ProgressBar() {
  const { currentTask } = useTaskStore()

  if (!currentTask) return null

  const completedFiles = currentTask.files.filter(f => f.status === 'completed').length
  const totalFiles = currentTask.files.length
  const progress = (completedFiles / totalFiles) * 100

  const totalOriginalSize = currentTask.files.reduce((sum, f) => sum + f.size, 0)
  const totalOutputSize = currentTask.files
    .filter(f => f.output)
    .reduce((sum, f) => sum + (f.output?.outputSize || 0), 0)

  return (
    <div className="bg-primary-50 dark:bg-primary-900/20 border-b border-primary-200 dark:border-primary-800 px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Loader className="w-4 h-4 animate-spin text-primary-500" />
          <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
            处理中...
          </span>
        </div>
        <span className="text-sm text-primary-600 dark:text-primary-400">
          {completedFiles} / {totalFiles}
        </span>
      </div>
      
      <div className="h-2 bg-primary-200 dark:bg-primary-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {totalOutputSize > 0 && (
        <div className="flex items-center justify-between mt-2 text-xs text-primary-600 dark:text-primary-400">
          <span>已处理: {formatBytes(totalOutputSize)}</span>
          <span>
            节省: {formatBytes(totalOriginalSize - totalOutputSize)} 
            ({((totalOriginalSize - totalOutputSize) / totalOriginalSize * 100).toFixed(1)}%)
          </span>
        </div>
      )}
    </div>
  )
}
