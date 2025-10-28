import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { useStore } from '@nanostores/react'
import { WidgetContainer } from './components/widget-system'
import { LumenOSSidebar, LumenOSTopBar, BottomNavBar } from './components/layout'
import { DEFAULT_WIDGETS } from './constants'
import type { WidgetConfig, WidgetType } from './types'
import { getWidgetMetadata } from './services'
import { $isEditMode, $isMarketplaceOpen, $widgets as $widgetsStore } from './stores/dashboardStore'
import '@/styles/dashboard.css'

// Lazy load heavy modal components
const WidgetMarketplace = lazy(() => import('./components/marketplace/WidgetMarketplace'))
const BackgroundUploadModal = lazy(() => import('./components/layout/BackgroundUploadModal'))

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
  const isMarketplaceOpen = useStore($isMarketplaceOpen)
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false)
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [uiVisible, setUiVisible] = useState(true)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Sync state with Nanostores for Astro components
  useEffect(() => {
    $isEditMode.set(isEditMode)
  }, [isEditMode])

  useEffect(() => {
    $widgetsStore.set(widgets)
  }, [widgets])

  // Load widgets from localStorage on mount
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

  // Set dynamic styles via refs
  useEffect(() => {
    if (backgroundRef.current && backgroundImage) {
      backgroundRef.current.style.backgroundImage = `url(${backgroundImage})`
    }
  }, [backgroundImage])

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.style.minHeight = `${canvasHeight}px`
    }
  }, [canvasHeight])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fullscreen Background Image with Warm Overlay */}
      {backgroundImage ? (
        <>
          <div
            ref={backgroundRef}
            className="dashboard-background fixed inset-0 bg-cover bg-center bg-no-repeat -z-10 blur-sm scale-105"
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

      {/* LumenOS Sidebar */}
      <LumenOSSidebar
        isEditMode={isEditMode}
        onAddWidget={() => $isMarketplaceOpen.set(true)}
        onToggleEditMode={toggleEditMode}
        onReset={resetDashboard}
        onUploadBackground={() => setIsBackgroundModalOpen(true)}
        isVisible={uiVisible}
      />

      {/* LumenOS Top Bar */}
      <LumenOSTopBar onToggleUI={setUiVisible} uiVisible={uiVisible} />

      {/* Main Content Area - offset for sidebar, centered floating widgets */}
      <div className={`min-h-screen overflow-y-auto transition-all duration-300 ease-in-out ${
        uiVisible ? 'pl-16' : 'pl-0'
      }`}>
        <div className="px-0.5 py-8 relative max-w-[1920px] mx-auto">
          {widgets.length === 0 ? (
            <div className="flex items-center justify-center min-h-[80vh]">
              <div className="text-center glass-empty-state p-12 rounded-3xl backdrop-blur-xl border border-white/30 max-w-md">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <svg className="w-12 h-12 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">No Widgets</h2>
                <p className="text-slate-600 mb-6 font-medium">Add widgets to get started</p>
                <button
                  onClick={() => $isMarketplaceOpen.set(true)}
                  className="glass-button px-8 py-3 bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-white rounded-xl font-semibold hover:from-blue-600/90 hover:to-purple-600/90 hover:shadow-xl transition-all duration-200 border border-white/30"
                >
                  Add Your First Widget
                </button>
              </div>
            </div>
          ) : (
            <div
              ref={canvasRef}
              className="dashboard-canvas relative"
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

      {/* Bottom Navigation Bar */}
      <BottomNavBar onNavigate={handleBottomNavClick} isVisible={uiVisible} />

      {/* Modals - Lazy loaded */}
      {isMarketplaceOpen && (
        <Suspense fallback={<div />}>
          <WidgetMarketplace
            isOpen={isMarketplaceOpen}
            onClose={() => $isMarketplaceOpen.set(false)}
            onAddWidget={addWidgetFromMarketplace}
          />
        </Suspense>
      )}

      {isBackgroundModalOpen && (
        <Suspense fallback={<div />}>
          <BackgroundUploadModal
            isOpen={isBackgroundModalOpen}
            onClose={() => setIsBackgroundModalOpen(false)}
            onUpload={handleBackgroundUpload}
            currentBackground={backgroundImage}
          />
        </Suspense>
      )}
    </div>
  )
}