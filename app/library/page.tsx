"use client"

import { SiteLayout } from "@/components/site-layout"
import { BookshelfList } from "@/components/bookshelf-list"

export default function LibraryPage() {
  return (
    <SiteLayout>
      <BookshelfList />
    </SiteLayout>
  )
}
