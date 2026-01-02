"use client"

import { useState, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { books } from "@/content/books"
import { cn } from "@/lib/utils"
import { ResizeHandle } from "./resize-handle"
import { Footer } from "./footer"
import { Book3D } from "./book-3d"

interface BookshelfListProps {
  selectedBook: string | null
  onSelectBook: (slug: string) => void
  width: number
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent) => void
}

export function BookshelfList({ selectedBook, onSelectBook, width, isDragging, onMouseDown }: BookshelfListProps) {
  const [hoveredBook, setHoveredBook] = useState<string | null>(null)

  // Get currently reading books (with covers for 3D display)
  const currentlyReading = useMemo(() => 
    books.filter(book => book.isReading && book.coverImage && book.spineImage),
    []
  )

  // Get all non-reading books
  const shelfBooks = useMemo(() => 
    books.filter(book => !book.isReading),
    []
  )

  const hoveredBookData = hoveredBook ? books.find(b => b.slug === hoveredBook) : null

  return (
    <div
      style={{ width: `${width}px` }}
      className={cn(
        "relative overflow-y-auto shrink-0 border-r border-border h-screen max-md:!w-full max-md:pt-20",
        selectedBook && "max-md:hidden",
      )}
    >
      {/* Hover book cover - positioned in middle of viewport with smooth animation */}
      <AnimatePresence>
        {hoveredBookData?.coverImage && !hoveredBookData.spineImage && (
          <motion.div 
            className="fixed pointer-events-none z-50"
            style={{
              left: '50%',
              top: '50%',
              x: '-50%',
              y: '-50%',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              mass: 0.5,
            }}
          >
            <motion.img
              src={hoveredBookData.coverImage}
              alt={hoveredBookData.title}
              className="w-48 h-auto object-contain rounded-sm"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              }}
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-6 md:px-16 pt-20 md:pt-16 pb-0 w-full md:max-w-4xl flex flex-col justify-between min-h-full">
        <div>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-serif mb-8">Library</h1>
            <p className="text-muted-foreground mb-8">Books, readings, and notes.</p>
          </div>

          {/* Currently Reading Section */}
          {currentlyReading.length > 0 && (
            <div className="mb-16">
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-8">
                Currently Reading
              </h2>
              
              <div className="flex flex-wrap gap-8 justify-start">
                {currentlyReading.map((book) => (
                  <div key={book.slug} className="flex flex-col items-center">
                    <Book3D
                      title={book.title}
                      author={book.author}
                      coverImage={book.coverImage!}
                      spineImage={book.spineImage!}
                      size="md"
                      onClick={() => book.hasNotes && onSelectBook(book.slug)}
                    />
                    <div className="mt-4 text-center max-w-[180px]">
                      <div className="text-sm font-medium text-foreground line-clamp-2">
                        {book.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {book.author}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* On My Shelf Section */}
          <div>
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
              On My Shelf
            </h2>

            {/* Book List */}
            <div className="space-y-0">
              {shelfBooks.map((book) => (
                <button
                  key={book.slug}
                  onClick={() => {
                    if (book.hasNotes) {
                      onSelectBook(book.slug)
                    }
                  }}
                  onMouseEnter={() => book.coverImage && setHoveredBook(book.slug)}
                  onMouseLeave={() => setHoveredBook(null)}
                  disabled={!book.hasNotes}
                  className={cn(
                    "w-full text-left py-3 transition-colors group",
                    book.hasNotes && "cursor-pointer",
                    !book.hasNotes && "cursor-default",
                  )}
                >
                  <div className="flex items-start gap-2">
                    <img 
                      src="/2. Bookshelf/pen-nib.svg" 
                      alt="" 
                      className={cn(
                        "pen-nib-icon w-4 h-4 transition-opacity duration-200 flex-shrink-0 mt-[0.2rem]",
                        selectedBook === book.slug ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                      )}
                    />
                    <div className="flex-1">
                      <div className={cn(
                        "text-lg font-medium text-foreground",
                        book.hasNotes && "group-hover:underline"
                      )}>
                        {book.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {book.author}, {book.year}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>

      <ResizeHandle onMouseDown={onMouseDown} isDragging={isDragging} />
    </div>
  )
}
