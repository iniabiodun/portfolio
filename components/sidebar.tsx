"use client"

import { cn } from "@/lib/utils"
import { ResizeHandle } from "./resize-handle"
import { motion } from "framer-motion"

type Tab = "about" | "work-log" | "library" | "events" | "essays" | "gallery"

interface SidebarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  width: number
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent) => void
  mobileMenuOpen: boolean
}

export function Sidebar({ activeTab, onTabChange, width, isDragging, onMouseDown, mobileMenuOpen }: SidebarProps) {
  const tabs: Tab[] = ["about", "work-log", "library", "events", "essays", "gallery"]

  return (
    <aside
      style={{ 
        borderRight: '3px double var(--border)',
      }}
      className={cn(
        "fixed left-0 top-0 h-screen shrink-0 bg-background z-40",
        // Desktop: use resizable width
        "hidden md:block",
      )}
    >
      <div style={{ width: `${width}px` }} className="h-full">
        {/* Ribbon Bookmark with 3D unfurl animation */}
        <div className="absolute top-0 left-8 w-8 h-40 z-10 group" style={{ perspective: '800px' }}>
          <motion.div
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 120, 
              damping: 14,
              delay: 0.2 
            }}
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
                delay: 1 // Start sway after unfurl completes
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

        <nav className="flex flex-col gap-2 p-8 pt-54">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={cn(
                "text-left py-1 transition-colors uppercase tracking-widest text-xs",
                activeTab === tab ? "text-foreground" : "text-foreground/40 hover:text-foreground/70",
              )}
            >
              {tab === "about" ? "About" : tab === "work-log" ? "Work Log" : tab === "library" ? "Library" : tab === "events" ? "Events" : tab === "essays" ? "Essays" : tab === "gallery" ? "Gallery" : tab}
            </button>
          ))}
        </nav>

        {/* Wax Seal - only show when not on About or Gallery page */}
        {activeTab !== "about" && activeTab !== "gallery" && (
          <div className="absolute bottom-8 left-6 z-10">
            <img 
              src="/IniOluwa Seal 1.png" 
              alt="OMÒ ASÍWAJU Seal" 
              className="object-contain"
              style={{ width: '104px', height: '104px' }}
            />
          </div>
        )}

        <ResizeHandle onMouseDown={onMouseDown} isDragging={isDragging} />
      </div>
    </aside>
  )
}

// Mobile drawer component
export function MobileDrawer({ 
  activeTab, 
  onTabChange, 
  isOpen, 
  onClose 
}: { 
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  isOpen: boolean
  onClose: () => void
}) {
  const tabs: Tab[] = ["about", "work-log", "library", "events", "essays", "gallery"]

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/10 z-40 md:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div
        className={cn(
          "fixed left-0 top-0 h-screen w-[75vw] max-w-[300px] bg-background z-50 md:hidden",
          "transform transition-transform duration-300 ease-out",
          "border-r-2 border-border shadow-xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Ribbon Bookmark with 3D unfurl animation */}
        <div className="absolute top-0 left-6 w-6 h-32 z-10" style={{ perspective: '800px' }}>
          <motion.div
            initial={{ rotateX: -90, opacity: 0 }}
            animate={isOpen ? { rotateX: 0, opacity: 1 } : { rotateX: -90, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 120, 
              damping: 14,
              delay: isOpen ? 0.15 : 0 
            }}
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
                delay: 0.8
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

        <nav className="flex flex-col gap-3 p-6 pt-40">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                onTabChange(tab)
                onClose()
              }}
              className={cn(
                "text-left py-2 transition-colors uppercase tracking-widest text-sm",
                activeTab === tab ? "text-foreground font-medium" : "text-foreground/50",
              )}
            >
              {tab === "about" ? "About" : tab === "work-log" ? "Work Log" : tab === "library" ? "Library" : tab === "events" ? "Events" : tab === "essays" ? "Essays" : tab === "gallery" ? "Gallery" : tab}
            </button>
          ))}
        </nav>

        {/* Wax Seal on mobile - only show when not on About or Gallery page */}
        {activeTab !== "about" && activeTab !== "gallery" && (
          <div className="absolute bottom-6 left-6 z-10">
            <img 
              src="/IniOluwa Seal 1.png" 
              alt="OMÒ ASÍWAJU Seal" 
              className="object-contain"
              style={{ width: '80px', height: '80px' }}
            />
          </div>
        )}
      </div>
    </>
  )
}
