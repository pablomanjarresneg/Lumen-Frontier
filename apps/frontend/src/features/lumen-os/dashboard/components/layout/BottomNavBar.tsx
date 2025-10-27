import { useState } from 'react'

interface BottomNavBarProps {
  onNavigate: (section: string) => void
  isVisible?: boolean
}

export default function BottomNavBar({ onNavigate, isVisible = true }: BottomNavBarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const navItems = [
    { id: 'theme', label: 'Theme', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'ambience', label: 'Ambience', icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z' },
    { id: 'track', label: 'Track', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
    { id: 'pomo', label: 'Pomo', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'music', label: 'Music', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
    { id: 'todo', label: 'Todo', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { id: 'stats', label: 'Stats', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'journal', label: 'Journal', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' }
  ]

  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
    }`}>
      <div className="flex items-center gap-3 backdrop-blur-2xl bg-gradient-to-r from-cognac-950/80 via-burgundy-950/80 to-cognac-950/80 border-2 border-brass-700/30 rounded-2xl px-4 py-2 shadow-2xl shadow-black/60">
        {navItems.map((item, index) => (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Tooltip */}
              {hoveredItem === item.id && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="bg-gradient-to-r from-cognac-950 to-burgundy-950 text-brass-200 text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl border border-brass-700/30">
                    {item.label}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-cognac-950 rotate-45 border-r border-b border-brass-700/30"></div>
                  </div>
                </div>
              )}

              {/* Icon Button */}
              <button
                onClick={() => onNavigate?.(item.id)}
                title={item.label}
                className={`relative p-3 rounded-xl transition-all duration-300 ${
                  hoveredItem === item.id
                    ? 'scale-125 -translate-y-3 bg-brass-600/20'
                    : 'hover:scale-110 hover:bg-brass-900/20'
                }`}
              >
                <svg
                  className={`w-6 h-6 transition-all duration-300 ${
                    hoveredItem === item.id ? 'text-brass-200 scale-110' : 'text-brass-400/70'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={item.icon}
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
    </div>
  )

}