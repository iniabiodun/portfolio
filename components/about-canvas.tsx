"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useLighting } from "@/lib/lighting-context"

type CardId = "bio" | "swatch" | "photo" | "crosley"

interface CardInfo {
  title: string
  description: string
  year?: string
}

const cardInfoData: Record<Exclude<CardId, "bio">, CardInfo> = {
  swatch: {
    title: "Aso-oke Fabric",
    description: "Traditional Yoruba hand-woven cloth, a symbol of heritage and celebration.",
    year: "Family heirloom"
  },
  photo: {
    title: "Early 00s",
    description: "A glimpse into childhood — curious eyes and endless imagination.",
    year: "c. 2002"
  },
  crosley: {
    title: "Crosley Cruiser",
    description: "Portable turntable for lo-fi listening sessions and deep work.",
    year: "2024"
  }
}

const smoothSpring = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25
}

export function AboutCanvas() {
  const constraintsRef = useRef<HTMLDivElement>(null)
  const { backgroundImage } = useLighting()
  const [zOrder, setZOrder] = useState<CardId[]>(["crosley", "swatch", "photo", "bio"])
  const [selectedCard, setSelectedCard] = useState<Exclude<CardId, "bio"> | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const bringToFront = (cardId: CardId) => {
    setZOrder(prev => {
      const filtered = prev.filter(id => id !== cardId)
      return [...filtered, cardId]
    })
  }

  const getZIndex = (cardId: CardId) => {
    const baseZ = zOrder.indexOf(cardId) + 10
    if (selectedCard === cardId) return baseZ + 100
    return baseZ
  }

  const handleDragStart = () => setIsDragging(true)
  const handleDragEnd = () => setTimeout(() => setIsDragging(false), 100)

  const handleCardClick = (cardId: CardId) => {
    if (isDragging) return
    bringToFront(cardId)
    if (cardId !== "bio") {
      setSelectedCard(prev => prev === cardId ? null : cardId as Exclude<CardId, "bio">)
    }
  }

  const closePopup = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedCard(null)
  }

  const InfoPopup = ({ cardId }: { cardId: Exclude<CardId, "bio"> }) => (
    <AnimatePresence>
      {selectedCard === cardId && (
        <motion.div
          className="about-canvas__info-popup"
          initial={{ opacity: 0, scale: 0.9, x: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={smoothSpring}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="about-canvas__info-close"
            onClick={closePopup}
            aria-label="Close"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1L9 9M1 9L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <h3 className="about-canvas__info-title">{cardInfoData[cardId].title}</h3>
          <p className="about-canvas__info-desc">{cardInfoData[cardId].description}</p>
          {cardInfoData[cardId].year && (
            <span className="about-canvas__info-year">{cardInfoData[cardId].year}</span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Card positions - using percentages from center
  const cardPositions = {
    bio: { x: "-50%", y: "-50%", top: "50%", left: "50%" },
    swatch: { x: "0%", y: "0%", top: "10%", right: "10%", left: "auto" },
    photo: { x: "0%", y: "0%", bottom: "15%", right: "8%", top: "auto", left: "auto" },
    crosley: { x: "0%", y: "-50%", top: "50%", left: "5%" },
  }

  return (
    <div className="about-canvas about-canvas--in-layout">
      {/* Background */}
      <div className="about-canvas__bg">
        <Image
          src={backgroundImage}
          alt="Ini's Study"
          fill
          priority
          quality={95}
          className="about-canvas__bg-image"
        />
      </div>

      {/* Dimmed overlay */}
      <div className="about-canvas__overlay" />

      {/* Canvas area */}
      <div className="about-canvas__workspace" ref={constraintsRef}>
        {/* Bio Card - centered */}
        <motion.div
          className="about-canvas__card about-canvas__card--bio"
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.05}
          dragMomentum={false}
          whileDrag={{ cursor: "grabbing", filter: "drop-shadow(0 30px 30px rgba(0,0,0,0.4))" }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onClick={() => handleCardClick("bio")}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ 
            zIndex: getZIndex("bio"),
            top: cardPositions.bio.top,
            left: cardPositions.bio.left,
            x: cardPositions.bio.x,
            y: cardPositions.bio.y
          }}
          transition={{ ...smoothSpring, delay: 0.2 }}
        >
          <Image
            src="/1. About/About me - card 1.png"
            alt="About ÌníOlúwa"
            width={400}
            height={580}
            quality={100}
            draggable={false}
            className="about-canvas__card-image"
          />
          <div className="about-canvas__hotspots">
            <a href="https://www.intercom.com/fin" target="_blank" rel="noopener noreferrer"
              className="about-canvas__hotspot" style={{ top: '38%', left: '25%', width: '50%', height: '3%' }}
              aria-label="Fin AI Agent / Intercom" onPointerDown={(e) => e.stopPropagation()} />
            <a href="https://iniabiodun.substack.com/" target="_blank" rel="noopener noreferrer"
              className="about-canvas__hotspot" style={{ top: '41%', left: '30%', width: '40%', height: '3%' }}
              aria-label="In Good Company" onPointerDown={(e) => e.stopPropagation()} />
            <a href="https://www.linkedin.com/in/inioluwa-abiodun/" target="_blank" rel="noopener noreferrer"
              className="about-canvas__hotspot" style={{ top: '76%', left: '15%', width: '20%', height: '4%' }}
              aria-label="LinkedIn" onPointerDown={(e) => e.stopPropagation()} />
            <a href="mailto:ini.faithabiodun@gmail.com"
              className="about-canvas__hotspot" style={{ top: '76%', left: '65%', width: '15%', height: '4%' }}
              aria-label="Email" onPointerDown={(e) => e.stopPropagation()} />
          </div>
        </motion.div>

        {/* Aso-oke Swatch - top right */}
        <motion.div
          className={`about-canvas__card about-canvas__card--with-popup ${selectedCard === "swatch" ? "about-canvas__card--selected" : ""}`}
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.05}
          dragMomentum={false}
          whileDrag={{ cursor: "grabbing", filter: "drop-shadow(0 30px 30px rgba(0,0,0,0.4))" }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onClick={() => handleCardClick("swatch")}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            filter: selectedCard === "swatch" ? "drop-shadow(0 30px 30px rgba(0,0,0,0.5))" : "none"
          }}
          style={{ 
            zIndex: getZIndex("swatch"),
            top: cardPositions.swatch.top,
            right: cardPositions.swatch.right,
          }}
          transition={{ ...smoothSpring, delay: 0.3 }}
        >
          <Image
            src="/1. About/Aso-oke-fabric-swatch 1.png"
            alt="Aso-oke fabric swatch"
            width={180}
            height={220}
            quality={95}
            draggable={false}
            className="about-canvas__card-image"
          />
          <InfoPopup cardId="swatch" />
        </motion.div>

        {/* Photo - bottom right */}
        <motion.div
          className={`about-canvas__card about-canvas__card--with-popup ${selectedCard === "photo" ? "about-canvas__card--selected" : ""}`}
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.05}
          dragMomentum={false}
          whileDrag={{ cursor: "grabbing", filter: "drop-shadow(0 30px 30px rgba(0,0,0,0.4))" }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onClick={() => handleCardClick("photo")}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            filter: selectedCard === "photo" ? "drop-shadow(0 30px 30px rgba(0,0,0,0.5))" : "none"
          }}
          style={{ 
            zIndex: getZIndex("photo"),
            bottom: cardPositions.photo.bottom,
            right: cardPositions.photo.right,
          }}
          transition={{ ...smoothSpring, delay: 0.4 }}
        >
          <Image
            src="/1. About/Ini-Early-00s.png"
            alt="Ini in the early 2000s"
            width={160}
            height={200}
            quality={95}
            draggable={false}
            className="about-canvas__card-image"
          />
          <InfoPopup cardId="photo" />
        </motion.div>

        {/* Crosley - left center */}
        <motion.div
          className={`about-canvas__card about-canvas__card--with-popup ${selectedCard === "crosley" ? "about-canvas__card--selected" : ""}`}
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.05}
          dragMomentum={false}
          whileDrag={{ cursor: "grabbing", filter: "drop-shadow(0 30px 30px rgba(0,0,0,0.4))" }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onClick={() => handleCardClick("crosley")}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            filter: selectedCard === "crosley" ? "drop-shadow(0 30px 30px rgba(0,0,0,0.5))" : "none"
          }}
          style={{ 
            zIndex: getZIndex("crosley"),
            top: cardPositions.crosley.top,
            left: cardPositions.crosley.left,
            y: cardPositions.crosley.y
          }}
          transition={{ ...smoothSpring, delay: 0.5 }}
        >
          <Image
            src="/1. About/Crosley-music-off.png"
            alt="Crosley record player"
            width={260}
            height={260}
            quality={95}
            draggable={false}
            className="about-canvas__card-image"
          />
          <InfoPopup cardId="crosley" />
        </motion.div>
      </div>

      {/* Hint */}
      <AnimatePresence>
        {!selectedCard && (
          <motion.div
            className="about-canvas__hint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 1, duration: 0.4 }}
          >
            <span>Drag cards to arrange · Tap to view details</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
