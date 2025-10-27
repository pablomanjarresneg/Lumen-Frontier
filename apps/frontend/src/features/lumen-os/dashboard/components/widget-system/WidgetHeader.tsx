import type { WidgetConfig } from '../../types'
import { getWidgetMetadata } from '../../services'

interface WidgetHeaderProps {
  widget: WidgetConfig
  isEditMode: boolean
  isDragging: boolean
  onDragStart: (e: React.MouseEvent) => void
  onRemove: () => void
  onMinimize: () => void
  onSettings: () => void
}

export default function WidgetHeader({
  widget,
  isEditMode,
  isDragging,
  onDragStart,
  onMinimize,
  onRemove,
  onSettings
}: WidgetHeaderProps) {
  const metadata = getWidgetMetadata(widget.type)

  return (
    <div
      className={`glass-header bg-gradient-to-r ${metadata.gradient} px-4 py-3.5 flex items-center justify-between backdrop-blur-xl border-b border-white/20 ${
        isEditMode && !isDragging ? 'cursor-grab hover:bg-opacity-90' : ''
      } ${isDragging ? 'cursor-grabbing' : ''}`}
      onMouseDown={onDragStart}
    >
      <div className="flex items-center gap-2 pointer-events-none">
        {isEditMode && (
          <svg className="w-4 h-4 text-white opacity-70" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 3h2v2H9V3zm4 0h2v2h-2V3zM9 7h2v2H9V7zm4 0h2v2h-2V7zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2z"/>
          </svg>
        )}
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={metadata.icon} />
        </svg>
        <h3 className="text-white font-semibold text-sm">{widget.title}</h3>
      </div>

      <div className="widget-controls flex items-center gap-1">
        {/* Settings Button */}
        <button
          onClick={onSettings}
          className="p-1.5 hover:bg-white/20 rounded transition-colors"
          title="Widget settings"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Minimize Button */}
        <button
          onClick={onMinimize}
          className="p-1.5 hover:bg-white/20 rounded transition-colors"
          title={widget.minimized ? 'Expand' : 'Minimize'}
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {widget.minimized ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
            )}
          </svg>
        </button>

        {isEditMode && (
          <button
            onClick={onRemove}
            className="p-1.5 hover:bg-white/20 rounded transition-colors"
            title="Remove widget"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
