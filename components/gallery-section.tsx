"use client"

import { Footer } from "./footer"

export function GallerySection() {
  return (
    <div 
      className="flex-1 min-h-screen flex flex-col"
      style={{ backgroundColor: '#2A0107' }}
    >
      <main className="flex-1 flex items-center justify-center px-6 md:px-16 py-16">
        <img 
          src="/3. Gallery/Woman.png" 
          alt="Woman" 
          className="max-w-full max-h-[80vh] object-contain"
        />
      </main>
      
      <div className="px-6 md:px-16 pb-8">
        <Footer />
      </div>
    </div>
  )
}

