"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useLighting } from "@/lib/lighting-context"
import { useMusic } from "@/lib/music-context"

// Desk document type
type DeskDocId = "sketchbook" | "worksheet" | "work-history" | "about-me-card" | "call-to-bar" | "notepad" | "aso-oke-swatch"

interface DeskDocument {
  id: DeskDocId
  // Position and size as percentages (from Figma: 3423×2100)
  position: { left: number; top: number; width: number; height: number }
  // Image for the desk layer (warm variant)
  deskImage: string
  // Pixel dimensions for the desk layer image
  deskImageSize: { width: number; height: number }
  // Hi-res image for focus view (optional - sketchbook doesn't have one)
  focusImage?: string
  // Display info
  title: string
  description?: string
  year?: string
  // Is this item clickable?
  clickable: boolean
  // Special interactive notepad
  isNotepad?: boolean
}

// Placed message type
interface PlacedMessage {
  id: string
  text: string
  position: { x: number; y: number }
}

// Desk documents with precise Figma coordinates converted to percentages
// Image dimensions: 3423 × 2100
const deskDocuments: DeskDocument[] = [
  {
    id: "sketchbook",
    position: { left: 28.30, top: 33.68, width: 14.65, height: 13.90 }, // +30% size
    deskImage: "/1. About/sketch-book-warm.png",
    deskImageSize: { width: 386, height: 225 },
    title: "Sketchbook",
    clickable: false, // Decorative only
  },
  {
    id: "worksheet",
    position: { left: 34.5, top: 38.5, width: 8.06, height: 16.30 }, // Moved right, size +40%
    deskImage: "/1. About/worksheet-warm.png",
    deskImageSize: { width: 197, height: 245 },
    focusImage: "/1. About/Worksheet.jpg",
    title: "Work Spotlight",
    description: "Process artifacts from design workshops and strategy sessions.",
    clickable: true,
  },
  {
    id: "work-history",
    position: { left: 42.33, top: 33.15, width: 8.51, height: 19.68 },
    deskImage: "/1. About/work-history-warm.png",
    deskImageSize: { width: 291, height: 413 },
    focusImage: "/1. About/Work-History-card.jpg",
    title: "Work History",
    description: "A career spanning 12+ years across B2B/B2C products, from founding designer roles to leading design at scale.",
    year: "2012–Present",
    clickable: true,
  },
  {
    id: "about-me-card",
    position: { left: 50.97, top: 32.32, width: 6.71, height: 15.52 },
    deskImage: "/1. About/about-me-card-warm.png",
    deskImageSize: { width: 230, height: 326 },
    focusImage: "/1. About/About-me-card.jpg",
    title: "About Me",
    description: "The essentials — designer, writer, and occasional speaker on all things product and growth.",
    clickable: true,
  },
  {
    id: "call-to-bar",
    position: { left: 57.69, top: 37.27, width: 5.83, height: 11.87 },
    deskImage: "/1. About/call-to-bar-warm.png",
    deskImageSize: { width: 200, height: 249 },
    focusImage: "/1. About/Ini-Call-to-Nigerian-Bar.jpg",
    title: "Call to the Nigerian Bar",
    description: "Before design, law. Called to the Nigerian Bar, bringing a unique perspective on systems, logic, and human-centered problem solving.",
    year: "2014",
    clickable: true,
  },
  {
    id: "notepad",
    position: { left: 67.03, top: 47.32, width: 3.54, height: 5.22 },
    deskImage: "/1. About/notepad-warm.png",
    deskImageSize: { width: 121, height: 110 },
    title: "Leave me a message",
    description: "Write a note and place it on the desk.",
    clickable: true,
    isNotepad: true, // Special interactive notepad
  },
  {
    id: "aso-oke-swatch",
    position: { left: 70.71, top: 46.81, width: 4.61, height: 8.94 },
    deskImage: "/1. About/aso-oke-swatch-warm.png",
    deskImageSize: { width: 158, height: 188 },
    focusImage: "/1. About/Aso-Oke Design-Swatch 1.jpg",
    title: "Aso-oke Fabric",
    description: "Traditional Yoruba hand-woven cloth, a symbol of heritage and celebration. A piece of home on the desk.",
    year: "Family heirloom",
    clickable: true,
  },
]

// Lighting modes
type LightingMode = "ambient" | "warm" | "natural"
const lightingModes: LightingMode[] = ["ambient", "warm", "natural"]

