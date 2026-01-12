"use client"

import { useState } from "react"
import { useResizable } from "@/hooks/use-resizable"
import { SiteLayout } from "@/components/site-layout"
import { SpeakingList } from "@/components/speaking-list"
import { SpeakingReader } from "@/components/speaking-reader"
import { ContentPanel } from "@/components/content-panel"
import { AnimatePresence, motion } from "framer-motion"

export default function EventsPage() {
  const [selectedSpeaking, setSelectedSpeaking] = useState<string | null>(null)
  const speakingList = useResizable({
    initialWidth: 600,
    minWidth: 300,
    maxWidth: 800,
  })

  return (
    <SiteLayout>
      <SpeakingList
        selectedSpeaking={selectedSpeaking}
        onSelectSpeaking={setSelectedSpeaking}
        width={speakingList.width}
        isDragging={speakingList.isDragging}
        onMouseDown={speakingList.handleMouseDown}
      />
      <AnimatePresence mode="wait">
        {selectedSpeaking && (
          <>
            {/* Mobile backdrop - fades in/out */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedSpeaking(null)}
            />
            
            <ContentPanel 
              key="speaking-reader"
              onClose={() => setSelectedSpeaking(null)}
              onMouseDown={speakingList.handleMouseDown}
              isDragging={speakingList.isDragging}
            >
              <SpeakingReader slug={selectedSpeaking} />
            </ContentPanel>
          </>
        )}
      </AnimatePresence>
    </SiteLayout>
  )
}


