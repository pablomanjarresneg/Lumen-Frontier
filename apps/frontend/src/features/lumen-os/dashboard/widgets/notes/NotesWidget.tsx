import { useState, useEffect, useRef } from 'react'
import type { WidgetProps } from '../../types'

interface Note {
  id: string
  text: string
  createdAt: number
}

export default function NotesWidget({ config, onUpdate }: WidgetProps) {
  const [notes, setNotes] = useState<Note[]>(config.data?.notes || [])
  const [newNoteText, setNewNoteText] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const onUpdateRef = useRef(onUpdate)

  // Keep ref updated
  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  useEffect(() => {
    if (JSON.stringify(notes) !== JSON.stringify(config.data?.notes)) {
      onUpdateRef.current({ data: { ...config.data, notes } })
    }
  }, [notes, config.data])

  const addNote = () => {
    if (!newNoteText.trim()) return

    const newNote: Note = {
      id: `note_${Date.now()}`,
      text: newNoteText,
      createdAt: Date.now()
    }

    setNotes([newNote, ...notes])
    setNewNoteText('')
    setIsAdding(false)
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id))
  }

  return (
    <div className="flex flex-col h-full">
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full p-2.5 bg-gradient-to-r from-brass-900/20 to-cognac-900/20 border-2 border-dashed border-brass-600/40 rounded-lg text-brass-300 font-medium hover:bg-brass-800/30 hover:border-brass-500/60 transition-all backdrop-blur-sm mb-2.5 shadow-lg shadow-brass-950/20"
        >
          + Add New Note
        </button>
      )}

      {isAdding && (
        <div className="mb-2.5 p-2.5 bg-gradient-to-br from-brass-900/20 to-cognac-900/20 rounded-lg border border-brass-700/30 backdrop-blur-sm shadow-lg shadow-brass-950/30">
          <textarea
            autoFocus
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="Write your note..."
            className="w-full p-2 bg-cognac-950/30 border border-brass-800/30 rounded resize-none text-ivory-100 placeholder:text-brass-300/30 focus:outline-none focus:ring-2 focus:ring-brass-600/50 focus:border-brass-500/50"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                addNote()
              }
            }}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={addNote}
              className="flex-1 px-3 py-1.5 bg-gradient-to-r from-brass-700 to-cognac-700 text-white rounded hover:shadow-lg hover:shadow-brass-600/40 transition-all text-sm font-medium"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsAdding(false)
                setNewNoteText('')
              }}
              className="flex-1 px-3 py-1.5 bg-cognac-950/40 text-ivory-200/80 rounded hover:bg-cognac-900/50 transition-colors text-sm border border-brass-800/30"
            >
              Cancel
            </button>
          </div>
          <p className="text-xs text-brass-400/50 mt-1">Ctrl+Enter to save</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-2">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-brass-300/40">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <p className="text-sm">No notes yet</p>
            <p className="text-xs">Click above to add your first note</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="group p-2.5 bg-gradient-to-br from-cognac-950/30 to-burgundy-950/20 border border-brass-800/30 rounded-lg hover:bg-cognac-900/30 hover:shadow-lg hover:shadow-brass-950/50 hover:border-brass-700/50 transition-all backdrop-blur-sm"
            >
              <div className="flex items-start justify-between">
                <p className="flex-1 text-sm text-ivory-100 whitespace-pre-wrap">{note.text}</p>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="ml-2 p-1 opacity-0 group-hover:opacity-100 text-burgundy-400 hover:bg-burgundy-500/20 rounded transition-all"
                  title="Delete note"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-brass-400/40 mt-1">
                {new Date(note.createdAt).toLocaleDateString()} {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
