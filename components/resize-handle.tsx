import { cn } from "@/lib/utils"

interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void
  isDragging: boolean
}

export function ResizeHandle({ onMouseDown, isDragging }: ResizeHandleProps) {
  const ditheredPattern = `data:image/svg+xml,%3Csvg width='4' height='4' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='0.5' fill='%23000' opacity='0.25'/%3E%3C/svg%3E`

  return (
    <div
      onMouseDown={onMouseDown}
      className={cn(
        "absolute right-0 top-0 bottom-0 w-8 cursor-col-resize transition-opacity z-10",
        isDragging ? "opacity-100" : "opacity-0 hover:opacity-100",
      )}
      style={{
        backgroundImage: `url("${ditheredPattern}")`,
        backgroundSize: '4px 4px',
        backgroundRepeat: 'repeat',
      }}
    >
      {/* Larger grab area extending beyond visible pattern */}
      <div className="absolute -left-2 -right-2 top-0 bottom-0" />
    </div>
  )
}
