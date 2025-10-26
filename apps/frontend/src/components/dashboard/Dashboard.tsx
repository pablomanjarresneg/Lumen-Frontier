/**
 * Dashboard - LumenOS Core
 * Refactored with composition pattern using smaller UI components
 */

import { useState, useEffect } from 'react'
import WidgetContainer from './WidgetContainer'
import { DashboardTopBar, EditModeIndicator, EmptyDashboard, AnimatedBackground } from './ui'
import { DEFAULT_WIDGETS } from './constants'
import type { Widget } from './types/'

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

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      <DashboardTopBar
        isEditMode={isEditMode}
        onAddWidget={addNewWidget}
        onToggleEditMode={toggleEditMode}
        onReset={resetDashboard}
      />

      {/* Dashboard Canvas */}
      <div className="pt-20 pb-8 px-4 relative min-h-screen">
        {widgets.length === 0 ? (
          <EmptyDashboard onAddWidget={addNewWidget} />
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

      <EditModeIndicator isEditMode={isEditMode} />
    </div>
  )
}