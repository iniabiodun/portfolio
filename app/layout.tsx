import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { LightingProvider } from "@/lib/lighting-context"
import { MusicProvider } from "@/lib/music-context"
import "./globals.css"

const ppRadioGrotesk = {
  className: "pp-radio-grotesk",
  variable: "--font-sans",
}
const ppKyoto = {
  className: "pp-kyoto",
  variable: "--font-serif",
}

export const metadata: Metadata = {
  title: "Ìní·Olúwa",
  description: "Designer and builder with founding-level experience across early and mature B2B/B2C teams. Building Aivie, health intelligence for chronic pain management.",
  generator: "v0.app",
  icons: {
    icon: '/IniOluwa Seal 1.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Nanum+Pen+Script&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${ppKyoto.variable} ${ppRadioGrotesk.variable} font-sans antialiased`}>
        <LightingProvider>
          <MusicProvider>
            {children}
          </MusicProvider>
        </LightingProvider>
        <Analytics />
      </body>
    </html>
  )
}
