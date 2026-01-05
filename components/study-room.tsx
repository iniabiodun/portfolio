"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useLighting } from "@/lib/lighting-context"
import { useMusic } from "@/lib/music-context"
import { NavSidebar, MobileNavDrawer } from "./nav-sidebar"


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
    href: "/work-log",
    label: "Work Log",
    // Top two rows of left shelf → links to work log
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
    href: "/library",
    label: "Library",
    // Top two rows of right shelf → links to library
    bounds: { left: 72, top: 5, width: 28, height: 35 },
    zIndex: 12,
  },
]


const navLinks = [
  { href: "/about", label: "About" },
  { href: "/work-log", label: "Work Log" },
  { href: "/events", label: "Events" },
  { href: "/library", label: "Library" },
  { href: "/essays", label: "Essays" },
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

// Shelf items - layered on top of the background
// Positions calculated as percentages of 3765×2100 background
interface ShelfItem {
  id: string
  image: string
  position: { left: number; top: number; width: number; height: number }
  label: string
  interactive?: boolean // Can be clicked/hovered
  href?: string // Link destination if clickable
  easterEgg?: string // Tooltip message for easter eggs
}

const shelfItems: ShelfItem[] = []

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
  
  // Fallback: Set isLoaded after a short delay if onLoad doesn't fire (cached images)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) {
        setIsLoaded(true)
      }
    }, 100) // Short delay to allow onLoad to fire first
    return () => clearTimeout(timer)
  }, [isLoaded])
  
  const [hoveredSpot, setHoveredSpot] = useState<string | null>(null)
  const [hoveredShelfItem, setHoveredShelfItem] = useState<ShelfItem | null>(null)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [showCursor, setShowCursor] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isDesktopChecked, setIsDesktopChecked] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Onboarding state - CRT TV Turn-On: preloader → reveal → ready
  // Start with null to prevent flash - don't render intro until visitor check completes
  const [showIntro, setShowIntro] = useState<boolean | null>(null)
  const [introPhase, setIntroPhase] = useState<'preloader' | 'dark' | 'reveal' | 'ready'>('ready')
  const [countdown, setCountdown] = useState(10)
  const [hasCheckedVisitor, setHasCheckedVisitor] = useState(false)
  
  // Preloader state (desktop only) - using motion value for smooth animation
  const preloaderMotionValue = useMotionValue(0)
  // Spring config tuned for ~3s animation to 100 (Eva Sánchez speed)
  const preloaderSpring = useSpring(preloaderMotionValue, { 
    stiffness: 12,  // Moderate stiffness = faster approach
    damping: 18,    // Smooth deceleration
    mass: 1.2       // Balanced momentum
  })
  const [preloaderProgress, setPreloaderProgress] = useState(0)
  const [preloaderTransitioning, setPreloaderTransitioning] = useState(false)
  const [preloaderComplete, setPreloaderComplete] = useState(false)
  
  // Subscribe to spring changes to update displayed value
  useEffect(() => {
    const unsubscribe = preloaderSpring.on("change", (latest) => {
      setPreloaderProgress(Math.round(latest))
      
      // Mark complete when we hit 100
      if (latest >= 99.5 && !preloaderComplete) {
        setPreloaderComplete(true)
      }
    })
    return () => unsubscribe()
  }, [preloaderSpring, preloaderComplete])
  
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

  // Detect touch device, desktop, and reduced motion preference
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window)
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    
    // Check if desktop (768px breakpoint)
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768)
    checkDesktop()
    setIsDesktopChecked(true)
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  // Check if first-time visitor and run intro sequence
  useEffect(() => {
    // Wait until we've determined if this is desktop
    if (!isDesktopChecked) return
    
    // Debug mode: ?debug=preloader forces preloader to show
    const urlParams = new URLSearchParams(window.location.search)
    const debugPreloader = urlParams.get('debug') === 'preloader'
    
    const hasVisited = localStorage.getItem('atelier-visited')
    
    if (hasVisited && !debugPreloader) {
      // Returning visitor - skip intro entirely (showIntro stays false, phase stays ready)
      setShowIntro(false)
    } else {
      // First-time visitor (or debug mode) - show intro (start with preloader on desktop)
      setIntroPhase(isDesktop ? 'preloader' : 'dark')
      setShowIntro(true)
    }
    setHasCheckedVisitor(true)
  }, [isDesktop, isDesktopChecked])

  // Preloader animation - set target to 100, spring physics handles the smooth animation
  useEffect(() => {
    if (!showIntro || !isDesktop || introPhase !== 'preloader') return
    
    // Reset and set target - spring physics will smoothly animate to 100
    preloaderMotionValue.set(0)
    
    // Small delay then set target to 100 - spring handles the rest
    const startTimer = setTimeout(() => {
      preloaderMotionValue.set(100)
    }, 100)

    return () => clearTimeout(startTimer)
  }, [showIntro, isDesktop, introPhase, preloaderMotionValue])
  
  // Handle transition when preloader completes - CRT TV turn-on effect
  useEffect(() => {
    if (!preloaderComplete || introPhase !== 'preloader') return
    
    // Brief hold at 100, then play TV sound and start turn-on animation
    const transitionTimer = setTimeout(() => {
      // Play TV turn-on sound
      const tvSound = new Audio('/study/tvon-108126.mp3')
      tvSound.volume = 0.5
      tvSound.play().catch(() => {}) // Ignore if blocked by autoplay policy
      
      // Go to TV turn-on phase (collapse then expand)
      setIntroPhase('reveal')
    }, 400)
    
    return () => clearTimeout(transitionTimer)
  }, [preloaderComplete, introPhase])

  // Intro animation sequence - CRT TV turn-on: reveal → ready
  // Desktop: preloader → reveal → ready
  // Mobile: dark → reveal → ready
  useEffect(() => {
    if (!showIntro) return
    
    // From reveal → ready (after CRT collapse animation completes)
    if (introPhase === 'reveal') {
      const timer = setTimeout(() => setIntroPhase('ready'), 700)
      return () => clearTimeout(timer)
    }
    
    // Mobile: dark → reveal (after 800ms)
    if (introPhase === 'dark') {
      const timer = setTimeout(() => setIntroPhase('reveal'), 800)
      return () => clearTimeout(timer)
    }
  }, [showIntro, introPhase])

  // Countdown timer for auto-dismiss
  useEffect(() => {
    if (!showIntro || introPhase !== 'ready') return

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          handleDismissIntro()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(countdownInterval)
  }, [showIntro, introPhase])

  // Dismiss intro and mark as visited
  const handleDismissIntro = useCallback(() => {
    setShowIntro(false)
    localStorage.setItem('atelier-visited', 'true')
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
      {/* Navigation Sidebar/Drawer - Desktop uses NavSidebar, Mobile uses MobileNavDrawer */}
      {isDesktop ? (
        // Desktop: NavSidebar in overlay
        <AnimatePresence>
          {menuOpen && (
            <>
              {/* Backdrop */}
          <motion.div
                className="homepage-sidebar-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMenuOpen(false)}
              />
              {/* NavSidebar */}
              <motion.div
                className="homepage-sidebar-wrapper"
                initial={{ x: -192 }}
                animate={{ x: 0 }}
                exit={{ x: -192 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <NavSidebar
                  width={192}
                  isDragging={false}
                  onMouseDown={() => {}} // No resize on homepage overlay
          />
        </motion.div>
            </>
          )}
        </AnimatePresence>
      ) : (
        // Mobile: MobileNavDrawer
        <MobileNavDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      )}

      {/* Scene Wrapper - handles overflow and centering */}
      <div className="scene-wrapper">
        {/* Scene Container - fixed 1920×1080, scales on desktop */}
        <div 
          className={`scene-container ${showIntro ? 'intro-active' : 'intro-complete'}`}
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
            className="scene-container__bg"
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
                className={`scene-container__image ${isLoaded ? "loaded" : ""} ${activeScene === key ? "active" : ""}`}
            />
          ))}
          
          {/* Warm overlay when lights are on */}
          <div 
              className={`scene-container__warmth ${lightsOn ? "active" : ""}`}
            aria-hidden="true"
          />
          
          
          {/* Ambient dust particles - visible in Warm/Ambient modes */}
            <div className="scene-container__particles" aria-hidden="true" />
            
            {/* Shelf Items - INSIDE parallax div so they move with background */}
            <div className="scene-container__shelf-items" data-lighting={mode}>
              {shelfItems.map((item) => (
                <div
                  key={item.id}
                  className={`shelf-item ${item.interactive ? "interactive" : ""} ${hoveredShelfItem?.id === item.id ? "hovered" : ""}`}
                  style={{
                    left: `${item.position.left}%`,
                    top: `${item.position.top}%`,
                    width: `${item.position.width}%`,
                    height: `${item.position.height}%`,
                  }}
                  onMouseEnter={() => item.interactive && setHoveredShelfItem(item)}
                  onMouseLeave={() => setHoveredShelfItem(null)}
                >
                  <Image
                    src={item.image}
                    alt={item.label}
                    fill
                    sizes={`${item.position.width}vw`}
                    className="shelf-item__image"
                  />
                  {/* Easter egg tooltip */}
                  {item.interactive && item.easterEgg && hoveredShelfItem?.id === item.id && (
                    <motion.div
                      className="shelf-item__tooltip"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                    >
                      {item.easterEgg}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
        </motion.div>

      {/* Interactive hotspots - cursor-following pills */}
          <div className="scene-container__hotspots">
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
      </div>

      {/* Brand - separate for mobile positioning */}
      <div className="nav-brand">
        <span className="nav-brand__title">Atelier ÌníOlúwa</span>
      </div>

      {/* Hover to Explore hint - bottom of screen */}
      <motion.div 
        className="hover-explore-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: introPhase === 'ready' || !showIntro ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <span className="hover-explore-hint__text">[HOVER TO EXPLORE]</span>
      </motion.div>

      {/* Preloader - Desktop Only with CRT TV turn-on exit */}
      <AnimatePresence>
        {showIntro && introPhase === 'preloader' && isDesktop && (
          <motion.div
            className="preloader"
            initial={{ scaleY: 1, opacity: 1 }}
            exit={{ 
              scaleY: 0,
              opacity: 1,
              transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
            }}
            style={{ originY: 0.5 }}
          >
            <div className="preloader__content">
              {/* Large centered counter */}
              <div className="preloader__counter">
                {preloaderProgress.toString().padStart(3, '0')}
              </div>
              
              {/* Copy - 24px below counter */}
              <div className="preloader__footer">
                YOU ARE ENTERING THE DESIGN WORKSHOP & ARCHIVE OF ÌNÍOLÚWA ABÍÓDÚN
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CRT TV Turn-On Effect - darkness collapses to line, revealing site from center */}
      <AnimatePresence>
        {showIntro && introPhase !== 'ready' && introPhase !== 'preloader' && (
          <>
            {/* Dark overlay that collapses */}
            <motion.div
              className="intro-darkness crt-reveal"
              initial={{ 
                clipPath: 'inset(0% 0% 0% 0%)',
                opacity: 1 
              }}
              animate={{ 
                // CRT turn-on: darkness collapses to horizontal line from center
                clipPath: introPhase === 'dark' 
                  ? 'inset(0% 0% 0% 0%)' // Full darkness
                  : 'inset(49.5% 0% 49.5% 0%)', // Collapse to thin horizontal line
                opacity: 1
              }}
              exit={{ 
                opacity: 0,
                transition: { duration: 0.15, delay: 0.05 }
              }}
              transition={{ 
                clipPath: {
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1] // Smooth ease-out
                }
              }}
            />
            {/* Bright scanline that appears during reveal */}
            {introPhase === 'reveal' && (
              <motion.div
                className="crt-scanline"
                initial={{ opacity: 0, scaleX: 0.3 }}
                animate={{ opacity: [0, 1, 1, 0], scaleX: [0.3, 1, 1, 1] }}
                transition={{ 
                  duration: 0.5,
                  times: [0, 0.1, 0.7, 1],
                  ease: "easeOut"
                }}
              />
            )}
          </>
        )}
      </AnimatePresence>

      {/* Welcome Overlay */}
      <AnimatePresence>
        {showIntro && introPhase === 'ready' && (
          <>
            {/* Blur backdrop */}
            <motion.div
              className="intro-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
            
            {/* Welcome modal - using opacity only to not conflict with CSS centering */}
            <motion.div
              className="intro-modal"
              data-lighting={lightingMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <p className="intro-modal__greeting">Hi, I am ÌníOlúwa.</p>
              <p className="intro-modal__message">
                Welcome to my active workshop and growing archive of work, thought, and craft.
              </p>
              <p className="intro-modal__hint">Hover on objects to explore.</p>
              
              <button 
                className="intro-modal__button"
                onClick={handleDismissIntro}
              >
                Step Inside
            </button>
              
              <p className="intro-modal__countdown">
                This message disappears in {countdown}...
              </p>
          </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Unified Navigation Bar - Outside study-room for proper z-index stacking */}
      <motion.nav 
        className="main-nav" 
        aria-label="Main navigation"
        initial={{ opacity: 0 }}
        animate={{ opacity: introPhase === 'ready' || !showIntro ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
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
          <label className={`lighting-tab ${activeScene === "nightOn" ? "active" : ""}`} data-mode="ambient">
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
          <label className={`lighting-tab ${activeScene === "dayOn" ? "active" : ""}`} data-mode="warm">
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
          <label className={`lighting-tab ${activeScene === "dayOff" ? "active" : ""}`} data-mode="natural">
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
      </motion.nav>
    </>
  )
}

