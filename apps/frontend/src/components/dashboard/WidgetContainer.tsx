import { useState, useEffect, useRef, type ReactNode } from 'react'
import type { WidgetConfig } from '@/types/widgets'
import { getWidgetMetadata } from '@/services/widgetRegistry'

interface WidgetContainerProps {
  config: WidgetConfig
  children: ReactNode
  onUpdate: (updates: Partial<WidgetConfig>) => void
  onRemove: () => void
  isEditing: boolean
}

export default function WidgetContainer({
  config,
  children,
  onUpdate,
  onRemove,
  isEditing
}: WidgetContainerProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const dragRef = useRef({ startX: 0, startY: 0, startPosX: 0, startPosY: 0 })
  const resizeRef = useRef({ startX: 0, startY: 0, startWidth: 0, startHeight: 0 })
  const metadata = getWidgetMetadata(config.type)

  const handleDragStart = (e: React.MouseEvent) => {
    if (!isEditing) return
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('.widget-controls') || target.closest('.resize-handle')) return
    e.preventDefault()
    e.stopPropagation()
    dragRef.current = { startX: e.clientX, startY: e.clientY, startPosX: config.position.x, startPosY: config.position.y }
    setIsDragging(true)
  }

  const handleResizeStart = (e: React.MouseEvent) => {
    if (!isEditing) return
    e.preventDefault()
    e.stopPropagation()
    resizeRef.current = { startX: e.clientX, startY: e.clientY, startWidth: config.position.width, startHeight: config.position.height }
    setIsResizing(true)
  }

  useEffect(() => {
    if (!isDragging && !isResizing) return
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      if (isDragging) {
        const deltaX = e.clientX - dragRef.current.startX
        const deltaY = e.clientY - dragRef.current.startY
        onUpdate({ position: { ...config.position, x: Math.max(0, dragRef.current.startPosX + deltaX), y: Math.max(0, dragRef.current.startPosY + deltaY) } })
      } else if (isResizing) {
        const deltaX = e.clientX - resizeRef.current.startX
        const deltaY = e.clientY - resizeRef.current.startY
        onUpdate({ position: { ...config.position, width: Math.max(metadata.minWidth, Math.min(metadata.maxWidth || 2000, resizeRef.current.startWidth + deltaX)), height: Math.max(metadata.minHeight, Math.min(metadata.maxHeight || 2000, resizeRef.current.startHeight + deltaY)) } })
      }
    }
    const handleMouseUp = () => { setIsDragging(false); setIsResizing(false) }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp) }
  }, [isDragging, isResizing, config.position, onUpdate, metadata])

  return (
    <div className={`absolute bg-white rounded-2xl shadow-xl border-2 transition-all flex flex-col ${isDragging ? 'cursor-grabbing z-50 border-blue-500' : isEditing ? 'cursor-grab border-slate-300 hover:border-blue-400' : 'border-slate-200'}`} style={{ left: config.position.x + 'px', top: config.position.y + 'px', width: config.position.width + 'px', height: config.position.height + 'px', userSelect: 'none' }} onMouseDown={handleDragStart}>
      <div className={`bg-gradient-to-r ${metadata.gradient} px-4 py-3 flex items-center justify-between rounded-t-2xl flex-shrink-0`} style={{ height: '52px' }}>
        <div className="flex items-center gap-2 pointer-events-none">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={metadata.icon} /></svg>
          <h3 className="text-white font-semibold text-sm truncate">{config.title}</h3>
        </div>
        <div className="widget-controls flex items-center gap-1">
          {isEditing && <button onClick={onRemove} className="p-1.5 hover:bg-white/20 rounded" type="button"><svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>}
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">{children}</div>
      {isEditing && <div className="resize-handle absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize group" onMouseDown={handleResizeStart} style={{ zIndex: 10 }}><div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-slate-300 to-transparent opacity-50 group-hover:opacity-100 group-hover:from-blue-400 rounded-br-2xl" /></div>}
    </div>
  )
}
