import { notes } from "@/content/notes"
import { cn } from "@/lib/utils"
import { ResizeHandle } from "./resize-handle"
import { Footer } from "./footer"

interface NotesListProps {
  selectedNote: string | null
  onSelectNote: (slug: string) => void
  width: number
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent) => void
}

// Helper function to parse date string (MM-DD-YYYY) and return comparable timestamp
function parseNoteDate(dateString: string): number {
  const [month, day, year] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day).getTime()
}

// Sort notes in reverse chronological order (newest first)
function sortNotesByDate() {
  return [...notes].sort((a, b) => parseNoteDate(b.date) - parseNoteDate(a.date))
}

export function NotesList({ selectedNote, onSelectNote, width, isDragging, onMouseDown }: NotesListProps) {
  const sortedNotes = sortNotesByDate()
  return (
    <div
      style={{ width: `${width}px` }}
      className={cn(
        "relative overflow-y-auto shrink-0 border-r border-border h-screen max-md:!w-full",
        selectedNote && "max-md:hidden",
      )}
    >
      <div className="px-6 md:px-16 pt-20 md:pt-16 pb-0 w-full md:max-w-3xl flex flex-col justify-between min-h-full">
        <div>
          <h1 className="text-4xl font-serif mb-8">Notes</h1>
          <p className="text-muted-foreground mb-8">Field observations & works-in-progress.</p>
          <div className="space-y-0">
            {sortedNotes.map((note, index) => (
              <div key={note.slug} className="relative">
                <button
                  onClick={() => onSelectNote(note.slug)}
                  className="w-full text-left space-y-1.5 py-3 transition-colors group"
                >
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-base font-medium text-foreground">{note.title}</h2>
                    <span className="text-muted-foreground text-sm transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">{note.date}</p>
                </button>
                {index < sortedNotes.length - 1 && (
                  <div className="h-px bg-border my-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>

      {selectedNote && <ResizeHandle onMouseDown={onMouseDown} isDragging={isDragging} />}
    </div>
  )
}
