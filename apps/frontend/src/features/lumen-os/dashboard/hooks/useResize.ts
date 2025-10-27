import { useState, useRef, useEffect, useCallback } from 'react'

interface WidgetSize {
  width: number
  height: number
}

export function useResize(
  currentSize: WidgetSize,
  onUpdate: (updates: Partial<WidgetSize>) => void,
  isEnabled: boolean
) {
  const [isResizing, setIsResizing] = useState(false)
  const resizeStartPos = useRef({ x: 0, y: 0, width: 0, height: 0 })
  const onUpdateRef = useRef(onUpdate)

  // Keep ref updated
  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
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
  }, [isEnabled, currentSize.width, currentSize.height])

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStartPos.current.x
      const deltaY = e.clientY - resizeStartPos.current.y
      const newWidth = Math.max(250, resizeStartPos.current.width + deltaX)
      const newHeight = Math.max(180, resizeStartPos.current.height + deltaY)

      onUpdateRef.current({ width: newWidth, height: newHeight })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: false })
    document.addEventListener('mouseup', handleMouseUp)

    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'nwse-resize'

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [isResizing])

  return { isResizing, handleResizeStart }
}
