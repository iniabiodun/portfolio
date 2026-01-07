"use client"

import { motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"

interface Book3DProps {
  title: string
  author: string
  coverImage: string
  spineImage: string
  size?: "sm" | "md" | "lg"
  isSelected?: boolean
  leanAngle?: number
  onClick?: () => void
}

export function Book3D({ 
  title, 
  author, 
  coverImage, 
  spineImage, 
  size = "md",
  isSelected = false,
  leanAngle = 0,
  onClick 
}: Book3DProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [hoverSide, setHoverSide] = useState<'left' | 'right' | 'center'>('center')
  const [tiltX, setTiltX] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Drag state (only active when selected)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragRotation, setDragRotation] = useState(12)
  const [baseRotation, setBaseRotation] = useState(12)

  useEffect(() => {
    if (isSelected) {
      setDragRotation(12)
    }
  }, [isSelected])

  // Size configurations
  const sizeConfig = {
    sm: { width: 90, height: 140, depth: 24, perspective: 600 },
    md: { width: 140, height: 218, depth: 32, perspective: 800 },
    lg: { width: 180, height: 280, depth: 40, perspective: 1000 },
  }

  const config = sizeConfig[size]
  const halfDepth = config.depth / 2

  // Spine width when showing spine (narrower view)
  const spineViewWidth = config.depth + 8

  // Calculate Y rotation based on state
  const getRotationY = () => {
    if (!isSelected) {
      // Spine view with peek on hover
      if (isHovered) return 70
      return 90
    }
    // Selected: full interaction
    if (isDragging) return dragRotation
    if (!isHovered) return dragRotation
    if (hoverSide === 'left') return dragRotation + 28
    if (hoverSide === 'right') return dragRotation - 42
    return dragRotation
  }

  const getRotationZ = () => {
    if (isSelected) return 0
    return leanAngle
  }

  const getRotationX = () => {
    if (!isSelected) return 0
    if (isHovered && !isDragging) return tiltX
    return 0
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelected) return
    e.preventDefault()
    setIsDragging(true)
    setDragStartX(e.clientX)
    setBaseRotation(dragRotation)
  }

  useEffect(() => {
    if (!isDragging || !isSelected) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartX
      const rotationDelta = (deltaX / 150) * 180
      setDragRotation(baseRotation + rotationDelta)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      const currentRotation = dragRotation % 360
      const normalizedRotation = currentRotation < 0 ? currentRotation + 360 : currentRotation
      
      let snappedRotation: number
      if (normalizedRotation < 51) {
        snappedRotation = 12
      } else if (normalizedRotation < 141) {
        snappedRotation = 90
      } else if (normalizedRotation < 231) {
        snappedRotation = 192
      } else if (normalizedRotation < 321) {
        snappedRotation = 270
      } else {
        snappedRotation = 12
      }
      
      const fullRotations = Math.floor(dragRotation / 360) * 360
      setDragRotation(fullRotations + snappedRotation)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isSelected, dragStartX, baseRotation, dragRotation])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || !isSelected) return
    
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const width = rect.width
    const height = rect.height
    const relativeX = x / width
    const relativeY = y / height

    if (relativeX < 0.35) {
      setHoverSide('left')
    } else if (relativeX > 0.65) {
      setHoverSide('right')
    } else {
      setHoverSide('center')
    }

    const tilt = (relativeY - 0.5) * 10
    setTiltX(tilt)
  }

  // Container dimensions - animate width for smooth transition
  const containerWidth = isSelected ? config.width + config.depth : spineViewWidth

  return (
    <motion.div
      ref={containerRef}
      className="book-3d"
      style={{
        height: config.height,
        perspective: config.perspective,
        perspectiveOrigin: "50% 50%",
        cursor: isSelected ? (isDragging ? "grabbing" : "grab") : "pointer",
        userSelect: "none",
        overflow: "visible",
      }}
      animate={{
        width: containerWidth,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 28,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        if (!isDragging) {
          setIsHovered(false)
          setHoverSide('center')
          setTiltX(0)
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        if (!isDragging && onClick) {
          onClick()
        }
      }}
    >
      <motion.div
        className="book-3d__inner"
        style={{
          width: config.width,
          height: config.height,
          position: "absolute",
          left: "50%",
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateY: getRotationY(),
          rotateZ: getRotationZ(),
          rotateX: getRotationX(),
          x: "-50%", // Center the book
          scale: isSelected ? 1.02 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: isDragging ? 300 : 200,
          damping: isDragging ? 30 : 22,
        }}
      >
        {/* Front Cover */}
        <motion.div
          className="book-3d__cover"
          style={{
            position: "absolute",
            width: config.width,
            height: config.height,
            transform: `translateZ(${halfDepth}px)`,
            backfaceVisibility: "hidden",
            borderRadius: "0 2px 2px 0",
            overflow: "hidden",
          }}
          animate={{
            boxShadow: isSelected 
              ? "2px 4px 16px rgba(0, 0, 0, 0.2)" 
              : "1px 2px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <img
            src={coverImage}
            alt={`${title} cover`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </motion.div>

        {/* Spine */}
        <div
          className="book-3d__spine"
          style={{
            position: "absolute",
            width: config.depth,
            height: config.height,
            left: -halfDepth,
            top: 0,
            transform: `rotateY(-90deg)`,
            transformOrigin: "center center",
            backfaceVisibility: "hidden",
            overflow: "hidden",
            boxShadow: isSelected ? "none" : "0 2px 8px rgba(0, 0, 0, 0.15)",
          }}
        >
          <img
            src={spineImage}
            alt={`${title} spine`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Pages - right edge */}
        <div
          className="book-3d__pages"
          style={{
            position: "absolute",
            width: config.depth,
            height: config.height - 4,
            left: config.width - halfDepth,
            top: 2,
            transformOrigin: "center center",
            transform: `rotateY(90deg)`,
            background: `repeating-linear-gradient(
              to bottom,
              #faf8f5 0px,
              #faf8f5 1px,
              #f2ede6 1px,
              #f2ede6 2px
            )`,
          }}
        />

        {/* Top edge */}
        <div
          className="book-3d__top"
          style={{
            position: "absolute",
            width: config.width - 2,
            height: config.depth,
            left: 1,
            top: 0,
            transformOrigin: "top center",
            transform: `rotateX(90deg) translateY(-${halfDepth}px)`,
            background: "linear-gradient(to right, #f2ede6, #faf8f5, #f2ede6)",
          }}
        />

        {/* Bottom edge */}
        <div
          className="book-3d__bottom"
          style={{
            position: "absolute",
            width: config.width - 2,
            height: config.depth,
            left: 1,
            bottom: 0,
            transformOrigin: "bottom center",
            transform: `rotateX(-90deg) translateY(${halfDepth}px)`,
            background: "linear-gradient(to right, #f2ede6, #faf8f5, #f2ede6)",
          }}
        />

        {/* Back Cover */}
        <div
          className="book-3d__back"
          style={{
            position: "absolute",
            width: config.width,
            height: config.height,
            transform: `translateZ(-${halfDepth}px) rotateY(180deg)`,
            background: "linear-gradient(135deg, #8b7355 0%, #6b5344 100%)",
            borderRadius: "2px 0 0 2px",
          }}
        />
      </motion.div>
    </motion.div>
  )
}
