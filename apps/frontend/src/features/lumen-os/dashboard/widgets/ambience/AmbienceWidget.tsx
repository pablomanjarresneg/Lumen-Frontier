import { useState, useEffect, useRef } from 'react'
import type { WidgetProps } from '../../types'

interface AmbienceSound {
  id: string
  name: string
  icon: string
  description: string
  // Note: Audio URLs would need to be replaced with actual hosted audio files
  // For now, using placeholder URLs that can be replaced with real audio sources
  url: string
  color: string
  gradient: string
}

const AMBIENCE_SOUNDS: AmbienceSound[] = [
  {
    id: 'rain',
    name: 'Rain',
    icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
    description: 'Gentle rainfall',
    url: '/sounds/rain.mp3',
    color: 'text-sky-400',
    gradient: 'from-sky-500 to-blue-600'
  },
  {
    id: 'cafe',
    name: 'Cafe',
    icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z',
    description: 'Coffee shop ambience',
    url: '/sounds/cafe.mp3',
    color: 'text-brass-400',
    gradient: 'from-brass-500 to-cognac-600'
  },
  {
    id: 'forest',
    name: 'Forest',
    icon: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9',
    description: 'Birds and nature',
    url: '/sounds/forest.mp3',
    color: 'text-forest-400',
    gradient: 'from-forest-500 to-forest-700'
  },
  {
    id: 'ocean',
    name: 'Ocean',
    icon: 'M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5',
    description: 'Ocean waves',
    url: '/sounds/ocean.mp3',
    color: 'text-cyan-400',
    gradient: 'from-cyan-500 to-teal-600'
  },
  {
    id: 'fireplace',
    name: 'Fireplace',
    icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z',
    description: 'Crackling fire',
    url: '/sounds/fireplace.mp3',
    color: 'text-burgundy-400',
    gradient: 'from-burgundy-500 to-burgundy-700'
  },
  {
    id: 'thunder',
    name: 'Thunder',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    description: 'Distant thunder',
    url: '/sounds/thunder.mp3',
    color: 'text-purple-400',
    gradient: 'from-purple-500 to-indigo-600'
  }
]

export default function AmbienceWidget({ config, onUpdate }: WidgetProps) {
  const [selectedSound, setSelectedSound] = useState<string>(config.data?.selectedSound || '')
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState<number>(config.data?.volume ?? 50)
  const [error, setError] = useState<string>('')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const onUpdateRef = useRef(onUpdate)

  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  useEffect(() => {
    if (selectedSound !== config.data?.selectedSound || volume !== config.data?.volume) {
      onUpdateRef.current({ data: { ...config.data, selectedSound, volume } })
    }
  }, [selectedSound, volume, config.data])

  // Initialize audio element
  useEffect(() => {
    if (selectedSound) {
      const sound = AMBIENCE_SOUNDS.find(s => s.id === selectedSound)
      if (sound) {
        // Create audio element
        const audio = new Audio(sound.url)
        audio.loop = true
        audio.volume = volume / 100
        audioRef.current = audio

        // Handle audio errors
        audio.addEventListener('error', () => {
          setError('Audio file not found. Please add sound files to /public/sounds/')
          setIsPlaying(false)
        })

        return () => {
          audio.pause()
          audio.src = ''
          audioRef.current = null
        }
      }
    }
  }, [selectedSound, volume])

  const handleSoundSelect = (soundId: string) => {
    // Stop current audio
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
    setError('')
    setSelectedSound(soundId)
  }

  const togglePlay = async () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      try {
        await audioRef.current.play()
        setIsPlaying(true)
        setError('')
      } catch (err) {
        setError('Unable to play audio. Files may be missing.')
        setIsPlaying(false)
      }
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }

  const currentSound = AMBIENCE_SOUNDS.find(s => s.id === selectedSound)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-brass-200">Ambient Sounds</h3>
        <p className="text-xs text-brass-400/60">Create the perfect atmosphere</p>
      </div>

      {/* Sound Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {AMBIENCE_SOUNDS.map((sound) => (
          <button
            key={sound.id}
            onClick={() => handleSoundSelect(sound.id)}
            className={`p-3 rounded-lg transition-all ${
              selectedSound === sound.id
                ? `bg-gradient-to-br ${sound.gradient} text-white shadow-lg scale-105`
                : 'bg-cognac-950/30 text-brass-300/60 hover:bg-cognac-900/40 hover:text-brass-200/90 border border-brass-800/20'
            }`}
          >
            <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={sound.icon} />
            </svg>
            <p className="text-xs font-medium">{sound.name}</p>
          </button>
        ))}
      </div>

      {/* Current Sound Display */}
      {currentSound && (
        <div className="mb-4 p-3 bg-gradient-to-br from-cognac-950/40 to-burgundy-950/30 border border-brass-800/30 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${currentSound.gradient}`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={currentSound.icon} />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-brass-200">{currentSound.name}</p>
              <p className="text-xs text-brass-400/60">{currentSound.description}</p>
            </div>
            <button
              onClick={togglePlay}
              className={`p-3 rounded-full transition-all ${
                isPlaying
                  ? 'bg-gradient-to-br from-burgundy-600 to-burgundy-700 text-white shadow-lg shadow-burgundy-600/40'
                  : 'bg-gradient-to-br from-brass-600 to-cognac-600 text-white shadow-lg shadow-brass-600/40'
              }`}
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>

          {/* Volume Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-brass-400">
              <span>Volume</span>
              <span className="font-medium text-brass-300">{volume}%</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-brass-400/60" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5.889 16H2a1 1 0 01-1-1V9a1 1 0 011-1h3.889l5.294-4.332a.5.5 0 01.817.387v15.89a.5.5 0 01-.817.387L5.89 16z" />
              </svg>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                className="flex-1 h-2 bg-cognac-900/40 rounded-lg appearance-none cursor-pointer accent-brass-500"
              />
              <svg className="w-5 h-5 text-brass-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5.889 16H2a1 1 0 01-1-1V9a1 1 0 011-1h3.889l5.294-4.332a.5.5 0 01.817.387v15.89a.5.5 0 01-.817.387L5.89 16zm13.517 4.134l-1.416-1.416A8.978 8.978 0 0021 12a8.982 8.982 0 00-3.304-6.968l1.42-1.42A10.976 10.976 0 0123 12c0 3.223-1.386 6.122-3.594 8.134zm-3.543-3.543l-1.422-1.422A3.993 3.993 0 0016 12c0-1.43-.75-2.685-1.879-3.392l1.439-1.439A5.991 5.991 0 0118 12c0 1.842-.83 3.49-2.137 4.591z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-burgundy-950/30 border border-burgundy-700/40 rounded-lg">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-burgundy-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <p className="text-xs text-burgundy-300 font-medium mb-1">Audio Not Available</p>
              <p className="text-xs text-burgundy-400/80">{error}</p>
              <p className="text-xs text-brass-400/60 mt-2">
                To use ambient sounds, add audio files to <code className="bg-burgundy-900/30 px-1 py-0.5 rounded">public/sounds/</code>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedSound && !error && (
        <div className="flex-1 flex items-center justify-center text-center">
          <div className="text-brass-300/40">
            <svg className="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            <p className="text-sm font-medium mb-1">Select a Sound</p>
            <p className="text-xs">Choose an ambient sound to begin</p>
          </div>
        </div>
      )}
    </div>
  )
}
