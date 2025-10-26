import type { WidgetType, WidgetProps } from '@/types/widgets'

import NotesWidget from '../widgets/notes/NotesWidget'
import FlashcardsWidget from '../widgets/flashcards/FlashcardsWidget'
import AnalyticsWidget from '../widgets/analytics/AnalyticsWidget'
import QuickAccessWidget from '../widgets/quick-access/QuickAccessWidget'
import ProgressWidget from '../widgets/progress/ProgressWidget'

const WIDGET_COMPONENTS: Record<WidgetType, React.ComponentType<WidgetProps>> = {
  'notes': NotesWidget,
  'flashcards': FlashcardsWidget,
  'analytics': AnalyticsWidget,
  'quick-access': QuickAccessWidget,
  'progress': ProgressWidget,
  'calendar': () => (
    <div className="flex items-center justify-center h-full text-slate-500">
      <div className="text-center">
        <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm font-medium">Calendar Widget</p>
        <p className="text-xs mt-1">Coming soon...</p>
      </div>
    </div>
  )
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

  return <WidgetComponent {...props} />
}
