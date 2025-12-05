"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { useResizable } from "@/hooks/use-resizable"
import { Sidebar, MobileDrawer } from "@/components/sidebar"
import { AboutSection } from "@/components/about-section"
import { NotesList } from "@/components/notes-list"
import { BookshelfList } from "@/components/bookshelf-list"
import { CaseStudiesList } from "@/components/case-studies-list"
import { SpeakingList } from "@/components/speaking-list"
import { SpeakingReader } from "@/components/speaking-reader"
import { NoteReader } from "@/components/note-reader"
import { BookReader } from "@/components/book-reader"
import { CaseStudyReader } from "@/components/case-study-reader"
import { ContentPanel } from "@/components/content-panel"
import { GallerySection } from "@/components/gallery-section"

type Tab = "about" | "bookshelf" | "notes" | "case-studies" | "speaking" | "gallery"

export default function PersonalWebsite() {
  const [activeTab, setActiveTab] = useState<Tab>("about")
  const [selectedNote, setSelectedNote] = useState<string | null>(null)
  const [selectedBook, setSelectedBook] = useState<string | null>(null)
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<string | null>(null)
  const [selectedSpeaking, setSelectedSpeaking] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const sidebar = useResizable({ initialWidth: 192, minWidth: 150, maxWidth: 400 })
  const notesList = useResizable({
    initialWidth: 600,
    minWidth: 200,
    maxWidth: 600,
    offsetX: sidebar.width,
  })
  const bookList = useResizable({
    initialWidth: 600,
    minWidth: 200,
    maxWidth: 600,
    offsetX: sidebar.width,
  })
  const caseStudiesList = useResizable({
    initialWidth: 600,
    minWidth: 200,
    maxWidth: 600,
    offsetX: sidebar.width,
  })
  const speakingList = useResizable({
    initialWidth: 600,
    minWidth: 200,
    maxWidth: 600,
    offsetX: sidebar.width,
  })

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    setMobileMenuOpen(false)
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-5 left-5 z-[60] md:hidden bg-background border border-border rounded-lg p-2.5 hover:bg-muted shadow-md"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Desktop sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        width={sidebar.width}
        isDragging={sidebar.isDragging}
        onMouseDown={sidebar.handleMouseDown}
        mobileMenuOpen={mobileMenuOpen}
      />

      {/* Mobile drawer */}
      <MobileDrawer
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main content area - desktop has margin for sidebar, mobile is full width */}
      <div 
        className="flex-1 flex md:ml-0"
        style={{ marginLeft: `${sidebar.width}px` }}
      >
        <style jsx>{`
          @media (max-width: 767px) {
            div {
              margin-left: 0 !important;
            }
          }
        `}</style>
        
        {activeTab === "notes" ? (
          <>
            <NotesList
              selectedNote={selectedNote}
              onSelectNote={setSelectedNote}
              width={notesList.width}
              isDragging={notesList.isDragging}
              onMouseDown={notesList.handleMouseDown}
            />
            {selectedNote && (
              <ContentPanel onClose={() => setSelectedNote(null)}>
                <NoteReader slug={selectedNote} />
              </ContentPanel>
            )}
          </>
        ) : activeTab === "bookshelf" ? (
          <>
            <BookshelfList
              selectedBook={selectedBook}
              onSelectBook={setSelectedBook}
              width={bookList.width}
              isDragging={bookList.isDragging}
              onMouseDown={bookList.handleMouseDown}
            />
            {selectedBook && (
              <ContentPanel onClose={() => setSelectedBook(null)}>
                <BookReader slug={selectedBook} />
              </ContentPanel>
            )}
          </>
        ) : activeTab === "case-studies" ? (
          <>
            <CaseStudiesList
              selectedCaseStudy={selectedCaseStudy}
              onSelectCaseStudy={setSelectedCaseStudy}
              width={caseStudiesList.width}
              isDragging={caseStudiesList.isDragging}
              onMouseDown={caseStudiesList.handleMouseDown}
            />
            {selectedCaseStudy && (
              <ContentPanel onClose={() => setSelectedCaseStudy(null)}>
                <CaseStudyReader slug={selectedCaseStudy} />
              </ContentPanel>
            )}
          </>
        ) : activeTab === "speaking" ? (
          <>
            <SpeakingList
              selectedSpeaking={selectedSpeaking}
              onSelectSpeaking={setSelectedSpeaking}
              width={speakingList.width}
              isDragging={speakingList.isDragging}
              onMouseDown={speakingList.handleMouseDown}
            />
            {selectedSpeaking && (
              <ContentPanel onClose={() => setSelectedSpeaking(null)}>
                <SpeakingReader slug={selectedSpeaking} />
              </ContentPanel>
            )}
          </>
        ) : activeTab === "gallery" ? (
          <GallerySection />
        ) : (
          <main className="flex-1 px-5 md:px-16 w-full md:max-w-3xl overflow-y-auto pt-16 md:pt-16 flex flex-col justify-between min-h-screen pb-0">
            <AboutSection onNavigateToSpeaking={() => setActiveTab("speaking")} />
          </main>
        )}
      </div>
    </div>
  )
}
