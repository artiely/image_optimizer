import { useEffect } from 'react'
import { Header } from './components/Layout/Header'
import { Sidebar } from './components/Layout/Sidebar'
import { MainContent } from './components/Layout/MainContent'
import { useTheme } from './hooks/useTheme'

function App() {
  const { effectiveTheme } = useTheme()
  
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(effectiveTheme)
  }, [effectiveTheme])

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  )
}

export default App
