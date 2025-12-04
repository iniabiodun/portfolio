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
      style={{ width: `${width}px`, borderRight: '3px double var(--border)' }}
      className={cn(
        "fixed left-0 top-0 h-screen shrink-0 bg-background z-30",
        "max-md:transition-transform max-md:duration-150",
        mobileMenuOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full",
        "max-md:shadow-lg",
      )}
    >
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
        >
        </div>
      </div>
      <style jsx>{`
        @keyframes sheen {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
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

      {/* Wax Seal */}
      <div className="absolute bottom-8 left-8 z-10">
        <img 
          src="/IniOluwa Seal 1.png" 
          alt="OMÒ ASÍWAJU Seal" 
          className="w-20 h-20 object-contain"
        />
      </div>

      <ResizeHandle onMouseDown={onMouseDown} isDragging={isDragging} />
    </aside>
  )
}
