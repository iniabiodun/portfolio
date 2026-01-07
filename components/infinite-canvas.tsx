'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useCanvasDrag } from '@/hooks/use-canvas-drag'
import { CanvasItem, CanvasItemData } from './canvas-item'
import { useLighting } from '@/lib/lighting-context'

interface InfiniteCanvasProps {
  items: CanvasItemData[]
  centerImage?: string // Avatar/person image at center
}

export function InfiniteCanvas({ items, centerImage }: InfiniteCanvasProps) {
  const { mode } = useLighting()
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [expandedItem, setExpandedItem] = useState<CanvasItemData | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const { x, y, handlers } = useCanvasDrag({
    friction: 0.92,
    springStiffness: 80,
    springDamping: 25,
  })

  // Track container size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Wrap handlers to track dragging state
  const wrappedHandlers = {
    onMouseDown: (e: React.MouseEvent) => {
      setIsDragging(true)
      handlers.onMouseDown(e)
      
      const handleMouseUp = () => {
        setIsDragging(false)
        document.removeEventListener('mouseup', handleMouseUp)
      }
      document.addEventListener('mouseup', handleMouseUp)
    },
    onTouchStart: (e: React.TouchEvent) => {
      setIsDragging(true)
      handlers.onTouchStart(e)
      
      const handleTouchEnd = () => {
        setIsDragging(false)
        document.removeEventListener('touchend', handleTouchEnd)
      }
      document.addEventListener('touchend', handleTouchEnd)
    },
  }

  // Handle item click
  const handleItemClick = useCallback((item: CanvasItemData) => {
    if (item.focusSrc) {
      setExpandedItem(item)
    }
  }, [])

  // Close expanded view
  const handleCloseExpanded = useCallback(() => {
    setExpandedItem(null)
  }, [])

  // Calculate canvas center offset
  const centerX = containerSize.width / 2
  const centerY = containerSize.height / 2

  return (
    <div 
      ref={containerRef}
      className={`infinite-canvas infinite-canvas--${mode}`}
      {...wrappedHandlers}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Ambient background gradient */}
      <div className="infinite-canvas__bg" />

      {/* Canvas container - moves with drag */}
      <motion.div
        className="infinite-canvas__content"
        style={{
          x,
          y,
          left: centerX,
          top: centerY,
        }}
      >
        {/* Center avatar image */}
        {centerImage && (
          <motion.div
            className="infinite-canvas__center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Image
              src={centerImage}
              alt="Center avatar"
              width={280}
              height={350}
              style={{ objectFit: 'contain' }}
              priority
              draggable={false}
            />
          </motion.div>
        )}

        {/* Canvas items with parallax */}
        {items.map((item, index) => (
          <CanvasItem
            key={item.id}
            item={item}
            canvasX={x}
            canvasY={y}
            onItemClick={handleItemClick}
            isDragging={isDragging}
          />
        ))}
      </motion.div>

      {/* Drag hint */}
      <motion.div
        className="infinite-canvas__hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: isDragging ? 0 : 1 }}
        transition={{ delay: 1 }}
      >
        Drag to explore
      </motion.div>

      {/* Expanded document overlay */}
      <AnimatePresence>
        {expandedItem && (
          <motion.div
            className="infinite-canvas__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseExpanded}
          >
            <motion.div
              className="infinite-canvas__expanded"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="infinite-canvas__close"
                onClick={handleCloseExpanded}
                aria-label="Close"
              >
                ×
              </button>
              
              <div className="infinite-canvas__expanded-content">
                <Image
                  src={expandedItem.focusSrc || expandedItem.src}
                  alt={expandedItem.label || 'Expanded view'}
                  width={800}
                  height={600}
                  style={{ objectFit: 'contain', maxHeight: '80vh', width: 'auto' }}
                />
                
                {expandedItem.label && (
                  <div className="infinite-canvas__expanded-info">
                    <h3>{expandedItem.label}</h3>
                    {expandedItem.description && (
                      <p>{expandedItem.description}</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

