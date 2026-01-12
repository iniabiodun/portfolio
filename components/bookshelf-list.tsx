"use client"

import { useMemo, useRef } from "react"
import { books } from "@/content/books"
import { cn } from "@/lib/utils"
import { Footer } from "./footer"
import { ShelfSection } from "./shelf-section"
import { ResizeHandle } from "./resize-handle"

interface BookshelfListProps {
  selectedBook: string | null
  onSelectBook: (slug: string | null) => void
  width: number
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent) => void
}

export function BookshelfList({ 
  selectedBook, 
  onSelectBook, 
  width, 
  isDragging, 
  onMouseDown 
}: BookshelfListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Handle book selection
  const handleSelectBook = (slug: string | null) => {
    onSelectBook(slug)
  }
  // Categorize books
  // Currently reading: isReading = true, not finished
  const currentlyReading = useMemo(() => 
    books.filter(book => book.isReading && !book.hasNotes),
    []
  )

  // Finished: has notes (completed with thoughts)
  const finished = useMemo(() => 
    books.filter(book => book.hasNotes),
    []
  )

  // Next up: not reading and not finished
  const nextUp = useMemo(() => 
    books.filter(book => !book.isReading && !book.hasNotes),
    []
  )

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
        ref={scrollRef}
        style={{ width: `${width}px` }}
        className={cn(
          "list-container relative overflow-y-auto overflow-x-hidden shrink-0 border-r border-border h-screen max-md:w-full max-md:pt-20 [overflow-scrolling:touch]",
          selectedBook && "max-md:hidden",
        )}
      >
        <div className="px-6 md:px-16 pt-20 md:pt-16 pb-0 w-full md:max-w-3xl flex flex-col justify-between min-h-full">
          <div>
            <h1 className="text-4xl font-serif mb-8">Library</h1>
            <p className="text-muted-foreground mb-8">Books, readings, and notes.</p>

            {/* Wooden Shelf Sections - full width on mobile */}
            <div className="space-y-6 -mx-6 md:-mx-4">
              {currentlyReading.length > 0 && (
                <ShelfSection
                  title="Currently reading"
                  books={currentlyReading}
                  selectedBookSlug={selectedBook}
                  onSelectBook={handleSelectBook}
                />
              )}

              {nextUp.length > 0 && (
                <ShelfSection
                  title="Next up"
                  books={nextUp}
                  selectedBookSlug={selectedBook}
                  onSelectBook={handleSelectBook}
                />
              )}

              {finished.length > 0 && (
                <ShelfSection
                  title="Finished"
                  books={finished}
                  selectedBookSlug={selectedBook}
                  onSelectBook={handleSelectBook}
                />
              )}
            </div>
          </div>

          <Footer />
        </div>

        <ResizeHandle onMouseDown={onMouseDown} isDragging={isDragging} />
      </div>
    </>
  )
}
