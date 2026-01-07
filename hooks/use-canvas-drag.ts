'use client'

import { useMotionValue, useSpring, MotionValue } from 'framer-motion'
import { useRef, useEffect, useCallback } from 'react'

interface UseCanvasDragOptions {
  friction?: number
  springStiffness?: number
  springDamping?: number
}

interface UseCanvasDragReturn {
  x: MotionValue<number>
  y: MotionValue<number>
  isDragging: boolean
  handlers: {
    onMouseDown: (e: React.MouseEvent) => void
    onTouchStart: (e: React.TouchEvent) => void
  }
}

export function useCanvasDrag(options: UseCanvasDragOptions = {}): UseCanvasDragReturn {
  const {
    friction = 0.95,
    springStiffness = 100,
    springDamping = 30,
  } = options

  // Raw position values
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  // Smoothed position with spring physics
  const x = useSpring(rawX, { stiffness: springStiffness, damping: springDamping })
  const y = useSpring(rawY, { stiffness: springStiffness, damping: springDamping })

  // Refs for tracking drag state
  const isDraggingRef = useRef(false)
  const lastPosRef = useRef({ x: 0, y: 0 })
  const velocityRef = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef<number>()

  // Momentum animation
  const animateMomentum = useCallback(() => {
    if (isDraggingRef.current) return

    const vx = velocityRef.current.x
    const vy = velocityRef.current.y

    // Stop if velocity is negligible
    if (Math.abs(vx) < 0.1 && Math.abs(vy) < 0.1) {
      velocityRef.current = { x: 0, y: 0 }
      return
    }

    // Apply friction
    velocityRef.current.x *= friction
    velocityRef.current.y *= friction

    // Update position
    rawX.set(rawX.get() + velocityRef.current.x)
    rawY.set(rawY.get() + velocityRef.current.y)

    animationFrameRef.current = requestAnimationFrame(animateMomentum)
  }, [friction, rawX, rawY])

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingRef.current = true
    lastPosRef.current = { x: e.clientX, y: e.clientY }
    velocityRef.current = { x: 0, y: 0 }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return

      const deltaX = e.clientX - lastPosRef.current.x
      const deltaY = e.clientY - lastPosRef.current.y

      velocityRef.current = { x: deltaX, y: deltaY }
      lastPosRef.current = { x: e.clientX, y: e.clientY }

      rawX.set(rawX.get() + deltaX)
      rawY.set(rawY.get() + deltaY)
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      
      // Start momentum animation
      animateMomentum()
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [rawX, rawY, animateMomentum])

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    isDraggingRef.current = true
    lastPosRef.current = { x: touch.clientX, y: touch.clientY }
    velocityRef.current = { x: 0, y: 0 }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return
      const touch = e.touches[0]

      const deltaX = touch.clientX - lastPosRef.current.x
      const deltaY = touch.clientY - lastPosRef.current.y

      velocityRef.current = { x: deltaX, y: deltaY }
      lastPosRef.current = { x: touch.clientX, y: touch.clientY }

      rawX.set(rawX.get() + deltaX)
      rawY.set(rawY.get() + deltaY)
    }

    const handleTouchEnd = () => {
      isDraggingRef.current = false
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
      
      // Start momentum animation
      animateMomentum()
    }

    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('touchend', handleTouchEnd)
  }, [rawX, rawY, animateMomentum])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return {
    x,
    y,
    isDragging: isDraggingRef.current,
    handlers: {
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart,
    },
  }
}

