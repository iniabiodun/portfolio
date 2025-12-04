import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const zalandoSans = {
  className: "zalando-sans",
  variable: "--font-sans",
}
const hedvigLettersSerif = {
  className: "hedvig-letters-serif",
  variable: "--font-serif",
}

export const metadata: Metadata = {
  title: "Ìní·Olúwa",
  description: "Designer and builder with founding-level experience across early and mature B2B/B2C teams. Building Aivie, health intelligence for chronic pain management.",
  generator: "v0.app",
  icons: {
    icon: {
      url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📚</text></svg>',
      type: 'image/svg+xml',
    },
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
          href="https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Zalando+Sans:ital,wght@0,200..900;1,200..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${hedvigLettersSerif.variable} ${zalandoSans.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
