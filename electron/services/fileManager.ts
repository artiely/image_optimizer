import fs from 'fs/promises'
import path from 'path'

export class FileManager {
  async ensureDirectory(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath)
    } catch {
      await fs.mkdir(dirPath, { recursive: true })
    }
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath)
      return true
    } catch {
      return false
    }
  }

  async getFilesInDirectory(dirPath: string, extensions: string[]): Promise<string[]> {
    const files: string[] = []
    
    const scan = async (currentPath: string) => {
      const entries = await fs.readdir(currentPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name)
        
        if (entry.isDirectory()) {
          await scan(fullPath)
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase().slice(1)
          if (extensions.includes(ext)) {
            files.push(fullPath)
          }
        }
      }
    }
    
    await scan(dirPath)
    return files
  }

  async deleteFile(filePath: string): Promise<void> {
    await fs.unlink(filePath)
  }

  async copyFile(src: string, dest: string): Promise<void> {
    await fs.copyFile(src, dest)
  }

  async moveFile(src: string, dest: string): Promise<void> {
    await fs.rename(src, dest)
  }
}
