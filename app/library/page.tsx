"use client"

import { useState } from "react"
import { useResizable } from "@/hooks/use-resizable"
import { SiteLayout } from "@/components/site-layout"
import { BookshelfList } from "@/components/bookshelf-list"
import { BookReader } from "@/components/book-reader"
import { ContentPanel } from "@/components/content-panel"

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
      {selectedBook && (
        <ContentPanel 
          onClose={() => setSelectedBook(null)}
          onMouseDown={bookList.handleMouseDown}
          isDragging={bookList.isDragging}
        >
          <BookReader slug={selectedBook} />
        </ContentPanel>
      )}
    </SiteLayout>
  )
}
