import { lazy, Suspense } from 'react'
import type { WidgetType, WidgetProps } from '../../types'

// Lazy load all widgets - each will be in its own chunk
const NotesWidget = lazy(() => import('../../widgets/notes/NotesWidget'))
const FlashcardsWidget = lazy(() => import('../../widgets/flashcards/FlashcardsWidget'))
const AnalyticsWidget = lazy(() => import('../../widgets/analytics/AnalyticsWidget'))
const QuickAccessWidget = lazy(() => import('../../widgets/quick-access/QuickAccessWidget'))
const ProgressWidget = lazy(() => import('../../widgets/progress/ProgressWidget'))
const PomodoroWidget = lazy(() => import('../../widgets/pomodoro/PomodoroWidget'))
const TasksWidget = lazy(() => import('../../widgets/tasks/TasksWidget'))
const GoalsWidget = lazy(() => import('../../widgets/goals/GoalsWidget'))
const TrackWidget = lazy(() => import('../../widgets/track/TrackWidget'))
const JournalWidget = lazy(() => import('../../widgets/journal/JournalWidget'))
const AmbienceWidget = lazy(() => import('../../widgets/ambience/AmbienceWidget'))
const MusicWidget = lazy(() => import('../../widgets/music/MusicWidget'))
const StatsWidget = lazy(() => import('../../widgets/stats/StatsWidget'))

// Loading fallback component
const WidgetLoadingFallback = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-brass-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
      <p className="text-xs text-brass-300/60">Loading widget...</p>
    </div>
  </div>
)

const PlaceholderWidget = ({ title, icon }: { title: string; icon: string }) => (
  <div className="flex items-center justify-center h-full text-brass-300/40">
    <div className="text-center">
      <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
      </svg>
      <p className="text-sm font-medium">{title} Widget</p>
      <p className="text-xs mt-1">Coming soon...</p>
    </div>
  </div>
)

const WIDGET_COMPONENTS: Record<WidgetType, React.ComponentType<WidgetProps>> = {
  'notes': NotesWidget,
  'flashcards': FlashcardsWidget,
  'analytics': AnalyticsWidget,
  'quick-access': QuickAccessWidget,
  'progress': ProgressWidget,
  'pomodoro': PomodoroWidget,
  'tasks': TasksWidget,
  'goals': GoalsWidget,
  'track': TrackWidget,
  'journal': JournalWidget,
  'ambience': AmbienceWidget,
  'music': MusicWidget,
  'stats': StatsWidget,
  'calendar': () => <PlaceholderWidget title="Calendar" icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
}

export default function WidgetRenderer(props: WidgetProps) {
  const WidgetComponent = WIDGET_COMPONENTS[props.config.type]

  if (!WidgetComponent) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">Unknown widget type: {props.config.type}</p>
        </div>
      </div>
    )
  }

  try {
    return (
      <Suspense fallback={<WidgetLoadingFallback />}>
        <WidgetComponent {...props} />
      </Suspense>
    )
  } catch (error) {
    console.error(`Error rendering widget ${props.config.type}:`, error)
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        <div className="text-center p-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm font-semibold">Widget Error</p>
          <p className="text-xs mt-1 text-slate-600">{props.config.type}</p>
        </div>
      </div>
    )
  }
}
