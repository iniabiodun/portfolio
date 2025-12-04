"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { books } from "@/content/books"
import { cn } from "@/lib/utils"
import { ResizeHandle } from "./resize-handle"
import { Footer } from "./footer"

interface BookshelfListProps {
  selectedBook: string | null
  onSelectBook: (slug: string) => void
  width: number
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent) => void
}

export function BookshelfList({ selectedBook, onSelectBook, width, isDragging, onMouseDown }: BookshelfListProps) {
  const [hoveredBook, setHoveredBook] = useState<string | null>(null)

  const hoveredBookData = hoveredBook ? books.find(b => b.slug === hoveredBook) : null

  return (
    <div
      style={{ width: `${width}px` }}
      className={cn(
        "relative overflow-y-auto shrink-0 border-r border-border h-screen max-md:!w-full",
        selectedBook && "max-md:hidden",
      )}
    >
      {/* Hover book cover - positioned in middle of viewport with smooth animation */}
      <AnimatePresence>
        {hoveredBookData?.coverImage && (
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
          <h1 className="text-4xl font-serif mb-8">Bookshelf</h1>

          <div className="space-y-8">
          <div>
            <h2 className=" text-xs uppercase tracking-widest text-muted-foreground mb-4">Now reading</h2>
            <ol className="space-y-0">
              {books
                .filter((book) => book.isReading)
                .map((book) => (
                  <li key={book.slug} className="text-foreground">
                    <div className="inline-block align-top" style={{ width: "calc(100% - 1.5em)" }}>
                      <button
                        onClick={() => {
                          if (book.hasNotes) {
                            onSelectBook(book.slug)
                          }
                        }}
                        onMouseEnter={() => book.coverImage && setHoveredBook(book.slug)}
                        onMouseLeave={() => setHoveredBook(null)}
                        disabled={!book.hasNotes}
                        className={cn(
                          "w-full text-left space-y-1.5 py-3 transition-colors group",
                          book.hasNotes && "cursor-pointer",
                          !book.hasNotes && "cursor-default",
                        )}
                      >
                        <div className="flex items-baseline gap-2">
                          <div className="text-base font-medium text-foreground">{book.title}</div>
                          {book.hasNotes && (
                            <span className="text-muted-foreground text-sm transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {book.author}, {book.year}
                        </div>
                      </button>
                    </div>
                  </li>
                ))}
            </ol>
          </div>

          <div>
            <h2 className=" text-xs uppercase tracking-widest text-muted-foreground mb-4">On my shelf</h2>
            <ol className="space-y-0">
              {books
                .filter((book) => !book.isReading)
                .map((book) => (
                  <li key={book.slug} className="text-foreground">
                    <div className="inline-block align-top">
                      <button
                        onClick={() => {
                          if (book.hasNotes) {
                            onSelectBook(book.slug)
                          }
                        }}
                        onMouseEnter={() => book.coverImage && setHoveredBook(book.slug)}
                        onMouseLeave={() => setHoveredBook(null)}
                        disabled={!book.hasNotes}
                        className={cn(
                          "w-full text-left space-y-1.5 py-3 transition-colors group",
                          book.hasNotes && "cursor-pointer",
                          !book.hasNotes && "cursor-default",
                        )}
                      >
                        <div className="flex items-baseline gap-2">
                          <div className={cn("text-base font-medium text-foreground", book.hasNotes && "group-hover:underline")}>{book.title}</div>
                          {book.hasNotes && (
                            <span className="text-muted-foreground text-sm transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {book.author}, {book.year}
                        </div>
                      </button>
                    </div>
                  </li>
                ))}
            </ol>
          </div>
        </div>
        </div>

        <Footer />
      </div>

      {selectedBook && <ResizeHandle onMouseDown={onMouseDown} isDragging={isDragging} />}
    </div>
  )
}
