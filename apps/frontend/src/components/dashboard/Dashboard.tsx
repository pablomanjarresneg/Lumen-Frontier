import { useState, useEffect } from 'react'
import WidgetContainer from './core/WidgetContainer'
import { DashboardTopBar, EditModeIndicator, EmptyDashboard, AnimatedBackground } from './ui'
import WidgetMarketplace from './marketplace/WidgetMarketplace'
import { DEFAULT_WIDGETS } from './constants'
import type { WidgetConfig, WidgetType } from '@/types/widgets'
import { getWidgetMetadata } from '@/services/widgetRegistry'

export default function Dashboard() {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false)

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

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      <DashboardTopBar
        isEditMode={isEditMode}
        onAddWidget={() => setIsMarketplaceOpen(true)}
        onToggleEditMode={toggleEditMode}
        onReset={resetDashboard}
      />

      <div className="pt-20 pb-8 px-4 relative min-h-screen">
        {widgets.length === 0 ? (
          <EmptyDashboard onAddWidget={() => setIsMarketplaceOpen(true)} />
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

      <WidgetMarketplace
        isOpen={isMarketplaceOpen}
        onClose={() => setIsMarketplaceOpen(false)}
        onAddWidget={addWidgetFromMarketplace}
      />
    </div>
  )
}