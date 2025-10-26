/**
 * Widget Store - Data Layer
 *
 * Manages widget state, persistence, and CRUD operations
 */

import type { WidgetConfig, WidgetType, DashboardLayout } from '@/types/widgets'

const STORAGE_KEY = 'lumen_dashboard_layout'

class WidgetStore {
  private listeners: Set<() => void> = new Set()
  private cachedLayout: DashboardLayout | null = null

  /**
   * Get current dashboard layout from localStorage (with caching)
   */
  getLayout(): DashboardLayout {
    // Return cached layout if available
    if (this.cachedLayout) {
      return this.cachedLayout
    }

    if (typeof window === 'undefined') {
      return this.getDefaultLayout()
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        this.cachedLayout = JSON.parse(stored)
        return this.cachedLayout!
      }
    } catch (error) {
      console.error('Failed to load dashboard layout:', error)
    }

    const defaultLayout = this.getDefaultLayout()
    this.cachedLayout = defaultLayout
    return defaultLayout
  }

  /**
   * Save dashboard layout to localStorage
   */
  saveLayout(layout: DashboardLayout): void {
    if (typeof window === 'undefined') return

    try {
      layout.lastModified = Date.now()
      this.cachedLayout = layout // Update cache
      localStorage.setItem(STORAGE_KEY, JSON.stringify(layout))
      this.notifyListeners()
    } catch (error) {
      console.error('Failed to save dashboard layout:', error)
    }
  }

  /**
   * Get all widgets
   */
  getWidgets(): WidgetConfig[] {
    return this.getLayout().widgets
  }

  /**
   * Add a new widget
   */
  addWidget(type: WidgetType, title: string, position?: Partial<WidgetConfig['position']>): WidgetConfig {
    const layout = this.getLayout()

    const newWidget: WidgetConfig = {
      id: this.generateId(),
      type,
      title,
      position: {
        x: position?.x ?? 0,
        y: position?.y ?? 0,
        width: position?.width ?? 300,
        height: position?.height ?? 200
      },
      data: {},
      settings: {},
      minimized: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    layout.widgets.push(newWidget)
    this.saveLayout(layout)

    return newWidget
  }

  /**
   * Update a widget
   */
  updateWidget(id: string, updates: Partial<WidgetConfig>): void {
    const layout = this.getLayout()
    const widgetIndex = layout.widgets.findIndex(w => w.id === id)

    if (widgetIndex === -1) {
      console.error(`Widget ${id} not found`)
      return
    }

    layout.widgets[widgetIndex] = {
      ...layout.widgets[widgetIndex],
      ...updates,
      updatedAt: Date.now()
    }

    this.saveLayout(layout)
  }

  /**
   * Remove a widget
   */
  removeWidget(id: string): void {
    const layout = this.getLayout()
    layout.widgets = layout.widgets.filter(w => w.id !== id)
    this.saveLayout(layout)
  }

  /**
   * Update widget position
   */
  updateWidgetPosition(id: string, position: Partial<WidgetConfig['position']>): void {
    const layout = this.getLayout()
    const widget = layout.widgets.find(w => w.id === id)

    if (!widget) {
      console.error(`Widget ${id} not found`)
      return
    }

    widget.position = { ...widget.position, ...position }
    widget.updatedAt = Date.now()

    this.saveLayout(layout)
  }

  /**
   * Clear all widgets
   */
  clearWidgets(): void {
    const layout = this.getLayout()
    layout.widgets = []
    this.saveLayout(layout)
  }

  /**
   * Reset to default layout
   */
  resetToDefault(): void {
    this.cachedLayout = null // Clear cache
    this.saveLayout(this.getDefaultLayout())
  }

  /**
   * Subscribe to layout changes
   */
  subscribe(callback: () => void): () => void {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  /**
   * Notify all subscribers of changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(callback => callback())
  }

  /**
   * Generate unique widget ID
   */
  private generateId(): string {
    return `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Get default dashboard layout
   */
  private getDefaultLayout(): DashboardLayout {
    return {
      widgets: [
        {
          id: this.generateId(),
          type: 'quick-access',
          title: 'Quick Access',
          position: { x: 20, y: 20, width: 350, height: 200 },
          data: {},
          minimized: false,
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          id: this.generateId(),
          type: 'progress',
          title: 'Learning Progress',
          position: { x: 390, y: 20, width: 350, height: 200 },
          data: { progress: 45, streak: 7 },
          minimized: false,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      ],
      gridSize: 10,
      lastModified: Date.now()
    }
  }
}
// Export singleton instance
export const widgetStore = new WidgetStore()