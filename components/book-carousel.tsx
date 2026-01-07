"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Book3D } from "./book-3d"
import { Book } from "@/content/books"

interface BookCarouselProps {
  books: Book[]
  selectedBookSlug: string | null
  onSelectBook: (slug: string | null) => void
}

export function BookCarousel({ books, selectedBookSlug, onSelectBook }: BookCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    if (!carouselRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    checkScrollPosition()
    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener('scroll', checkScrollPosition)
      return () => carousel.removeEventListener('scroll', checkScrollPosition)
    }
  }, [books])

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return
    const scrollAmount = 300
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  // Find selected index
  const selectedIndex = selectedBookSlug 
    ? books.findIndex(b => b.slug === selectedBookSlug)
    : -1

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="relative group">
        {/* Left Arrow */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll('left')}
              className="absolute -left-2 md:left-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-10 md:h-10 bg-background/95 backdrop-blur-sm border border-border rounded-full flex items-center justify-center shadow-lg hover:bg-background active:scale-95 transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Right Arrow */}
        <AnimatePresence>
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll('right')}
              className="absolute -right-2 md:right-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-10 md:h-10 bg-background/95 backdrop-blur-sm border border-border rounded-full flex items-center justify-center shadow-lg hover:bg-background active:scale-95 transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Books Row */}
        <div
          ref={carouselRef}
          className="flex items-end overflow-x-auto py-8 px-4 -mx-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ gap: '4px' }}
        >
          {books.map((book, index) => {
            const isSelected = selectedBookSlug === book.slug
            const isHovered = hoveredIndex === index
            
            // Check neighbor relationships
            const isLeftOfHovered = hoveredIndex !== null && index === hoveredIndex - 1
            const isRightOfHovered = hoveredIndex !== null && index === hoveredIndex + 1
            const isLeftOfSelected = selectedIndex !== -1 && index === selectedIndex - 1
            const isRightOfSelected = selectedIndex !== -1 && index === selectedIndex + 1
            
            // Calculate padding - accumulate from different states
            let paddingLeft = 0
            let paddingRight = 0
            
            // Selection spacing (highest priority, larger values)
            if (isSelected) {
              paddingLeft += 12
              paddingRight += 12
            }
            
            // Selected neighbor spacing
            if (isLeftOfSelected) {
              paddingRight += 12
            }
            if (isRightOfSelected) {
              paddingLeft += 12
            }
            
            // Hover spacing - always applies when hovered (unless selected)
            if (isHovered && !isSelected) {
              paddingLeft += 20
              paddingRight += 20
            }
            
            // Hover neighbor spacing - always applies
            if (isLeftOfHovered && !isSelected) {
              paddingRight += 16
            }
            if (isRightOfHovered && !isSelected) {
              paddingLeft += 16
            }
            
            return (
              <motion.div
                key={book.slug}
                className="flex-shrink-0"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                animate={{
                  paddingLeft,
                  paddingRight,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              >
                <Book3D
                  title={book.title}
                  author={book.author}
                  coverImage={book.coverImage!}
                  spineImage={book.spineImage!}
                  size="md"
                  isSelected={isSelected}
                  leanAngle={0}
                  onClick={() => {
                    if (isSelected) {
                      onSelectBook(null)
                    } else {
                      onSelectBook(book.slug)
                    }
                  }}
                />
              </motion.div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
