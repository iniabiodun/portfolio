"use client"

import { use } from "react"
import { useResizable } from "@/hooks/use-resizable"
import { SiteLayout } from "@/components/site-layout"
import { BookshelfList } from "@/components/bookshelf-list"
import { BookReader } from "@/components/book-reader"
import { ContentPanel } from "@/components/content-panel"
import { useRouter } from "next/navigation"

export default function BookDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const bookList = useResizable({
    initialWidth: 600,
    minWidth: 200,
    maxWidth: 600,
  })

  const handleSelectBook = (newSlug: string | null) => {
    if (newSlug) {
      router.push(`/library/${newSlug}`)
    } else {
      router.push('/library')
    }
  }

  const handleClose = () => {
    router.push('/library')
  }

  return (
    <SiteLayout>
      <BookshelfList
        selectedBook={slug}
        onSelectBook={handleSelectBook}
        width={bookList.width}
        isDragging={bookList.isDragging}
        onMouseDown={bookList.handleMouseDown}
      />
      <ContentPanel 
        onClose={handleClose}
        onMouseDown={bookList.handleMouseDown}
        isDragging={bookList.isDragging}
      >
        <BookReader slug={slug} />
      </ContentPanel>
    </SiteLayout>
  )
}

