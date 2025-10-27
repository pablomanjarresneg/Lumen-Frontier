import { useState, useRef, useEffect, useCallback } from 'react'

interface WidgetPosition {
  x: number
  y: number
}

export function useDrag(
  currentPosition: WidgetPosition,
  onUpdate: (updates: Partial<WidgetPosition>) => void,
  isEnabled: boolean
) {
  const [isDragging, setIsDragging] = useState(false)
  const dragStartPos = useRef({ x: 0, y: 0, widgetX: 0, widgetY: 0 })
  const onUpdateRef = useRef(onUpdate)

  // Keep ref updated
  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  const handleDragStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEnabled) return

    const target = e.target as HTMLElement

    // Don't drag if clicking on interactive elements
    if (target.closest('.widget-controls')) return
    if (target.closest('button')) return
    if (target.closest('input')) return
    if (target.closest('textarea')) return
    if (target.closest('select')) return

    // Only allow drag from header area
    if (!target.closest('.widget-header')) return

    e.preventDefault()
    e.stopPropagation()

    setIsDragging(true)
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      widgetX: currentPosition.x,
      widgetY: currentPosition.y
    }
  }, [isEnabled, currentPosition.x, currentPosition.y])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartPos.current.x
      const deltaY = e.clientY - dragStartPos.current.y
      const newX = Math.max(0, dragStartPos.current.widgetX + deltaX)
      const newY = Math.max(64, dragStartPos.current.widgetY + deltaY)

      onUpdateRef.current({ x: newX, y: newY })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: false })
    document.addEventListener('mouseup', handleMouseUp)

    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'grabbing'

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [isDragging])

  return { isDragging, handleDragStart }
}