// Empty desk backgrounds per lighting mode
const deskBackgrounds: Record<LightingMode, string> = {
  ambient: "/1. About/empty-table-night-lights-on.jpg",
  warm: "/1. About/empty-table-day-lights-on.jpg",
  natural: "/1. About/empty-table-day-lights-off.jpg",
}

// Spring animation config
const smoothSpring = {
  type: "spring" as const,
  stiffness: 280,
  damping: 26,
}

export function DeskScene() {
  const { mode, setMode } = useLighting()
  const { isPlaying, toggleMusic } = useMusic()
  const [focusedDoc, setFocusedDoc] = useState<DeskDocument | null>(null)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  
  // Cursor tracking state
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [showCursor, setShowCursor] = useState(false)
  const [hoveredDoc, setHoveredDoc] = useState<DeskDocument | null>(null)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Notepad state
  const [notepadOpen, setNotepadOpen] = useState(false)
  const [messageText, setMessageText] = useState("")
  const [placedMessages, setPlacedMessages] = useState<PlacedMessage[]>([])
  const [placingMessage, setPlacingMessage] = useState(false)
  const [stickyPreview, setStickyPreview] = useState<{ x: number; y: number } | null>(null)

  // Track loaded state
  const isLoaded = loadedImages.size >= lightingModes.length

  const handleImageLoad = useCallback((imageId: string) => {
    setLoadedImages(prev => new Set([...prev, imageId]))
  }, [])

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window)
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFocusedDoc(null)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  // Lock body scroll when doc is focused
  useEffect(() => {
    if (focusedDoc) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [focusedDoc])

  const handleDocClick = useCallback((doc: DeskDocument) => {
    if (doc.clickable) {
      if (doc.isNotepad) {
        setNotepadOpen(true)
      } else if (doc.focusImage) {
        setFocusedDoc(doc)
      }
    }
  }, [])

  const closeFocus = useCallback(() => {
    setFocusedDoc(null)
    setNotepadOpen(false)
    setPlacingMessage(false)
  }, [])
  
  // Place message on desk
  const handlePlaceMessage = useCallback(() => {
    if (messageText.trim()) {
      setPlacingMessage(true)
      setNotepadOpen(false)
    }
  }, [messageText])
  
  // Handle clicking on desk to place message
  const handleDeskClick = useCallback((e: React.MouseEvent) => {
    if (placingMessage && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      
      // Only place on the desk area (roughly 25-85% horizontal, 25-60% vertical)
      if (x > 25 && x < 85 && y > 25 && y < 60) {
        const newMessage: PlacedMessage = {
          id: `msg-${Date.now()}`,
          text: messageText,
          position: { x, y }
        }
        setPlacedMessages(prev => [...prev, newMessage])
        setMessageText("")
        setPlacingMessage(false)
        setStickyPreview(null)
      }
    }
  }, [placingMessage, messageText])

  // Delete a placed message
  const deleteMessage = useCallback((id: string) => {
    setPlacedMessages(prev => prev.filter(msg => msg.id !== id))
  }, [])

  // Track cursor position
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setCursorPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      
      // Update sticky preview when in placing mode
      if (placingMessage) {
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        if (x > 25 && x < 85 && y > 25 && y < 60) {
          setStickyPreview({ x, y })
        } else {
          setStickyPreview(null)
        }
      }
    }
    if (!showCursor) setShowCursor(true)
  }, [showCursor, placingMessage])

  return (
    <div 
      className="desk-scene" 
      data-lighting={mode}
      data-placing={placingMessage ? "true" : undefined}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowCursor(true)}
      onMouseLeave={() => {
        setShowCursor(false)
        setHoveredDoc(null)
      }}
      onClick={placingMessage ? handleDeskClick : undefined}
    >
      {/* Layer 1: Empty desk backgrounds (all 3 pre-rendered for smooth transitions) */}
      <div className="desk-scene__bg">
        {lightingModes.map((lightingMode) => (
          <Image
            key={lightingMode}
            src={deskBackgrounds[lightingMode]}
            alt={`Ini's Desk - ${lightingMode} lighting`}
            fill
            priority={lightingMode === mode}
            quality={95}
            sizes="100vw"
            onLoad={() => handleImageLoad(`bg-${lightingMode}`)}
            className={`desk-scene__bg-image ${loadedImages.has(`bg-${lightingMode}`) ? "loaded" : ""} ${mode === lightingMode ? "active" : ""}`}
          />
        ))}
      </div>

      {/* Layer 2: Document images positioned over desk */}
      <div className="desk-scene__documents">
        {deskDocuments.map((doc) => (
          <button
            key={doc.id}
            className={`desk-scene__doc ${doc.clickable ? "clickable" : "decorative"}`}
            data-doc-id={doc.id}
            style={{
              left: `${doc.position.left}%`,
              top: `${doc.position.top}%`,
              width: `${doc.position.width}%`,
              height: `${doc.position.height}%`,
            }}
            onClick={() => handleDocClick(doc)}
            onMouseEnter={() => doc.clickable && setHoveredDoc(doc)}
            onMouseLeave={() => setHoveredDoc(null)}
            disabled={!doc.clickable}
            aria-label={doc.clickable ? `View ${doc.title}` : doc.title}
          >
            <Image
              src={doc.deskImage}
              alt={doc.title}
              fill
              quality={90}
              sizes={`${doc.position.width}vw`}
              className="desk-scene__doc-img"
            />
          </button>
        ))}
      </div>

      {/* Layer 3: Placed messages from visitors */}
      <div className="desk-scene__messages">
        {placedMessages.map((msg, index) => (
          <motion.div
            key={msg.id}
            className="desk-scene__message"
            initial={{ opacity: 0, scale: 0.5, y: -20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              rotate: (index % 2 === 0 ? 1 : -1) * (2 + (index % 5))
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            style={{
              left: `${msg.position.x}%`,
              top: `${msg.position.y}%`,
            }}
          >
            <button 
              className="desk-scene__message-delete"
              onClick={() => deleteMessage(msg.id)}
              aria-label="Delete note"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 1L9 9M1 9L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <span className="desk-scene__message-text">{msg.text}</span>
          </motion.div>
        ))}
        
        {/* Sticky preview while placing */}
        <AnimatePresence>
          {placingMessage && stickyPreview && (
            <motion.div
              className="desk-scene__sticky-preview"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.8, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                left: `${stickyPreview.x}%`,
                top: `${stickyPreview.y}%`,
              }}
            >
              <span className="desk-scene__message-text">{messageText}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom cursor - dot when idle, pill when on hotspot */}
      {!isTouchDevice && !focusedDoc && !notepadOpen && (
        <AnimatePresence>
          {showCursor && (
            <motion.div
              className={`desk-scene__cursor ${hoveredDoc ? "has-label" : ""}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{
                left: cursorPos.x,
                top: cursorPos.y,
              }}
            >
              <span className="desk-scene__cursor-dot" />
              {hoveredDoc && (
                <motion.span 
                  className="desk-scene__cursor-label"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  transition={{ duration: 0.1 }}
                >
                  {hoveredDoc.title}
                </motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Focus overlay and expanded document */}
      <AnimatePresence>
        {focusedDoc && focusedDoc.focusImage && (
          <>
            {/* Backdrop */}
            <motion.div
              className="desk-scene__backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeFocus}
            />

            {/* Focused document */}
            <div className="desk-scene__focus">
              {/* Close button */}
              <motion.button
                className="desk-scene__focus-close"
                onClick={closeFocus}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </motion.button>

              {/* Document image */}
              <motion.div 
                className="desk-scene__focus-image"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...smoothSpring, delay: 0.05 }}
              >
                <Image
                  src={focusedDoc.focusImage}
                  alt={focusedDoc.title}
                  width={600}
                  height={800}
                  quality={95}
                  className="desk-scene__focus-img"
                />
              </motion.div>

              {/* Info panel */}
              <motion.div
                className="desk-scene__focus-info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, ...smoothSpring }}
              >
                <h2 className="desk-scene__focus-title">{focusedDoc.title}</h2>
                {focusedDoc.description && (
                  <p className="desk-scene__focus-desc">{focusedDoc.description}</p>
                )}
                {focusedDoc.year && (
                  <span className="desk-scene__focus-year">{focusedDoc.year}</span>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Notepad Modal - Leave a message */}
      <AnimatePresence>
        {notepadOpen && (
          <>
            <motion.div
              className="desk-scene__backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeFocus}
            />
            <motion.div
              className="desk-scene__notepad"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
            >
              <button
                className="desk-scene__notepad-close"
                onClick={closeFocus}
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              
              {/* Notepad image with input overlay */}
              <div className="desk-scene__notepad-paper">
                <Image
                  src="/1. About/Notepad.jpg"
                  alt="Notepad"
                  width={300}
                  height={400}
                  quality={90}
                  className="desk-scene__notepad-img"
                />
                <div className="desk-scene__notepad-overlay">
                  <textarea
                    className="desk-scene__notepad-input"
                    placeholder="Write your note..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value.slice(0, 100))}
                    maxLength={100}
                    autoFocus
                  />
                </div>
              </div>
              
              <div className="desk-scene__notepad-footer">
                <span className="desk-scene__notepad-count">{messageText.length}/100</span>
                <button
                  className="desk-scene__notepad-place"
                  onClick={handlePlaceMessage}
                  disabled={!messageText.trim()}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Place sticky
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Placing message hint */}
      <AnimatePresence>
        {placingMessage && (
          <motion.div
            className="desk-scene__placing-hint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <span>Click anywhere on the desk to place your note</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint for first-time visitors */}
      <AnimatePresence>
        {!focusedDoc && !notepadOpen && !placingMessage && isLoaded && (
          <motion.div
            className="desk-scene__hint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.5, duration: 0.4 }}
          >
            <span>Click items on the desk to explore</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lighting Controls - Top Right (matches homepage) */}
      <nav className="desk-scene__nav" aria-label="Lighting controls">
        <div className="nav-lighting" role="group" aria-label="Lighting mode">
          {/* Ambient (Moon) */}
          <label className={`lighting-tab ${mode === "ambient" ? "active" : ""}`}>
            <input
              type="radio"
              name="lighting"
              className="sr-only"
              checked={mode === "ambient"}
              onChange={() => setMode("ambient")}
            />
            <span className="lighting-tab__text">Ambient</span>
            <svg className="lighting-tab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            <span className="lighting-tab__glow" aria-hidden="true" />
            <span className="lighting-tab__line" aria-hidden="true" />
          </label>

          {/* Warm (Sun) */}
          <label className={`lighting-tab ${mode === "warm" ? "active" : ""}`}>
            <input
              type="radio"
              name="lighting"
              className="sr-only"
              checked={mode === "warm"}
              onChange={() => setMode("warm")}
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
          <label className={`lighting-tab ${mode === "natural" ? "active" : ""}`}>
            <input
              type="radio"
              name="lighting"
              className="sr-only"
              checked={mode === "natural"}
              onChange={() => setMode("natural")}
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
              {/* Vinyl disc */}
              <g className="music-toggle__vinyl">
                <circle cx="16" cy="16" r="14" fill="#2a2825" />
                <circle cx="16" cy="16" r="12.5" stroke="rgba(0,0,0,0.3)" strokeWidth="0.3" fill="none" />
                <circle cx="16" cy="16" r="11" stroke="rgba(60,60,60,0.4)" strokeWidth="0.3" fill="none" />
                <circle cx="16" cy="16" r="9.5" stroke="rgba(0,0,0,0.3)" strokeWidth="0.3" fill="none" />
                <circle cx="16" cy="16" r="8" stroke="rgba(60,60,60,0.4)" strokeWidth="0.3" fill="none" />
                <circle cx="16" cy="16" r="6.5" stroke="rgba(0,0,0,0.2)" strokeWidth="0.3" fill="none" />
                <circle cx="16" cy="16" r="5" fill="rgba(180, 120, 80, 0.9)" />
                <circle cx="16" cy="16" r="4.5" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" fill="none" />
                <ellipse cx="16" cy="14.5" rx="2.5" ry="0.8" fill="rgba(0,0,0,0.15)" />
                <circle cx="16" cy="16" r="1.2" fill="rgba(20, 16, 14, 1)" />
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
                <circle cx="36" cy="4" r="3" fill="rgba(120,110,100,0.9)" />
                <circle cx="36" cy="4" r="2" fill="rgba(80,75,70,0.9)" />
                <g className="music-toggle__tonearm-arm">
                  <line x1="36" y1="4" x2="22" y2="14" stroke="rgba(160,150,140,0.9)" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="22" y1="14" x2="18" y2="16" stroke="rgba(160,150,140,0.9)" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="17.5" cy="16.5" r="1" fill="rgba(140,130,120,0.9)" />
                </g>
              </g>
            </svg>
          </button>
        </div>
      </nav>
    </div>
  )
}
