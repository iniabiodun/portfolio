"use client"

import { useResizable } from "@/hooks/use-resizable"
import { NavSidebar } from "./nav-sidebar"

interface SiteLayoutProps {
  children: React.ReactNode
}

export function SiteLayout({ children }: SiteLayoutProps) {
  const sidebar = useResizable({ initialWidth: 192, minWidth: 150, maxWidth: 400 })

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar - mobile nav handled by page components */}
      <NavSidebar
        width={sidebar.width}
        isDragging={sidebar.isDragging}
        onMouseDown={sidebar.handleMouseDown}
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

