import { speaking } from "@/content/speaking"

interface SpeakingReaderProps {
  slug: string
}

export function SpeakingReader({ slug }: SpeakingReaderProps) {
  const item = speaking.find((s) => s.slug === slug)

  if (!item) return null

  return (
    <article className="prose prose-sm prose-neutral dark:prose-invert max-w-none text-muted-foreground">
      <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">{item.date}</p>
      <h1 className="text-4xl font-serif mb-8 text-foreground">{item.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: item.content }} />
    </article>
  )
}

