/**
 * Notes Widget
 *
 * Quick notes and thoughts capture
 */

import { useState, useEffect } from 'react'
import type { WidgetProps } from '@/types/widgets'

interface Note {
  id: string
  text: string
  createdAt: number
}

export default function NotesWidget({ config, onUpdate }: WidgetProps) {
  const [notes, setNotes] = useState<Note[]>(config.data?.notes || [])
  const [newNoteText, setNewNoteText] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  // Save notes to config when they change (with proper dependency to avoid infinite loop)
  useEffect(() => {
    if (JSON.stringify(notes) !== JSON.stringify(config.data?.notes)) {
      onUpdate({ data: { ...config.data, notes } })
    }
  }, [notes])

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
      {/* Add Note Button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-dashed border-green-300 rounded-lg text-green-700 font-medium hover:bg-green-100 transition-colors mb-3"
        >
          + Add New Note
        </button>
      )}

      {/* Add Note Form */}
      {isAdding && (
        <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <textarea
            autoFocus
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="Write your note..."
            className="w-full p-2 border border-green-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsAdding(false)
                setNewNoteText('')
              }}
              className="flex-1 px-3 py-1.5 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">Ctrl+Enter to save</p>
        </div>
      )}

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
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
              className="group p-3 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <p className="flex-1 text-sm text-slate-700 whitespace-pre-wrap">{note.text}</p>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="ml-2 p-1 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 rounded transition-all"
                  title="Delete note"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {new Date(note.createdAt).toLocaleDateString()} {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
