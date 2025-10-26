interface EmptyDashboardProps {
  onAddWidget: () => void
}

export default function EmptyDashboard({ onAddWidget }: EmptyDashboardProps) {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center glass-empty-state p-12 rounded-3xl backdrop-blur-xl border border-white/30 max-w-md">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
          <svg className="w-12 h-12 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">No Widgets</h2>
        <p className="text-slate-600 mb-6 font-medium">Add widgets to get started</p>
        <button
          onClick={onAddWidget}
          className="glass-button px-8 py-3 bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-white rounded-xl font-semibold hover:from-blue-600/90 hover:to-purple-600/90 hover:shadow-xl transition-all duration-200 border border-white/30"
        >
          Add Your First Widget
        </button>
      </div>
    </div>
  )
}

