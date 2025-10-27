import { useState, useEffect } from 'react'
import { WidgetContainer } from './components/widget-system'
import { DashboardTopBar, EditModeIndicator, EmptyDashboard, AnimatedBackground } from './components/layout'
import { WidgetMarketplace } from './components/marketplace'
import { DEFAULT_WIDGETS } from './constants'
import type { WidgetConfig, WidgetType } from './types'
import { getWidgetMetadata } from './services'

// Migration function to convert old widget format to new format
function migrateOldWidgets(oldWidgets: any[]): WidgetConfig[] {
  return oldWidgets.map(widget => {
    // Check if widget has old format (x, y, width, height directly)
    if ('x' in widget && 'y' in widget && !('position' in widget)) {
      return {
        id: widget.id,
        type: widget.type,
        title: widget.title,
        position: {
          x: widget.x,
          y: widget.y,
          width: widget.width,
          height: widget.height
        },
        data: widget.content || widget.data || {},
        settings: widget.settings || {},
        minimized: widget.minimized || false,
        createdAt: widget.createdAt || Date.now(),
        updatedAt: widget.updatedAt || Date.now()
      }
    }
    // Already in new format or needs minimal updates
    return {
      ...widget,
      createdAt: widget.createdAt || Date.now(),
      updatedAt: widget.updatedAt || Date.now()
    }
  })
}

export default function Dashboard() {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('dashboard_widgets')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const migrated = migrateOldWidgets(parsed)
        setWidgets(migrated)
        // Save migrated data back
        localStorage.setItem('dashboard_widgets', JSON.stringify(migrated))
      } catch (error) {
        console.error('Error loading widgets:', error)
        setWidgets(DEFAULT_WIDGETS)
      }
    } else {
      setWidgets(DEFAULT_WIDGETS)
    }
  }, [])

  useEffect(() => {
    if (widgets.length > 0) {
      localStorage.setItem('dashboard_widgets', JSON.stringify(widgets))
    }
  }, [widgets])

  const updateWidget = (id: string, updates: Partial<WidgetConfig>) => {
    setWidgets(prev => prev.map(w => w.id === id ? {
      ...w,
      ...updates,
      updatedAt: Date.now()
    } : w))
  }

  const removeWidget = (id: string) => {
    if (confirm('Remove this widget?')) {
      setWidgets(prev => prev.filter(w => w.id !== id))
    }
  }

  const addWidgetFromMarketplace = (type: WidgetType) => {
    const metadata = getWidgetMetadata(type)
    const sizeMap = {
      small: { width: 280, height: 200 },
      medium: { width: 350, height: 300 },
      large: { width: 450, height: 400 },
      xlarge: { width: 600, height: 500 }
    }
    const size = sizeMap[metadata.defaultSize]

    const newWidget: WidgetConfig = {
      id: `widget_${Date.now()}`,
      type,
      title: metadata.name,
      position: {
        x: 20 + (widgets.length % 3) * 370,
        y: 80 + Math.floor(widgets.length / 3) * 320,
        width: size.width,
        height: size.height
      },
      data: {},
      settings: {},
      minimized: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
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

  // Calculate canvas height based on widget positions
  const canvasHeight = widgets.length > 0
    ? Math.max(1200, ...widgets.map(w => w.position.y + w.position.height + 100))
    : 1200

  return (
    <div className="min-h-screen relative overflow-y-auto">
      <AnimatedBackground />

      <DashboardTopBar
        isEditMode={isEditMode}
        onAddWidget={() => setIsMarketplaceOpen(true)}
        onToggleEditMode={toggleEditMode}
        onReset={resetDashboard}
      />

      <div className="pt-20 pb-8 px-4 relative">
        {widgets.length === 0 ? (
          <EmptyDashboard onAddWidget={() => setIsMarketplaceOpen(true)} />
        ) : (
          <div className="relative" style={{ minHeight: `${canvasHeight}px` }}>
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

      <WidgetMarketplace
        isOpen={isMarketplaceOpen}
        onClose={() => setIsMarketplaceOpen(false)}
        onAddWidget={addWidgetFromMarketplace}
      />
    </div>
  )
}