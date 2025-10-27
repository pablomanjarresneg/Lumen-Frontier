/**
 * Dashboard Constants
 */

import type { WidgetConfig } from '../types'

export const DEFAULT_WIDGETS: WidgetConfig[] = [
  {
    id: '1',
    type: 'notes',
    title: 'Quick Notes',
    position: {
      x: 20,
      y: 64,
      width: 350,
      height: 300
    },
    data: { notes: [] },
    settings: {},
    minimized: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: '2',
    type: 'progress',
    title: 'Learning Progress',
    position: {
      x: 390,
      y: 64,
      width: 350,
      height: 250
    },
    data: { progress: 45, streak: 7 },
    settings: {},
    minimized: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: '3',
    type: 'analytics',
    title: 'Analytics',
    position: {
      x: 760,
      y: 64,
      width: 400,
      height: 300
    },
    data: {},
    settings: {},
    minimized: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
]
