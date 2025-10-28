import { useState, useEffect, useRef } from 'react'
import type { WidgetProps } from '../../types'

interface Track {
  id: string
  title: string
  artist: string
  url: string
  duration?: number
}

export default function MusicWidget({ config, onUpdate }: WidgetProps) {
  const [playlist, setPlaylist] = useState<Track[]>(config.data?.playlist || [])
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(config.data?.currentTrackIndex ?? 0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState<number>(config.data?.volume ?? 70)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off')
  const [showAddTrack, setShowAddTrack] = useState(false)
  const [newTrackTitle, setNewTrackTitle] = useState('')
  const [newTrackArtist, setNewTrackArtist] = useState('')
  const [newTrackUrl, setNewTrackUrl] = useState('')
  const [error, setError] = useState<string>('')

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const onUpdateRef = useRef(onUpdate)

  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  useEffect(() => {
    if (JSON.stringify(playlist) !== JSON.stringify(config.data?.playlist) ||
        currentTrackIndex !== config.data?.currentTrackIndex ||
        volume !== config.data?.volume) {
      onUpdateRef.current({ data: { ...config.data, playlist, currentTrackIndex, volume } })
    }
  }, [playlist, currentTrackIndex, volume, config.data])

  // Initialize audio element for current track
  useEffect(() => {
    if (playlist.length > 0 && playlist[currentTrackIndex]) {
      const track = playlist[currentTrackIndex]
      const audio = new Audio(track.url)
      audio.volume = volume / 100
      audioRef.current = audio

      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration)
      })

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime)
      })

      audio.addEventListener('ended', () => {
        handleTrackEnd()
      })

      audio.addEventListener('error', () => {
        setError('Unable to load track. Check the URL.')
        setIsPlaying(false)
      })

      return () => {
        audio.pause()
        audio.src = ''
        audioRef.current = null
      }
    }
  }, [currentTrackIndex, playlist, volume])

  const handleTrackEnd = () => {
    if (repeatMode === 'one') {
      // Replay current track
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    } else if (repeatMode === 'all' || currentTrackIndex < playlist.length - 1) {
      // Play next track
      playNext()
    } else {
      // Stop at end of playlist
      setIsPlaying(false)
    }
  }

  const togglePlay = async () => {
    if (!audioRef.current || playlist.length === 0) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      try {
        await audioRef.current.play()
        setIsPlaying(true)
        setError('')
      } catch (err) {
        setError('Unable to play audio. File may be missing.')
        setIsPlaying(false)
      }
    }
  }

  const playNext = () => {
    if (playlist.length === 0) return
    const nextIndex = (currentTrackIndex + 1) % playlist.length
    setCurrentTrackIndex(nextIndex)
    setIsPlaying(true)
  }

  const playPrevious = () => {
    if (playlist.length === 0) return
    // If more than 3 seconds into song, restart it. Otherwise go to previous
    if (currentTime > 3) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
      }
    } else {
      const prevIndex = currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1
      setCurrentTrackIndex(prevIndex)
      setIsPlaying(true)
    }
  }

  const handleSeek = (newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }

  const addTrack = () => {
    if (!newTrackTitle.trim() || !newTrackUrl.trim()) return

    const newTrack: Track = {
      id: `track_${Date.now()}`,
      title: newTrackTitle.trim(),
      artist: newTrackArtist.trim() || 'Unknown Artist',
      url: newTrackUrl.trim()
    }

    setPlaylist([...playlist, newTrack])
    setNewTrackTitle('')
    setNewTrackArtist('')
    setNewTrackUrl('')
    setShowAddTrack(false)
  }

  const removeTrack = (id: string) => {
    const index = playlist.findIndex(t => t.id === id)
    if (index === -1) return

    const newPlaylist = playlist.filter(t => t.id !== id)
    setPlaylist(newPlaylist)

    // Adjust current track index if needed
    if (index === currentTrackIndex) {
      setIsPlaying(false)
      setCurrentTrackIndex(0)
    } else if (index < currentTrackIndex) {
      setCurrentTrackIndex(currentTrackIndex - 1)
    }
  }

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const toggleRepeat = () => {
    const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one']
    const currentIndex = modes.indexOf(repeatMode)
    setRepeatMode(modes[(currentIndex + 1) % modes.length])
  }

  const currentTrack = playlist[currentTrackIndex]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-brass-200">Music Player</h3>
          <p className="text-xs text-brass-400/60">{playlist.length} track{playlist.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowAddTrack(!showAddTrack)}
          className="p-2 rounded-lg bg-gradient-to-br from-brass-600 to-cognac-600 text-white hover:shadow-lg hover:shadow-brass-600/40 transition-all"
          title="Add track"
          aria-label="Add new track to playlist"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Add Track Form */}
      {showAddTrack && (
        <div className="mb-4 p-3 bg-gradient-to-br from-cognac-950/40 to-burgundy-950/30 border border-brass-800/30 rounded-lg space-y-2">
          <input
            type="text"
            placeholder="Track title"
            value={newTrackTitle}
            onChange={(e) => setNewTrackTitle(e.target.value)}
            className="w-full px-3 py-2 bg-cognac-950/50 border border-brass-800/30 rounded-lg text-sm text-ivory-100 placeholder:text-brass-300/30 focus:outline-none focus:ring-2 focus:ring-brass-600/50"
          />
          <input
            type="text"
            placeholder="Artist (optional)"
            value={newTrackArtist}
            onChange={(e) => setNewTrackArtist(e.target.value)}
            className="w-full px-3 py-2 bg-cognac-950/50 border border-brass-800/30 rounded-lg text-sm text-ivory-100 placeholder:text-brass-300/30 focus:outline-none focus:ring-2 focus:ring-brass-600/50"
          />
          <input
            type="url"
            placeholder="Audio URL (mp3, wav, etc.)"
            value={newTrackUrl}
            onChange={(e) => setNewTrackUrl(e.target.value)}
            className="w-full px-3 py-2 bg-cognac-950/50 border border-brass-800/30 rounded-lg text-sm text-ivory-100 placeholder:text-brass-300/30 focus:outline-none focus:ring-2 focus:ring-brass-600/50"
          />
          <div className="flex gap-2">
            <button
              onClick={addTrack}
              disabled={!newTrackTitle.trim() || !newTrackUrl.trim()}
              className="flex-1 py-2 bg-gradient-to-r from-brass-600 to-cognac-600 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-brass-600/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Track
            </button>
            <button
              onClick={() => setShowAddTrack(false)}
              className="px-4 py-2 bg-cognac-950/40 text-brass-300 rounded-lg text-sm hover:bg-cognac-900/50 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Current Track Display */}
      {currentTrack ? (
        <>
          <div className="mb-4 p-4 bg-gradient-to-br from-cognac-950/40 to-burgundy-950/30 border border-brass-800/30 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-brass-600 to-cognac-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brass-200 truncate">{currentTrack.title}</p>
                <p className="text-xs text-brass-400/60 truncate">{currentTrack.artist}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1 mb-3">
              <label htmlFor="seek-slider" className="sr-only">Track progress</label>
              <input
                id="seek-slider"
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                className="w-full h-2 bg-cognac-900/40 rounded-lg appearance-none cursor-pointer accent-brass-500"
                aria-label="Seek track position"
              />
              <div className="flex justify-between text-xs text-brass-400/60">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={toggleRepeat}
                className={`p-2 rounded-lg transition-all ${
                  repeatMode !== 'off'
                    ? 'bg-brass-600/30 text-brass-300'
                    : 'text-brass-400/50 hover:text-brass-300'
                }`}
                title={`Repeat: ${repeatMode}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {repeatMode === 'one' && <span className="text-xs">1</span>}
              </button>
              <button
                onClick={playPrevious}
                disabled={playlist.length === 0}
                className="p-2 text-brass-300 hover:bg-cognac-900/40 rounded-lg transition-all disabled:opacity-30"
                title="Previous track"
                aria-label="Play previous track"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
                </svg>
              </button>
              <button
                onClick={togglePlay}
                className="p-4 rounded-full bg-gradient-to-br from-brass-600 to-cognac-600 text-white shadow-lg shadow-brass-600/40 hover:scale-105 transition-all"
                title={isPlaying ? "Pause" : "Play"}
                aria-label={isPlaying ? "Pause track" : "Play track"}
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <button
                onClick={playNext}
                disabled={playlist.length === 0}
                className="p-2 text-brass-300 hover:bg-cognac-900/40 rounded-lg transition-all disabled:opacity-30"
                title="Next track"
                aria-label="Play next track"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 18h2V6h-2v12zM6 18l8.5-6L6 6v12z" />
                </svg>
              </button>
              <button
                onClick={() => setIsShuffled(!isShuffled)}
                className={`p-2 rounded-lg transition-all ${
                  isShuffled
                    ? 'bg-brass-600/30 text-brass-300'
                    : 'text-brass-400/50 hover:text-brass-300'
                }`}
                title="Shuffle"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>

            {/* Volume Control */}
            <div className="mt-3 flex items-center gap-3">
              <svg className="w-4 h-4 text-brass-400/60 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5.889 16H2a1 1 0 01-1-1V9a1 1 0 011-1h3.889l5.294-4.332a.5.5 0 01.817.387v15.89a.5.5 0 01-.817.387L5.89 16z" />
              </svg>
              <label htmlFor="volume-slider" className="sr-only">Volume</label>
              <input
                id="volume-slider"
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                className="flex-1 h-2 bg-cognac-900/40 rounded-lg appearance-none cursor-pointer accent-brass-500"
                aria-label="Adjust volume"
              />
              <span className="text-xs text-brass-400 w-8 text-right">{volume}%</span>
            </div>
          </div>
        </>
      ) : null}

      {/* Error Message */}
      {error && (
        <div className="mb-3 p-2 bg-burgundy-950/30 border border-burgundy-700/40 rounded-lg">
          <p className="text-xs text-burgundy-300">{error}</p>
        </div>
      )}

      {/* Playlist */}
      <div className="flex-1 overflow-y-auto">
        <h4 className="text-sm font-semibold text-brass-300 mb-2 px-1">Playlist</h4>
        {playlist.length === 0 ? (
          <div className="text-center py-8 text-brass-300/40">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <p className="text-sm">No tracks yet</p>
            <p className="text-xs">Add tracks to build your playlist</p>
          </div>
        ) : (
          <div className="space-y-1">
            {playlist.map((track, index) => (
              <div
                key={track.id}
                onClick={() => {
                  setCurrentTrackIndex(index)
                  setIsPlaying(true)
                }}
                className={`group p-2 rounded-lg cursor-pointer transition-all ${
                  index === currentTrackIndex
                    ? 'bg-gradient-to-r from-brass-600/30 to-cognac-600/30 border border-brass-600/40'
                    : 'bg-cognac-950/20 hover:bg-cognac-900/30 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-ivory-100 truncate">{track.title}</p>
                    <p className="text-xs text-brass-400/60 truncate">{track.artist}</p>
                  </div>
                  {index === currentTrackIndex && isPlaying && (
                    <svg className="w-3 h-3 text-brass-400 animate-pulse flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeTrack(track.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-burgundy-400 hover:bg-burgundy-500/20 rounded transition-all flex-shrink-0"
                    title="Remove track"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
