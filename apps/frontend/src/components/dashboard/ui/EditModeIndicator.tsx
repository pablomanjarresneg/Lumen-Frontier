/**
 * Edit Mode Indicator Component
 */

import type { EditModeIndicatorProps } from '../types/'

export default function EditModeIndicator({ isEditMode }: EditModeIndicatorProps) {
  if (!isEditMode) return null

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-indicator bg-gradient-to-r from-blue-500/90 to-purple-500/90 backdrop-blur-xl text-white px-6 py-3 rounded-full shadow-glass-lg z-50 flex items-center gap-3 animate-slideUp border border-white/30">
      <svg className="w-5 h-5 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
      <span className="font-semibold text-sm drop-shadow">Edit Mode - Drag widgets to move, resize from corner</span>
    </div>
  )
}
