export default function NotesContent() {
  return (
    <div className="space-y-3">
      <div className="p-4 glass-card-inner bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-300/30 rounded-2xl backdrop-blur-sm">
        <p className="text-sm text-slate-700 font-medium">📝 Click to add your first note</p>
      </div>
      <button className="w-full py-2.5 glass-button bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 rounded-xl text-green-700 font-medium text-sm transition-all duration-200 border border-green-300/30">
        + Add Note
      </button>
    </div>
  )
}
