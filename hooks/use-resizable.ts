import { useState, useEffect, useRef } from "react"

interface UseResizableOptions {
  initialWidth: number
  minWidth: number
  maxWidth: number
  offsetX?: number // Optional offset for calculating width (e.g., sidebar width for nested panels)
}

export function useResizable({ initialWidth, minWidth, maxWidth, offsetX = 0 }: UseResizableOptions) {
  const [width, setWidth] = useState(initialWidth)
  const [isDragging, setIsDragging] = useState(false)
  const rafRef = useRef<number | null>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        // Cancel any pending animation frame
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current)
        }
        // Schedule width update on next animation frame for smoother performance
        rafRef.current = requestAnimationFrame(() => {
          const newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX - offsetX))
          setWidth(newWidth)
        })
      }
    }

    const handleMouseUp = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [isDragging, minWidth, maxWidth, offsetX])

  return {
    width,
    isDragging,
    handleMouseDown,
  }
}
