import { useState, useEffect, useRef } from 'react'
import WidgetHeader from './WidgetHeader'
import WidgetRenderer from './WidgetRenderer'
import WidgetSettings from './WidgetSettings'
import ResizeHandle from './ResizeHandle'
import { useDrag } from '../../hooks'
import { useResize } from '../../hooks'
import { getWidgetMetadata } from '../../services'
import type { WidgetConfig } from '../../types'
import '@/styles/dashboard.css'

interface WidgetContainerProps {
  widget: WidgetConfig
  isEditMode: boolean
  onUpdate: (updates: Partial<WidgetConfig>) => void
  onRemove: () => void
}

export default function WidgetContainer({ widget, isEditMode, onUpdate, onRemove }: WidgetContainerProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const widgetRef = useRef<HTMLDivElement>(null)
  const metadata = getWidgetMetadata(widget.type)

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
    true // Always enabled
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
    true, // Always enabled
    {
      minWidth: metadata.minWidth,
      minHeight: metadata.minHeight,
      maxWidth: metadata.maxWidth,
      maxHeight: metadata.maxHeight
    }
  )

  const toggleMinimize = () => {
    onUpdate({ minimized: !widget.minimized })
  }

  // Update widget position/size dynamically via refs
  useEffect(() => {
    if (widgetRef.current) {
      widgetRef.current.style.left = `${widget.position.x}px`
      widgetRef.current.style.top = `${widget.position.y}px`
      widgetRef.current.style.width = widget.minimized ? '280px' : `${widget.position.width}px`
      widgetRef.current.style.height = widget.minimized ? 'auto' : `${widget.position.height}px`
      widgetRef.current.style.cursor = isDragging ? 'grabbing' : isEditMode ? 'default' : 'default'
    }
  }, [widget.position.x, widget.position.y, widget.position.width, widget.position.height, widget.minimized, isDragging, isEditMode])

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
        ref={widgetRef}
        id={`widget-${widget.id}`}
        className={`widget-container absolute rounded-2xl overflow-hidden backdrop-blur-2xl bg-gradient-to-br from-cognac-950/40 via-burgundy-950/50 to-forest-950/60 border-2 ${
          isDragging || isResizing ? '' : 'transition-all duration-200'
        } ${isDragging ? 'shadow-2xl shadow-brass-900/60 scale-[1.02] z-50 border-brass-600/50' : 'shadow-xl shadow-black/60 border-brass-800/30'} ${
          isResizing ? 'z-50' : ''
        } ${widget.minimized ? 'h-auto' : ''} ${
          isEditMode && !isDragging && !isResizing ? 'ring-2 ring-brass-500/50' : ''
        }`}
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
        <div className="widget-content p-3 overflow-auto text-white h-[calc(100%-56px)]">
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
          isEditMode={true} // Always visible
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
