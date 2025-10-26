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
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAddWidget}
            className="glass-button px-4 py-2 bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-white rounded-xl font-semibold hover:from-blue-600/90 hover:to-purple-600/90 hover:shadow-lg transition-all duration-200 text-sm border border-white/30"
          >
            + Add Widget
          </button>

          <button
            onClick={onToggleEditMode}
            className={`glass-button px-4 py-2 rounded-xl font-semibold transition-all duration-200 text-sm border ${
              isEditMode
                ? 'bg-gradient-to-r from-green-500/80 to-emerald-500/80 text-white border-white/30 hover:from-green-600/90 hover:to-emerald-600/90'
                : 'bg-white/40 text-slate-700 border-white/50 hover:bg-white/60'
            }`}
          >
            {isEditMode ? '✓ Done' : '✎ Edit'}
          </button>

          <button
            onClick={onReset}
            className="glass-button px-4 py-2 bg-white/40 text-slate-700 rounded-xl font-semibold hover:bg-white/60 transition-all duration-200 text-sm border border-white/50"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
