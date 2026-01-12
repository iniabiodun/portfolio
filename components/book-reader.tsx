import { books } from "@/content/books"

interface BookReaderProps {
  slug: string
}

export function BookReader({ slug }: BookReaderProps) {
  const book = books.find((b) => b.slug === slug)
  if (!book) return null

  const hasContent = book.content && book.content.trim().length > 0

  return (
    <article className="max-w-none">
      {/* Book Header with Cover - stacks on mobile */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8">
        {/* Cover - smaller on mobile, centered */}
        <div className="flex-shrink-0 w-24 h-36 sm:w-32 sm:h-48 rounded shadow-lg overflow-hidden bg-muted/50 mx-auto sm:mx-0">
          {book.coverImage ? (
            <img 
              src={book.coverImage} 
              alt={`${book.title} cover`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
              <span className="text-3xl sm:text-4xl">📖</span>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center min-w-0 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-serif mb-2">{book.title}</h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-2">{book.author}</p>
          <div className="flex justify-center sm:justify-start gap-4 text-sm text-muted-foreground">
            {book.year && <span>{book.year}</span>}
            {book.hasNotes ? (
              <span className="text-emerald-500 font-medium">Finished</span>
            ) : book.isReading ? (
              <span className="text-amber-500 font-medium">Currently Reading</span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Notes/Content Section */}
      {hasContent ? (
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2 className="text-xl font-medium mb-4 text-foreground">Notes</h2>
          <div dangerouslySetInnerHTML={{ __html: book.content }} />
        </div>
      ) : (
        <blockquote className="border-l-2 border-muted-foreground/30 pl-4 italic text-muted-foreground">
          No notes yet for this book.
        </blockquote>
      )}
      
      {book.lastUpdated && (
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mt-8">
          Last updated: {book.lastUpdated}
        </p>
      )}
    </article>
  )
}
