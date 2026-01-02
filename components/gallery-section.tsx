"use client"

import { Footer } from "./footer"

export function GallerySection() {
  return (
    <div 
      className="flex-1 min-h-screen flex flex-col px-5 md:px-16 max-md:pt-20"
      style={{ backgroundColor: '#1F0405' }}
    >
      <main className="flex-1 flex flex-col items-center justify-center py-16">
        <p className="font-mono text-xs uppercase tracking-widest mb-8 text-white/80">
          THE ART OF ÌNÍOLÚWA
        </p>
        
        <img 
          src="/3. Gallery/Woman.png" 
          alt="Woman" 
          className="object-contain"
          style={{ maxWidth: '60%', maxHeight: '60vh' }}
        />
        
        <div className="mt-8 text-center text-white/80">
          <p className="font-sans text-lg mb-2">
            Woman, 2018
          </p>
          <p className="font-sans text-sm text-white/60 max-w-md">
            A study of shapes and the female form.
          </p>
          <p className="font-sans text-sm text-white/60 max-w-md">
            Continuously painted over 17 hours.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

