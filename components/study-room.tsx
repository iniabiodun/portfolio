"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useResizable } from "@/hooks/use-resizable"
import { ResizeHandle } from "./resize-handle"
import { useLighting } from "@/lib/lighting-context"
import { useMusic } from "@/lib/music-context"

// Module-level flag to track if homepage menu bookmark has unfurled this session
// Persists across client-side navigations but resets on hard refresh
let hasUnfurledHomepageMenu = false

// Menu navigation links
const menuLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/speaking", label: "Speaking" },
  { href: "/bookshelf", label: "Bookshelf" },
  { href: "/notes", label: "Notes" },
  { href: "/gallery", label: "Gallery" },
]

// Hotspot regions as percentages - larger areas with z-index layering
// Gallery hotspot: Art frame on left wall (colorful woman with sunglasses)
const hotspots = [
  {
    id: "portrait",
    href: "/about",
    label: "About",
    bounds: { left: 35, top: 12, width: 30, height: 45 },
    zIndex: 20,
  },
  {
    id: "bookshelf-left-top",
    href: "/case-studies",
    label: "Case Studies",
    // Top two rows of left shelf → links to case studies
    bounds: { left: 0, top: 5, width: 28, height: 35 },
    zIndex: 12,
  },
  {
    id: "gallery",
    href: "/gallery",
    label: "Gallery",
    // Art frame position: adjusted based on debug logs
    bounds: { left: 2, top: 44, width: 20, height: 40 },
    zIndex: 15, // Above bookshelf
  },
  {
    id: "bookshelf-right-top",
    href: "/bookshelf",
    label: "Bookshelf",
    // Top two rows of right shelf → links to bookshelf
    bounds: { left: 72, top: 5, width: 28, height: 35 },
    zIndex: 12,
  },
]


const navLinks = [
  { href: "/about", label: "About" },
  { href: "/case-studies", label: "Work" },
  { href: "/speaking", label: "Speaking" },
  { href: "/bookshelf", label: "Bookshelf" },
  { href: "/notes", label: "Notes" },
  { href: "/gallery", label: "Gallery" },
]

// 3 scene options (removed nightOff due to composition mismatch)
type SceneKey = "dayOn" | "dayOff" | "nightOn"

const scenes: { key: SceneKey; label: string; icon: "sun" | "sun-dim" | "moon" }[] = [
  { key: "dayOn", label: "Day with lights", icon: "sun" },
  { key: "dayOff", label: "Day without lights", icon: "sun-dim" },
  { key: "nightOn", label: "Night with lights", icon: "moon" },
]

const images: Record<SceneKey, string> = {
  dayOn: "/study/day-light-on.jpg",
  dayOff: "/study/day-light-off.jpg",
  nightOn: "/study/night-light-on.jpg",
}

// Parallax settings
const PARALLAX_INTENSITY = 8 // Max pixels of movement

// Spring physics config for smooth parallax
const springConfig = { 
  stiffness: 50,  // Lower = smoother, more "floaty"
  damping: 20,    // Controls oscillation
  mass: 0.5       // Lower = more responsive
}

// Map lighting mode to scene key
const modeToScene: Record<"ambient" | "warm" | "natural", SceneKey> = {
  ambient: "nightOn",
  warm: "dayOn",
  natural: "dayOff",
}

const sceneToMode: Record<SceneKey, "ambient" | "warm" | "natural"> = {
  nightOn: "ambient",
  dayOn: "warm",
  dayOff: "natural",
}

