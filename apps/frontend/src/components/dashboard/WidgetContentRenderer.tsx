/**
 * Widget Content Renderer
 */

import { NotesContent, ProgressContent, AnalyticsContent, DefaultContent } from './widgets'
import type { WidgetContentRendererProps } from './types/'

export default function WidgetContentRenderer({ widget }: WidgetContentRendererProps) {
  switch (widget.type) {
    case 'notes':
      return <NotesContent />
    
    case 'progress':
      return <ProgressContent content={widget.content} />
    
    case 'analytics':
      return <AnalyticsContent />
    
    default:
      return <DefaultContent />
  }
}
