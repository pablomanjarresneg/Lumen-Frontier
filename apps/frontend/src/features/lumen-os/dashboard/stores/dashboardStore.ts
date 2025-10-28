import { atom, map } from 'nanostores'
import type { WidgetConfig } from '../types'
import { DEFAULT_WIDGETS } from '../constants'

// Migration function to convert old widget format to new format
function migrateOldWidgets(oldWidgets: any[]): WidgetConfig[] {
  return oldWidgets.map(widget => {
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
    return {
      ...widget,
      createdAt: widget.createdAt || Date.now(),
      updatedAt: widget.updatedAt || Date.now()
    }
  })
}

// Initialize widgets from localStorage
function loadWidgets(): WidgetConfig[] {
  if (typeof window === 'undefined') return []

  const stored = localStorage.getItem('dashboard_widgets')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      const migrated = migrateOldWidgets(parsed)
      localStorage.setItem('dashboard_widgets', JSON.stringify(migrated))
      return migrated
    } catch (error) {
      console.error('Error loading widgets:', error)
      return DEFAULT_WIDGETS
    }
  }
  return DEFAULT_WIDGETS
}

// Initialize background from localStorage
function loadBackground(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('dashboard_background')
}

// Dashboard state stores
export const $widgets = atom<WidgetConfig[]>(loadWidgets())
export const $isEditMode = atom(false)
export const $isMarketplaceOpen = atom(false)
export const $isBackgroundModalOpen = atom(false)
export const $backgroundImage = atom<string | null>(loadBackground())
export const $uiVisible = atom(true)

// Save widgets to localStorage whenever they change
if (typeof window !== 'undefined') {
  $widgets.subscribe((widgets) => {
    if (widgets.length > 0) {
      try {
        localStorage.setItem('dashboard_widgets', JSON.stringify(widgets))
      } catch (error) {
        console.error('Error saving widgets:', error)
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          console.warn('localStorage quota exceeded - widget data may not persist')
        }
      }
    }
  })

  // Save background to localStorage whenever it changes
  $backgroundImage.subscribe((background) => {
    if (background) {
      localStorage.setItem('dashboard_background', background)
    } else {
      localStorage.removeItem('dashboard_background')
    }
  })
}
