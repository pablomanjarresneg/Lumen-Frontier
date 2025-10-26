import { useState, useRef, useEffect } from 'react'

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

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEnabled) return

    const target = e.target as HTMLElement
    if (target.closest('.widget-controls')) return

    e.preventDefault()
    e.stopPropagation()

    setIsDragging(true)
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      widgetX: currentPosition.x,
      widgetY: currentPosition.y
    }
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()

      const deltaX = e.clientX - dragStartPos.current.x
      const deltaY = e.clientY - dragStartPos.current.y
      const newX = Math.max(0, dragStartPos.current.widgetX + deltaX)
      const newY = Math.max(80, dragStartPos.current.widgetY + deltaY)

      onUpdate({ x: newX, y: newY })
    }

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault()
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'grabbing'

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [isDragging, onUpdate])

  return { isDragging, handleDragStart }
}
