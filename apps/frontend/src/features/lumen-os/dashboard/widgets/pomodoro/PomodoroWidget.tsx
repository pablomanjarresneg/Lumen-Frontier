import { useState, useEffect, useRef } from 'react'
import type { WidgetProps } from '../../types'

type PomodoroMode = 'work' | 'shortBreak' | 'longBreak'

interface PomodoroData {
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  completedPomodoros: number
  totalWorkTime: number
}

export default function PomodoroWidget({ config, onUpdate }: WidgetProps) {
  const data: PomodoroData = config.data || {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    completedPomodoros: 0,
    totalWorkTime: 0
  }

  const [mode, setMode] = useState<PomodoroMode>('work')
  const [timeLeft, setTimeLeft] = useState(data.workDuration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<number | null>(null)

  const durations = {
    work: data.workDuration * 60,
    shortBreak: data.shortBreakDuration * 60,
    longBreak: data.longBreakDuration * 60
  }

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  const handleTimerComplete = () => {
    setIsRunning(false)

    if (mode === 'work') {
      const newCompletedPomodoros = data.completedPomodoros + 1
      const newTotalWorkTime = data.totalWorkTime + data.workDuration

      onUpdate({
        data: {
          ...data,
          completedPomodoros: newCompletedPomodoros,
          totalWorkTime: newTotalWorkTime
        }
      })

      // Play notification sound
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Complete!', {
          body: 'Great work! Time for a break.',
          icon: '/favicon.ico'
        })
      }

      // Auto-switch to break
      const nextMode = newCompletedPomodoros % 4 === 0 ? 'longBreak' : 'shortBreak'
      setMode(nextMode)
      setTimeLeft(durations[nextMode])
    } else {
      // Break complete
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Break Complete!', {
          body: 'Ready to focus again?',
          icon: '/favicon.ico'
        })
      }
      setMode('work')
      setTimeLeft(durations.work)
    }
  }

  const toggleTimer = () => {
    if (!isRunning && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(durations[mode])
  }

  const switchMode = (newMode: PomodoroMode) => {
    setMode(newMode)
    setTimeLeft(durations[newMode])
    setIsRunning(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((durations[mode] - timeLeft) / durations[mode]) * 100

  return (
    <div className="flex flex-col h-full">
      {/* Mode Selector */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => switchMode('work')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            mode === 'work'
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Work
        </button>
        <button
          onClick={() => switchMode('shortBreak')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            mode === 'shortBreak'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Short Break
        </button>
        <button
          onClick={() => switchMode('longBreak')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            mode === 'longBreak'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Long Break
        </button>
      </div>

      {/* Timer Display */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          {/* Circular Progress */}
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-slate-200"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
              className={`transition-all duration-1000 ${
                mode === 'work' ? 'text-red-500' :
                mode === 'shortBreak' ? 'text-green-500' : 'text-blue-500'
              }`}
              strokeLinecap="round"
            />
          </svg>

          {/* Time Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-slate-800">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-slate-500 mt-1 capitalize">
                {mode === 'work' ? 'Focus Time' :
                 mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={toggleTimer}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all shadow-md hover:shadow-lg ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600'
              : mode === 'work' ? 'bg-red-500 hover:bg-red-600' :
                mode === 'shortBreak' ? 'bg-green-500 hover:bg-green-600' :
                'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200">
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{data.completedPomodoros}</div>
          <div className="text-xs text-slate-600 mt-1">Pomodoros</div>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{data.totalWorkTime}</div>
          <div className="text-xs text-slate-600 mt-1">Minutes</div>
        </div>
      </div>
    </div>
  )
}
