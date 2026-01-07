'use client'

import { motion, MotionValue, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useState, useCallback } from 'react'

export interface CanvasItemData {
  id: string
  type: 'image' | 'document' | 'avatar'
  src: string
  focusSrc?: string // For click-to-expand (documents)
  label?: string
  description?: string
  x: number // Position relative to canvas center
  y: number
  width: number
  height: number
  depth: number // 0 = closest (fastest parallax), 1 = furthest (slowest)
  rotation?: number
}

interface CanvasItemProps {
  item: CanvasItemData
  canvasX: MotionValue<number>
  canvasY: MotionValue<number>
  onItemClick?: (item: CanvasItemData) => void
  isDragging: boolean
}

export function CanvasItem({ 
  item, 
  canvasX, 
  canvasY, 
  onItemClick,
  isDragging 
}: CanvasItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [clickStartPos, setClickStartPos] = useState<{ x: number; y: number } | null>(null)

  // Parallax: items with lower depth move more (closer to viewer)
  // Depth 0 = 1.0x movement, Depth 1 = 0.3x movement
  const parallaxFactor = 1 - (item.depth * 0.7)
  
  // Transform canvas position to item position with parallax
  const itemX = useTransform(canvasX, (v) => item.x + (v * parallaxFactor))
  const itemY = useTransform(canvasY, (v) => item.y + (v * parallaxFactor))

  // Handle click detection (distinguish from drag)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setClickStartPos({ x: e.clientX, y: e.clientY })
  }, [])

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!clickStartPos) return
    
    const dx = Math.abs(e.clientX - clickStartPos.x)
    const dy = Math.abs(e.clientY - clickStartPos.y)
    
    // Only trigger click if mouse hasn't moved much (not a drag)
    if (dx < 5 && dy < 5 && onItemClick && item.focusSrc) {
      onItemClick(item)
    }
    
    setClickStartPos(null)
  }, [clickStartPos, onItemClick, item])

  const isClickable = !!item.focusSrc

  return (
    <motion.div
      className={`canvas-item canvas-item--${item.type} ${isClickable ? 'canvas-item--clickable' : ''}`}
      style={{
        x: itemX,
        y: itemY,
        width: item.width,
        height: item.height,
        rotate: item.rotation || 0,
        zIndex: Math.round((1 - item.depth) * 10), // Closer items on top
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setClickStartPos(null)
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      whileHover={isClickable ? { scale: 1.02 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div className="canvas-item__image-wrapper">
        <Image
          src={item.src}
          alt={item.label || 'Canvas item'}
          fill
          sizes={`${item.width}px`}
          style={{ objectFit: 'contain' }}
          draggable={false}
          priority={item.depth < 0.3} // Prioritize closer items
        />
      </div>

      {/* Label on hover */}
      {item.label && (
        <motion.div
          className="canvas-item__label"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 8 }}
          transition={{ duration: 0.2 }}
        >
          <span className="canvas-item__label-text">{item.label}</span>
          {item.description && (
            <span className="canvas-item__label-desc">{item.description}</span>
          )}
        </motion.div>
      )}

      {/* Click indicator for documents */}
      {isClickable && isHovered && (
        <motion.div
          className="canvas-item__click-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Click to view
        </motion.div>
      )}
    </motion.div>
  )
}

