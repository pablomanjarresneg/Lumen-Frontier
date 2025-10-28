import { useState, useEffect, useRef } from 'react'
import type { WidgetProps} from '../../types'

interface Task {
  id: string
  text: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: number
}

export default function TasksWidget({ config, onUpdate }: WidgetProps) {
  const [tasks, setTasks] = useState<Task[]>(config.data?.tasks || [])
  const [newTaskText, setNewTaskText] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const onUpdateRef = useRef(onUpdate)

  // Keep ref updated
  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  useEffect(() => {
    if (JSON.stringify(tasks) !== JSON.stringify(config.data?.tasks)) {
      onUpdateRef.current({ data: { ...config.data, tasks } })
    }
  }, [tasks, config.data])

  const addTask = () => {
    if (!newTaskText.trim()) return

    const newTask: Task = {
      id: `task_${Date.now()}`,
      text: newTaskText,
      completed: false,
      priority: newTaskPriority,
      createdAt: Date.now()
    }

    setTasks([newTask, ...tasks])
    setNewTaskText('')
    setNewTaskPriority('medium')
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50'
      case 'medium': return 'border-yellow-500 bg-yellow-50'
      case 'low': return 'border-green-500 bg-green-50'
      default: return 'border-slate-300 bg-white'
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length
  }

  return (
    <div className="flex flex-col h-full">
      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center p-2 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
          <div className="text-lg font-bold text-white">{stats.total}</div>
          <div className="text-xs text-white/50">Total</div>
        </div>
        <div className="text-center p-2 bg-blue-500/10 rounded-lg backdrop-blur-sm border border-blue-500/20">
          <div className="text-lg font-bold text-blue-400">{stats.active}</div>
          <div className="text-xs text-blue-400/70">Active</div>
        </div>
        <div className="text-center p-2 bg-green-500/10 rounded-lg backdrop-blur-sm border border-green-500/20">
          <div className="text-lg font-bold text-green-400">{stats.completed}</div>
          <div className="text-xs text-green-400/70">Done</div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-3">
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
              filter === f
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white/5 text-white/60 hover:text-white/90 hover:bg-white/10 border border-white/10'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Add Task Form */}
      <div className="mb-3 p-3 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
        <div className="flex gap-2 mb-2">
          <label htmlFor="task-input" className="sr-only">New task</label>
          <input
            id="task-input"
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add a new task..."
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
          />
        </div>
        <div className="flex gap-2">
          <label htmlFor="priority-select" className="sr-only">Task priority</label>
          <select
            id="priority-select"
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="flex-1 px-2 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-label="Select task priority"
          >
            <option value="low" className="bg-gray-800">Low Priority</option>
            <option value="medium" className="bg-gray-800">Medium Priority</option>
            <option value="high" className="bg-gray-800">High Priority</option>
          </select>
          <button
            onClick={addTask}
            className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all font-medium"
          >
            Add
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-white/40">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <p className="text-sm">No tasks {filter !== 'all' && filter}</p>
            <p className="text-xs">Add your first task above</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`group p-3 border-l-4 rounded-lg transition-all backdrop-blur-sm ${
                task.priority === 'high' ? 'border-red-500 bg-red-500/10' :
                task.priority === 'medium' ? 'border-yellow-500 bg-yellow-500/10' :
                'border-green-500 bg-green-500/10'
              } ${task.completed ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    task.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-white/30 hover:border-green-500'
                  }`}
                >
                  {task.completed && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${task.completed ? 'line-through text-white/50' : 'text-white'}`}>
                    {task.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="text-xs text-white/40">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:bg-red-500/20 rounded transition-all"
                  title="Delete task"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
