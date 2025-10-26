/**
 * Custom hook for widget resize functionality
 */

import { useState, useRef, useEffect } from 'react'
import type { ResizeState, WidgetSize } from '../types/'

export function useResize(
  currentSize: WidgetSize,
  onUpdate: (updates: Partial<WidgetSize>) => void,
  isEnabled: boolean
): ResizeState {
  const [isResizing, setIsResizing] = useState(false)
  const resizeStartPos = useRef({ x: 0, y: 0, width: 0, height: 0 })

  const handleResizeStart = (e: React.MouseEvent) => {
    if (!isEnabled) return
    e.stopPropagation()
    e.preventDefault()
    setIsResizing(true)
    resizeStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      width: currentSize.width,
      height: currentSize.height
    }
  }

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()

      const deltaX = e.clientX - resizeStartPos.current.x
      const deltaY = e.clientY - resizeStartPos.current.y
      const newWidth = Math.max(250, resizeStartPos.current.width + deltaX)
      const newHeight = Math.max(180, resizeStartPos.current.height + deltaY)

      onUpdate({ width: newWidth, height: newHeight })
    }

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault()
      setIsResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    // Prevent text selection while resizing
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'nwse-resize'

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [isResizing, onUpdate])

  return { isResizing, handleResizeStart }
}
