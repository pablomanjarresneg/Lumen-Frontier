import { useState, useEffect } from 'react'
import { WidgetContainer } from './components/widget-system'
import { WonderspaceSidebar, WonderSpaceTopBar, BottomNavBar, BackgroundUploadModal, EditModeIndicator, EmptyDashboard } from './components/layout'
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
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false)
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [uiVisible, setUiVisible] = useState(true)

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
      try {
        localStorage.setItem('dashboard_widgets', JSON.stringify(widgets))
      } catch (error) {
        console.error('Error saving widgets to localStorage:', error)
        // Handle quota exceeded or other storage errors gracefully
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          console.warn('localStorage quota exceeded - widget data may not persist')
        }
      }
    }
  }, [widgets])

  // Load background image from localStorage
  useEffect(() => {
    const storedBackground = localStorage.getItem('dashboard_background')
    if (storedBackground) {
      setBackgroundImage(storedBackground)
    }
  }, [])

  const handleBackgroundUpload = (imageUrl: string) => {
    setBackgroundImage(imageUrl)
    if (imageUrl) {
      localStorage.setItem('dashboard_background', imageUrl)
    } else {
      localStorage.removeItem('dashboard_background')
    }
  }

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
        y: 64 + Math.floor(widgets.length / 3) * 320,
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

  const handleBottomNavClick = (section: string) => {
    console.log('Navigate to:', section)

    // Helper function to add or focus a widget
    const addOrFocusWidget = (widgetType: WidgetType) => {
      const existing = widgets.find(w => w.type === widgetType)
      if (existing) {
        // If widget exists, scroll to it
        const element = document.getElementById(`widget-${existing.id}`)
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else {
        // Add new widget
        addWidgetFromMarketplace(widgetType)
      }
    }

    // Handle navigation based on section
    switch (section) {
      case 'pomo':
        addOrFocusWidget('pomodoro')
        break
      case 'track':
        addOrFocusWidget('track')
        break
      case 'journal':
        addOrFocusWidget('journal')
        break
      case 'todo':
        addOrFocusWidget('tasks')
        break
      case 'ambience':
        addOrFocusWidget('ambience')
        break
      case 'music':
        addOrFocusWidget('music')
        break
      case 'stats':
        addOrFocusWidget('stats')
        break
      case 'theme':
        setIsBackgroundModalOpen(true)
        break
      default:
        console.log(`Navigation for ${section} not yet implemented`)
    }
  }

  // Calculate canvas height based on widget positions
  const canvasHeight = widgets.length > 0
    ? Math.max(1200, ...widgets.map(w => w.position.y + w.position.height + 100))
    : 1200

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fullscreen Background Image with Warm Overlay */}
      {backgroundImage ? (
        <>
          <div
            className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10 blur-sm scale-105"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="fixed inset-0 bg-gradient-to-br from-cognac-950/30 via-burgundy-900/40 to-forest-900/50 -z-10" />
        </>
      ) : (
        <div className="fixed inset-0 bg-gradient-to-br from-cognac-950 via-burgundy-950 to-forest-950 -z-10">
          {/* Warm ambient glows for depth */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brass-700/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cognac-800/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-burgundy-900/5 rounded-full blur-3xl" />
        </div>
      )}

      {/* WonderSpace Sidebar */}
      <WonderspaceSidebar
        isEditMode={isEditMode}
        onAddWidget={() => setIsMarketplaceOpen(true)}
        onToggleEditMode={toggleEditMode}
        onReset={resetDashboard}
        onUploadBackground={() => setIsBackgroundModalOpen(true)}
        isVisible={uiVisible}
      />

      {/* WonderSpace Top Bar */}
      <WonderSpaceTopBar onToggleUI={setUiVisible} uiVisible={uiVisible} />

      {/* Main Content Area - offset for sidebar, centered floating widgets */}
      <div className={`min-h-screen overflow-y-auto transition-all duration-300 ease-in-out ${
        uiVisible ? 'pl-16' : 'pl-0'
      }`}>
        <div className="px-0.5 py-8 relative max-w-[1920px] mx-auto">
          {widgets.length === 0 ? (
            <EmptyDashboard onAddWidget={() => setIsMarketplaceOpen(true)} />
          ) : (
            <div
              className="relative"
              // eslint-disable-next-line react/forbid-dom-props
              style={{ minHeight: `${canvasHeight}px` }} // Dynamic height based on widget positions
            >
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
      </div>

      {/* Edit Mode Indicator */}
      <EditModeIndicator isEditMode={isEditMode} />

      {/* Bottom Navigation Bar */}
      <BottomNavBar onNavigate={handleBottomNavClick} isVisible={uiVisible} />

      {/* Modals */}
      <WidgetMarketplace
        isOpen={isMarketplaceOpen}
        onClose={() => setIsMarketplaceOpen(false)}
        onAddWidget={addWidgetFromMarketplace}
      />

      <BackgroundUploadModal
        isOpen={isBackgroundModalOpen}
        onClose={() => setIsBackgroundModalOpen(false)}
        onUpload={handleBackgroundUpload}
        currentBackground={backgroundImage}
      />
    </div>
  )
}