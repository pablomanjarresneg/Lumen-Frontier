/**
 * Dashboard - LumenOS Core
 *
 * Main dashboard component with widget management
 */

import { useState, useEffect, lazy, Suspense, useCallback } from 'react'
import { widgetStore } from '@/services/widgetStore'
import { getWidgetMetadata } from '@/services/widgetRegistry'
import type { WidgetConfig, WidgetType } from '@/types/widgets'
import WidgetContainer from './WidgetContainer'
import WidgetRenderer from './WidgetRenderer'

// Lazy load the marketplace to reduce initial bundle size
const WidgetMarketplace = lazy(() => import('./WidgetMarketplace'))

export default function Dashboard() {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false)

  // Load widgets on mount
  useEffect(() => {
    setWidgets(widgetStore.getWidgets())

    // Subscribe to changes
    const unsubscribe = widgetStore.subscribe(() => {
      setWidgets(widgetStore.getWidgets())
    })

    // Hide loading screen if it exists
    const loadingEl = document.getElementById('dashboard-loading')
    if (loadingEl) {
      loadingEl.style.display = 'none'
    }

    return unsubscribe
  }, [])

  const handleAddWidget = useCallback((type: WidgetType) => {
    const metadata = getWidgetMetadata(type)

    // Calculate position for new widget (stagger them)
    const existingPositions = widgets.map(w => ({ x: w.position.x, y: w.position.y }))
    let x = 20
    let y = 20

    // Find a spot that doesn't overlap too much
    while (existingPositions.some(pos => Math.abs(pos.x - x) < 100 && Math.abs(pos.y - y) < 100)) {
      x += 30
      y += 30
      if (x > 400) {
        x = 20
        y += 200
      }
    }

    widgetStore.addWidget(type, metadata.name, { x, y, width: metadata.minWidth, height: metadata.minHeight })
  }, [widgets])

  const handleUpdateWidget = useCallback((id: string, updates: Partial<WidgetConfig>) => {
    widgetStore.updateWidget(id, updates)
  }, [])

  const handleRemoveWidget = useCallback((id: string) => {
    if (confirm('Are you sure you want to remove this widget?')) {
      widgetStore.removeWidget(id)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-40">
        <div className="h-full px-6 flex items-center justify-between">
          {/* Logo/Title */}
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

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMarketplaceOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Widget
            </button>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isEditing
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {isEditing ? (
                <>
                  <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Done
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </>
              )}
            </button>

            <button
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Settings"
            >
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Canvas */}
      <div className="pt-16 min-h-screen relative">
        {widgets.length === 0 ? (
          // Empty State
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-200 max-w-md">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to LumenOS</h2>
              <p className="text-slate-600 mb-6">Your personalized learning dashboard awaits. Add widgets to get started!</p>
              <button
                onClick={() => setIsMarketplaceOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Browse Widget Marketplace
              </button>
            </div>
          </div>
        ) : (
          // Widgets Canvas - positioned container for absolute positioned widgets
          <div className="widgets-canvas relative w-full min-h-screen p-4">
            {widgets.map((widget) => (
              <WidgetContainer
                key={widget.id}
                config={widget}
                onUpdate={(updates) => handleUpdateWidget(widget.id, updates)}
                onRemove={() => handleRemoveWidget(widget.id)}
                isEditing={isEditing}
              >
                <WidgetRenderer
                  config={widget}
                  onUpdate={(updates) => handleUpdateWidget(widget.id, updates)}
                  onRemove={() => handleRemoveWidget(widget.id)}
                  onMinimize={() => handleUpdateWidget(widget.id, { minimized: !widget.minimized })}
                  isEditing={isEditing}
                />
              </WidgetContainer>
            ))}
          </div>
        )}
      </div>

      {/* Widget Marketplace - Lazy Loaded */}
      {isMarketplaceOpen && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Loading marketplace...</p>
            </div>
          </div>
        }>
          <WidgetMarketplace
            isOpen={isMarketplaceOpen}
            onClose={() => setIsMarketplaceOpen(false)}
            onAddWidget={handleAddWidget}
          />
        </Suspense>
      )}

      {/* Edit Mode Overlay */}
      {isEditing && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2 animate-slideUp">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="font-medium">Edit Mode Active - Drag widgets to reposition</span>
        </div>
      )}
    </div>
  )
}
