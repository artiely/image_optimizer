import { useState } from 'react'
import { CompressionPanel } from '../ImageProcessing/CompressionPanel'
import { ResizePanel } from '../ImageProcessing/ResizePanel'
import { OutputSettings } from '../ImageProcessing/OutputSettings'
import { Image, Maximize2, FolderOpen } from 'lucide-react'

type Tab = 'compression' | 'resize' | 'output'

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<Tab>('compression')

  const tabs = [
    { id: 'compression', label: '压缩设置', icon: Image },
    { id: 'resize', label: '尺寸调整', icon: Maximize2 },
    { id: 'output', label: '输出设置', icon: FolderOpen }
  ] as const

  return (
    <aside className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'text-primary-600 dark:text-primary-400 border-primary-600 dark:border-primary-400'
                  : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4 mx-auto mb-1" />
              <div>{tab.label}</div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {activeTab === 'compression' && <CompressionPanel />}
        {activeTab === 'resize' && <ResizePanel />}
        {activeTab === 'output' && <OutputSettings />}
      </div>
    </aside>
  )
}
