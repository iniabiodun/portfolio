"use client"

import { use } from "react"
import { useResizable } from "@/hooks/use-resizable"
import { SiteLayout } from "@/components/site-layout"
import { NotesList } from "@/components/notes-list"
import { NoteReader } from "@/components/note-reader"
import { ContentPanel } from "@/components/content-panel"
import { useRouter } from "next/navigation"

export default function EssayDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const notesList = useResizable({
    initialWidth: 600,
    minWidth: 200,
    maxWidth: 600,
  })

  const handleSelectNote = (newSlug: string | null) => {
    if (newSlug) {
      router.push(`/essays/${newSlug}`)
    } else {
      router.push('/essays')
    }
  }

  const handleClose = () => {
    router.push('/essays')
  }

  return (
    <SiteLayout>
      <NotesList
        selectedNote={slug}
        onSelectNote={handleSelectNote}
        width={notesList.width}
        isDragging={notesList.isDragging}
        onMouseDown={notesList.handleMouseDown}
      />
      <ContentPanel 
        onClose={handleClose}
        onMouseDown={notesList.handleMouseDown}
        isDragging={notesList.isDragging}
      >
        <NoteReader slug={slug} />
      </ContentPanel>
    </SiteLayout>
  )
}


