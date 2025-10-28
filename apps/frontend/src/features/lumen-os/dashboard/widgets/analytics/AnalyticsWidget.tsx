import { useEffect, useRef } from 'react'
import type { WidgetProps } from '../../types'
import '@/styles/dashboard.css'

export default function AnalyticsWidget({ config }: WidgetProps) {
  const barsRef = useRef<(HTMLDivElement | null)[]>([])
  
  const stats = {
    totalStudyTime: 127,
    cardsReviewed: 1243,
    accuracy: 87,
    streak: 12,
    weeklyActivity: [65, 78, 82, 91, 75, 88, 95]
  }

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const maxActivity = Math.max(...stats.weeklyActivity)

  useEffect(() => {
    barsRef.current.forEach((bar, index) => {
      if (bar) {
        const height = (stats.weeklyActivity[index] / maxActivity) * 100
        bar.style.height = `${height}%`
      }
    })
  }, [stats.weeklyActivity, maxActivity])

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-100">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-slate-600">Study Time</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{stats.totalStudyTime}h</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-100">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-xs text-slate-600">Cards Reviewed</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">{stats.cardsReviewed}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-slate-600">Accuracy</span>
          </div>
          <p className="text-2xl font-bold text-green-900">{stats.accuracy}%</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-3 border border-orange-100">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
            <span className="text-xs text-slate-600">Day Streak</span>
          </div>
          <p className="text-2xl font-bold text-orange-900">{stats.streak}</p>
        </div>
      </div>

      <div className="flex-1 bg-slate-50 rounded-lg p-3 border border-slate-200">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Weekly Activity</h4>
        <div className="flex items-end justify-between gap-2 h-32">
          {stats.weeklyActivity.map((activity, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-1 h-full">
              <div className="w-full flex items-end justify-center flex-1">
                <div 
                  ref={el => barsRef.current[index] = el}
                  className="activity-bar w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t transition-all hover:from-blue-600 hover:to-cyan-500 relative group min-h-[10px]"
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {activity}%
                  </div>
                </div>
              </div>
              <span className="text-xs text-slate-600">{days[index]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-xs font-medium text-blue-900 mb-1">💡 Insight</p>
        <p className="text-xs text-slate-700">
          You're on fire! Your study consistency has improved by 23% this week. Keep it up!
        </p>
      </div>
    </div>
  )
}
