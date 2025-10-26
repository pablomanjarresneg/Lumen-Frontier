interface ProgressContentProps {
  content?: {
    progress?: number
    streak?: number
  }
}

export default function ProgressContent({ content }: ProgressContentProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">Overall Progress</span>
        <span className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
          {content?.progress || 0}%
        </span>
      </div>
      <div className="w-full bg-gradient-to-r from-slate-200/50 to-slate-300/50 backdrop-blur-sm rounded-full h-4 overflow-hidden shadow-inner border border-white/50">
        <div
          className="glass-progress bg-gradient-to-r from-pink-400 via-pink-500 to-rose-600 h-full rounded-full transition-all duration-500 relative overflow-hidden"
          style={{ width: `${content?.progress || 0}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent shimmer"></div>
        </div>
      </div>
      <div className="flex items-center gap-3 p-4 glass-card-inner bg-gradient-to-br from-pink-500/10 to-rose-500/5 rounded-2xl border border-pink-300/30 backdrop-blur-sm">
        <span className="text-3xl">🔥</span>
        <div>
          <p className="text-sm font-semibold text-slate-700">{content?.streak || 0} Day Streak</p>
          <p className="text-xs text-slate-500">Keep it up!</p>
        </div>
      </div>
    </div>
  )
}
