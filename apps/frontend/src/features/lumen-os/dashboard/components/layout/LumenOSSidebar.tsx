import { useState, useEffect } from 'react'

interface LumenOSSidebarProps {
  onAddWidget: () => void
  onToggleEditMode: () => void
  onReset: () => void
  onUploadBackground: () => void
  isEditMode: boolean
  isVisible?: boolean
}

export default function LumenOSSidebar({
  onAddWidget,
  onToggleEditMode,
  onReset,
  onUploadBackground,
  isEditMode,
  isVisible = true
}: LumenOSSidebarProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={`fixed left-0 top-0 bottom-0 w-16 flex flex-col items-center py-4 z-50 backdrop-blur-2xl bg-gradient-to-b from-cognac-950/80 via-burgundy-950/80 to-forest-950/80 border-r-2 border-brass-700/30 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Logo / Home Button */}
      <a 
        href="/"
        className="mb-8 group relative"
        title="Back to Home"
      >
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brass-600 to-cognac-600 flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-lg hover:shadow-brass-600/50 border border-brass-700/30">
          <svg className="w-6 h-6 text-ivory-100" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </div>
        {/* Tooltip */}
        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gradient-to-r from-cognac-950 to-burgundy-950 text-brass-200 text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-brass-700/30">
          Back to Home
        </div>
      </a>

      {/* Navigation Icons */}
      <nav className="flex-1 flex flex-col gap-4 items-center">
        {/* Empty for now - main navigation moved to bottom bar */}
      </nav>

      {/* Bottom section - Settings */}
      <div className="mt-auto flex flex-col gap-2">
        {/* Background Upload */}
        <button
          onClick={onUploadBackground}
          className="text-brass-400/50 hover:text-brass-200 hover:bg-brass-900/20 rounded-lg transition-all p-2"
          title="Background"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        {/* Add Widget */}
        <button
          onClick={onAddWidget}
          className="text-brass-400/50 hover:text-brass-200 hover:bg-brass-900/20 rounded-lg transition-all p-2"
          title="Add Widget"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="text-brass-400/50 hover:text-brass-200 hover:bg-brass-900/20 rounded-lg transition-all p-2"
          title="Reset Dashboard"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  )
}
