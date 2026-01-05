"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Footer } from "./footer"
import { SpatialArtwork } from "./spatial-artwork"

interface Artwork {
  id: string
  artworkSrc: string
  frameSrc?: string
  title: string
  year: number
  description?: string
  description2?: string
}

const artworks: Artwork[] = [
  {
    id: "woman-2018",
    artworkSrc: "/3. Gallery/Artwork-1-Woman-Ini-Abiodun-2018.png",
    frameSrc: "/3. Gallery/Artwork-Frame-1.png",
    title: "Woman",
    year: 2018,
    description: "A study of shapes and the female form.",
    description2: "Continuously painted over 17 hours.",
  },
  // Add more artworks here as needed
]

export function GallerySection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const currentArtwork = artworks[currentIndex]

  const goToPrevious = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev === 0 ? artworks.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev === artworks.length - 1 ? 0 : prev + 1))
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  }

  return (
    <div 
      className="flex-1 min-h-screen flex flex-col px-5 md:px-16 max-md:pt-20"
      style={{ backgroundColor: '#1F0405' }}
    >
      <main className="flex-1 flex flex-col items-center justify-center py-8 relative">
        {/* Gallery header */}
        <p className="font-mono text-xs uppercase tracking-widest mb-8 text-white/80">
          THE ART OF ÌNÍOLÚWA
        </p>

        {/* Artwork carousel */}
        <div className="relative w-full flex items-center justify-center">
          {/* Previous button */}
          {artworks.length > 1 && (
            <button
              onClick={goToPrevious}
              className="absolute left-0 md:left-4 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
              aria-label="Previous artwork"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white/70" />
            </button>
          )}

          {/* Artwork display */}
          <div className="w-full max-w-4xl overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentArtwork.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
              >
                <SpatialArtwork
                  artworkSrc={currentArtwork.artworkSrc}
                  frameSrc={currentArtwork.frameSrc}
                  title={currentArtwork.title}
                  year={currentArtwork.year}
                  description={currentArtwork.description}
                  description2={currentArtwork.description2}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next button */}
          {artworks.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-0 md:right-4 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
              aria-label="Next artwork"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white/70" />
            </button>
          )}
        </div>

        {/* Dot indicators */}
        {artworks.length > 1 && (
          <div className="flex gap-2 mt-8">
            {artworks.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1)
                  setCurrentIndex(index)
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-white/80 w-6"
                    : "bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to artwork ${index + 1}`}
              />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  )
}
