"use client"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Book3D } from "./book-3d"
import { Book } from "@/content/books"
import { useLighting } from "@/lib/lighting-context"

// Wood texture paths for each lighting mode
const woodTextures = {
  natural: "/Bookshelf/honey-oak-wood.png",
  warm: "/Bookshelf/birch-maple-wood.png",
  ambient: "/Bookshelf/dark-walnut-wood.png",
}

interface ShelfSectionProps {
  title: string
  books: Book[]
  selectedBookSlug: string | null
  onSelectBook: (slug: string | null) => void
}

export function ShelfSection({ 
  title, 
  books, 
  selectedBookSlug, 
  onSelectBook
}: ShelfSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const { mode } = useLighting()
  
  // Get the appropriate wood texture for current lighting mode
  const woodTexture = woodTextures[mode]
  const isDark = mode === "ambient"

  // Check scroll position
  const checkScrollPosition = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    checkScrollPosition()
    const container = scrollRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollPosition)
      window.addEventListener('resize', checkScrollPosition)
      return () => {
        container.removeEventListener('scroll', checkScrollPosition)
        window.removeEventListener('resize', checkScrollPosition)
      }
    }
  }, [books])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = 280
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  // Find selected index for spacing calculations
  const selectedIndex = selectedBookSlug 
    ? books.findIndex(b => b.slug === selectedBookSlug)
    : -1

  if (books.length === 0) return null

  return (
    <div className="mb-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground">{title}</h2>
      </div>
      
      {/* Books on shelf with scroll */}
      <div className="relative group">
        {/* Left Arrow - positioned inside on mobile */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll('left')}
              className="absolute left-1 sm:-left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-9 sm:h-9 bg-background/95 backdrop-blur-sm border border-border rounded-full flex items-center justify-center shadow-lg hover:bg-background active:scale-95 transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 sm:w-4 sm:h-4" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Right Arrow - positioned inside on mobile */}
        <AnimatePresence>
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll('right')}
              className="absolute right-1 sm:-right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-9 sm:h-9 bg-background/95 backdrop-blur-sm border border-border rounded-full flex items-center justify-center shadow-lg hover:bg-background active:scale-95 transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 sm:w-4 sm:h-4" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Scrollable books container */}
        <div
          ref={scrollRef}
          className="flex items-end gap-1 px-6 pb-0 pt-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {books.map((book, index) => {
            const isSelected = selectedBookSlug === book.slug
            const isHovered = hoveredIndex === index
            
            // Neighbor relationships
            const isLeftOfHovered = hoveredIndex !== null && index === hoveredIndex - 1
            const isRightOfHovered = hoveredIndex !== null && index === hoveredIndex + 1
            const isLeftOfSelected = selectedIndex !== -1 && index === selectedIndex - 1
            const isRightOfSelected = selectedIndex !== -1 && index === selectedIndex + 1
            
            // Calculate padding for smooth spacing
            let paddingLeft = 0
            let paddingRight = 0
            
            if (isSelected) {
              paddingLeft += 8
              paddingRight += 8
            }
            if (isLeftOfSelected) paddingRight += 8
            if (isRightOfSelected) paddingLeft += 8
            
            if (isHovered && !isSelected) {
              paddingLeft += 12
              paddingRight += 12
            }
            if (isLeftOfHovered && !isSelected) paddingRight += 10
            if (isRightOfHovered && !isSelected) paddingLeft += 10

            // Subtle lean angle for visual interest
            const leanAngle = (index % 3 - 1) * 1.5

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
                  coverImage={book.coverImage}
                  spineImage={book.spineImage}
                  aspectRatio={book.aspectRatio}
                  isbn={book.isbn}
                  size="sm"
                  isSelected={isSelected}
                  leanAngle={leanAngle}
                  showCoverByDefault={true}
                  onClick={() => {
                    onSelectBook(isSelected ? null : book.slug)
                  }}
                />
              </motion.div>
            )
          })}
        </div>

        {/* Wooden shelf with real texture */}
        <div 
          className="h-5 rounded-t-sm mx-2 relative overflow-hidden"
          style={{
            backgroundImage: `url(${woodTexture})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: `0 4px 12px var(--shelf-shadow), inset 0 1px 0 ${isDark ? 'rgba(255,200,120,0.08)' : 'rgba(255,255,255,0.4)'}`,
          }}
        >
          {/* 3D lighting gradient overlay */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isDark 
                ? `linear-gradient(to bottom, rgba(255,200,120,0.06) 0%, transparent 40%, rgba(0,0,0,0.2) 100%)`
                : `linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, transparent 40%, rgba(0,0,0,0.08) 100%)`,
            }}
          />
        </div>
        {/* Shelf edge/lip with texture */}
        <div 
          className="h-2 -mt-px rounded-b-sm mx-2 relative overflow-hidden"
          style={{
            backgroundImage: `url(${woodTexture})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
            boxShadow: `0 2px 4px var(--shelf-shadow)`,
          }}
        >
          {/* Darker overlay for edge depth */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isDark 
                ? `linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.4) 100%)`
                : `linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 100%)`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

