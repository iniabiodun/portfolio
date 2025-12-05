"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Footer } from "./footer"

interface AboutSectionProps {
  onNavigateToSpeaking?: () => void
}

function HoverWord({ children, onHover, onLeave }: { children: string; onHover: () => void; onLeave: () => void }) {
  return (
    <span
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="cursor-default transition-colors hover:text-foreground/80"
    >
      {children}
    </span>
  )
}

export function AboutSection({ onNavigateToSpeaking }: AboutSectionProps) {
  const [showImage, setShowImage] = useState(false)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    setImagePosition({ x: e.clientX, y: e.clientY })
  }

  const handleHover = () => setShowImage(true)
  const handleLeave = () => setShowImage(false)

  return (
    <div className="flex flex-col justify-between min-h-full" onMouseMove={handleMouseMove}>
      {/* Hover image with smooth animation */}
      <AnimatePresence>
        {showImage && (
          <motion.div
            className="fixed pointer-events-none z-50"
            style={{
              left: imagePosition.x + 20,
              top: imagePosition.y - 100,
            }}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 5 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              mass: 0.5,
            }}
          >
            <img
              src="/About/Ini-Illustrated-Headshot-2025 2.PNG"
              alt="Ìní·Olúwa"
              className="w-32 h-32 object-cover rounded-lg"
              style={{
                boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.35)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
        <div>
          <h1 className="text-5xl font-serif mb-2">
            <HoverWord onHover={handleHover} onLeave={handleLeave}>Ìní·Olúwa</HoverWord>
          </h1>
          <p className="text-muted-foreground text-sm mb-2">/ee-nee-OH-loo-wah/</p>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground">noun</p>
          <ol className="space-y-2 list-decimal list-inside">
            <li className="text-foreground">
              Player/coach senior IC with 12+ YOE at fast-moving B2B/B2C teams.
            </li>
            <li className="text-foreground">
              <HoverWord onHover={handleHover} onLeave={handleLeave}>Designer</HoverWord>,{" "}
              <a href="https://fin.ai/" target="_blank" rel="noopener noreferrer" className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid">Fin AI Agent</a>
              /
              <a href="https://www.intercom.com/" target="_blank" rel="noopener noreferrer" className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid">Intercom</a>
              ; prev. Principal Product Designer,{" "}
              <a href="https://www.gendigital.com/us/en/" target="_blank" rel="noopener noreferrer" className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid">Gen Digital</a>.
            </li>
            <li className="text-foreground">
              <HoverWord onHover={handleHover} onLeave={handleLeave}>Writer</HoverWord>,{" "}
              <a href="https://iniabiodun.substack.com/" target="_blank" rel="noopener noreferrer" className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid">In Good Company</a>
              ; Podcast host,{" "}
              <a href="https://open.spotify.com/show/0szIL4qmNk7DrrlAgMX0uV" target="_blank" rel="noopener noreferrer" className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid">Growth Design Podcast</a>.
            </li>
            <li className="text-foreground">
              Founding designer, <a href="https://decimals.co/" target="_blank" rel="noopener noreferrer" className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid">Decimals</a>, Coho, and News Decoder.
            </li>
          </ol>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <span className="text-muted-foreground">See also:</span>
          <a
            href="https://www.linkedin.com/in/inioluwa-abiodun/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid"
          >
            LinkedIn
          </a>
          <button
            onClick={onNavigateToSpeaking}
            className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid text-left"
          >
            Speaking
          </button>
        </div>
      </div>

      <Footer />

      {/* Seal at far right corner of page, bottom-aligned with copyright */}
      <img 
        src="/IniOluwa Seal 1.png" 
        alt="OMÒ ASÍWAJU Seal" 
        className="fixed object-contain"
        style={{ 
          width: '130px', 
          height: '130px',
          right: '2rem',
          bottom: '2rem',
        }}
      />
    </div>
  )
}
