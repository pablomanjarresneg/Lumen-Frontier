interface Props {
  isEditMode: boolean
  isMinimized: boolean
  onResizeStart: (e: React.MouseEvent) => void
}

export default function ResizeHandle({ isEditMode, isMinimized, onResizeStart }: Props) {
  if (!isEditMode || isMinimized) return null

  return (
    <div
      className="resize-handle absolute bottom-0 right-0 w-8 h-8 cursor-nwse-resize z-20 group touch-none"
      onMouseDown={onResizeStart}
    >
      {/* Larger invisible hit area */}
      <div className="absolute inset-0 -m-2"></div>

      {/* Visual indicator */}
      <div className="absolute bottom-1 right-1 flex flex-col gap-0.5 pointer-events-none">
        <div className="flex gap-0.5">
          <div className="w-1 h-1 bg-white/40 rounded-full group-hover:bg-white/80 transition-colors"></div>
          <div className="w-1 h-1 bg-white/40 rounded-full group-hover:bg-white/80 transition-colors"></div>
        </div>
        <div className="flex gap-0.5">
          <div className="w-1 h-1 bg-white/40 rounded-full group-hover:bg-white/80 transition-colors"></div>
          <div className="w-1 h-1 bg-white/40 rounded-full group-hover:bg-white/80 transition-colors"></div>
        </div>
      </div>
    </div>
  )
}
