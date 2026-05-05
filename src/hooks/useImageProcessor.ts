import { useCallback } from 'react'
import { useImageStore } from '../stores/imageStore'
import { useTaskStore } from '../stores/taskStore'
import { ProcessSettings, Task } from '../types/image'

export function useImageProcessor() {
  const { files, updateFileProgress, updateFile } = useImageStore()
  const { addTask, setCurrentTask } = useTaskStore()

  const processImages = useCallback(async (settings: ProcessSettings) => {
    const pendingFiles = files.filter(f => f.status === 'pending')
    
    if (pendingFiles.length === 0) return

    const task: Task = {
      id: `task-${Date.now()}`,
      files: pendingFiles,
      settings,
      status: 'processing',
      progress: 0,
      startTime: Date.now()
    }

    addTask(task)
    setCurrentTask(task)

    window.electronAPI.onProcessProgress((data) => {
      updateFileProgress(data.fileId, data.progress, data.status, data.error)
    })

    window.electronAPI.onProcessComplete((data) => {
      updateFile(data.fileId, {
        status: 'completed',
        progress: 100,
        outputs: data.outputs,
        output: data.outputs?.[0]
      })
    })

    const filePaths = pendingFiles.map(f => f.path)
    await window.electronAPI.processImages(filePaths, settings)

    setCurrentTask(null)
  }, [files, addTask, setCurrentTask, updateFileProgress, updateFile])

  return { processImages }
}
