"use client"

import { use } from "react"
import { useResizable } from "@/hooks/use-resizable"
import { SiteLayout } from "@/components/site-layout"
import { CaseStudiesList } from "@/components/case-studies-list"
import { CaseStudyReader } from "@/components/case-study-reader"
import { ContentPanel } from "@/components/content-panel"
import { useRouter } from "next/navigation"

export default function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const caseStudiesList = useResizable({
    initialWidth: 600,
    minWidth: 200,
    maxWidth: 600,
  })

  const handleSelectCaseStudy = (newSlug: string | null) => {
    if (newSlug) {
      router.push(`/work-log/${newSlug}`)
    } else {
      router.push('/work-log')
    }
  }

  const handleClose = () => {
    router.push('/work-log')
  }

  return (
    <SiteLayout>
      <CaseStudiesList
        selectedCaseStudy={slug}
        onSelectCaseStudy={handleSelectCaseStudy}
        width={caseStudiesList.width}
        isDragging={caseStudiesList.isDragging}
        onMouseDown={caseStudiesList.handleMouseDown}
      />
      <ContentPanel 
        onClose={handleClose}
        onMouseDown={caseStudiesList.handleMouseDown}
        isDragging={caseStudiesList.isDragging}
      >
        <CaseStudyReader slug={slug} />
      </ContentPanel>
    </SiteLayout>
  )
}

