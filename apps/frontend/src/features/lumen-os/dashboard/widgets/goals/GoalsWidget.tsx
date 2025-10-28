import { useState, useEffect, useRef } from 'react'
import type { WidgetProps } from '../../types'
import './GoalsWidget.css'

interface Goal {
  id: string
  title: string
  description: string
  target: number
  current: number
  unit: string
  deadline?: string
  category: 'daily' | 'weekly' | 'monthly' | 'custom'
  createdAt: number
  completedAt?: number
}

export default function GoalsWidget({ config, onUpdate }: WidgetProps) {
  const [goals, setGoals] = useState<Goal[]>(config.data?.goals || [])
  const [isAdding, setIsAdding] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    target: 10,
    unit: 'hours',
    category: 'weekly' as Goal['category']
  })
  const progressBarRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const onUpdateRef = useRef(onUpdate)

  // Keep ref updated
  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  useEffect(() => {
    if (JSON.stringify(goals) !== JSON.stringify(config.data?.goals)) {
      onUpdateRef.current({ data: { ...config.data, goals } })
    }
  }, [goals, config.data])

  // Update progress bar widths dynamically
  useEffect(() => {
    goals.forEach(goal => {
      const progressBar = progressBarRefs.current.get(goal.id)
      if (progressBar) {
        const progress = Math.min((goal.current / goal.target) * 100, 100)
        progressBar.style.width = `${progress}%`
      }
    })
  }, [goals])

  const addGoal = () => {
    if (!newGoal.title.trim()) return

    const goal: Goal = {
      id: `goal_${Date.now()}`,
      title: newGoal.title,
      description: newGoal.description,
      target: newGoal.target,
      current: 0,
      unit: newGoal.unit,
      category: newGoal.category,
      createdAt: Date.now()
    }

    setGoals([goal, ...goals])
    setNewGoal({
      title: '',
      description: '',
      target: 10,
      unit: 'hours',
      category: 'weekly'
    })
    setIsAdding(false)
  }

  const updateProgress = (id: string, amount: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === id) {
        const newCurrent = Math.max(0, Math.min(goal.target, goal.current + amount))
        const isCompleted = newCurrent >= goal.target && !goal.completedAt
        return {
          ...goal,
          current: newCurrent,
          completedAt: isCompleted ? Date.now() : goal.completedAt
        }
      }
      return goal
    }))
  }

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'daily': return 'from-orange-500 to-red-500'
      case 'weekly': return 'from-blue-500 to-indigo-500'
      case 'monthly': return 'from-purple-500 to-pink-500'
      case 'custom': return 'from-green-500 to-teal-500'
      default: return 'from-slate-500 to-slate-600'
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'daily': return 'bg-orange-500/20 text-orange-400'
      case 'weekly': return 'bg-blue-500/20 text-blue-400'
      case 'monthly': return 'bg-purple-500/20 text-purple-400'
      case 'custom': return 'bg-green-500/20 text-green-400'
      default: return 'bg-slate-500/20 text-slate-400'
    }
  }

  const activeGoals = goals.filter(g => !g.completedAt)
  const completedGoals = goals.filter(g => g.completedAt)

  return (
    <div className="flex flex-col h-full">
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-lg border border-blue-500/20 backdrop-blur-sm">
          <div className="text-2xl font-bold text-blue-400">{activeGoals.length}</div>
          <div className="text-xs text-blue-400/70">Active Goals</div>
        </div>
        <div className="p-3 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20 backdrop-blur-sm">
          <div className="text-2xl font-bold text-green-400">{completedGoals.length}</div>
          <div className="text-xs text-green-400/70">Completed</div>
        </div>
      </div>

      {/* Add Goal Button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full p-3 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-2 border-dashed border-blue-500/30 rounded-lg text-blue-400 font-medium hover:bg-blue-500/20 hover:border-blue-500/50 transition-all backdrop-blur-sm mb-3"
        >
          + Set New Goal
        </button>
      )}

      {/* Add Goal Form */}
      {isAdding && (
        <div className="mb-3 p-4 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
          <input
            type="text"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            placeholder="Goal title..."
            aria-label="Goal title"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg mb-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            autoFocus
          />
          <textarea
            value={newGoal.description}
            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            placeholder="Description (optional)..."
            aria-label="Goal description"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg mb-2 text-sm text-white placeholder:text-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            rows={2}
          />
          <div className="grid grid-cols-3 gap-2 mb-3">
            <input
              type="number"
              value={newGoal.target}
              onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) || 0 })}
              aria-label="Target value"
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              min="1"
            />
            <input
              type="text"
              value={newGoal.unit}
              onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
              placeholder="hours"
              aria-label="Unit of measurement"
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <select
              value={newGoal.category}
              onChange={(e) => {
                const value = e.target.value
                if (value === 'daily' || value === 'weekly' || value === 'monthly' || value === 'custom') {
                  setNewGoal({ ...newGoal, category: value })
                }
              }}
              aria-label="Goal category"
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="daily" className="bg-gray-800">Daily</option>
              <option value="weekly" className="bg-gray-800">Weekly</option>
              <option value="monthly" className="bg-gray-800">Monthly</option>
              <option value="custom" className="bg-gray-800">Custom</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={addGoal}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all text-sm font-medium"
            >
              Add Goal
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="flex-1 px-3 py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-colors text-sm border border-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Goals List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {goals.length === 0 ? (
          <div className="text-center py-8 text-white/40">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            <p className="text-sm">No goals set yet</p>
            <p className="text-xs">Click above to set your first goal</p>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = (goal.current / goal.target) * 100
            const isCompleted = goal.completedAt !== undefined

            return (
              <div
                key={goal.id}
                className={`group p-4 rounded-xl border transition-all backdrop-blur-sm ${
                  isCompleted
                    ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:shadow-lg'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className={`font-semibold text-sm ${isCompleted ? 'text-green-400' : 'text-white'}`}>
                      {goal.title}
                      {isCompleted && (
                        <svg className="inline w-4 h-4 ml-1 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </h4>
                    {goal.description && (
                      <p className="text-xs text-white/50 mt-0.5">{goal.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-500/20 rounded transition-all"
                    title="Delete goal"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium mb-2 ${getCategoryBadge(goal.category)}`}>
                  {goal.category}
                </span>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>{goal.current} / {goal.target} {goal.unit}</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      ref={(el) => {
                        if (el) progressBarRefs.current.set(goal.id, el)
                      }}
                      className={`goal-progress-bar h-full bg-gradient-to-r ${getCategoryColor(goal.category)}`}
                      data-progress={Math.min(progress, 100)}
                    />
                  </div>
                </div>

                {/* Control Buttons */}
                {!isCompleted && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateProgress(goal.id, -1)}
                      className="flex-1 py-1.5 bg-white/10 text-white/60 rounded-lg text-xs font-medium hover:bg-white/20 hover:text-white/90 transition-colors border border-white/10"
                      disabled={goal.current === 0}
                    >
                      -1
                    </button>
                    <button
                      onClick={() => updateProgress(goal.id, 1)}
                      className="flex-1 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-xs font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                      disabled={goal.current >= goal.target}
                    >
                      +1
                    </button>
                    <button
                      onClick={() => updateProgress(goal.id, 5)}
                      className="flex-1 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-xs font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all"
                      disabled={goal.current >= goal.target}
                    >
                      +5
                    </button>
                  </div>
                )}

                {isCompleted && goal.completedAt && (
                  <div className="text-xs text-green-400 font-medium text-center py-1">
                    Completed {new Date(goal.completedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
