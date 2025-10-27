import { useState, useEffect } from 'react'

export default function WonderSpaceTopBar() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  const formatDate = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    const dayName = days[date.getDay()]
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear().toString().slice(-2)
    
    return `${dayName} | ${day} ${month} '${year}`
  }

  const getAmPm = (date: Date) => {
    return date.getHours() >= 12 ? 'PM' : 'AM'
  }

  return (
    <div className="fixed top-0 right-0 h-16 px-6 flex items-center gap-6 z-50">
      {/* Action Icons */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg transition-colors" title="Notifications">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Icons */}
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center hover:scale-110 transition-transform">
            <span className="text-white text-xs font-bold">🎭</span>
          </button>
          <button className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center hover:scale-110 transition-transform">
            <span className="text-white text-xs font-bold">📚</span>
          </button>
        </div>

        {/* Fullscreen Toggle */}
        <button className="p-2 rounded-lg transition-colors" title="Toggle Fullscreen">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>

        {/* Hide UI */}
        <button className="p-2 rounded-lg transition-colors" title="Hide UI">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
        </button>
      </div>

      {/* Digital Clock */}
      <div className="flex flex-col items-end">
        <div className="flex items-baseline gap-2">
          <span className="text-white font-mono text-4xl font-bold tracking-tight">
            {formatTime(currentTime)}
          </span>
          <span className="text-white text-sm font-medium mb-1">
            {getAmPm(currentTime)}
          </span>
        </div>
        <div className="text-white/70 text-xs font-medium tracking-wide">
          {formatDate(currentTime)}
        </div>
      </div>
    </div>
  )
}
