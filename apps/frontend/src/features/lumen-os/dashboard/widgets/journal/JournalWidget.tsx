import { useState, useEffect, useRef } from 'react'
import type { WidgetProps } from '../../types'

interface JournalEntry {
  id: string
  date: string // YYYY-MM-DD format
  content: string
  mood?: 'great' | 'good' | 'okay' | 'bad' | 'terrible'
  createdAt: number
  updatedAt: number
}

export default function JournalWidget({ config, onUpdate }: WidgetProps) {
  const [entries, setEntries] = useState<JournalEntry[]>(config.data?.entries || [])
  const [currentEntry, setCurrentEntry] = useState('')
  const [currentMood, setCurrentMood] = useState<JournalEntry['mood']>('good')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [viewMode, setViewMode] = useState<'write' | 'history'>('write')
  const onUpdateRef = useRef(onUpdate)

  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  useEffect(() => {
    if (JSON.stringify(entries) !== JSON.stringify(config.data?.entries)) {
      onUpdateRef.current({ data: { ...config.data, entries } })
    }
  }, [entries, config.data])

  // Load entry for selected date
  useEffect(() => {
    const existing = entries.find(e => e.date === selectedDate)
    if (existing) {
      setCurrentEntry(existing.content)
      setCurrentMood(existing.mood || 'good')
    } else {
      setCurrentEntry('')
      setCurrentMood('good')
    }
  }, [selectedDate, entries])

  const saveEntry = () => {
    if (!currentEntry.trim()) return

    const existing = entries.find(e => e.date === selectedDate)
    if (existing) {
      // Update existing entry
      setEntries(entries.map(e =>
        e.date === selectedDate
          ? { ...e, content: currentEntry, mood: currentMood, updatedAt: Date.now() }
          : e
      ))
    } else {
      // Create new entry
      const newEntry: JournalEntry = {
        id: `entry_${Date.now()}`,
        date: selectedDate,
        content: currentEntry,
        mood: currentMood,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      setEntries([newEntry, ...entries].sort((a, b) => b.date.localeCompare(a.date)))
    }
  }

  const deleteEntry = (id: string) => {
    if (confirm('Delete this journal entry?')) {
      setEntries(entries.filter(e => e.id !== id))
    }
  }

  const getMoodEmoji = (mood?: JournalEntry['mood']) => {
    switch (mood) {
      case 'great': return '😄'
      case 'good': return '🙂'
      case 'okay': return '😐'
      case 'bad': return '😟'
      case 'terrible': return '😢'
      default: return '🙂'
    }
  }

  const getMoodColor = (mood?: JournalEntry['mood']) => {
    switch (mood) {
      case 'great': return 'text-forest-300 bg-forest-950/30 border-forest-700/30'
      case 'good': return 'text-brass-300 bg-brass-950/30 border-brass-700/30'
      case 'okay': return 'text-cognac-300 bg-cognac-950/30 border-cognac-700/30'
      case 'bad': return 'text-burgundy-300 bg-burgundy-950/30 border-burgundy-700/30'
      case 'terrible': return 'text-burgundy-400 bg-burgundy-950/40 border-burgundy-600/40'
      default: return 'text-brass-300 bg-brass-950/30 border-brass-700/30'
    }
  }

  const todayEntry = entries.find(e => e.date === new Date().toISOString().split('T')[0])
  const streak = calculateStreak(entries)

  function calculateStreak(entries: JournalEntry[]): number {
    if (entries.length === 0) return 0

    const sortedDates = entries.map(e => e.date).sort().reverse()
    const today = new Date().toISOString().split('T')[0]

    if (sortedDates[0] !== today) return 0

    let streak = 1
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1])
      const currDate = new Date(sortedDates[i])
      const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setViewMode('write')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
            viewMode === 'write'
              ? 'bg-gradient-to-r from-brass-600 to-cognac-600 text-white shadow-lg shadow-brass-600/30'
              : 'bg-cognac-950/30 text-brass-300/60 hover:text-brass-200/90 hover:bg-cognac-900/40 border border-brass-800/20'
          }`}
        >
          Write
        </button>
        <button
          onClick={() => setViewMode('history')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
            viewMode === 'history'
              ? 'bg-gradient-to-r from-brass-600 to-cognac-600 text-white shadow-lg shadow-brass-600/30'
              : 'bg-cognac-950/30 text-brass-300/60 hover:text-brass-200/90 hover:bg-cognac-900/40 border border-brass-800/20'
          }`}
        >
          History ({entries.length})
        </button>
      </div>

      {viewMode === 'write' ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="text-center p-2 bg-brass-950/30 rounded-lg border border-brass-800/20">
              <div className="text-lg font-bold text-brass-300">{streak}</div>
              <div className="text-xs text-brass-400/70">Day Streak</div>
            </div>
            <div className="text-center p-2 bg-cognac-950/30 rounded-lg border border-brass-800/20">
              <div className="text-lg font-bold text-brass-300">{entries.length}</div>
              <div className="text-xs text-brass-400/70">Total Entries</div>
            </div>
          </div>

          {/* Date Selector */}
          <div className="mb-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 bg-cognac-950/30 border border-brass-800/30 rounded-lg text-sm text-ivory-100 focus:outline-none focus:ring-2 focus:ring-brass-600/50"
            />
          </div>

          {/* Mood Selector */}
          <div className="mb-3">
            <label className="block text-xs text-brass-300 mb-2">How are you feeling?</label>
            <div className="flex gap-2">
              {(['great', 'good', 'okay', 'bad', 'terrible'] as const).map((mood) => (
                <button
                  key={mood}
                  onClick={() => setCurrentMood(mood)}
                  className={`flex-1 p-2 rounded-lg text-2xl transition-all ${
                    currentMood === mood
                      ? `${getMoodColor(mood)} scale-110`
                      : 'bg-cognac-950/20 opacity-50 hover:opacity-100'
                  }`}
                  title={mood}
                >
                  {getMoodEmoji(mood)}
                </button>
              ))}
            </div>
          </div>

          {/* Text Editor */}
          <div className="flex-1 mb-3">
            <textarea
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              placeholder="Write about your day..."
              className="w-full h-full px-3 py-2 bg-cognac-950/30 border border-brass-800/30 rounded-lg text-sm text-ivory-100 placeholder:text-brass-300/30 focus:outline-none focus:ring-2 focus:ring-brass-600/50 resize-none"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={saveEntry}
            disabled={!currentEntry.trim()}
            className="w-full py-2.5 bg-gradient-to-r from-brass-600 to-cognac-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-brass-600/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {entries.find(e => e.date === selectedDate) ? 'Update Entry' : 'Save Entry'}
          </button>
        </>
      ) : (
        /* History View */
        <div className="flex-1 overflow-y-auto space-y-2">
          {entries.length === 0 ? (
            <div className="text-center py-8 text-brass-300/40">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-sm">No journal entries yet</p>
              <p className="text-xs">Start writing to create your first entry</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="group p-3 bg-gradient-to-br from-cognac-950/30 to-burgundy-950/20 border border-brass-800/30 rounded-lg hover:bg-cognac-900/30 hover:shadow-lg hover:shadow-brass-950/50 hover:border-brass-700/50 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                    <div>
                      <p className="text-sm font-medium text-brass-200">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className={`text-xs px-2 py-0.5 rounded-full inline-block ${getMoodColor(entry.mood)}`}>
                        {entry.mood}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-burgundy-400 hover:bg-burgundy-500/20 rounded transition-all"
                    title="Delete entry"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-ivory-200 line-clamp-3">{entry.content}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
