import { X, ArrowLeft } from "lucide-react"
import type React from "react"
import { cn } from "@/lib/utils"

interface ContentPanelProps {
  onClose: () => void
  children: React.ReactNode
  onMouseDown?: (e: React.MouseEvent) => void
  isDragging?: boolean
}

export function ContentPanel({ onClose, children, onMouseDown, isDragging }: ContentPanelProps) {
  const ditheredPattern = `data:image/svg+xml,%3Csvg width='4' height='4' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='0.5' fill='%23000' opacity='0.25'/%3E%3C/svg%3E`

  return (
    <main className="flex-1 p-6 pt-4 md:p-16 max-w-3xl overflow-y-auto max-md:pt-16 relative h-screen">
      {/* Mobile back button */}
      <div className="md:hidden mb-6">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors -ml-1 py-2"
          aria-label="Back to library"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Left resize handle - desktop only */}
      {onMouseDown && (
        <div
          onMouseDown={onMouseDown}
          className={cn(
            "absolute left-0 top-0 bottom-0 w-16 cursor-col-resize transition-opacity z-[5] max-md:hidden",
            isDragging ? "opacity-100" : "opacity-0 hover:opacity-100",
          )}
          style={{
            backgroundImage: `url("${ditheredPattern}")`,
            backgroundSize: '4px 4px',
            backgroundRepeat: 'repeat',
          }}
        />
      )}
      
      {/* Desktop close button */}
      <div className="absolute top-4 right-4 max-md:hidden">
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Close reading panel"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      
      {children}
    </main>
  )
}
