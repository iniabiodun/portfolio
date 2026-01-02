"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ResizeHandle } from "./resize-handle"
import { motion } from "framer-motion"
import { useLighting } from "@/lib/lighting-context"

// Module-level flags to track if bookmark has unfurled this session
// These persist across client-side navigations but reset on hard refresh
let hasUnfurledDesktop = false
let hasUnfurledMobile = false

type Tab = "home" | "about" | "work-log" | "library" | "events" | "essays" | "gallery"

interface NavSidebarProps {
  width: number
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent) => void
}

const tabs: { id: Tab; label: string; href: string }[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "about", label: "About", href: "/about" },
  { id: "work-log", label: "Work Log", href: "/work-log" },
  { id: "library", label: "Library", href: "/library" },
  { id: "events", label: "Events", href: "/events" },
  { id: "essays", label: "Essays", href: "/essays" },
  { id: "gallery", label: "Gallery", href: "/gallery" },
]

function getActiveTab(pathname: string): Tab {
  if (pathname === "/") return "home"
  if (pathname.startsWith("/about")) return "about"
  if (pathname.startsWith("/work-log")) return "work-log"
  if (pathname.startsWith("/library")) return "library"
  if (pathname.startsWith("/events")) return "events"
  if (pathname.startsWith("/essays")) return "essays"
  if (pathname.startsWith("/gallery")) return "gallery"
  return "home"
}

export function NavSidebar({ width, isDragging, onMouseDown }: NavSidebarProps) {
  const pathname = usePathname()
  const activeTab = getActiveTab(pathname)
  const { mode } = useLighting()
  const isDarkMode = mode === "ambient"
  
  // Track if this is the first render for the unfurl animation
  const [shouldAnimate, setShouldAnimate] = useState(!hasUnfurledDesktop)
  
  useEffect(() => {
    // Mark as unfurled after initial animation completes
    if (!hasUnfurledDesktop) {
      const timer = setTimeout(() => {
        hasUnfurledDesktop = true
      }, 500) // After animation completes
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <aside
      style={{ 
        width: `${width}px`,
      }}
      className={cn(
        "site-sidebar fixed left-0 top-0 h-screen shrink-0 z-40 flex flex-col",
        "hidden md:block",
        isDarkMode ? "site-sidebar--dark" : "site-sidebar--light"
      )}
    >
        {/* Ribbon Bookmark with sway animation */}
        <div className="site-sidebar__bookmark" style={{ perspective: '800px' }}>
          <motion.div
            initial={shouldAnimate ? { rotateX: -90, opacity: 0 } : { rotateX: 0, opacity: 1 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={shouldAnimate ? { 
              type: "spring", 
              stiffness: 120, 
              damping: 14,
              delay: 0.2 
            } : { duration: 0 }}
            style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
            className="w-full h-full"
          >
            {/* Inner div with pendulum sway animation */}
            <motion.div
              animate={{ rotateZ: [0, 1, 0, -1, 0] }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: shouldAnimate ? 1 : 0
              }}
              style={{ transformOrigin: "top center" }}
              className="w-full h-full"
            >
              <div
                className="w-full h-full relative overflow-hidden"
                style={{
                  backgroundImage: 'url("/3. Gallery/Bookmark-Material.jpeg")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 12px), 0 100%)',
                  boxShadow: '2px 2px 6px rgba(0,0,0,0.3)',
                }}
              />
            </motion.div>
          </motion.div>
        </div>

        <nav className="site-sidebar__nav">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "site-sidebar__link",
                activeTab === tab.id ? "site-sidebar__link--active" : "",
              )}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        <ResizeHandle onMouseDown={onMouseDown} isDragging={isDragging} />
    </aside>
  )
}

// Sidebar drawer component - works on both desktop and mobile
// On desktop: matches NavSidebar styling with fixed width
// On mobile: slides in from left with narrower width
export function MobileNavDrawer({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean
  onClose: () => void
}) {
  const pathname = usePathname()
  const activeTab = getActiveTab(pathname)
  const { mode } = useLighting()
  const isDarkMode = mode === "ambient"

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-[60] transition-opacity duration-300",
          isDarkMode ? "bg-black/50" : "bg-black/10",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Drawer - slides from left */}
      <div
        className={cn(
          "site-sidebar-drawer fixed left-0 top-0 h-screen z-[70]",
          "w-[60vw] max-w-[240px]",
          "transform transition-transform duration-300 ease-out",
          "shadow-xl",
          isDarkMode ? "site-sidebar-mobile--dark" : "site-sidebar-mobile--light",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* X close button - top left */}
        <button
          onClick={onClose}
          className="mobile-drawer__close"
          aria-label="Close menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Bookmark ribbon - top right of drawer */}
        <div className="mobile-drawer__bookmark" style={{ perspective: '400px' }}>
          <motion.div
            animate={{ rotateZ: [0, 0.5, 0, -0.5, 0] }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut"
            }}
            style={{ transformOrigin: "top center" }}
            className="w-full h-full"
          >
            <div
              className="w-full h-full relative overflow-hidden"
              style={{
                backgroundImage: 'url("/3. Gallery/Bookmark-Material.jpeg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 10px), 0 100%)',
                boxShadow: '2px 2px 6px rgba(0,0,0,0.3)',
              }}
            />
          </motion.div>
        </div>

        {/* Navigation links */}
        <nav className="site-sidebar__nav site-sidebar-drawer__nav">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={onClose}
              className={cn(
                "site-sidebar__link",
                activeTab === tab.id ? "site-sidebar__link--active" : "",
              )}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}

