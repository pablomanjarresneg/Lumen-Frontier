import { useState, useEffect } from 'react'
import type { WidgetProps } from '../../types'

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
    category: 'weekly' as const
  })

  useEffect(() => {
    if (JSON.stringify(goals) !== JSON.stringify(config.data?.goals)) {
      onUpdate({ data: { ...config.data, goals } })
    }
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
      case 'daily': return 'from-orange-400 to-red-500'
      case 'weekly': return 'from-blue-400 to-indigo-500'
      case 'monthly': return 'from-purple-400 to-pink-500'
      case 'custom': return 'from-green-400 to-teal-500'
      default: return 'from-slate-400 to-slate-500'
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'daily': return 'bg-orange-100 text-orange-700'
      case 'weekly': return 'bg-blue-100 text-blue-700'
      case 'monthly': return 'bg-purple-100 text-purple-700'
      case 'custom': return 'bg-green-100 text-green-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const activeGoals = goals.filter(g => !g.completedAt)
  const completedGoals = goals.filter(g => g.completedAt)

  return (
    <div className="flex flex-col h-full">
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{activeGoals.length}</div>
          <div className="text-xs text-blue-700">Active Goals</div>
        </div>
        <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
          <div className="text-xs text-green-700">Completed</div>
        </div>
      </div>

      {/* Add Goal Button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-lg text-blue-700 font-medium hover:bg-blue-100 transition-colors mb-3"
        >
          + Set New Goal
        </button>
      )}

      {/* Add Goal Form */}
      {isAdding && (
        <div className="mb-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <input
            type="text"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            placeholder="Goal title..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <textarea
            value={newGoal.description}
            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            placeholder="Description (optional)..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
          <div className="grid grid-cols-3 gap-2 mb-3">
            <input
              type="number"
              value={newGoal.target}
              onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) || 0 })}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
            <input
              type="text"
              value={newGoal.unit}
              onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
              placeholder="hours"
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newGoal.category}
              onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as any })}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={addGoal}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Add Goal
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="flex-1 px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Goals List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {goals.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
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
                className={`group p-4 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                    : 'bg-white border-slate-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className={`font-semibold text-sm ${isCompleted ? 'text-green-700' : 'text-slate-800'}`}>
                      {goal.title}
                      {isCompleted && (
                        <svg className="inline w-4 h-4 ml-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </h4>
                    {goal.description && (
                      <p className="text-xs text-slate-500 mt-0.5">{goal.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded transition-all"
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
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>{goal.current} / {goal.target} {goal.unit}</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getCategoryColor(goal.category)} transition-all duration-500`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Control Buttons */}
                {!isCompleted && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateProgress(goal.id, -1)}
                      className="flex-1 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors"
                      disabled={goal.current === 0}
                    >
                      -1
                    </button>
                    <button
                      onClick={() => updateProgress(goal.id, 1)}
                      className="flex-1 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors"
                      disabled={goal.current >= goal.target}
                    >
                      +1
                    </button>
                    <button
                      onClick={() => updateProgress(goal.id, 5)}
                      className="flex-1 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors"
                      disabled={goal.current >= goal.target}
                    >
                      +5
                    </button>
                  </div>
                )}

                {isCompleted && (
                  <div className="text-xs text-green-600 font-medium text-center py-1">
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
