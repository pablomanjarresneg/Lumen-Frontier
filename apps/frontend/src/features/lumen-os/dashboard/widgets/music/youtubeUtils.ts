/**
 * Extracts video ID from various YouTube URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null

  // Remove whitespace
  url = url.trim()

  // Handle shortened youtu.be URLs
  const shortMatch = url.match(/(?:youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/)
  if (shortMatch) return shortMatch[1]

  // Handle standard youtube.com URLs
  const standardMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
  if (standardMatch) return standardMatch[1]

  // Handle embed URLs
  const embedMatch = url.match(/(?:embed|v)\/([a-zA-Z0-9_-]{11})/)
  if (embedMatch) return embedMatch[1]

  // If it's just the ID (11 characters)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url

  return null
}

/**
 * Extracts playlist ID from YouTube URL
 * Supports: https://www.youtube.com/playlist?list=PLAYLIST_ID
 */
export function extractYouTubePlaylistId(url: string): string | null {
  if (!url) return null

  const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/)
  return match ? match[1] : null
}

/**
 * Validates if a string is a valid YouTube URL or ID
 */
export function isValidYouTubeUrl(url: string): boolean {
  if (!url) return false
  return extractYouTubeVideoId(url) !== null || extractYouTubePlaylistId(url) !== null
}

/**
 * Creates a clean display name from a YouTube URL
 */
export function getYouTubeDisplayName(url: string): string {
  const videoId = extractYouTubeVideoId(url)
  const playlistId = extractYouTubePlaylistId(url)

  if (playlistId) return `Playlist: ${playlistId.substring(0, 8)}...`
  if (videoId) return `Video: ${videoId}`
  return 'Unknown'
}
