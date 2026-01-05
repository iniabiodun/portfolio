"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

interface SpatialArtworkProps {
  artworkSrc: string
  frameSrc?: string
  title: string
  year: number
  description?: string
  description2?: string
}

export function SpatialArtwork({
  artworkSrc,
  frameSrc,
  title,
  year,
  description,
  description2,
}: SpatialArtworkProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isGyroscopeEnabled, setIsGyroscopeEnabled] = useState(false)
  const [hasGyroscope, setHasGyroscope] = useState(false)
  const [needsPermission, setNeedsPermission] = useState(false)

  // Motion values for tilt
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring physics for smooth animation
  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig)

  // Shadow movement
  const shadowX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), springConfig)
  const shadowY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20, 20]), springConfig)

  // Artwork parallax movement (moves opposite to create depth)
  const artworkX = useSpring(useTransform(mouseX, [-0.5, 0.5], [15, -15]), springConfig)
  const artworkY = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig)

  // Shine position
  const shineX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-50, 50]), springConfig)
  const shineY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-50, 50]), springConfig)
  const shineOpacity = useSpring(useTransform(mouseX, [-0.5, 0, 0.5], [0.15, 0, 0.15]), springConfig)

  // Check for gyroscope support
  useEffect(() => {
    const checkGyroscope = () => {
      if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
        setHasGyroscope(true)
        // Check if iOS requires permission
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
          setNeedsPermission(true)
        } else {
          // Android or older iOS - enable directly
          enableGyroscope()
        }
      }
    }

    // Only check on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (isMobile) {
      checkGyroscope()
    }
  }, [])

  const enableGyroscope = () => {
    setIsGyroscopeEnabled(true)

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma === null || event.beta === null) return

      // gamma: left-right tilt (-90 to 90)
      // beta: front-back tilt (-180 to 180)
      const x = Math.max(-0.5, Math.min(0.5, event.gamma / 30))
      const y = Math.max(-0.5, Math.min(0.5, (event.beta - 45) / 30))

      mouseX.set(x)
      mouseY.set(y)
    }

    window.addEventListener('deviceorientation', handleOrientation)
    return () => window.removeEventListener('deviceorientation', handleOrientation)
  }

  const requestGyroscopePermission = async () => {
    try {
      const permission = await (DeviceOrientationEvent as any).requestPermission()
      if (permission === 'granted') {
        enableGyroscope()
      }
    } catch (error) {
      console.error('Gyroscope permission denied:', error)
    }
  }

  // Mouse tracking for desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isGyroscopeEnabled) return

    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const x = (e.clientX - centerX) / rect.width
    const y = (e.clientY - centerY) / rect.height

    mouseX.set(Math.max(-0.5, Math.min(0.5, x)))
    mouseY.set(Math.max(-0.5, Math.min(0.5, y)))
  }

  const handleMouseLeave = () => {
    if (isGyroscopeEnabled) return
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Gyroscope permission button for iOS */}
      {hasGyroscope && needsPermission && !isGyroscopeEnabled && (
        <button
          onClick={requestGyroscopePermission}
          className="mb-6 px-4 py-2 text-xs uppercase tracking-widest text-white/60 border border-white/20 rounded-full hover:bg-white/10 transition-colors"
        >
          Enable Spatial View
        </button>
      )}

      {/* Artwork container */}
      <div
        ref={containerRef}
        className="relative cursor-grab active:cursor-grabbing"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: 1200 }}
      >
        {/* Dynamic shadow - behind everything */}
        <motion.div
          className="absolute rounded-lg"
          style={{
            inset: '10%',
            x: shadowX,
            y: shadowY,
            background: 'rgba(0, 0, 0, 0.5)',
            filter: 'blur(40px)',
            zIndex: -1,
          }}
        />

        {/* Main tiltable container */}
        <motion.div
          className="relative"
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
        >
          {frameSrc ? (
            <>
              {/* LAYER 1: Frame sets the size (z-30) */}
              <img
                src={frameSrc}
                alt=""
                className="block"
                style={{
                  maxWidth: '50vw',
                  maxHeight: '55vh',
                  width: 'auto',
                  height: 'auto',
                  position: 'relative',
                  zIndex: 30,
                }}
                draggable={false}
              />

              {/* LAYER 2: Artwork clipped to oval, behind frame (z-10) - with parallax */}
              <motion.div
                className="absolute inset-0"
                style={{
                  zIndex: 10,
                  clipPath: 'ellipse(34% 42% at 50% 50%)', // Clip to match frame's inner oval
                  overflow: 'hidden',
                  x: artworkX,  // Parallax movement
                  y: artworkY,
                  willChange: 'transform',
                }}
              >
                <img
                  src={artworkSrc}
                  alt={title}
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: 'center 40%',
                    imageRendering: 'auto',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)', // Force GPU rendering for sharper image
                  }}
                  draggable={false}
                />
              </motion.div>

              {/* LAYER 3: Shine on artwork area, below frame (z-20) */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at calc(50% + ${shineX}px) calc(50% + ${shineY}px), rgba(255,255,255,0.12), transparent 40%)`,
                  opacity: shineOpacity,
                  zIndex: 20,
                  clipPath: 'ellipse(34% 42% at 50% 50%)', // Same clip as artwork
                }}
              />
            </>
          ) : (
            <>
              <img
                src={artworkSrc}
                alt={title}
                className="block rounded-sm"
                style={{
                  maxWidth: '50vw',
                  maxHeight: '55vh',
                  width: 'auto',
                  height: 'auto',
                }}
                draggable={false}
              />

              {/* Shine/reflection overlay */}
              <motion.div
                className="absolute inset-0 pointer-events-none overflow-hidden rounded-sm"
                style={{
                  background: `radial-gradient(circle at calc(50% + ${shineX}px) calc(50% + ${shineY}px), rgba(255,255,255,0.2), transparent 50%)`,
                  opacity: shineOpacity,
                }}
              />

              {/* Edge highlight */}
              <motion.div
                className="absolute inset-0 pointer-events-none rounded-sm"
                style={{
                  boxShadow: 'inset 0 0 30px rgba(255,255,255,0.1)',
                }}
              />
            </>
          )}
        </motion.div>
      </div>

      {/* Artwork info */}
      <div className="mt-8 text-center text-white/80">
        <p className="font-sans text-lg mb-2">
          {title}, {year}
        </p>
        {description && (
          <p className="font-sans text-sm text-white/60 max-w-md">
            {description}
          </p>
        )}
        {description2 && (
          <p className="font-sans text-sm text-white/60 max-w-md">
            {description2}
          </p>
        )}
      </div>

      {/* Interaction hint */}
      <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-white/30">
        {isGyroscopeEnabled ? 'Tilt device to interact' : 'Move cursor to interact'}
      </p>
    </div>
  )
}
