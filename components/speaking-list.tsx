import { speaking } from "@/content/speaking"
import { cn } from "@/lib/utils"
import { ResizeHandle } from "./resize-handle"
import { Footer } from "./footer"

interface SpeakingListProps {
  selectedSpeaking: string | null
  onSelectSpeaking: (slug: string) => void
  width: number
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent) => void
}

// Helper function to parse date string (MM-DD-YYYY) and return comparable timestamp
function parseSpeakingDate(dateString: string): number {
  const [month, day, year] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day).getTime()
}

// Sort speaking engagements in reverse chronological order (newest first)
function sortSpeakingByDate() {
  return [...speaking].sort((a, b) => parseSpeakingDate(b.date) - parseSpeakingDate(a.date))
}

export function SpeakingList({ selectedSpeaking, onSelectSpeaking, width, isDragging, onMouseDown }: SpeakingListProps) {
  const sortedSpeaking = sortSpeakingByDate()
  return (
    <div
      style={{ width: `${width}px` }}
      className={cn(
        "relative overflow-y-auto shrink-0 border-r border-border h-screen",
        selectedSpeaking && "max-md:hidden",
      )}
    >
      <div className="px-8 md:px-16 pt-28 md:pt-16 pb-0 max-w-3xl flex flex-col justify-between min-h-full">
        <div>
          <h1 className="text-4xl font-serif mb-8">Speaking</h1>
          <p className="text-muted-foreground mb-8">Talks, workshops, and presentations.</p>
          <div className="space-y-0">
            {sortedSpeaking.map((item, index) => (
              <div key={item.slug} className="relative">
                <button
                  onClick={() => onSelectSpeaking(item.slug)}
                  className="w-full text-left space-y-1.5 py-3 transition-colors group"
                >
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-base font-medium text-foreground">{item.title}</h2>
                    <span className="text-muted-foreground text-sm transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">{item.date}</p>
                </button>
                {index < sortedSpeaking.length - 1 && (
                  <div className="h-px bg-border my-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>

      {selectedSpeaking && <ResizeHandle onMouseDown={onMouseDown} isDragging={isDragging} />}
    </div>
  )
}

