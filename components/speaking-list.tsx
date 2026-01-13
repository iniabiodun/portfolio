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
        "relative overflow-y-auto shrink-0 border-r border-border h-screen max-md:!w-full max-md:pt-20",
        selectedSpeaking && "max-md:hidden",
      )}
    >
      <div className="px-6 md:px-16 pt-20 md:pt-16 pb-0 w-full md:max-w-3xl flex flex-col justify-between min-h-full">
        <div>
          <h1 className="text-4xl font-serif mb-8">Events</h1>
          <p className="text-muted-foreground mb-8 font-sans font-semibold">Talks, workshops, and presentations.</p>
          <div className="space-y-0">
            {sortedSpeaking.map((item, index) => (
              <div key={item.slug} className="relative">
                <button
                  onClick={() => onSelectSpeaking(item.slug)}
                  className="w-full text-left space-y-1.5 py-3 transition-colors group"
                >
                  <div className="flex items-start gap-2">
                    <img 
                      src="/Bookshelf/pen-nib.svg" 
                      alt="" 
                      className={cn(
                        "pen-nib-icon w-4 h-4 transition-opacity duration-200 flex-shrink-0 mt-[0.2rem]",
                        selectedSpeaking === item.slug ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                      )}
                    />
                    <h2 className="text-lg font-medium text-foreground">{item.title}</h2>
                  </div>
                  <p className="text-xs text-muted-foreground font-sans uppercase tracking-widest pl-5">{item.date}</p>
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

      <ResizeHandle onMouseDown={onMouseDown} isDragging={isDragging} />
    </div>
  )
}

