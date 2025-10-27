import { useState } from 'react'
import type { WidgetConfig } from '../../types'
import { getWidgetMetadata } from '../../services'

interface WidgetSettingsProps {
  widget: WidgetConfig
  isOpen: boolean
  onClose: () => void
  onSave: (settings: Record<string, any>) => void
}

export default function WidgetSettings({ widget, isOpen, onClose, onSave }: WidgetSettingsProps) {
  const metadata = getWidgetMetadata(widget.type)
  const [settings, setSettings] = useState<Record<string, any>>(widget.settings || {})

  if (!isOpen) return null

  const handleSave = () => {
    onSave(settings)
    onClose()
  }

  // Widget-specific settings based on type
  const renderSettings = () => {
    switch (widget.type) {
      case 'notes':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="maxNotes" className="block text-sm font-medium text-slate-700 mb-2">
                Max Notes to Display
              </label>
              <input
                id="maxNotes"
                type="number"
                value={settings.maxNotes || 10}
                onChange={(e) => setSettings({ ...settings, maxNotes: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="1"
                max="50"
                aria-label="Max Notes to Display"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showTimestamps"
                checked={settings.showTimestamps !== false}
                onChange={(e) => setSettings({ ...settings, showTimestamps: e.target.checked })}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <label htmlFor="showTimestamps" className="ml-2 text-sm text-slate-700">
                Show timestamps
              </label>
            </div>
          </div>
        )

      case 'analytics':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="timeRange" className="block text-sm font-medium text-slate-700 mb-2">
                Time Range
              </label>
              <select
                id="timeRange"
                value={settings.timeRange || 'week'}
                onChange={(e) => setSettings({ ...settings, timeRange: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Time Range"
              >
                <option value="day">Last 24 Hours</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showGoals"
                checked={settings.showGoals !== false}
                onChange={(e) => setSettings({ ...settings, showGoals: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="showGoals" className="ml-2 text-sm text-slate-700">
                Display study goals
              </label>
            </div>
          </div>
        )

      case 'progress':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="dailyGoal" className="block text-sm font-medium text-slate-700 mb-2">
                Daily Goal (minutes)
              </label>
              <input
                id="dailyGoal"
                type="number"
                value={settings.dailyGoal || 60}
                onChange={(e) => setSettings({ ...settings, dailyGoal: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                min="5"
                max="480"
                step="5"
                aria-label="Daily Goal in minutes"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="celebrateStreaks"
                checked={settings.celebrateStreaks !== false}
                onChange={(e) => setSettings({ ...settings, celebrateStreaks: e.target.checked })}
                className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
              />
              <label htmlFor="celebrateStreaks" className="ml-2 text-sm text-slate-700">
                Celebrate milestone streaks
              </label>
            </div>
          </div>
        )

      case 'flashcards':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="cardsPerSession" className="block text-sm font-medium text-slate-700 mb-2">
                Cards per Session
              </label>
              <input
                id="cardsPerSession"
                type="number"
                value={settings.cardsPerSession || 20}
                onChange={(e) => setSettings({ ...settings, cardsPerSession: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="5"
                max="100"
                step="5"
                aria-label="Cards per Session"
              />
            </div>
            <div>
              <label htmlFor="algorithm" className="block text-sm font-medium text-slate-700 mb-2">
                Review Algorithm
              </label>
              <select
                id="algorithm"
                value={settings.algorithm || 'spaced'}
                onChange={(e) => setSettings({ ...settings, algorithm: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                aria-label="Review Algorithm"
              >
                <option value="random">Random</option>
                <option value="spaced">Spaced Repetition</option>
                <option value="difficult">Difficult First</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoFlip"
                checked={settings.autoFlip === true}
                onChange={(e) => setSettings({ ...settings, autoFlip: e.target.checked })}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="autoFlip" className="ml-2 text-sm text-slate-700">
                Auto-flip cards after 3 seconds
              </label>
            </div>
          </div>
        )

      case 'quick-access':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="maxLinks" className="block text-sm font-medium text-slate-700 mb-2">
                Number of Quick Links
              </label>
              <input
                id="maxLinks"
                type="number"
                value={settings.maxLinks || 6}
                onChange={(e) => setSettings({ ...settings, maxLinks: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                min="3"
                max="12"
                aria-label="Number of Quick Links"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showIcons"
                checked={settings.showIcons !== false}
                onChange={(e) => setSettings({ ...settings, showIcons: e.target.checked })}
                className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
              />
              <label htmlFor="showIcons" className="ml-2 text-sm text-slate-700">
                Show link icons
              </label>
            </div>
          </div>
        )

      case 'calendar':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="defaultView" className="block text-sm font-medium text-slate-700 mb-2">
                Default View
              </label>
              <select
                id="defaultView"
                value={settings.defaultView || 'month'}
                onChange={(e) => setSettings({ ...settings, defaultView: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                aria-label="Default View"
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showWeekends"
                checked={settings.showWeekends !== false}
                onChange={(e) => setSettings({ ...settings, showWeekends: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <label htmlFor="showWeekends" className="ml-2 text-sm text-slate-700">
                Show weekends
              </label>
            </div>
          </div>
        )

      case 'pomodoro':
      case 'tasks':
      case 'goals':
        return (
          <div className="text-center py-8 text-slate-500">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
            <p className="text-sm">Widget settings are configured within the widget</p>
            <p className="text-xs mt-1">Use the controls in the widget itself</p>
          </div>
        )

      default:
        return (
          <div className="text-center py-8 text-slate-500">
            <p>No settings available for this widget</p>
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slideUp">
        <div className={`bg-gradient-to-r ${metadata.gradient} p-5 rounded-t-2xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={metadata.icon} />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{metadata.name} Settings</h2>
                <p className="text-white/80 text-xs">Customize your widget</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close settings"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {renderSettings()}
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${metadata.gradient} text-white rounded-lg font-medium hover:shadow-lg transition-all`}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
