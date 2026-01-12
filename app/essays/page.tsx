"use client"

import { useState } from "react"
import { useResizable } from "@/hooks/use-resizable"
import { SiteLayout } from "@/components/site-layout"
import { NotesList } from "@/components/notes-list"
import { NoteReader } from "@/components/note-reader"
import { ContentPanel } from "@/components/content-panel"
import { AnimatePresence, motion } from "framer-motion"

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
      <AnimatePresence mode="wait">
        {selectedNote && (
          <>
            {/* Mobile backdrop - fades in/out */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedNote(null)}
            />
            
            <ContentPanel 
              key="note-reader"
              onClose={() => setSelectedNote(null)}
              onMouseDown={notesList.handleMouseDown}
              isDragging={notesList.isDragging}
            >
              <NoteReader slug={selectedNote} />
            </ContentPanel>
          </>
        )}
      </AnimatePresence>
    </SiteLayout>
  )
}


