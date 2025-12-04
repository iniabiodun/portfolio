import { Footer } from "./footer"

interface AboutSectionProps {
  onNavigateToSpeaking?: () => void
}

export function AboutSection({ onNavigateToSpeaking }: AboutSectionProps) {
  return (
    <div className="flex flex-col justify-between min-h-full">
      <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-serif mb-2">Ìní·Olúwa</h1>
        <p className="text-muted-foreground text-sm mb-2">/ee-nee-OH-loo-wah/</p>
      </div>

      <div className="space-y-4">
        <p className="text-muted-foreground">noun</p>
        <ol className="space-y-2 list-decimal list-inside">
          <li className="text-foreground">
            Former Lawyer
          </li>
          <li className="text-foreground">
            Designer and builder with founding-level experience across fast-paced B2B/B2C teams.
          </li>
          <li className="text-foreground">
            Currently, Intercom (Fin AI Agent), previously Principal at Gen Digital (58 markets); founding designer at Decimals, Coho.
          </li>
          <li className="text-foreground">
            Writer, In Good Company; publication on AI integration in design practice.
          </li>
        </ol>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <span className="text-muted-foreground">See also:</span>
        <a
          href="https://www.linkedin.com/in/inioluwa-abiodun/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid"
        >
          LinkedIn
        </a>
        <a
          href="https://open.spotify.com/show/0szIL4qmNk7DrrlAgMX0uV"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid"
        >
          Growth Design Podcast
        </a>
        <button
          onClick={onNavigateToSpeaking}
          className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid text-left"
        >
          Speaking
        </button>
      </div>
      </div>

      <Footer />
    </div>
  )
}
