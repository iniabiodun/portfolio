'use client'

import { InfiniteCanvas } from '@/components/infinite-canvas'
import { CanvasItemData } from '@/components/canvas-item'
import { NavSidebar, MobileNavDrawer } from '@/components/nav-sidebar'
import { useLighting } from '@/lib/lighting-context'
import { useState, useEffect } from 'react'
import '@/styles/infinite-canvas.css'

// All items scattered around the canvas
const canvasItems: CanvasItemData[] = [
  // Documents with click-to-expand
  {
    id: 'about-me',
    type: 'document',
    src: '/1. About/about-me-card-warm.png',
    focusSrc: '/1. About/About-me-card.jpg',
    label: 'About Atelier ÌníOlúwa',
    description: 'A visual experiment into the physical space of a lawyer turned designer',
    x: -350,
    y: -180,
    width: 160,
    height: 230,
    depth: 0.2,
    rotation: -4,
  },
  {
    id: 'work-history',
    type: 'document',
    src: '/1. About/work-history-warm.png',
    focusSrc: '/1. About/Work-History-card.jpg',
    label: 'Work Experience',
    description: 'Twelve years designing at scale',
    x: 380,
    y: -150,
    width: 180,
    height: 260,
    depth: 0.3,
    rotation: 5,
  },
  {
    id: 'call-to-bar',
    type: 'document',
    src: '/1. About/call-to-bar-warm.png',
    focusSrc: '/1. About/Ini-Call-to-Nigerian-Bar.jpg',
    label: 'Legal Foundation',
    description: 'Law school taught me systems thinking',
    x: -420,
    y: 180,
    width: 140,
    height: 180,
    depth: 0.4,
    rotation: -2,
  },
  {
    id: 'worksheet',
    type: 'document',
    src: '/1. About/worksheet-warm.png',
    focusSrc: '/1. About/Worksheet.jpg',
    label: 'AI Conversation Navigation',
    description: 'Self-initiated research into AI conversations',
    x: 450,
    y: 200,
    width: 140,
    height: 180,
    depth: 0.25,
    rotation: 3,
  },

  // Decorative items (no click-to-expand)
  {
    id: 'sketchbook',
    type: 'image',
    src: '/1. About/sketch-book-warm.png',
    label: 'Sketchbook',
    x: -180,
    y: 320,
    width: 200,
    height: 120,
    depth: 0.35,
    rotation: -6,
  },
  {
    id: 'notepad',
    type: 'image',
    src: '/1. About/notepad-warm.png',
    label: 'Notes',
    x: 280,
    y: -320,
    width: 120,
    height: 140,
    depth: 0.5,
    rotation: 2,
  },
  {
    id: 'aso-oke',
    type: 'image',
    src: '/1. About/aso-oke-swatch-warm.png',
    label: 'Aso-Oke Swatch',
    description: 'Traditional Yoruba textile',
    x: -550,
    y: -30,
    width: 140,
    height: 100,
    depth: 0.45,
    rotation: -8,
  },
  {
    id: 'record-player',
    type: 'image',
    src: '/1. About/Crosley-music-off.png',
    label: 'Record Player',
    x: 520,
    y: 50,
    width: 160,
    height: 120,
    depth: 0.6,
    rotation: 0,
  },
  {
    id: 'telephone',
    type: 'image',
    src: '/1. About/telephone.svg',
    label: 'Telephone',
    x: -580,
    y: 280,
    width: 80,
    height: 100,
    depth: 0.55,
    rotation: 15,
  },
]

export default function AboutPage() {
  const { mode } = useLighting()
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  return (
    <>
      {/* Navigation overlay for desktop */}
      {isDesktop && (
        <div className="fixed top-0 left-0 z-50">
          <NavSidebar />
        </div>
      )}

      {/* Mobile navigation */}
      {!isDesktop && <MobileNavDrawer />}

      <InfiniteCanvas
        items={canvasItems}
        centerImage="/Ini-Illustrated-Headshot-2025 2.PNG"
      />
    </>
  )
}

