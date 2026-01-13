"use client"

import { useState } from "react"
import { useResizable } from "@/hooks/use-resizable"
import { NavSidebar, MobileNavDrawer } from "./nav-sidebar"
import { Menu } from "lucide-react"

interface SiteLayoutProps {
  children: React.ReactNode
}

export function SiteLayout({ children }: SiteLayoutProps) {
  const sidebar = useResizable({ initialWidth: 154, minWidth: 120, maxWidth: 320 })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden max-md:overflow-y-auto max-md:h-auto max-md:min-h-screen">
      {/* Desktop sidebar */}
      <NavSidebar
        width={sidebar.width}
        isDragging={sidebar.isDragging}
        onMouseDown={sidebar.handleMouseDown}
      />

      {/* Mobile hamburger button - LEFT side */}
      <button
        className="mobile-menu-trigger md:hidden"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile navigation drawer */}
      <MobileNavDrawer 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      {/* Main content area */}
      <div 
        className="flex-1 flex md:ml-0"
        style={{ marginLeft: `${sidebar.width}px` }}
      >
        <style jsx>{`
          @media (max-width: 767px) {
            div {
              margin-left: 0 !important;
            }
          }
        `}</style>
        {children}
      </div>
    </div>
  )
}
