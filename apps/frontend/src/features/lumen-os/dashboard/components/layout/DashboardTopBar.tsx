import { useState, useEffect } from 'react'

interface DashboardTopBarProps {
  isEditMode: boolean
  onAddWidget: () => void
  onToggleEditMode: () => void
  onReset: () => void
}

export default function DashboardTopBar({
  isEditMode,
  onAddWidget,
  onToggleEditMode,
  onReset
}: DashboardTopBarProps) {
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
      setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-16 glass-topbar backdrop-blur-2xl z-50 border-b border-white/20">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg glass-logo">
            <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">LumenOS</h1>
            <p className="text-xs text-slate-600 font-medium">Your Learning Operating System</p>
          </div>

          {/* Date and Time */}
          <div className="hidden md:flex items-center gap-2 ml-4 px-3 py-1.5 bg-white/30 rounded-lg border border-white/40">
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-slate-700">{currentDate}</span>
            <span className="text-slate-400">•</span>
            <span className="text-sm font-semibold text-slate-800">{currentTime}</span>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onAddWidget}
            className="glass-button px-4 py-2 bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-white rounded-xl font-semibold hover:from-blue-600/90 hover:to-purple-600/90 hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm border border-white/30 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Add Widget</span>
          </button>

          <button
            onClick={onToggleEditMode}
            className={`glass-button px-4 py-2 rounded-xl font-semibold transition-all duration-200 text-sm border flex items-center gap-2 ${
              isEditMode
                ? 'bg-gradient-to-r from-green-500/80 to-emerald-500/80 text-white border-white/30 hover:from-green-600/90 hover:to-emerald-600/90 hover:scale-105'
                : 'bg-white/40 text-slate-700 border-white/50 hover:bg-white/60'
            }`}
          >
            {isEditMode ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Done</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span className="hidden sm:inline">Edit</span>
              </>
            )}
          </button>

          <button
            onClick={onReset}
            className="glass-button p-2 bg-white/40 text-slate-700 rounded-xl hover:bg-white/60 transition-all duration-200 border border-white/50"
            title="Reset dashboard"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
