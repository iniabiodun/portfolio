import { caseStudies } from "@/content/case-studies"
import { cn } from "@/lib/utils"
import { ResizeHandle } from "./resize-handle"
import { Footer } from "./footer"

interface CaseStudiesListProps {
  selectedCaseStudy: string | null
  onSelectCaseStudy: (slug: string) => void
  width: number
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent) => void
}

// Helper function to parse date string and return comparable timestamp
function parseCaseStudyDate(dateString: string): number {
  // Try to parse as Date, fallback to 0 if invalid
  const parsed = new Date(dateString).getTime()
  return isNaN(parsed) ? 0 : parsed
}

// Helper function to remove year from date string for list display
function formatDateForList(dateString: string): string {
  // Remove the year (e.g., "2025 / B2B / $125M Series D" -> "B2B / $125M Series D")
  const parts = dateString.split(' / ')
  if (parts.length > 1 && /^\d{4}$/.test(parts[0])) {
    return parts.slice(1).join(' / ')
  }
  return dateString
}

// Sort case studies in reverse chronological order (newest first)
function sortCaseStudiesByDate() {
  return [...caseStudies].sort((a, b) => parseCaseStudyDate(b.date) - parseCaseStudyDate(a.date))
}

export function CaseStudiesList({ selectedCaseStudy, onSelectCaseStudy, width, isDragging, onMouseDown }: CaseStudiesListProps) {
  const sortedCaseStudies = sortCaseStudiesByDate()
  return (
    <>
      <style jsx>{`
        @media (max-width: 767px) {
          .list-container {
            width: 100% !important;
          }
        }
      `}</style>
      <div
        style={{ width: `${width}px` }}
        className={cn(
          "list-container relative overflow-y-auto shrink-0 border-r border-border h-screen max-md:w-full max-md:pt-20",
          selectedCaseStudy && "max-md:hidden",
        )}
      >
      <div className="px-6 md:px-16 pt-20 md:pt-16 pb-0 w-full md:max-w-3xl flex flex-col justify-between min-h-full">
        <div>
          <h1 className="text-4xl font-serif mb-8">Work Log</h1>
          <p className="text-muted-foreground mb-8 font-sans font-semibold">Selected projects & design work.</p>
          <div className="space-y-0">
            {sortedCaseStudies.map((caseStudy, index) => (
              <div key={caseStudy.slug} className="relative">
                {caseStudy.disabled ? (
                  <div className="w-full text-left space-y-1.5 py-3 opacity-50 cursor-not-allowed">
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-lg font-medium text-foreground">{caseStudy.title}</h2>
                    </div>
                    <p className="text-xs text-muted-foreground font-sans uppercase tracking-widest">{formatDateForList(caseStudy.date)}</p>
                  </div>
                ) : (
                  <button
                    onClick={() => onSelectCaseStudy(caseStudy.slug)}
                    className="w-full text-left space-y-1.5 py-3 transition-colors group"
                  >
                    <div className="flex items-start gap-2">
                      <img 
                        src="/Bookshelf/pen-nib.svg" 
                        alt="" 
                        className={cn(
                          "pen-nib-icon w-4 h-4 transition-opacity duration-200 flex-shrink-0 mt-[0.2rem]",
                          selectedCaseStudy === caseStudy.slug ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                        )}
                      />
                      <h2 className="text-lg font-medium text-foreground">{caseStudy.title}</h2>
                    </div>
                    <p className="text-xs text-muted-foreground font-sans uppercase tracking-widest pl-5">{formatDateForList(caseStudy.date)}</p>
                  </button>
                )}
                {index < sortedCaseStudies.length - 1 && (
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
    </>
  )
}

