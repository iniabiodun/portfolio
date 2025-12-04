"use client"

import { cn } from "@/lib/utils"
import { ResizeHandle } from "./resize-handle"

type Tab = "about" | "bookshelf" | "notes" | "case-studies" | "speaking"

interface SidebarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  width: number
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent) => void
  mobileMenuOpen: boolean
}

export function Sidebar({ activeTab, onTabChange, width, isDragging, onMouseDown, mobileMenuOpen }: SidebarProps) {
  const tabs: Tab[] = ["about", "case-studies", "bookshelf", "notes", "speaking"]

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
        {/* Ribbon Bookmark */}
        <div className="absolute top-0 left-8 w-8 h-40 z-10 group">
          <div
            className="w-full h-full relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #1F0405, #2a0607 50%, #1F0405)',
              border: '1px solid #1F0405',
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 12px), 0 100%)',
              boxShadow: '2px 2px 6px rgba(0,0,0,0.3), inset -1px -1px 2px rgba(0,0,0,0.2)',
            }}
          />
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
              {tab === "case-studies" ? "Case Studies" : tab === "speaking" ? "Speaking" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        {/* Wax Seal - only show when not on About page */}
        {activeTab !== "about" && (
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
  const tabs: Tab[] = ["about", "case-studies", "bookshelf", "notes", "speaking"]

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
        {/* Ribbon Bookmark */}
        <div className="absolute top-0 left-6 w-6 h-32 z-10">
          <div
            className="w-full h-full relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #1F0405, #2a0607 50%, #1F0405)',
              border: '1px solid #1F0405',
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 10px), 0 100%)',
              boxShadow: '2px 2px 6px rgba(0,0,0,0.3), inset -1px -1px 2px rgba(0,0,0,0.2)',
            }}
          />
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
              {tab === "case-studies" ? "Case Studies" : tab === "speaking" ? "Speaking" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        {/* Wax Seal on mobile */}
        <div className="absolute bottom-6 left-6 z-10">
          <img 
            src="/IniOluwa Seal 1.png" 
            alt="OMÒ ASÍWAJU Seal" 
            className="object-contain"
            style={{ width: '80px', height: '80px' }}
          />
        </div>
      </div>
    </>
  )
}
