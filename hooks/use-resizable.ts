import { useState, useEffect, useRef, useCallback } from "react"

interface UseResizableOptions {
  initialWidth: number
  minWidth: number
  maxWidth: number
}

export function useResizable({ initialWidth, minWidth, maxWidth }: UseResizableOptions) {
  const [width, setWidth] = useState(initialWidth)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLElement | null>(null)
  const startXRef = useRef(0)
  const startWidthRef = useRef(0)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Find the container element (the one with the width style)
    const target = e.currentTarget as HTMLElement
    const container = target.closest('[style*="width"]') as HTMLElement
    
    if (container) {
      containerRef.current = container
      startXRef.current = e.clientX
      startWidthRef.current = width
    }
    
    setIsDragging(true)
  }, [width])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      
      // Calculate delta from start position
      const deltaX = e.clientX - startXRef.current
      const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidthRef.current + deltaX))
      
      setWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      containerRef.current = null
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
    }
  }, [isDragging, minWidth, maxWidth])

  return {
    width,
    isDragging,
    handleMouseDown,
  }
}
