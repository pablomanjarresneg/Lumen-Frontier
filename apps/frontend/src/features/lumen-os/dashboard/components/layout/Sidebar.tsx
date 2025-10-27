import { useState } from 'react'

interface SidebarProps {
  onAddWidget: () => void
  onToggleEditMode: () => void
  onReset: () => void
  onUploadBackground: () => void
  isEditMode: boolean
}

export default function Sidebar({ onAddWidget, onToggleEditMode, onReset, onUploadBackground, isEditMode }: SidebarProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const menuItems = [
    {
      id: 'dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 6v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      label: 'Dashboard',
      active: true
    },
    {
      id: 'widgets',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      ),
      label: 'Add Widget',
      action: onAddWidget
    },
    {
      id: 'edit',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      label: isEditMode ? 'Exit Edit' : 'Edit Mode',
      action: onToggleEditMode,
      isActive: isEditMode
    },
    {
      id: 'background',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Background',
      action: onUploadBackground
    },
    {
      id: 'reset',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      label: 'Reset',
      action: onReset
    }
  ]

  return (
    <div className="fixed left-0 top-0 bottom-0 w-20 bg-black/30 backdrop-blur-xl border-r border-white/10 flex flex-col items-center py-6 z-50">
      {/* Logo */}
      <div className="mb-8 relative group">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
          <svg className="w-7 h-7 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        {/* Tooltip */}
        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
          LumenOS
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 flex flex-col gap-2 w-full px-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className={`relative group w-full p-3 rounded-xl transition-all duration-200 ${
              item.isActive || item.active
                ? 'bg-white/20 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            title={item.label}
          >
            {item.icon}
            {/* Tooltip */}
            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              {item.label}
            </div>
          </button>
        ))}
      </nav>

      {/* Bottom Section - Clock */}
      <div className="mt-auto text-center">
        <div className="text-white/60 text-xs font-mono mb-1">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-white/40 text-[10px]">
          {new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })}
        </div>
      </div>
    </div>
  )
}
