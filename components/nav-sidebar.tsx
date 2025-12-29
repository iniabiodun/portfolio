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

type Tab = "home" | "about" | "case-studies" | "speaking" | "bookshelf" | "notes" | "gallery"

interface NavSidebarProps {
  width: number
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent) => void
}

const tabs: { id: Tab; label: string; href: string }[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "about", label: "About", href: "/about" },
  { id: "case-studies", label: "Case Studies", href: "/case-studies" },
  { id: "speaking", label: "Speaking", href: "/speaking" },
  { id: "bookshelf", label: "Bookshelf", href: "/bookshelf" },
  { id: "notes", label: "Notes", href: "/notes" },
  { id: "gallery", label: "Gallery", href: "/gallery" },
]

function getActiveTab(pathname: string): Tab {
  if (pathname === "/") return "home"
  if (pathname.startsWith("/about")) return "about"
  if (pathname.startsWith("/case-studies")) return "case-studies"
  if (pathname.startsWith("/speaking")) return "speaking"
  if (pathname.startsWith("/bookshelf")) return "bookshelf"
  if (pathname.startsWith("/notes")) return "notes"
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
        "site-sidebar fixed left-0 top-0 h-screen shrink-0 z-40",
        "hidden md:block",
        isDarkMode ? "site-sidebar--dark" : "site-sidebar--light"
      )}
    >
      <div className="h-full">
        {/* Ribbon Bookmark with sway animation */}
        <div className="absolute top-0 left-8 w-8 h-40 z-10 group" style={{ perspective: '800px' }}>
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

        <nav className="site-sidebar__nav flex flex-col gap-2 p-8 pt-54">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "site-sidebar__link text-left py-1 transition-all uppercase tracking-widest text-xs",
                activeTab === tab.id ? "site-sidebar__link--active" : "",
              )}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        <ResizeHandle onMouseDown={onMouseDown} isDragging={isDragging} />
      </div>
    </aside>
  )
}

// Mobile drawer component
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
  
  // Track if this is the first time the drawer opens for the unfurl animation
  const [hasOpenedOnce, setHasOpenedOnce] = useState(hasUnfurledMobile)
  
  useEffect(() => {
    // When drawer opens for the first time, mark it as unfurled
    if (isOpen && !hasUnfurledMobile) {
      const timer = setTimeout(() => {
        hasUnfurledMobile = true
        setHasOpenedOnce(true)
      }, 500) // After animation completes
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-opacity duration-300",
          isDarkMode ? "bg-black/50" : "bg-black/10",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div
        className={cn(
          "site-sidebar-mobile fixed left-0 top-0 h-screen w-[75vw] max-w-[300px] z-50 md:hidden",
          "transform transition-transform duration-300 ease-out",
          "shadow-xl",
          isDarkMode ? "site-sidebar-mobile--dark" : "site-sidebar-mobile--light",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Ribbon Bookmark with sway animation */}
        <div className="absolute top-0 left-6 w-6 h-32 z-10" style={{ perspective: '800px' }}>
          <motion.div
            initial={hasOpenedOnce ? { rotateX: 0, opacity: 1 } : { rotateX: -90, opacity: 0 }}
            animate={isOpen ? { rotateX: 0, opacity: 1 } : (hasOpenedOnce ? { rotateX: 0, opacity: 1 } : { rotateX: -90, opacity: 0 })}
            transition={!hasOpenedOnce ? { 
              type: "spring", 
              stiffness: 120, 
              damping: 14,
              delay: isOpen ? 0.15 : 0 
            } : { duration: 0 }}
            style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
            className="w-full h-full"
          >
            {/* Inner div with pendulum sway animation */}
            <motion.div
              animate={isOpen ? { rotateZ: [0, 1, 0, -1, 0] } : { rotateZ: 0 }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: !hasOpenedOnce ? 0.8 : 0
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
          </motion.div>
        </div>

        <nav className="site-sidebar__nav flex flex-col gap-3 p-6 pt-40">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={onClose}
              className={cn(
                "site-sidebar__link text-left py-2 transition-all uppercase tracking-widest text-sm",
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

