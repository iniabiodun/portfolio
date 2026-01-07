"use client"

import { useState, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { books } from "@/content/books"
import { cn } from "@/lib/utils"
import { Footer } from "./footer"
import { BookCarousel } from "./book-carousel"

export function BookshelfList() {
  const [hoveredBook, setHoveredBook] = useState<string | null>(null)
  const [selectedBook, setSelectedBook] = useState<string | null>(null)

  // Get books with 3D covers (for carousel)
  const booksWithCovers = useMemo(() => 
    books.filter(book => book.coverImage && book.spineImage),
    []
  )

  // Debug: Check production data
  if (typeof window !== 'undefined') {
    const circe = books.find(b => b.slug === 'circe');
    console.log('[DEBUG] Circe data:', { cover: circe?.coverImage, spine: circe?.spineImage });
    console.log('[DEBUG] Books with covers:', booksWithCovers.length, booksWithCovers.map(b => b.slug));
  }

  // Get books without 3D covers (for text list)
  const booksWithoutCovers = useMemo(() => 
    books.filter(book => !book.coverImage || !book.spineImage),
    []
  )

  const hoveredBookData = hoveredBook ? books.find(b => b.slug === hoveredBook) : null

  return (
    <div className="relative overflow-y-auto h-screen w-full max-md:pt-20">
      {/* Hover book cover for text list items */}
      <AnimatePresence>
        {hoveredBookData?.coverImage && !booksWithCovers.some(b => b.slug === hoveredBookData.slug) && (
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

      <div className="px-6 md:px-16 pt-20 md:pt-16 pb-0 w-full md:max-w-3xl flex flex-col justify-between min-h-full">
        <div>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-serif mb-4">Library</h1>
            <p className="text-muted-foreground">Books, readings, and notes.</p>
          </div>

          {/* 3D Book Carousel */}
          {booksWithCovers.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                On the Shelf
              </h2>
              <BookCarousel
                books={booksWithCovers}
                selectedBookSlug={selectedBook}
                onSelectBook={setSelectedBook}
              />
            </div>
          )}

          {/* Text List for Other Books */}
          {booksWithoutCovers.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
                More Books
              </h2>

              <div className="space-y-0">
                {booksWithoutCovers.map((book) => (
                  <button
                    key={book.slug}
                    onClick={() => {
                      if (book.hasNotes) {
                        setSelectedBook(selectedBook === book.slug ? null : book.slug)
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
                        src="/Bookshelf/pen-nib.svg" 
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
          )}
        </div>

        <Footer />
      </div>
    </div>
  )
}
