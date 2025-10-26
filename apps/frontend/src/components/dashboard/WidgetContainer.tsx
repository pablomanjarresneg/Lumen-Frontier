/**
 * Widget Container
 * Simple, clean container with working drag, resize, and minimize
 */

import { useState, useRef, useEffect } from 'react'

interface Widget {
  id: string
  type: string
  title: string
  color: string
  icon: string
  x: number
  y: number
  width: number
  height: number
  minimized: boolean
  content?: any
}

interface Props {
  widget: Widget
  isEditMode: boolean
  onUpdate: (updates: Partial<Widget>) => void
  onRemove: () => void
}

export default function WidgetContainer({ widget, isEditMode, onUpdate, onRemove }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const dragStartPos = useRef({ x: 0, y: 0, widgetX: 0, widgetY: 0 })
  const resizeStartPos = useRef({ x: 0, y: 0, width: 0, height: 0 })

  // Handle drag start - SIMPLIFIED
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditMode) return

    // Only allow dragging from the header
    const target = e.target as HTMLElement
    if (target.closest('.widget-controls')) return

    e.preventDefault()
    e.stopPropagation()

    setIsDragging(true)
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      widgetX: widget.x,
      widgetY: widget.y
    }
  }

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent) => {
    if (!isEditMode) return
    e.stopPropagation()
    e.preventDefault()
    setIsResizing(true)
    resizeStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      width: widget.width,
      height: widget.height
    }
  }

  // Handle mouse move for drag and resize
  useEffect(() => {
    if (!isDragging && !isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()

      if (isDragging) {
        const deltaX = e.clientX - dragStartPos.current.x
        const deltaY = e.clientY - dragStartPos.current.y
        const newX = Math.max(0, dragStartPos.current.widgetX + deltaX)
        const newY = Math.max(80, dragStartPos.current.widgetY + deltaY)

        onUpdate({ x: newX, y: newY })
      }

      if (isResizing) {
        const deltaX = e.clientX - resizeStartPos.current.x
        const deltaY = e.clientY - resizeStartPos.current.y
        const newWidth = Math.max(250, resizeStartPos.current.width + deltaX)
        const newHeight = Math.max(180, resizeStartPos.current.height + deltaY)

        onUpdate({ width: newWidth, height: newHeight })
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault()
      setIsDragging(false)
      setIsResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    // Prevent text selection while dragging
    document.body.style.userSelect = 'none'
    document.body.style.cursor = isDragging ? 'grabbing' : isResizing ? 'nwse-resize' : 'default'

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [isDragging, isResizing, onUpdate])

  // Toggle minimize
  const toggleMinimize = () => {
    onUpdate({ minimized: !widget.minimized })
  }

  // Render widget content based on type
  const renderContent = () => {
    if (widget.minimized) return null

    switch (widget.type) {
      case 'notes':
        return (
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-slate-700">📝 Click to add your first note</p>
            </div>
            <button className="w-full py-2 bg-green-100 hover:bg-green-200 rounded-lg text-green-700 font-medium text-sm transition-colors">
              + Add Note
            </button>
          </div>
        )

      case 'progress':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Overall Progress</span>
              <span className="text-2xl font-bold text-pink-600">{widget.content?.progress || 0}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-400 to-rose-600 h-full rounded-full transition-all"
                style={{ width: `${widget.content?.progress || 0}%` }}
              />
            </div>
            <div className="flex items-center gap-2 p-3 bg-pink-50 rounded-lg">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="text-sm font-medium text-slate-700">{widget.content?.streak || 0} Day Streak</p>
                <p className="text-xs text-slate-500">Keep it up!</p>
              </div>
            </div>
          </div>
        )

      case 'analytics':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-slate-500">Study Time</p>
                <p className="text-xl font-bold text-blue-600">12.5h</p>
              </div>
              <div className="p-3 bg-cyan-50 rounded-lg">
                <p className="text-xs text-slate-500">Completed</p>
                <p className="text-xl font-bold text-cyan-600">48</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <p className="text-xs text-slate-500">Accuracy</p>
                <p className="text-xl font-bold text-indigo-600">94%</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-slate-500">Rank</p>
                <p className="text-xl font-bold text-purple-600">#12</p>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center text-slate-500 py-8">
            <p className="text-sm">Widget content goes here</p>
          </div>
        )
    }
  }

  return (
    <div
      className={`absolute bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden transition-all ${
        isDragging ? 'shadow-2xl scale-[1.02] z-50 cursor-grabbing' : ''
      } ${isResizing ? 'z-50' : ''} ${widget.minimized ? 'h-auto' : ''}`}
      style={{
        left: `${widget.x}px`,
        top: `${widget.y}px`,
        width: widget.minimized ? '280px' : `${widget.width}px`,
        height: widget.minimized ? 'auto' : `${widget.height}px`,
        userSelect: 'none'
      }}
    >
      {/* Widget Header - Drag Handle */}
      <div
        className={`bg-gradient-to-r ${widget.color} px-4 py-3 flex items-center justify-between ${
          isEditMode && !isDragging ? 'cursor-grab hover:opacity-90' : ''
        } ${isDragging ? 'cursor-grabbing' : ''}`}
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center gap-2 pointer-events-none">
          {isEditMode && (
            <svg className="w-4 h-4 text-white opacity-70" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 3h2v2H9V3zm4 0h2v2h-2V3zM9 7h2v2H9V7zm4 0h2v2h-2V7zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2z"/>
            </svg>
          )}
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={widget.icon} />
          </svg>
          <h3 className="text-white font-semibold text-sm">{widget.title}</h3>
        </div>

        {/* Controls */}
        <div className="widget-controls flex items-center gap-1">
          {/* Minimize Button */}
          <button
            onClick={toggleMinimize}
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

          {/* Remove Button (only in edit mode) */}
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

      {/* Widget Content */}
      {!widget.minimized && (
        <div className="widget-content p-4 overflow-auto" style={{ height: 'calc(100% - 52px)' }}>
          {renderContent()}
        </div>
      )}

      {/* Resize Handle (only in edit mode and not minimized) */}
      {isEditMode && !widget.minimized && (
        <div
          className="resize-handle absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-10"
          onMouseDown={handleResizeStart}
        >
          <svg className="w-full h-full text-slate-400 opacity-50 hover:opacity-100" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22 22H20V20H22V22M22 18H20V16H22V18M18 22H16V20H18V22M18 18H16V16H18V18M14 22H12V20H14V22M22 14H20V12H22V14Z" />
          </svg>
        </div>
      )}
    </div>
  )
}
