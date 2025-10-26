/**
 * Dashboard Constants
 */

import type { Widget } from './types/'

export const DEFAULT_WIDGETS: Widget[] = [
  {
    id: '1',
    type: 'notes',
    title: 'Quick Notes',
    color: 'from-green-400 to-emerald-600',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    x: 20,
    y: 80,
    width: 350,
    height: 300,
    minimized: false,
    content: { notes: [] }
  },
  {
    id: '2',
    type: 'progress',
    title: 'Learning Progress',
    color: 'from-pink-400 to-rose-600',
    icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    x: 390,
    y: 80,
    width: 350,
    height: 250,
    minimized: false,
    content: { progress: 45, streak: 7 }
  },
  {
    id: '3',
    type: 'analytics',
    title: 'Analytics',
    color: 'from-blue-400 to-cyan-600',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    x: 760,
    y: 80,
    width: 400,
    height: 300,
    minimized: false,
    content: {}
  }
]
