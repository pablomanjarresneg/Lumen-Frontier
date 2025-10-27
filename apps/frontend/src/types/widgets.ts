/**
 * LumenOS Widget System Types
 *
 * Core type definitions for the modular widget/plugin system
 */

export type WidgetType = 'notes' | 'flashcards' | 'analytics' | 'quick-access' | 'progress' | 'calendar' | 'pomodoro' | 'tasks' | 'goals'

export type WidgetSize = 'small' | 'medium' | 'large' | 'xlarge'

export interface WidgetPosition {
  x: number
  y: number
  width: number
  height: number
}

export interface WidgetConfig {
  id: string
  type: WidgetType
  title: string
  position: WidgetPosition
  data?: Record<string, any>
  settings?: Record<string, any>
  minimized?: boolean
  createdAt: number
  updatedAt: number
}

export interface WidgetMetadata {
  type: WidgetType
  name: string
  description: string
  icon: string
  defaultSize: WidgetSize
  minWidth: number
  minHeight: number
  maxWidth?: number
  maxHeight?: number
  category: 'productivity' | 'learning' | 'analytics' | 'utility'
  color: string
  gradient?: string
}

export interface WidgetProps {
  config: WidgetConfig
  onUpdate: (config: Partial<WidgetConfig>) => void
  onRemove: () => void
  onMinimize: () => void
  isEditing: boolean
}

export interface DashboardLayout {
  widgets: WidgetConfig[]
  gridSize: number
  lastModified: number
}
