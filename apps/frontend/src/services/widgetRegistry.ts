/**
 * Widget Registry
 *
 * Central registry of all available widgets with metadata
 */

import type { WidgetMetadata, WidgetType } from '@/types/widgets'

export const WIDGET_REGISTRY: Record<WidgetType, WidgetMetadata> = {
  notes: {
    type: 'notes',
    name: 'Notes',
    description: 'Quick notes and thoughts. Capture ideas on the fly.',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    defaultSize: 'medium',
    minWidth: 300,
    minHeight: 250,
    maxWidth: 600,
    maxHeight: 800,
    category: 'productivity',
    color: '#10b981',
    gradient: 'from-green-400 to-emerald-600'
  },
  flashcards: {
    type: 'flashcards',
    name: 'Flashcards',
    description: 'Review your flashcard sets. Active learning made simple.',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    defaultSize: 'large',
    minWidth: 350,
    minHeight: 300,
    maxWidth: 700,
    maxHeight: 600,
    category: 'learning',
    color: '#8b5cf6',
    gradient: 'from-purple-400 to-indigo-600'
  },
  analytics: {
    type: 'analytics',
    name: 'Analytics',
    description: 'Track your learning metrics and performance over time.',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    defaultSize: 'large',
    minWidth: 400,
    minHeight: 300,
    maxWidth: 800,
    maxHeight: 600,
    category: 'analytics',
    color: '#3b82f6',
    gradient: 'from-blue-400 to-cyan-600'
  },
  'quick-access': {
    type: 'quick-access',
    name: 'Quick Access',
    description: 'Jump to your most used features and recent items.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    defaultSize: 'medium',
    minWidth: 300,
    minHeight: 180,
    maxWidth: 500,
    maxHeight: 300,
    category: 'utility',
    color: '#f59e0b',
    gradient: 'from-amber-400 to-orange-600'
  },
  progress: {
    type: 'progress',
    name: 'Learning Progress',
    description: 'Your overall learning journey and achievements.',
    icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    defaultSize: 'medium',
    minWidth: 300,
    minHeight: 180,
    maxWidth: 500,
    maxHeight: 300,
    category: 'learning',
    color: '#ec4899',
    gradient: 'from-pink-400 to-rose-600'
  },
  calendar: {
    type: 'calendar',
    name: 'Calendar',
    description: 'Schedule study sessions and track deadlines.',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    defaultSize: 'large',
    minWidth: 350,
    minHeight: 300,
    maxWidth: 600,
    maxHeight: 600,
    category: 'productivity',
    color: '#6366f1',
    gradient: 'from-indigo-400 to-purple-600'
  }
}

export function getWidgetMetadata(type: WidgetType): WidgetMetadata {
  return WIDGET_REGISTRY[type]
}

export function getAllWidgets(): WidgetMetadata[] {
  return Object.values(WIDGET_REGISTRY)
}

export function getWidgetsByCategory(category: WidgetMetadata['category']): WidgetMetadata[] {
  return Object.values(WIDGET_REGISTRY).filter(w => w.category === category)
}
