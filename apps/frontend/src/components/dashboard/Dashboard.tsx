/**
 * Dashboard - LumenOS Core
 * Clean, simple dashboard with working drag-drop and minimize functionality
 */

import { useState, useEffect } from 'react'
import WidgetContainer from './WidgetContainer'

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

const DEFAULT_WIDGETS: Widget[] = [
  {
    id: '1',
    type: 'notes',
    title: 'Quick Notes',
    color: 'from-green-400 to-emerald-600',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    x: 20,
    y: 80,
    width: 350,
    height: 300,
    minimized: false,
    content: { notes: [] }
  },
  {
    id: '2',
    type: 'progress',
    title: 'Learning Progress',
    color: 'from-pink-400 to-rose-600',
    icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    x: 390,
    y: 80,
    width: 350,
    height: 250,
    minimized: false,
    content: { progress: 45, streak: 7 }
  },
  {
    id: '3',
    type: 'analytics',
    title: 'Analytics',
    color: 'from-blue-400 to-cyan-600',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    x: 760,
    y: 80,
    width: 400,
    height: 300,
    minimized: false,
    content: {}
  }
]

export default function Dashboard() {
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [isEditMode, setIsEditMode] = useState(false)

  // Load widgets on mount
  useEffect(() => {
    const stored = localStorage.getItem('dashboard_widgets')
    if (stored) {
      try {
        setWidgets(JSON.parse(stored))
      } catch {
        setWidgets(DEFAULT_WIDGETS)
      }
    } else {
      setWidgets(DEFAULT_WIDGETS)
    }
  }, [])

  // Save widgets when they change
  useEffect(() => {
    if (widgets.length > 0) {
      localStorage.setItem('dashboard_widgets', JSON.stringify(widgets))
    }
  }, [widgets])

  const updateWidget = (id: string, updates: Partial<Widget>) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w))
  }

  const removeWidget = (id: string) => {
    if (confirm('Remove this widget?')) {
      setWidgets(prev => prev.filter(w => w.id !== id))
    }
  }

  const addNewWidget = () => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type: 'custom',
      title: 'New Widget',
      color: 'from-purple-400 to-indigo-600',
      icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
      x: 100,
      y: 100,
      width: 300,
      height: 250,
      minimized: false,
      content: {}
    }
    setWidgets(prev => [...prev, newWidget])
  }

  const resetDashboard = () => {
    if (confirm('Reset dashboard to default?')) {
      setWidgets(DEFAULT_WIDGETS)
      localStorage.removeItem('dashboard_widgets')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">LumenOS</h1>
              <p className="text-xs text-slate-500">Your Learning Operating System</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={addNewWidget}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm"
            >
              + Add Widget
            </button>

            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                isEditMode
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {isEditMode ? '✓ Done' : '✎ Edit'}
            </button>

            <button
              onClick={resetDashboard}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-all text-sm"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Canvas */}
      <div className="pt-20 pb-8 px-4 relative min-h-screen">
        {widgets.length === 0 ? (
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">No Widgets</h2>
              <p className="text-slate-600 mb-4">Add widgets to get started</p>
              <button
                onClick={addNewWidget}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Add Your First Widget
              </button>
            </div>
          </div>
        ) : (
          <div className="relative" style={{ minHeight: '800px' }}>
            {widgets.map(widget => (
              <WidgetContainer
                key={widget.id}
                widget={widget}
                isEditMode={isEditMode}
                onUpdate={(updates) => updateWidget(widget.id, updates)}
                onRemove={() => removeWidget(widget.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Mode Indicator */}
      {isEditMode && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2 animate-slideUp">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="font-medium text-sm">Edit Mode - Drag widgets to move, resize from corner</span>
        </div>
      )}
    </div>
  )
}
