import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FolderOpen, Image } from 'lucide-react'
import { useFileManager } from '../../hooks/useFileManager'

export function DropZone() {
  const { loadFiles } = useFileManager()
  const [isLoading, setIsLoading] = useState(false)

  const handleFiles = useCallback(async (filePaths: string[]) => {
    setIsLoading(true)
    try {
      await loadFiles(filePaths)
    } finally {
      setIsLoading(false)
    }
  }, [loadFiles])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const filePaths = acceptedFiles.map(file => (file as any).path || file.name)
    await handleFiles(filePaths)
  }, [handleFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.tiff', '.avif']
    },
    noClick: true,
    noKeyboard: true
  })

  const handleSelectFiles = async () => {
    const filePaths = await window.electronAPI.selectFiles()
    if (filePaths && filePaths.length > 0) {
      await handleFiles(filePaths)
    }
  }

  const handleSelectFolder = async () => {
    const folderPath = await window.electronAPI.selectFolder()
    if (folderPath) {
      setIsLoading(true)
      try {
        const allFiles: string[] = []
        await handleFiles(allFiles)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div 
      {...getRootProps()}
      className="flex-1 flex items-center justify-center p-8"
    >
      <input {...getInputProps()} />
      
      <div className="max-w-2xl w-full">
        <div 
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            isDragActive 
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
          }`}
        >
          <div className="flex justify-center mb-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
              isDragActive 
                ? 'bg-primary-500' 
                : 'bg-gray-100 dark:bg-gray-800'
            }`}>
              <Upload className={`w-10 h-10 ${
                isDragActive 
                  ? 'text-white' 
                  : 'text-gray-400 dark:text-gray-500'
              }`} />
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mb-2">
            {isDragActive ? '释放以上传文件' : '拖拽图片到此处'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            支持 JPEG, PNG, WebP, GIF, TIFF, AVIF 格式
          </p>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleSelectFiles}
              disabled={isLoading}
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Image className="w-5 h-5" />
              选择文件
            </button>
            <button
              onClick={handleSelectFolder}
              disabled={isLoading}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FolderOpen className="w-5 h-5" />
              选择文件夹
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
