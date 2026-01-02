"use client"

import { use } from "react"
import { useResizable } from "@/hooks/use-resizable"
import { SiteLayout } from "@/components/site-layout"
import { SpeakingList } from "@/components/speaking-list"
import { SpeakingReader } from "@/components/speaking-reader"
import { ContentPanel } from "@/components/content-panel"
import { useRouter } from "next/navigation"

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const speakingList = useResizable({
    initialWidth: 600,
    minWidth: 200,
    maxWidth: 600,
  })

  const handleSelectSpeaking = (newSlug: string | null) => {
    if (newSlug) {
      router.push(`/events/${newSlug}`)
    } else {
      router.push('/events')
    }
  }

  const handleClose = () => {
    router.push('/events')
  }

  return (
    <SiteLayout>
      <SpeakingList
        selectedSpeaking={slug}
        onSelectSpeaking={handleSelectSpeaking}
        width={speakingList.width}
        isDragging={speakingList.isDragging}
        onMouseDown={speakingList.handleMouseDown}
      />
      <ContentPanel 
        onClose={handleClose}
        onMouseDown={speakingList.handleMouseDown}
        isDragging={speakingList.isDragging}
      >
        <SpeakingReader slug={slug} />
      </ContentPanel>
    </SiteLayout>
  )
}

