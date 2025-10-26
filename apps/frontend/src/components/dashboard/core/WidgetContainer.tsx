import { useState } from 'react'
import WidgetHeader from './WidgetHeader'
import WidgetContentRenderer from './WidgetContentRenderer'
import ResizeHandle from './ResizeHandle'
import { useDrag } from '../hooks/useDrag'
import { useResize } from '../hooks/useResize'
import type { WidgetConfig } from '@/types/widgets'

interface Widget extends WidgetConfig {
  x: number
  y: number
  width: number
  height: number
  color?: string
  icon?: string
  minimized?: boolean
  content?: any
}

interface WidgetContainerProps {
  widget: Widget
  isEditMode: boolean
  onUpdate: (updates: Partial<Widget>) => void
  onRemove: () => void
}

export default function WidgetContainer({ widget, isEditMode, onUpdate, onRemove }: WidgetContainerProps) {
  const { isDragging, handleDragStart } = useDrag(
    { x: widget.x, y: widget.y },
    onUpdate,
    isEditMode
  )
  
  const { isResizing, handleResizeStart } = useResize(
    { width: widget.width, height: widget.height },
    onUpdate,
    isEditMode
  )

  const toggleMinimize = () => {
    onUpdate({ minimized: !widget.minimized })
  }

  return (
    <div
      className={`absolute glass-widget rounded-3xl overflow-hidden transition-all duration-300 ${
        isDragging ? 'shadow-glass-lg scale-[1.02] z-50 cursor-grabbing glass-widget-dragging' : 'shadow-glass'
      } ${isResizing ? 'z-50' : ''} ${widget.minimized ? 'h-auto' : ''}`}
      style={{
        left: `${widget.x}px`,
        top: `${widget.y}px`,
        width: widget.minimized ? '280px' : `${widget.width}px`,
        height: widget.minimized ? 'auto' : `${widget.height}px`,
        userSelect: 'none'
      }}
    >
      <WidgetHeader
        widget={widget}
        isEditMode={isEditMode}
        isDragging={isDragging}
        onDragStart={handleDragStart}
        onMinimize={toggleMinimize}
        onRemove={onRemove}
      />

      {!widget.minimized && (
        <div className="widget-content p-5 overflow-auto glass-content" style={{ height: 'calc(100% - 56px)' }}>
          <WidgetContentRenderer widget={widget} />
        </div>
      )}

      <ResizeHandle
        isEditMode={isEditMode}
        isMinimized={widget.minimized}
        onResizeStart={handleResizeStart}
      />
    </div>
  )
}
