"use client"

import { motion } from "framer-motion"
import { useState } from "react"

interface Book3DProps {
  title: string
  author: string
  coverImage: string
  spineImage: string
  size?: "sm" | "md" | "lg"
  onClick?: () => void
}

export function Book3D({ 
  title, 
  author, 
  coverImage, 
  spineImage, 
  size = "md",
  onClick 
}: Book3DProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Size configurations - ~1:1.5 aspect ratio for tall book covers
  const sizeConfig = {
    sm: { width: 90, height: 140, spineWidth: 16, perspective: 800 },
    md: { width: 140, height: 218, spineWidth: 22, perspective: 1000 },
    lg: { width: 180, height: 280, spineWidth: 28, perspective: 1200 },
  }

  const config = sizeConfig[size]

  return (
    <motion.div
      className="book-3d"
      style={{
        width: config.width + config.spineWidth,
        height: config.height,
        perspective: config.perspective,
        cursor: onClick ? "pointer" : "default",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <motion.div
        className="book-3d__inner"
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateY: isHovered ? -25 : -15,
          rotateX: isHovered ? 5 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
      >
        {/* Front Cover */}
        <div
          className="book-3d__cover"
          style={{
            position: "absolute",
            width: config.width,
            height: config.height,
            left: config.spineWidth,
            transformOrigin: "left center",
            transform: "translateZ(1px)",
            backfaceVisibility: "hidden",
            borderRadius: "0 2px 2px 0",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25), 0 2px 8px rgba(0, 0, 0, 0.15)",
          }}
        >
          <img
            src={coverImage}
            alt={`${title} cover`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Spine */}
        <div
          className="book-3d__spine"
          style={{
            position: "absolute",
            width: config.spineWidth,
            height: config.height,
            left: 0,
            transformOrigin: "right center",
            transform: `rotateY(-90deg) translateX(-${config.spineWidth}px)`,
            backfaceVisibility: "hidden",
            overflow: "hidden",
          }}
        >
          <img
            src={spineImage}
            alt={`${title} spine`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Page Edges (Top) - hidden behind cover */}
        <div
          className="book-3d__pages-top"
          style={{
            position: "absolute",
            width: config.width - 8,
            height: config.spineWidth - 4,
            left: config.spineWidth + 4,
            top: 2,
            transformOrigin: "center bottom",
            transform: `rotateX(90deg) translateZ(-${config.spineWidth / 2}px)`,
            background: "linear-gradient(to right, #d4ccc0, #e8e0d4, #d4ccc0)",
            borderRadius: "0 2px 2px 0",
          }}
        />

        {/* Page Edges (Bottom) - hidden behind cover */}
        <div
          className="book-3d__pages-bottom"
          style={{
            position: "absolute",
            width: config.width - 8,
            height: config.spineWidth - 4,
            left: config.spineWidth + 4,
            bottom: 2,
            transformOrigin: "center top",
            transform: `rotateX(-90deg) translateZ(-${config.spineWidth / 2}px)`,
            background: "linear-gradient(to right, #d4ccc0, #e8e0d4, #d4ccc0)",
            borderRadius: "0 2px 2px 0",
          }}
        />

        {/* Page Edges (Right) */}
        <div
          className="book-3d__pages-right"
          style={{
            position: "absolute",
            width: config.spineWidth - 4,
            height: config.height - 8,
            right: 0,
            top: 4,
            transformOrigin: "left center",
            transform: `rotateY(90deg) translateX(${(config.spineWidth - 4) / 2}px)`,
            background: `repeating-linear-gradient(
              to bottom,
              #f5efe7 0px,
              #f5efe7 1px,
              #e8e0d4 1px,
              #e8e0d4 2px
            )`,
            borderRadius: "0 2px 2px 0",
          }}
        />

        {/* Back Cover */}
        <div
          className="book-3d__back"
          style={{
            position: "absolute",
            width: config.width,
            height: config.height,
            left: config.spineWidth,
            transform: `translateZ(-${config.spineWidth}px)`,
            background: "#1a1512",
            borderRadius: "0 2px 2px 0",
          }}
        />
      </motion.div>

      {/* Book Info (optional - shown below) */}
      {size === "lg" && (
        <div className="book-3d__info mt-4 text-center">
          <div className="text-sm font-medium text-foreground">{title}</div>
          <div className="text-xs text-muted-foreground">{author}</div>
        </div>
      )}
    </motion.div>
  )
}

