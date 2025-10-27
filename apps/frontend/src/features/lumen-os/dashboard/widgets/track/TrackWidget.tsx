import { useState, useEffect, useRef } from 'react'
import type { WidgetProps } from '../../types'

interface TimeSession {
  id: string
  label: string
  duration: number  // in seconds
  startTime: number
  endTime: number
}

export default function TrackWidget({ config, onUpdate }: WidgetProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0) // in seconds
  const [sessionLabel, setSessionLabel] = useState('')
  const [isEditingLabel, setIsEditingLabel] = useState(false)
  const [sessions, setSessions] = useState<TimeSession[]>(config.data?.sessions || [])
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null)
  const intervalRef = useRef<number | null>(null)
  const onUpdateRef = useRef(onUpdate)

  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  useEffect(() => {
    if (JSON.stringify(sessions) !== JSON.stringify(config.data?.sessions)) {
      onUpdateRef.current({ data: { ...config.data, sessions } })
    }
  }, [sessions, config.data])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setElapsedTime(prev => prev + 1)
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

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0')
    }
  }

  const handleStartStop = () => {
    if (isRunning) {
      // Stop and save session
      if (elapsedTime > 0) {
        const newSession: TimeSession = {
          id: `session_${Date.now()}`,
          label: sessionLabel || 'Work Session',
          duration: elapsedTime,
          startTime: startTimestamp || Date.now() - (elapsedTime * 1000),
          endTime: Date.now()
        }
        setSessions([newSession, ...sessions])
        setSessionLabel('')
      }
      setIsRunning(false)
      setElapsedTime(0)
      setStartTimestamp(null)
    } else {
      // Start tracking
      setIsRunning(true)
      setStartTimestamp(Date.now())
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    setElapsedTime(0)
    setStartTimestamp(null)
    setSessionLabel('')
  }

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id))
  }

  const time = formatTime(elapsedTime)
  const totalTrackedTime = sessions.reduce((sum, s) => sum + s.duration, 0)
  const todaySessions = sessions.filter(s => {
    const sessionDate = new Date(s.startTime).toDateString()
    const today = new Date().toDateString()
    return sessionDate === today
  })
  const todayTotal = todaySessions.reduce((sum, s) => sum + s.duration, 0)

  return (
    <div className="flex flex-col h-full">
      {/* Timer Display */}
      <div className="mb-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="text-center">
            <div className="text-5xl lg:text-6xl font-bold text-brass-200 tracking-tight">{time.hours}</div>
            <div className="text-xs text-brass-400/50 mt-1 font-medium uppercase tracking-wider">HR</div>
          </div>
          <div className="text-4xl lg:text-5xl font-bold text-brass-300/30">:</div>
          <div className="text-center">
            <div className="text-5xl lg:text-6xl font-bold text-brass-200 tracking-tight">{time.minutes}</div>
            <div className="text-xs text-brass-400/50 mt-1 font-medium uppercase tracking-wider">MIN</div>
          </div>
          <div className="text-4xl lg:text-5xl font-bold text-brass-300/30">:</div>
          <div className="text-center">
            <div className="text-5xl lg:text-6xl font-bold text-brass-200 tracking-tight">{time.seconds}</div>
            <div className="text-xs text-brass-400/50 mt-1 font-medium uppercase tracking-wider">SEC</div>
          </div>
        </div>

        {/* Label Input */}
        {isRunning && (
          <div className="mb-3">
            {isEditingLabel ? (
              <input
                type="text"
                value={sessionLabel}
                onChange={(e) => setSessionLabel(e.target.value)}
                onBlur={() => setIsEditingLabel(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingLabel(false)}
                placeholder="What are you working on?"
                autoFocus
                className="w-full bg-cognac-950/30 text-ivory-100/80 text-sm px-3 py-2 rounded-lg border border-brass-800/30 focus:outline-none focus:border-brass-500/50 placeholder:text-brass-300/30"
              />
            ) : (
              <div
                onClick={() => setIsEditingLabel(true)}
                className="w-full text-brass-300/60 text-sm px-3 py-2 rounded-lg cursor-text hover:bg-cognac-950/20 transition-colors text-center"
              >
                {sessionLabel || 'click to label this session'}
              </div>
            )}
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleStartStop}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-all shadow-lg ${
              isRunning
                ? 'bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:shadow-burgundy-600/50'
                : 'bg-gradient-to-r from-brass-600 to-cognac-600 hover:shadow-brass-600/50'
            }`}
          >
            {isRunning ? 'Stop & Save' : 'Start Tracking'}
          </button>
          {isRunning && (
            <button
              onClick={handleReset}
              className="px-4 py-3 rounded-xl font-semibold text-sm bg-cognac-950/40 text-ivory-200 border border-brass-800/30 hover:bg-cognac-900/50 transition-all"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="text-center p-2 bg-brass-950/30 rounded-lg border border-brass-800/20">
          <div className="text-lg font-bold text-brass-300">{formatTime(todayTotal).hours}h {formatTime(todayTotal).minutes}m</div>
          <div className="text-xs text-brass-400/70">Today</div>
        </div>
        <div className="text-center p-2 bg-cognac-950/30 rounded-lg border border-brass-800/20">
          <div className="text-lg font-bold text-brass-300">{formatTime(totalTrackedTime).hours}h {formatTime(totalTrackedTime).minutes}m</div>
          <div className="text-xs text-brass-400/70">All Time</div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-sm font-semibold text-brass-300 mb-2 px-1">Recent Sessions</h3>
        <div className="space-y-2">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-brass-300/40">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">No sessions yet</p>
              <p className="text-xs">Start tracking to log your work</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className="group p-3 bg-gradient-to-br from-cognac-950/30 to-burgundy-950/20 border border-brass-800/30 rounded-lg hover:bg-cognac-900/30 hover:shadow-lg hover:shadow-brass-950/50 hover:border-brass-700/50 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ivory-100">{session.label}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-brass-300">
                        {formatTime(session.duration).hours}:{formatTime(session.duration).minutes}:{formatTime(session.duration).seconds}
                      </span>
                      <span className="text-xs text-brass-400/40">
                        {new Date(session.startTime).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteSession(session.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-burgundy-400 hover:bg-burgundy-500/20 rounded transition-all"
                    title="Delete session"
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
    </div>
  )
}
