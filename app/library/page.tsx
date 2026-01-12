"use client"

import { useState } from "react"
import { useResizable } from "@/hooks/use-resizable"
import { SiteLayout } from "@/components/site-layout"
import { BookshelfList } from "@/components/bookshelf-list"
import { BookReader } from "@/components/book-reader"
import { ContentPanel } from "@/components/content-panel"
import { AnimatePresence, motion } from "framer-motion"

export default function LibraryPage() {
  const [selectedBook, setSelectedBook] = useState<string | null>(null)
  const bookList = useResizable({
    initialWidth: 600,
    minWidth: 300,
    maxWidth: 800,
  })

  return (
    <SiteLayout>
      <BookshelfList
        selectedBook={selectedBook}
        onSelectBook={setSelectedBook}
        width={bookList.width}
        isDragging={bookList.isDragging}
        onMouseDown={bookList.handleMouseDown}
      />
      <AnimatePresence mode="wait">
        {selectedBook && (
          <>
            {/* Mobile backdrop - fades in/out */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedBook(null)}
            />
            
            <ContentPanel 
              key="book-reader"
              onClose={() => setSelectedBook(null)}
              onMouseDown={bookList.handleMouseDown}
              isDragging={bookList.isDragging}
            >
              <BookReader slug={selectedBook} />
            </ContentPanel>
          </>
        )}
      </AnimatePresence>
    </SiteLayout>
  )
}
