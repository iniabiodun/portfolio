"use client"

import { useState } from "react"
import { useResizable } from "@/hooks/use-resizable"
import { SiteLayout } from "@/components/site-layout"
import { CaseStudiesList } from "@/components/case-studies-list"
import { CaseStudyReader } from "@/components/case-study-reader"
import { ContentPanel } from "@/components/content-panel"

export default function WorkLogPage() {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<string | null>(null)
  const caseStudiesList = useResizable({
    initialWidth: 600,
    minWidth: 200,
    maxWidth: 600,
  })

  return (
    <SiteLayout>
      <CaseStudiesList
        selectedCaseStudy={selectedCaseStudy}
        onSelectCaseStudy={setSelectedCaseStudy}
        width={caseStudiesList.width}
        isDragging={caseStudiesList.isDragging}
        onMouseDown={caseStudiesList.handleMouseDown}
      />
      {selectedCaseStudy && (
        <ContentPanel 
          onClose={() => setSelectedCaseStudy(null)}
          onMouseDown={caseStudiesList.handleMouseDown}
          isDragging={caseStudiesList.isDragging}
        >
          <CaseStudyReader slug={selectedCaseStudy} />
        </ContentPanel>
      )}
    </SiteLayout>
  )
}

