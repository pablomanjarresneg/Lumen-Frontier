import { useState } from 'react'
import WidgetHeader from './WidgetHeader'
import WidgetRenderer from './WidgetRenderer'
import ResizeHandle from './ResizeHandle'
import { useDrag } from '../hooks/useDrag'
import { useResize } from '../hooks/useResize'
import type { WidgetConfig } from '@/types/widgets'

interface WidgetContainerProps {
  widget: WidgetConfig
  isEditMode: boolean
  onUpdate: (updates: Partial<WidgetConfig>) => void
  onRemove: () => void
}

export default function WidgetContainer({ widget, isEditMode, onUpdate, onRemove }: WidgetContainerProps) {
  const { isDragging, handleDragStart } = useDrag(
    { x: widget.position.x, y: widget.position.y },
    (positionUpdates) => {
      onUpdate({
        position: {
          ...widget.position,
          ...positionUpdates
        }
      })
    },
    isEditMode
  )

  const { isResizing, handleResizeStart } = useResize(
    { width: widget.position.width, height: widget.position.height },
    (sizeUpdates) => {
      onUpdate({
        position: {
          ...widget.position,
          ...sizeUpdates
        }
      })
    },
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
          <WidgetRenderer
            config={widget}
            onUpdate={onUpdate}
            onRemove={onRemove}
            onMinimize={toggleMinimize}
            isEditing={isEditMode}
          />
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
