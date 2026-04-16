import { DropZone } from '../FileUpload/DropZone'
import { FileList } from '../FileUpload/FileList'
import { ProgressBar } from '../Progress/ProgressBar'
import { useImageStore } from '../../stores/imageStore'

export function MainContent() {
  const { files } = useImageStore()

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <ProgressBar />
      
      {files.length === 0 ? (
        <DropZone />
      ) : (
        <FileList />
      )}
    </main>
  )
}
