"use client"

import { motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"

interface Book3DProps {
  title: string
  author: string
  coverImage?: string
  spineImage?: string
  isbn?: string  // For fetching covers from Open Library
  size?: "sm" | "md" | "lg"
  aspectRatio?: number  // Width/height ratio (e.g., 0.65 for standard books, 1.0 for square)
  isSelected?: boolean
  leanAngle?: number
  showCoverByDefault?: boolean
  onClick?: () => void
}

// Get cover URL from Open Library
function getOpenLibraryCover(isbn: string, size: 'S' | 'M' | 'L' = 'M'): string {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`
}

// Generate a consistent color based on title string
function getBookColor(title: string): { bg: string; accent: string; text: string } {
  const colors = [
    { bg: '#8B4513', accent: '#D2691E', text: '#F5DEB3' }, // Saddle brown
    { bg: '#2F4F4F', accent: '#5F9EA0', text: '#E0FFFF' }, // Dark slate
    { bg: '#4A0E0E', accent: '#8B0000', text: '#FFE4E1' }, // Dark red
    { bg: '#1C3D5A', accent: '#4682B4', text: '#B0E0E6' }, // Navy
    { bg: '#3D2914', accent: '#8B7355', text: '#FAEBD7' }, // Coffee
    { bg: '#2E0854', accent: '#6B238E', text: '#E6E6FA' }, // Purple
    { bg: '#1A3C2A', accent: '#2E8B57', text: '#98FB98' }, // Forest
    { bg: '#4A3728', accent: '#8B7355', text: '#FFDEAD' }, // Walnut
  ]
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

// Extract dominant color from an image using canvas sampling
// Prioritizes saturated, vibrant colors over grays/whites/blacks
function extractDominantColor(img: HTMLImageElement): { bg: string; accent: string; text: string } | null {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return null

    // Sample at a small size for performance
    const sampleSize = 64
    canvas.width = sampleSize
    canvas.height = sampleSize
    
    // Draw image to canvas
    ctx.drawImage(img, 0, 0, sampleSize, sampleSize)

    let imageData: ImageData
    try {
      imageData = ctx.getImageData(0, 0, sampleSize, sampleSize)
    } catch {
      // CORS error - can't read pixel data
      return null
    }
    
    const data = imageData.data

    // Color bucket approach with saturation weighting
    const colorBuckets: { [key: string]: { r: number; g: number; b: number; count: number; saturationSum: number } } = {}

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const a = data[i + 3]

      // Skip transparent pixels
      if (a < 128) continue

      // Calculate brightness and saturation
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      const brightness = (r + g + b) / 3
      const saturation = max === 0 ? 0 : (max - min) / max

      // Skip very light colors (whites) and very dark colors (blacks)
      if (brightness > 230 || brightness < 25) continue
      
      // Skip very desaturated colors (grays)
      if (saturation < 0.15) continue

      // Create bucket key by rounding to nearest 24 for finer granularity
      const bucketR = Math.floor(r / 24) * 24
      const bucketG = Math.floor(g / 24) * 24
      const bucketB = Math.floor(b / 24) * 24
      const key = `${bucketR}-${bucketG}-${bucketB}`

      if (!colorBuckets[key]) {
        colorBuckets[key] = { r: 0, g: 0, b: 0, count: 0, saturationSum: 0 }
      }
      colorBuckets[key].r += r
      colorBuckets[key].g += g
      colorBuckets[key].b += b
      colorBuckets[key].count++
      colorBuckets[key].saturationSum += saturation
    }

    // Find the bucket with highest weighted score (count * avg saturation)
    let bestBucket: { r: number; g: number; b: number; count: number; saturationSum: number } | null = null
    let bestScore = 0

    for (const key in colorBuckets) {
      const bucket = colorBuckets[key]
      const avgSaturation = bucket.saturationSum / bucket.count
      // Weight by both count and saturation - prefer vibrant colors
      const score = bucket.count * (0.5 + avgSaturation * 0.5)
      
      if (score > bestScore) {
        bestScore = score
        bestBucket = bucket
      }
    }

    if (!bestBucket || bestBucket.count === 0) return null

    // Calculate average color in best bucket
    const avgR = Math.round(bestBucket.r / bestBucket.count)
    const avgG = Math.round(bestBucket.g / bestBucket.count)
    const avgB = Math.round(bestBucket.b / bestBucket.count)

    // Create darker version for bg, original for accent
    const darkenFactor = 0.7
    const bgR = Math.round(avgR * darkenFactor)
    const bgG = Math.round(avgG * darkenFactor)
    const bgB = Math.round(avgB * darkenFactor)

    // Calculate text color based on brightness
    const brightness = (avgR * 299 + avgG * 587 + avgB * 114) / 1000
    const textColor = brightness > 128 ? '#1a1a1a' : '#f5f5f5'

    return {
      bg: `rgb(${bgR}, ${bgG}, ${bgB})`,
      accent: `rgb(${avgR}, ${avgG}, ${avgB})`,
      text: textColor,
    }
  } catch {
    return null
  }
}

export function Book3D({ 
  title, 
  author, 
  coverImage, 
  spineImage, 
  isbn,
  size = "md",
  aspectRatio,
  isSelected = false,
  leanAngle = 0,
  showCoverByDefault = false,
  onClick 
}: Book3DProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [coverLoaded, setCoverLoaded] = useState(false)
  const [coverError, setCoverError] = useState(false)
  const [detectedAspectRatio, setDetectedAspectRatio] = useState<number | null>(null)
  const [extractedColor, setExtractedColor] = useState<{ bg: string; accent: string; text: string } | null>(null)
  const fallbackColor = getBookColor(title)
  // Use extracted color from cover if available, otherwise fallback to hash-based color
  const bookColor = extractedColor || fallbackColor
  
  // Determine cover source
  const hasLocalImages = coverImage && spineImage
  const openLibraryCover = isbn ? getOpenLibraryCover(isbn, size === 'sm' ? 'M' : 'L') : null
  const effectiveCover = coverImage || (isbn && !coverError ? openLibraryCover : null)
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

  // Base size configurations (standard book aspect ratio ~0.64)
  const baseSizeConfig = {
    sm: { height: 140, depth: 24, perspective: 600 },
    md: { height: 218, depth: 32, perspective: 800 },
    lg: { height: 280, depth: 40, perspective: 1000 },
  }

  // Use provided aspectRatio, detected from image, or default (0.64 standard book)
  const effectiveAspectRatio = aspectRatio ?? detectedAspectRatio ?? 0.64
  
  // Calculate width based on height and aspect ratio
  const baseConfig = baseSizeConfig[size]
  const config = {
    ...baseConfig,
    width: Math.round(baseConfig.height * effectiveAspectRatio),
  }
  const halfDepth = config.depth / 2

  // Spine width when showing spine (narrower view)
  const spineViewWidth = config.depth + 8

  // Calculate Y rotation based on state
  const getRotationY = () => {
    if (!isSelected) {
      if (showCoverByDefault) {
        // Cover view - show front with slight angle, more on hover
        if (isHovered) return 25
        return 15
      }
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

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isSelected) return
    const touch = e.touches[0]
    setIsDragging(true)
    setDragStartX(touch.clientX)
    setBaseRotation(dragRotation)
  }

  useEffect(() => {
    if (!isDragging || !isSelected) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartX
      const rotationDelta = (deltaX / 150) * 180
      setDragRotation(baseRotation + rotationDelta)
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      const deltaX = touch.clientX - dragStartX
      const rotationDelta = (deltaX / 150) * 180
      setDragRotation(baseRotation + rotationDelta)
    }

    const handleDragEnd = () => {
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
    window.addEventListener('mouseup', handleDragEnd)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleDragEnd)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleDragEnd)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleDragEnd)
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
  const containerWidth = isSelected 
    ? config.width + config.depth 
    : showCoverByDefault 
      ? config.width + config.depth / 2
      : spineViewWidth

  return (
    <motion.div
      ref={containerRef}
      className="book-3d"
      style={{
        width: containerWidth,
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
      onTouchStart={handleTouchStart}
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
          {effectiveCover ? (
            <img
              src={effectiveCover}
              alt={`${title} cover`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onLoad={(e) => {
                setCoverLoaded(true)
                const img = e.currentTarget
                
                // Auto-detect aspect ratio from loaded image if not explicitly set
                if (!aspectRatio && img.naturalWidth && img.naturalHeight) {
                  const ratio = img.naturalWidth / img.naturalHeight
                  setDetectedAspectRatio(ratio)
                }
                
                // Extract dominant color from cover for spine
                const dominantColor = extractDominantColor(img)
                if (dominantColor) {
                  setExtractedColor(dominantColor)
                }
              }}
              onError={() => setCoverError(true)}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: `linear-gradient(145deg, ${bookColor.bg} 0%, ${bookColor.accent} 100%)`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: size === "sm" ? "8px" : "12px",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  fontSize: size === "sm" ? "9px" : "12px",
                  fontWeight: 600,
                  color: bookColor.text,
                  lineHeight: 1.2,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontSize: size === "sm" ? "7px" : "9px",
                  color: bookColor.text,
                  opacity: 0.8,
                }}
              >
                {author}
              </div>
            </div>
          )}
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
          {hasLocalImages ? (
            <img
              src={spineImage}
              alt={`${title} spine`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: `linear-gradient(to right, ${bookColor.bg}, ${bookColor.accent})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                transform: "rotate(180deg)",
                padding: "8px 2px",
                boxSizing: "border-box",
              }}
            >
              <span
                style={{
                  fontSize: size === "sm" ? "6px" : "8px",
                  color: bookColor.text,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxHeight: "100%",
                }}
              >
                {title}
              </span>
            </div>
          )}
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

        {/* Back Cover - matches spine color */}
        <div
          className="book-3d__back"
          style={{
            position: "absolute",
            width: config.width,
            height: config.height,
            transform: `translateZ(-${halfDepth}px) rotateY(180deg)`,
            background: `linear-gradient(135deg, ${bookColor.bg} 0%, ${bookColor.accent} 100%)`,
            borderRadius: "2px 0 0 2px",
          }}
        />
      </motion.div>
    </motion.div>
  )
}
