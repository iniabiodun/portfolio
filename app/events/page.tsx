"use client"

import { useState } from "react"
import { useResizable } from "@/hooks/use-resizable"
import { SiteLayout } from "@/components/site-layout"
import { SpeakingList } from "@/components/speaking-list"
import { SpeakingReader } from "@/components/speaking-reader"
import { ContentPanel } from "@/components/content-panel"

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
      {selectedSpeaking && (
        <ContentPanel 
          onClose={() => setSelectedSpeaking(null)}
          onMouseDown={speakingList.handleMouseDown}
          isDragging={speakingList.isDragging}
        >
          <SpeakingReader slug={selectedSpeaking} />
        </ContentPanel>
      )}
    </SiteLayout>
  )
}


