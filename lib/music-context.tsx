"use client"

import { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from "react"

interface MusicContextType {
  isPlaying: boolean
  toggleMusic: () => void
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export function MusicProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio element on mount
  useEffect(() => {
    const audio = new Audio("/Music/Cozy-Ember-Christmas.mp3")
    audio.loop = true
    audio.volume = 0.3
    audioRef.current = audio

    // Load saved preference
    const savedState = localStorage.getItem("music-playing")
    const shouldPlay = savedState === "true"
    
    setIsHydrated(true)

    if (shouldPlay) {
      setIsPlaying(true)
      audio.play().catch(() => {})
    }

    return () => {
      audio.pause()
      audio.src = ""
    }
  }, [])

  // Sync audio with play state
  useEffect(() => {
    if (!audioRef.current || !isHydrated) return

    if (isPlaying) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false)
      })
    } else {
      audioRef.current.pause()
    }

    localStorage.setItem("music-playing", String(isPlaying))
  }, [isPlaying, isHydrated])

  const toggleMusic = useCallback(() => {
    setIsPlaying(prev => !prev)
  }, [])

  return (
    <MusicContext.Provider value={{ isPlaying, toggleMusic }}>
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const context = useContext(MusicContext)
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider")
  }
  return context
}
