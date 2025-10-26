/**
 * Quick Access Widget
 *
 * Quick links to frequently used features
 */

import type { WidgetProps } from '@/types/widgets'

export default function QuickAccessWidget({ config }: WidgetProps) {
  const quickLinks = [
    { icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6', label: 'New Study Set', color: 'bg-blue-500', href: '#' },
    { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', label: 'Flashcards', color: 'bg-purple-500', href: '#' },
    { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', label: 'Analytics', color: 'bg-green-500', href: '#' },
    { icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z', label: 'My Files', color: 'bg-orange-500', href: '#' }
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {quickLinks.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="group flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 rounded-xl border border-slate-200 transition-all hover:shadow-md"
        >
          <div className={`${link.color} p-3 rounded-xl mb-2 group-hover:scale-110 transition-transform`}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
            </svg>
          </div>
          <span className="text-xs font-medium text-slate-700 text-center">{link.label}</span>
        </a>
      ))}
    </div>
  )
}
