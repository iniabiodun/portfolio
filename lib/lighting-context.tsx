"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type LightingMode = "ambient" | "warm" | "natural"

interface LightingContextType {
  mode: LightingMode
  setMode: (mode: LightingMode) => void
  isDarkMode: boolean
  backgroundImage: string
}

const LightingContext = createContext<LightingContextType | undefined>(undefined)

const modeToImage: Record<LightingMode, string> = {
  warm: "/study/day-light-on.jpg",
  natural: "/study/day-light-off.jpg",
  ambient: "/study/night-light-on.jpg",
}

export function LightingProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<LightingMode>("warm")
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("lighting-mode") as LightingMode | null
    if (saved && ["ambient", "warm", "natural"].includes(saved)) {
      setModeState(saved)
    }
    setIsHydrated(true)
  }, [])

  // Save to localStorage and apply dark mode class
  useEffect(() => {
    if (!isHydrated) return
    
    localStorage.setItem("lighting-mode", mode)
    
    // Apply dark mode class to document
    if (mode === "ambient") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [mode, isHydrated])

  const setMode = (newMode: LightingMode) => {
    setModeState(newMode)
  }

  const value: LightingContextType = {
    mode,
    setMode,
    isDarkMode: mode === "ambient",
    backgroundImage: modeToImage[mode],
  }

  return (
    <LightingContext.Provider value={value}>
      {children}
    </LightingContext.Provider>
  )
}

export function useLighting() {
  const context = useContext(LightingContext)
  if (context === undefined) {
    throw new Error("useLighting must be used within a LightingProvider")
  }
  return context
}


