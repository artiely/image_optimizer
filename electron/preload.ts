import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  selectFiles: () => ipcRenderer.invoke('select-files'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  getImageMetadata: (filePath: string) => ipcRenderer.invoke('get-image-metadata', filePath),
  generateThumbnail: (filePath: string) => ipcRenderer.invoke('generate-thumbnail', filePath),
  processImages: (files: string[], settings: any) => ipcRenderer.invoke('process-images', files, settings),
  getSystemTheme: () => ipcRenderer.invoke('get-system-theme'),
  
  onProcessProgress: (callback: (data: any) => void) => {
    ipcRenderer.on('process-progress', (_, data) => callback(data))
  },
  onProcessComplete: (callback: (data: any) => void) => {
    ipcRenderer.on('process-complete', (_, data) => callback(data))
  },
  onSystemThemeChanged: (callback: (theme: string) => void) => {
    ipcRenderer.on('system-theme-changed', (_, theme) => callback(theme))
  },
  
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel)
  }
})
