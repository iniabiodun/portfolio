"use client"

import { useState } from "react"
import { useResizable } from "@/hooks/use-resizable"
import { SiteLayout } from "@/components/site-layout"
import { CaseStudiesList } from "@/components/case-studies-list"
import { CaseStudyReader } from "@/components/case-study-reader"
import { ContentPanel } from "@/components/content-panel"
import { AnimatePresence, motion } from "framer-motion"

export default function WorkLogPage() {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<string | null>(null)
  const caseStudiesList = useResizable({
    initialWidth: 600,
    minWidth: 300,
    maxWidth: 800,
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
      <AnimatePresence mode="wait">
        {selectedCaseStudy && (
          <>
            {/* Mobile backdrop - fades in/out */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedCaseStudy(null)}
            />
            
            <ContentPanel 
              key="case-study-reader"
              onClose={() => setSelectedCaseStudy(null)}
              onMouseDown={caseStudiesList.handleMouseDown}
              isDragging={caseStudiesList.isDragging}
            >
              <CaseStudyReader slug={selectedCaseStudy} />
            </ContentPanel>
          </>
        )}
      </AnimatePresence>
    </SiteLayout>
  )
}


