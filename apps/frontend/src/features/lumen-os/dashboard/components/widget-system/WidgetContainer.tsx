import { useState } from 'react'
import WidgetHeader from './WidgetHeader'
import WidgetRenderer from './WidgetRenderer'
import WidgetSettings from './WidgetSettings'
import ResizeHandle from './ResizeHandle'
import { useDrag } from '../../hooks'
import { useResize } from '../../hooks'
import type { WidgetConfig } from '../../types'

interface WidgetContainerProps {
  widget: WidgetConfig
  isEditMode: boolean
  onUpdate: (updates: Partial<WidgetConfig>) => void
  onRemove: () => void
}

export default function WidgetContainer({ widget, isEditMode, onUpdate, onRemove }: WidgetContainerProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

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

  const handleSaveSettings = (settings: Record<string, any>) => {
    // For pomodoro, the settings contain data that should be saved to widget.data
    if (widget.type === 'pomodoro' && settings.data) {
      onUpdate({ data: settings.data, settings })
    } else {
      onUpdate({ settings })
    }
  }

  return (
    <>
      <div
        id={`widget-${widget.id}`}
        className={`absolute rounded-2xl overflow-hidden backdrop-blur-xl bg-black/40 border border-white/20 ${
          isDragging || isResizing ? '' : 'transition-all duration-200'
        } ${isDragging ? 'shadow-2xl shadow-black/60 scale-[1.02] z-50 bg-black/50' : 'shadow-xl shadow-black/40'} ${
          isResizing ? 'z-50' : ''
        } ${widget.minimized ? 'h-auto' : ''} ${
          isEditMode && !isDragging && !isResizing ? 'ring-2 ring-blue-500/50' : ''
        }`}
        // eslint-disable-next-line react/forbid-dom-props
        style={{
          // Dynamic positioning - must use inline styles for draggable widgets
          left: `${widget.position.x}px`,
          top: `${widget.position.y}px`,
          width: widget.minimized ? '280px' : `${widget.position.width}px`,
          height: widget.minimized ? 'auto' : `${widget.position.height}px`,
          cursor: isDragging ? 'grabbing' : isEditMode ? 'default' : 'default'
        }}
      >
        <WidgetHeader
          widget={widget}
          isEditMode={isEditMode}
          isDragging={isDragging}
          onDragStart={handleDragStart}
          onMinimize={toggleMinimize}
          onRemove={onRemove}
          onSettings={() => setIsSettingsOpen(true)}
        />
 
      {!widget.minimized && (
        <div className="widget-content p-5 overflow-auto text-white h-[calc(100%-56px)]">
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
          isMinimized={widget.minimized || false}
          onResizeStart={handleResizeStart}
        />
      </div>

      <WidgetSettings
        widget={widget}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
      />
    </>
  )
}
