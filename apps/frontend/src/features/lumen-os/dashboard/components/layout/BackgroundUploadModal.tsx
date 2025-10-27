import { useState, useRef } from 'react'

interface BackgroundUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (imageUrl: string) => void
  currentBackground: string | null
}

export default function BackgroundUploadModal({ isOpen, onClose, onUpload, currentBackground }: BackgroundUploadModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentBackground)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreviewUrl(result)
    }
    reader.readAsDataURL(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleSave = () => {
    if (previewUrl) {
      onUpload(previewUrl)
      onClose()
    }
  }

  const handleRemove = () => {
    setPreviewUrl(null)
    onUpload('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-8 animate-fadeIn">
      <div className="backdrop-blur-xl bg-gradient-to-br from-cognac-950/90 via-burgundy-950/90 to-forest-950/90 border-2 border-brass-700/30 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden m-4">
        {/* Header */}
        <div className="p-6 border-b border-brass-800/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-brass-200">Upload Background</h2>
              <p className="text-ivory-200/60 text-sm mt-1">Personalize your dashboard with a custom image</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-brass-900/30 rounded-lg transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6 text-brass-300/70 hover:text-brass-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Preview */}
          {previewUrl ? (
            <div className="relative mb-6 rounded-xl overflow-hidden aspect-video bg-cognac-950/30 border-2 border-brass-800/30">
              <img
                src={previewUrl}
                alt="Background preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cognac-950/80 to-transparent flex items-end p-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-brass-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <p className="text-brass-200 text-sm font-medium">Preview</p>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`mb-6 rounded-xl border-2 border-dashed aspect-video flex flex-col items-center justify-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-brass-500/50 bg-brass-500/10 backdrop-blur-xl'
                  : 'border-brass-700/30 hover:border-brass-600/50 bg-cognac-950/20 backdrop-blur-xl'
              }`}
            >
              <svg className="w-16 h-16 text-brass-400/40 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-brass-200 text-lg font-medium mb-1">Drop your image here</p>
              <p className="text-ivory-200/60 text-sm">or click to browse</p>
              <p className="text-brass-400/40 text-xs mt-2">JPG, PNG, GIF up to 10MB</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />

          {/* Info */}
          <div className="bg-brass-900/20 backdrop-blur-xl border border-brass-700/30 rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-brass-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-brass-200 font-medium text-sm mb-1.5">Tips for best results:</p>
                <ul className="text-ivory-200/70 text-xs space-y-1">
                  <li>• Use high-resolution images (1920x1080 or higher)</li>
                  <li>• Images are stored locally in your browser</li>
                  <li>• Dark or muted images work best for readability</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-cognac-950/40 backdrop-blur-xl px-6 py-4 flex justify-between items-center border-t border-brass-800/30">
          <button
            onClick={handleRemove}
            className="px-4 py-2 text-burgundy-400 hover:text-burgundy-300 hover:bg-burgundy-500/10 rounded-lg font-medium transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!previewUrl && !currentBackground}
          >
            Remove Background
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-cognac-950/40 hover:bg-cognac-900/50 text-ivory-100 rounded-lg font-medium backdrop-blur-xl border border-brass-800/30 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-gradient-to-r from-brass-600 to-cognac-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-brass-600/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              disabled={!previewUrl}
            >
              Save Background
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
