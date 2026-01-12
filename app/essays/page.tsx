"use client"

import { useState } from "react"
import { useResizable } from "@/hooks/use-resizable"
import { SiteLayout } from "@/components/site-layout"
import { NotesList } from "@/components/notes-list"
import { NoteReader } from "@/components/note-reader"
import { ContentPanel } from "@/components/content-panel"

export default function EssaysPage() {
  const [selectedNote, setSelectedNote] = useState<string | null>(null)
  const notesList = useResizable({
    initialWidth: 600,
    minWidth: 300,
    maxWidth: 800,
  })

  return (
    <SiteLayout>
      <NotesList
        selectedNote={selectedNote}
        onSelectNote={setSelectedNote}
        width={notesList.width}
        isDragging={notesList.isDragging}
        onMouseDown={notesList.handleMouseDown}
      />
      {selectedNote && (
        <ContentPanel 
          onClose={() => setSelectedNote(null)}
          onMouseDown={notesList.handleMouseDown}
          isDragging={notesList.isDragging}
        >
          <NoteReader slug={selectedNote} />
        </ContentPanel>
      )}
    </SiteLayout>
  )
}


