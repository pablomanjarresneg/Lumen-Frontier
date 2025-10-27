import { NotesContent, ProgressContent, AnalyticsContent, DefaultContent } from '../widgets'
import type { WidgetConfig } from '@/types/widgets'

interface Widget extends WidgetConfig {
  x: number
  y: number
  width: number
  height: number
  color?: string
  icon?: string
  minimized?: boolean
  content?: any
}

interface WidgetContentRendererProps {
  widget: Widget
}

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
