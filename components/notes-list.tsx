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
        "relative overflow-y-auto shrink-0 border-r border-border h-screen max-md:!w-full max-md:pt-20",
        selectedNote && "max-md:hidden",
      )}
    >
      <div className="px-6 md:px-16 pt-20 md:pt-16 pb-0 w-full md:max-w-3xl flex flex-col justify-between min-h-full">
        <div>
          <h1 className="text-4xl font-serif mb-8">Essays</h1>
          <p className="text-muted-foreground mb-8">Thoughts, notes and insights.</p>
          <div className="space-y-0">
            {sortedNotes.map((note, index) => (
              <div key={note.slug} className="relative">
                <button
                  onClick={() => onSelectNote(note.slug)}
                  className="w-full text-left space-y-1.5 py-3 transition-colors group"
                >
                  <div className="flex items-start gap-2">
                    <img 
                      src="/2. Bookshelf/pen-nib.svg" 
                      alt="" 
                      className={cn(
                        "pen-nib-icon w-4 h-4 transition-opacity duration-200 flex-shrink-0 mt-[0.2rem]",
                        selectedNote === note.slug ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                      )}
                    />
                    <h2 className="text-lg font-medium text-foreground">{note.title}</h2>
                  </div>
                  <p className="text-xs text-muted-foreground font-sans uppercase tracking-widest pl-5">{note.date}</p>
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

      <ResizeHandle onMouseDown={onMouseDown} isDragging={isDragging} />
    </div>
  )
}
