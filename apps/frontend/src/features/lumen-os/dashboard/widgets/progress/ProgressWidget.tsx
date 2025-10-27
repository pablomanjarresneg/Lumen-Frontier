import type { WidgetProps } from '../../types'

export default function ProgressWidget({ config }: WidgetProps) {
  const progress = config.data?.progress || 45
  const streak = config.data?.streak || 7

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center mb-4">
        <div className="relative w-32 h-32">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#e2e8f0"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-slate-900">{progress}%</span>
            <span className="text-xs text-slate-500">Complete</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg p-3 border border-pink-100">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
            <span className="text-xs text-slate-600">Streak</span>
          </div>
          <p className="text-xl font-bold text-pink-900">{streak} days</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-100">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span className="text-xs text-slate-600">Level</span>
          </div>
          <p className="text-xl font-bold text-purple-900">12</p>
        </div>
      </div>

      <div className="flex-1 bg-slate-50 rounded-lg p-3 border border-slate-200">
        <h4 className="text-xs font-semibold text-slate-700 mb-2">Recent Achievements</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-100">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🏆</span>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-800">Week Warrior</p>
              <p className="text-xs text-slate-500">7-day streak!</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-100">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg">📚</span>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-800">Bookworm</p>
              <p className="text-xs text-slate-500">100 cards reviewed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
