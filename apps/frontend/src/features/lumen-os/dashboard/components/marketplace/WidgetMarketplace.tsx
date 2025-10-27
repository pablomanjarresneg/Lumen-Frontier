import { useState } from 'react'
import type { WidgetType, WidgetMetadata } from '../../types'
import { getAllWidgets } from '../../services'

interface WidgetMarketplaceProps {
  isOpen: boolean
  onClose: () => void
  onAddWidget: (type: WidgetType) => void
}

export default function WidgetMarketplace({ isOpen, onClose, onAddWidget }: WidgetMarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | WidgetMetadata['category']>('all')
  const allWidgets = getAllWidgets()

  const filteredWidgets = selectedCategory === 'all'
    ? allWidgets
    : allWidgets.filter(w => w.category === selectedCategory)

  const categories = [
    { id: 'all' as const, name: 'All Widgets', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'productivity' as const, name: 'Productivity', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { id: 'learning' as const, name: 'Learning', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'analytics' as const, name: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'utility' as const, name: 'Utility', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-8 animate-fadeIn">
      <div className="backdrop-blur-xl bg-gradient-to-br from-cognac-950/90 via-burgundy-950/90 to-forest-950/90 border-2 border-brass-700/30 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-slideUp m-4">
        <div className="bg-gradient-to-r from-brass-900/40 to-cognac-900/40 p-6 rounded-t-2xl border-b border-brass-800/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-brass-200 mb-1">Widget Marketplace</h2>
              <p className="text-ivory-200/70 text-sm">Add elegant widgets to customize your dashboard</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-brass-900/30 rounded-lg transition-colors"
              aria-label="Close marketplace"
            >
              <svg className="w-6 h-6 text-brass-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-brass-800/30 overflow-x-auto">
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-brass-600 to-cognac-600 text-white shadow-lg shadow-brass-900/40 border border-brass-600/50'
                    : 'bg-cognac-950/30 text-brass-300/70 hover:bg-cognac-900/40 hover:text-brass-200 border border-brass-800/20'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={category.icon} />
                </svg>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWidgets.map((widget) => (
              <div
                key={widget.type}
                className="group relative backdrop-blur-xl bg-gradient-to-br from-cognac-950/40 to-burgundy-950/30 border-2 border-brass-800/30 rounded-xl p-5 hover:border-brass-600/50 hover:shadow-lg hover:shadow-brass-950/50 transition-all"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${widget.gradient} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg border border-brass-700/30`}>
                  <svg className="w-6 h-6 text-ivory-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={widget.icon} />
                  </svg>
                </div>

                <h3 className="font-bold text-brass-200 mb-1">{widget.name}</h3>
                <p className="text-sm text-ivory-200/70 mb-3">{widget.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 bg-brass-950/40 text-brass-400 rounded-full capitalize border border-brass-800/30">
                    {widget.category}
                  </span>
                  <button
                    onClick={() => {
                      onAddWidget(widget.type)
                      onClose()
                    }}
                    className="px-3 py-1.5 bg-gradient-to-r from-brass-600 to-cognac-600 hover:from-brass-500 hover:to-cognac-500 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg hover:shadow-brass-600/40"
                  >
                    Add Widget
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredWidgets.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-brass-400/30 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-ivory-200/50">No widgets found in this category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
