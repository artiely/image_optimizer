import { useCallback } from 'react'
import { useImageStore } from '../stores/imageStore'
import { ImageFile } from '../types/image'

export function useFileManager() {
  const { addFiles } = useImageStore()

  const loadFiles = useCallback(async (filePaths: string[]) => {
    const newFiles: ImageFile[] = []

    for (const filePath of filePaths) {
      try {
        const metadata = await window.electronAPI.getImageMetadata(filePath)
        const thumbnail = await window.electronAPI.generateThumbnail(filePath)
        
        const fileName = filePath.split('/').pop() || filePath.split('\\').pop() || filePath
        
        newFiles.push({
          id: filePath,
          path: filePath,
          name: fileName,
          size: metadata.size,
          format: metadata.format,
          dimensions: {
            width: metadata.width,
            height: metadata.height
          },
          thumbnail,
          metadata,
          status: 'pending',
          progress: 0
        })
      } catch (error) {
        console.error(`Failed to load file ${filePath}:`, error)
      }
    }

    addFiles(newFiles)
    return newFiles
  }, [addFiles])

  return { loadFiles }
}
