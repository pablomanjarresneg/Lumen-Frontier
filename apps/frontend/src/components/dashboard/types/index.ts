/**
 * Dashboard Types - Centralized type definitions
 * 
 * All TypeScript interfaces and types for the dashboard domain.
 */

// ============================================================================
// Core Widget Types
// ============================================================================

export interface Widget {
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

export interface WidgetContainerProps {
  widget: Widget
  isEditMode: boolean
  onUpdate: (updates: Partial<Widget>) => void
  onRemove: () => void
}

// ============================================================================
// Position & Size Types
// ============================================================================

export interface WidgetPosition {
  x: number
  y: number
}

export interface WidgetSize {
  width: number
  height: number
}

export interface WidgetBounds extends WidgetPosition, WidgetSize {}

// ============================================================================
// Component Props Types
// ============================================================================

export interface WidgetHeaderProps {
  widget: Widget
  isEditMode: boolean
  isDragging: boolean
  onMinimize: () => void
  onRemove: () => void
  onDragStart: (e: React.MouseEvent<HTMLDivElement>) => void
}

export interface ResizeHandleProps {
  isEditMode: boolean
  onResizeStart: (e: React.MouseEvent) => void
}

export interface WidgetContentRendererProps {
  widget: Widget
}

export interface ProgressContentProps {
  progress?: number
}

// ============================================================================
// UI Component Props
// ============================================================================

export interface DashboardTopBarProps {
  isEditMode: boolean
  onToggleEditMode: () => void
  onAddWidget: () => void
}

export interface EditModeIndicatorProps {
  isEditMode: boolean
}

export interface EmptyDashboardProps {
  onAddWidget: () => void
}

// ============================================================================
// Hook Types
// ============================================================================

export interface DragState {
  isDragging: boolean
  handleDragStart: (e: React.MouseEvent<HTMLDivElement>) => void
}

export interface ResizeState {
  isResizing: boolean
  handleResizeStart: (e: React.MouseEvent) => void
}

// ============================================================================
// Widget Type Definitions
// ============================================================================

export type WidgetType = 'notes' | 'progress' | 'analytics' | 'flashcards' | 'quick-access' | 'custom'

export interface WidgetTypeConfig {
  type: WidgetType
  defaultTitle: string
  defaultIcon: string
  defaultColor: string
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
}
