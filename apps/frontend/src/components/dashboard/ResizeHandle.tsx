/**
 * Resize Handle Component
 */

import type { ResizeHandleProps } from './types/'

// Extended props to include isMinimized
interface Props extends ResizeHandleProps {
  isMinimized: boolean
}

export default function ResizeHandle({ isEditMode, isMinimized, onResizeStart }: Props) {
  if (!isEditMode || isMinimized) return null

  return (
    <div
      className="resize-handle absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-10"
      onMouseDown={onResizeStart}
    >
      <svg className="w-full h-full text-slate-400 opacity-50 hover:opacity-100" viewBox="0 0 24 24">
        <path fill="currentColor" d="M22 22H20V20H22V22M22 18H20V16H22V18M18 22H16V20H18V22M18 18H16V16H18V18M14 22H12V20H14V22M22 14H20V12H22V14Z" />
      </svg>
    </div>
  )
}
