import { app, BrowserWindow, ipcMain, dialog, nativeTheme } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { ImageProcessor } from './services/imageProcessor'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let mainWindow: BrowserWindow | null = null
const imageProcessor = new ImageProcessor()

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 15, y: 15 },
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#111827' : '#F9FAFB'
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('select-files', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'tiff', 'avif'] }
    ]
  })
  return result.filePaths
})

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openDirectory', 'createDirectory']
  })
  return result.filePaths[0]
})

ipcMain.handle('get-image-metadata', async (_, filePath: string) => {
  return await imageProcessor.getMetadata(filePath)
})

ipcMain.handle('generate-thumbnail', async (_, filePath: string) => {
  return await imageProcessor.generateThumbnail(filePath)
})

ipcMain.handle('process-images', async (_, files: string[], settings: any) => {
  const results = []
  for (const file of files) {
    try {
      mainWindow?.webContents.send('process-progress', {
        fileId: file,
        progress: 0,
        status: 'processing'
      })

      const result = await imageProcessor.processImage(file, settings, (progress) => {
        mainWindow?.webContents.send('process-progress', {
          fileId: file,
          progress,
          status: 'processing'
        })
      })

      results.push(result)
      
      mainWindow?.webContents.send('process-complete', {
        fileId: file,
        output: result
      })
    } catch (error) {
      mainWindow?.webContents.send('process-progress', {
        fileId: file,
        progress: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
  return results
})

ipcMain.handle('get-system-theme', () => {
  return nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
})

nativeTheme.on('updated', () => {
  mainWindow?.webContents.send('system-theme-changed', 
    nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
  )
})
