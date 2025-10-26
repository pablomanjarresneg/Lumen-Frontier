/**
 * Analytics Widget Content
 */

export default function AnalyticsContent() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 glass-card-inner bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-2xl border border-blue-300/30 backdrop-blur-sm hover:scale-105 transition-transform duration-200">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Study Time</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">12.5h</p>
        </div>
        <div className="p-4 glass-card-inner bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 rounded-2xl border border-cyan-300/30 backdrop-blur-sm hover:scale-105 transition-transform duration-200">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Completed</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-700 bg-clip-text text-transparent">48</p>
        </div>
        <div className="p-4 glass-card-inner bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 rounded-2xl border border-indigo-300/30 backdrop-blur-sm hover:scale-105 transition-transform duration-200">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Accuracy</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent">94%</p>
        </div>
        <div className="p-4 glass-card-inner bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-2xl border border-purple-300/30 backdrop-blur-sm hover:scale-105 transition-transform duration-200">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Rank</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">#12</p>
        </div>
      </div>
    </div>
  )
}
