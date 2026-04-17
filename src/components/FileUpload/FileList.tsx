import { useState } from 'react'
import { useImageStore } from '../../stores/imageStore'
import { useImageProcessor } from '../../hooks/useImageProcessor'
import { useCompressionStore } from '../../stores/compressionStore'
import { formatBytes, formatDimensions, formatCompressionRatio } from '../../utils/formatBytes'
import { Trash2, CheckCircle, XCircle, Loader, Eye, Zap } from 'lucide-react'

export function FileList() {
  const { files, selectedFiles, toggleFileSelection, selectAll, deselectAll, removeFiles } = useImageStore()
  const { processImages } = useImageProcessor()
  const { compression, output } = useCompressionStore()
  const [isProcessing, setIsProcessing] = useState(false)

  const allSelected = files.length > 0 && selectedFiles.length === files.length
  const someSelected = selectedFiles.length > 0

  const handleSelectAll = () => {
    if (allSelected) {
      deselectAll()
    } else {
      selectAll()
    }
  }

  const handleRemoveSelected = () => {
    if (someSelected) {
      removeFiles(selectedFiles)
    }
  }

  const handleStartProcess = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending')
    if (pendingFiles.length === 0) return

    setIsProcessing(true)
    
    const settings = {
      compression,
      output
    }

    try {
      await processImages(settings)
    } finally {
      setIsProcessing(false)
    }
  }

  const completedCount = files.filter(f => f.status === 'completed').length
  const errorCount = files.filter(f => f.status === 'error').length
  const pendingCount = files.filter(f => f.status === 'pending').length

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm font-medium">全选</span>
            </label>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {files.length} 个文件
              {completedCount > 0 && <span className="text-primary-500 ml-2">({completedCount} 已完成)</span>}
              {errorCount > 0 && <span className="text-red-500 ml-2">({errorCount} 失败)</span>}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {someSelected && (
              <button
                onClick={handleRemoveSelected}
                className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                删除选中 ({selectedFiles.length})
              </button>
            )}
            
            {pendingCount > 0 && (
              <button
                onClick={handleStartProcess}
                disabled={isProcessing}
                className="px-6 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    处理中...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    开始处理 ({pendingCount})
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        <div className="grid gap-3">
          {files.map(file => (
            <div
              key={file.id}
              className={`bg-white dark:bg-gray-800 rounded-lg border transition-all ${
                selectedFiles.includes(file.id)
                  ? 'border-primary-500 ring-1 ring-primary-500'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center p-3 gap-4">
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(file.id)}
                  onChange={() => toggleFileSelection(file.id)}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-500 focus:ring-primary-500"
                />
                
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                  {file.thumbnail ? (
                    <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Eye className="w-6 h-6" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{file.name}</h3>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatBytes(file.size)}</span>
                    <span>{formatDimensions(file.dimensions.width, file.dimensions.height)}</span>
                    <span className="uppercase">{file.format}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {file.status === 'processing' && (
                    <div className="flex items-center gap-2 text-primary-500">
                      <Loader className="w-4 h-4 animate-spin" />
                      <span className="text-sm">{file.progress}%</span>
                    </div>
                  )}
                  
                  {file.status === 'completed' && file.output && (
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-medium text-primary-500">
                          {formatCompressionRatio(file.output.compressionRatio)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatBytes(file.output.outputSize)}
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-primary-500" />
                    </div>
                  )}
                  
                  {file.status === 'error' && (
                    <div className="flex items-center gap-2 text-red-500">
                      <XCircle className="w-5 h-5" />
                      <span className="text-sm">失败</span>
                    </div>
                  )}
                </div>
              </div>
              
              {file.status === 'processing' && (
                <div className="h-1 bg-gray-100 dark:bg-gray-700">
                  <div 
                    className="h-full bg-primary-500 transition-all duration-300"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