export function StudyRoom() {
  const { mode, setMode } = useLighting()
  const { isPlaying, toggleMusic } = useMusic()
  const activeScene = modeToScene[mode]
  const setActiveScene = (scene: SceneKey) => setMode(sceneToMode[scene])
  const isDarkMode = mode === "ambient"
  
  const [isLoaded, setIsLoaded] = useState(false)
  const [hoveredSpot, setHoveredSpot] = useState<string | null>(null)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [showCursor, setShowCursor] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hasMenuBookmarkUnfurled, setHasMenuBookmarkUnfurled] = useState(hasUnfurledHomepageMenu)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Resizable sidebar - matches site sidebar settings
  const sidebar = useResizable({ initialWidth: 192, minWidth: 150, maxWidth: 400 })
  
  // Framer Motion values for parallax
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Springs for smooth following
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)
  
  // Transform to final pixel values
  const bgX = useTransform(springX, [-1, 1], [PARALLAX_INTENSITY, -PARALLAX_INTENSITY])
  const bgY = useTransform(springY, [-1, 1], [PARALLAX_INTENSITY, -PARALLAX_INTENSITY])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      // Mark bookmark as unfurled after animation completes
      if (!hasUnfurledHomepageMenu) {
        const timer = setTimeout(() => {
          hasUnfurledHomepageMenu = true
          setHasMenuBookmarkUnfurled(true)
        }, 500)
        return () => clearTimeout(timer)
      }
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // Detect touch device and reduced motion preference
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window)
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])


  // Smooth parallax using Framer Motion springs
  useEffect(() => {
    if (isTouchDevice || prefersReducedMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      // Normalized -1 to 1
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      mouseX.set(x)
      mouseY.set(y)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isTouchDevice, prefersReducedMotion, mouseX, mouseY])

  // Track cursor position relative to container (for hotspot pills)
  const handleMouseMove = useCallback((e: React.MouseEvent, spotId: string) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setCursorPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
    setHoveredSpot(spotId)
  }, [])

  // Determine if lights are on for warmth overlay
  const lightsOn = activeScene === "dayOn" || activeScene === "nightOn"
  
  // Map scene to lighting mode for CSS data attribute
  const lightingMode = activeScene === "nightOn" ? "ambient" : activeScene === "dayOn" ? "warm" : "natural"

  return (
    <>
      {/* Push Menu Sidebar */}
      <aside 
        className={`menu-sidebar ${menuOpen ? "open" : ""} ${isDarkMode ? "menu-sidebar--dark" : "menu-sidebar--light"}`} 
        aria-hidden={!menuOpen}
        style={{ width: `${sidebar.width}px` }}
      >
        {/* Resize Handle */}
        <ResizeHandle onMouseDown={sidebar.handleMouseDown} isDragging={sidebar.isDragging} />
        
        {/* Close Button */}
        <button 
          className="menu-sidebar__close"
          onClick={() => setMenuOpen(false)}
          aria-label="Close index"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Ribbon Bookmark */}
        <div className="menu-sidebar__bookmark">
          <motion.div
            initial={hasMenuBookmarkUnfurled ? { rotateX: 0, opacity: 1 } : { rotateX: -90, opacity: 0 }}
            animate={menuOpen ? { rotateX: 0, opacity: 1 } : (hasMenuBookmarkUnfurled ? { rotateX: 0, opacity: 1 } : { rotateX: -90, opacity: 0 })}
            transition={!hasMenuBookmarkUnfurled ? { 
              type: "spring", 
              stiffness: 120, 
              damping: 14,
              delay: menuOpen ? 0.2 : 0 
            } : { duration: 0 }}
            style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
            className="menu-sidebar__bookmark-inner"
          >
            <motion.div
              animate={menuOpen ? { rotateZ: [0, 1, 0, -1, 0] } : { rotateZ: 0 }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: !hasMenuBookmarkUnfurled ? 1 : 0
              }}
              style={{ transformOrigin: "top center" }}
              className="menu-sidebar__bookmark-ribbon"
            />
          </motion.div>
        </div>

        {/* Navigation Links */}
        <nav className="menu-sidebar__nav">
          {menuLinks.map((link, index) => (
            <motion.div
              key={link.href}
              initial={false}
              animate={menuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ 
                duration: 0.3,
                delay: menuOpen ? 0.1 + index * 0.05 : 0
              }}
            >
              <Link
                href={link.href}
                className="menu-sidebar__link"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </nav>
      </aside>

      {/* Overlay when menu open */}
      <div 
        className={`menu-overlay ${menuOpen ? "visible" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <div 
        className="study-room"
        data-lighting={lightingMode}
        onMouseMove={(e) => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            setCursorPos({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            })
          }
          if (!showCursor) setShowCursor(true)
        }}
        onMouseEnter={() => setShowCursor(true)}
        onMouseLeave={() => {
          setShowCursor(false)
          setHoveredSpot(null)
        }}
        ref={containerRef}
      >
        {/* Background images with parallax - all 3 always rendered, opacity toggled via CSS */}
        <motion.div 
          className="study-room__bg"
          style={{ 
            x: isTouchDevice || prefersReducedMotion ? 0 : bgX, 
            y: isTouchDevice || prefersReducedMotion ? 0 : bgY,
            scale: 1.03 
          }}
        >
          {scenes.map(({ key }) => (
            <Image
              key={key}
              src={images[key]}
              alt={`Ini's Study - ${key}`}
              fill
              priority
              quality={95}
              onLoad={() => setIsLoaded(true)}
              className={`study-room__image ${isLoaded ? "loaded" : ""} ${activeScene === key ? "active" : ""}`}
            />
          ))}
          
          {/* Warm overlay when lights are on */}
          <div 
            className={`study-room__warmth ${lightsOn ? "active" : ""}`}
            aria-hidden="true"
          />
          
          
          {/* Ambient dust particles - visible in Warm/Ambient modes */}
          <div className="study-room__particles" aria-hidden="true" />
        </motion.div>

      {/* Interactive hotspots - cursor-following pills */}
      <div className="study-room__hotspots">
        {hotspots.map((spot) => (
          <Link
            key={spot.id}
            href={spot.href}
            className="hotspot"
            data-id={spot.id}
            style={{
              left: `${spot.bounds.left}%`,
              top: `${spot.bounds.top}%`,
              width: `${spot.bounds.width}%`,
              height: `${spot.bounds.height}%`,
              zIndex: spot.zIndex,
            }}
            onMouseMove={(e) => handleMouseMove(e, spot.id)}
            onMouseLeave={() => setHoveredSpot(null)}
            aria-label={spot.label}
          />
        ))}

        {/* Custom cursor - dot when idle, pill when on hotspot */}
        <AnimatePresence>
          {showCursor && (
            <motion.div
              className={`custom-cursor ${hoveredSpot ? "has-label" : ""}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{
                left: cursorPos.x,
                top: cursorPos.y,
              }}
            >
              <span className="custom-cursor__dot" />
              {hoveredSpot && (
                <motion.span 
                  className="custom-cursor__label"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  transition={{ duration: 0.1 }}
                >
                  {hotspots.find((s) => s.id === hoveredSpot)?.label}
                </motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      </div>

      {/* Brand - separate for mobile positioning */}
      <div className="nav-brand">
        <span>Atelier ÌníOlúwa</span>
      </div>

      {/* Unified Navigation Bar - Outside study-room for proper z-index stacking */}
      <nav className="main-nav" aria-label="Main navigation">
        {/* Left: Index */}
        <button 
          className={`nav-menu ${menuOpen ? "open" : ""}`}
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen(!menuOpen)
          }}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close index" : "Open index"}
        >
          <span className="nav-menu__text">Index</span>
        </button>

        {/* Right: Lighting Controls */}
        <div className="nav-lighting" role="group" aria-label="Lighting mode">
          {/* Mobile Hamburger Menu - before lighting tabs */}
          <button
            className="nav-hamburger"
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen(!menuOpen)
            }}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
              <path d="M1 1h18M1 7h18M1 13h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Divider after hamburger */}
          <div className="nav-lighting__divider nav-hamburger-divider" aria-hidden="true" />

          {/* Ambient (Moon) */}
          <label className={`lighting-tab ${activeScene === "nightOn" ? "active" : ""}`}>
            <input
              type="radio"
              name="lighting"
              className="sr-only"
              checked={activeScene === "nightOn"}
              onChange={() => setActiveScene("nightOn")}
            />
            <span className="lighting-tab__text">Ambient</span>
            <svg className="lighting-tab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            <span className="lighting-tab__glow" aria-hidden="true" />
            <span className="lighting-tab__line" aria-hidden="true" />
          </label>

          {/* Warm (Sun) */}
          <label className={`lighting-tab ${activeScene === "dayOn" ? "active" : ""}`}>
            <input
              type="radio"
              name="lighting"
              className="sr-only"
              checked={activeScene === "dayOn"}
              onChange={() => setActiveScene("dayOn")}
            />
            <span className="lighting-tab__text">Warm</span>
            <svg className="lighting-tab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <span className="lighting-tab__glow" aria-hidden="true" />
            <span className="lighting-tab__line" aria-hidden="true" />
          </label>

          {/* Natural (Sun dim - no rays) */}
          <label className={`lighting-tab ${activeScene === "dayOff" ? "active" : ""}`}>
            <input
              type="radio"
              name="lighting"
              className="sr-only"
              checked={activeScene === "dayOff"}
              onChange={() => setActiveScene("dayOff")}
            />
            <span className="lighting-tab__text">Natural</span>
            <svg className="lighting-tab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" opacity="0.3" />
              <line x1="12" y1="21" x2="12" y2="23" opacity="0.3" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" opacity="0.3" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" opacity="0.3" />
              <line x1="1" y1="12" x2="3" y2="12" opacity="0.3" />
              <line x1="21" y1="12" x2="23" y2="12" opacity="0.3" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" opacity="0.3" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" opacity="0.3" />
            </svg>
            <span className="lighting-tab__glow" aria-hidden="true" />
            <span className="lighting-tab__line" aria-hidden="true" />
          </label>

          {/* Divider */}
          <div className="nav-lighting__divider" aria-hidden="true" />

          {/* Music Toggle - Vinyl with Tonearm */}
          <button
            className={`music-toggle ${isPlaying ? "playing" : ""}`}
            data-mode={mode}
            onClick={toggleMusic}
            aria-label={isPlaying ? "Pause music" : "Play music"}
            title={isPlaying ? "Pause music" : "Play music"}
          >
            <svg className="music-toggle__player" viewBox="0 0 40 32" fill="none">
              {/* Vinyl disc - slightly offset to make room for tonearm */}
              <g className="music-toggle__vinyl">
                {/* Vinyl base */}
                <circle cx="16" cy="16" r="14" fill="#2a2825" />
                
                {/* Grooves - multiple rings for realism */}
                <circle cx="16" cy="16" r="12.5" stroke="rgba(0,0,0,0.3)" strokeWidth="0.3" fill="none" />
                <circle cx="16" cy="16" r="11" stroke="rgba(60,60,60,0.4)" strokeWidth="0.3" fill="none" />
                <circle cx="16" cy="16" r="9.5" stroke="rgba(0,0,0,0.3)" strokeWidth="0.3" fill="none" />
                <circle cx="16" cy="16" r="8" stroke="rgba(60,60,60,0.4)" strokeWidth="0.3" fill="none" />
                <circle cx="16" cy="16" r="6.5" stroke="rgba(0,0,0,0.2)" strokeWidth="0.3" fill="none" />
                
                {/* Center label */}
                <circle cx="16" cy="16" r="5" fill="rgba(180, 120, 80, 0.9)" />
                <circle cx="16" cy="16" r="4.5" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" fill="none" />
                
                {/* Label text hint */}
                <ellipse cx="16" cy="14.5" rx="2.5" ry="0.8" fill="rgba(0,0,0,0.15)" />
                
                {/* Center hole */}
                <circle cx="16" cy="16" r="1.2" fill="rgba(20, 16, 14, 1)" />
                
                {/* Light reflection arc */}
                <path 
                  className="music-toggle__reflection"
                  d="M 16 3 A 13 13 0 0 1 27.5 10" 
                  stroke="rgba(255,255,255,0.35)" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
              
              {/* Tonearm */}
              <g className="music-toggle__tonearm">
                {/* Tonearm base/pivot */}
                <circle cx="36" cy="4" r="3" fill="rgba(120,110,100,0.9)" />
                <circle cx="36" cy="4" r="2" fill="rgba(80,75,70,0.9)" />
                
                {/* Tonearm - pivots from top right */}
                <g className="music-toggle__tonearm-arm">
                  {/* Main arm */}
                  <line x1="36" y1="4" x2="22" y2="14" stroke="rgba(160,150,140,0.9)" strokeWidth="1.5" strokeLinecap="round" />
                  
                  {/* Headshell */}
                  <line x1="22" y1="14" x2="18" y2="16" stroke="rgba(160,150,140,0.9)" strokeWidth="2" strokeLinecap="round" />
                  
                  {/* Cartridge/stylus */}
                  <circle cx="17.5" cy="16.5" r="1" fill="rgba(140,130,120,0.9)" />
                </g>
              </g>
            </svg>
          </button>

        </div>
      </nav>
    </>
  )
}

