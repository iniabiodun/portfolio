import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, "..")

// Minimal Markdown → HTML converter
function markdownToHtml(markdown) {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n")

  function escapeHtml(raw) {
    return raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  }

  function processInlineMarkdown(text) {
    // First escape HTML, then convert markdown images and links to HTML tags
    // We use placeholders to protect syntax during escaping
    
    // Handle images first: ![alt](url)
    const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g
    const images = []
    let match

    // Extract all images
    while ((match = imagePattern.exec(text)) !== null) {
      images.push({ alt: match[1], url: match[2] })
    }

    // Replace images with placeholders
    let processedText = text.replace(imagePattern, '___IMAGE___')

    // Handle links: [text](url)
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g
    const links = []

    // Extract all links
    while ((match = linkPattern.exec(processedText)) !== null) {
      links.push({ text: match[1], url: match[2] })
    }

    // Handle italic text FIRST: *text* or _text_ (before links to avoid conflicts)
    const italicPattern = /(\*|_)([^*_]+)\1/g
    const italics = []
    let italicMatch
    while ((italicMatch = italicPattern.exec(processedText)) !== null) {
      italics.push(italicMatch[2])
    }
    processedText = processedText.replace(italicPattern, '___ITALIC___')

    // Replace links with placeholders AFTER italic processing
    processedText = processedText.replace(linkPattern, 'LINKPLACEHOLDER123')

    // Escape HTML in the remaining text
    processedText = escapeHtml(processedText)

    // Restore images as HTML
    images.forEach(({ alt, url }) => {
      // URL encode the path to handle Unicode characters in filenames
      // Only encode if not already encoded (check for % which indicates encoding)
      let encodedUrl = url
      if (!url.includes('%')) {
        if (url.startsWith('/')) {
          const pathParts = url.substring(1).split('/')
          const encodedParts = pathParts.map(part => encodeURIComponent(part))
          encodedUrl = '/' + encodedParts.join('/')
        } else {
          encodedUrl = encodeURI(url)
        }
      }
      // Reduce telephone image by 40% (36% width - reduced from 60%)
      const isTelephone = encodedUrl.includes('Telephone')
      const widthClass = isTelephone ? 'w-[36%] mx-auto' : 'w-full'
      processedText = processedText.replace('___IMAGE___',
        `<img src="${encodedUrl}" alt="${escapeHtml(alt)}" class="${widthClass} my-8 rounded-lg" />`)
    })

    // Restore italic text as HTML
    italics.forEach((text) => {
      const escapedText = escapeHtml(text)
      processedText = processedText.replace('___ITALIC___',
        `<em>${escapedText}</em>`)
    })

    // Restore links as HTML LAST (after all other processing)
    links.forEach(({ text, url }) => {
      processedText = processedText.replace('LINKPLACEHOLDER123',
        `<a href="${url}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`)
    })

    return processedText
  }

  const html = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]

    if (/^\s*$/.test(line)) {
      i++
      continue
    }

    if (/^```/.test(line)) {
      const code = []
      i++
      while (i < lines.length && !/^```/.test(lines[i])) {
        code.push(lines[i])
        i++
      }
      if (i < lines.length && /^```/.test(lines[i])) i++
      html.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`)
      continue
    }

    // Handle images on their own line: ![alt](url)
    const imageLine = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (imageLine) {
      const alt = imageLine[1]
      let url = imageLine[2]
      // URL encode the path to handle Unicode characters in filenames
      // Only encode if not already encoded (check for % which indicates encoding)
      if (!url.includes('%')) {
        if (url.startsWith('/')) {
          const pathParts = url.substring(1).split('/')
          const encodedParts = pathParts.map(part => encodeURIComponent(part))
          url = '/' + encodedParts.join('/')
        } else {
          url = encodeURI(url)
        }
      }
      // Reduce telephone image by 40% (36% width - reduced from 60%)
      const isTelephone = url.includes('Telephone')
      const widthClass = isTelephone ? 'w-[36%] mx-auto' : 'w-full'
      html.push(`<img src="${url}" alt="${escapeHtml(alt)}" class="${widthClass} my-8 rounded-lg" />`)
      i++
      continue
    }

    // Handle video tags: <video src="..." controls class="..."></video>
    const videoLine = line.match(/^<video\s+src="([^"]+)"\s+(?:controls\s+)?class="([^"]+)"\s*><\/video>$/)
    if (videoLine) {
      const src = videoLine[1]
      const className = videoLine[2]
      html.push(`<video src="${src}" autoplay loop muted playsinline class="${className}"></video>`)
      i++
      continue
    }

    // Handle horizontal rules (dividers)
    if (/^---$/.test(line.trim())) {
      html.push(`<hr class="my-8 border-t border-border" />`)
      i++
      continue
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/)
    if (heading) {
      const level = heading[1].length
      const text = processInlineMarkdown(heading[2])
      html.push(`<h${level}>${text}</h${level}>`)
      i++
      continue
    }

    if (/^>\s?/.test(line)) {
      const quote = []
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^>\s?/, ""))
        i++
      }
      html.push(`<blockquote>${escapeHtml(quote.join("\n")).replace(/\n/g, "<br/>")}</blockquote>`)
      continue
    }

    if (/^[-*]\s+/.test(line)) {
      const items = []
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        const itemText = processInlineMarkdown(lines[i].replace(/^[-*]\s+/, ""))
        items.push(`<li>${itemText}</li>`)
        i++
      }
      html.push(`<ul>${items.join("")}</ul>`)
      continue
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        const itemText = processInlineMarkdown(lines[i].replace(/^\d+\.\s+/, ""))
        items.push(`<li>${itemText}</li>`)
        i++
      }
      html.push(`<ol>${items.join("")}</ol>`)
      continue
    }

    // Check if line contains HTML video tag
    const videoTagMatch = line.match(/<video\s+src="([^"]+)"\s+(?:controls\s+)?class="([^"]+)"\s*><\/video>/)
    if (videoTagMatch) {
      const src = videoTagMatch[1]
      const className = videoTagMatch[2]
      html.push(`<video src="${src}" autoplay loop muted playsinline class="${className}"></video>`)
      i++
      continue
    }

    const para = [line]
    i++
    while (i < lines.length && !/^\s*$/.test(lines[i])) {
      if (/^(?:```|#{1,6}\s|>\s|[-*]\s|\d+\.\s)/.test(lines[i])) break
      // Check if next line is a video tag
      if (lines[i].match(/<video\s+src="([^"]+)"\s+(?:controls\s+)?class="([^"]+)"\s*><\/video>/)) break
      para.push(lines[i])
      i++
    }
    const text = processInlineMarkdown(para.join(" ").trim())
    if (text) html.push(`<p>${text}</p>`)
  }

  return html.join("\n")
}

// Generate notes content
function generateNotes() {
  const notesDir = path.join(rootDir, "content/notes")
  const files = fs.readdirSync(notesDir).filter((f) => f.endsWith(".mdx"))

  const notes = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "")
    const fullPath = path.join(notesDir, filename)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || slug,
      date: data.date || "",
      excerpt: data.excerpt || "",
      content: markdownToHtml(content),
    }
  })

  const output = `export interface Note {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
}

export const notes: Note[] = ${JSON.stringify(notes, null, 2)}
`

  fs.writeFileSync(path.join(rootDir, "content/notes.tsx"), output)
  console.log(`✓ Generated content for ${notes.length} notes`)
}

// Generate books content
function generateBooks() {
  const booksDir = path.join(rootDir, "content/books")
  const files = fs.readdirSync(booksDir).filter((f) => f.endsWith(".mdx"))

  const books = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "")
    const fullPath = path.join(booksDir, filename)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content: mdxContent } = matter(fileContents)

    // Read metadata from frontmatter with defaults
    const title = data.title || slug
    const author = data.author || ""
    const year = data.year || 0
    const lastUpdated = data.lastUpdated
    const hasNotes = data.hasNotes ?? (mdxContent.trim().length > 0)
    const isReading = data.isReading ?? false
    const content = markdownToHtml(mdxContent)

    return {
      slug,
      title,
      author,
      year,
      ...(lastUpdated && { lastUpdated }),
      hasNotes,
      isReading,
      content,
    }
  })

  const output = `export interface Book {
  slug: string
  title: string
  author: string
  year: number
  lastUpdated?: string
  hasNotes: boolean
  isReading: boolean
  content: string
}

export const books: Book[] = ${JSON.stringify(books, null, 2)}
`

  fs.writeFileSync(path.join(rootDir, "content/books.tsx"), output)
  console.log(`✓ Generated content for ${books.length} books`)
}

// Generate case studies content
function generateCaseStudies() {
  const caseStudiesDir = path.join(rootDir, "content/case-studies")
  if (!fs.existsSync(caseStudiesDir)) {
    fs.mkdirSync(caseStudiesDir, { recursive: true })
  }
  const files = fs.readdirSync(caseStudiesDir).filter((f) => f.endsWith(".mdx"))

  const caseStudies = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "")
    const fullPath = path.join(caseStudiesDir, filename)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || slug,
      date: data.date || "",
      excerpt: data.excerpt || "",
      disabled: data.disabled || false,
      content: markdownToHtml(content),
    }
  })

  const output = `export interface CaseStudy {
  slug: string
  title: string
  date: string
  excerpt: string
  disabled?: boolean
  content: string
}

export const caseStudies: CaseStudy[] = ${JSON.stringify(caseStudies, null, 2)}
`

  fs.writeFileSync(path.join(rootDir, "content/case-studies.tsx"), output)
  console.log(`✓ Generated content for ${caseStudies.length} case studies`)
}

// Generate speaking content
function generateSpeaking() {
  const speakingDir = path.join(rootDir, "content/speaking")
  if (!fs.existsSync(speakingDir)) {
    fs.mkdirSync(speakingDir, { recursive: true })
  }
  const files = fs.readdirSync(speakingDir).filter((f) => f.endsWith(".mdx"))

  const speaking = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "")
    const fullPath = path.join(speakingDir, filename)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || slug,
      date: data.date || "",
      excerpt: data.excerpt || "",
      content: markdownToHtml(content),
    }
  })

  const output = `export interface Speaking {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
}

export const speaking: Speaking[] = ${JSON.stringify(speaking, null, 2)}
`

  fs.writeFileSync(path.join(rootDir, "content/speaking.tsx"), output)
  console.log(`✓ Generated content for ${speaking.length} speaking engagements`)
}

// Run generators
generateNotes()
generateBooks()
generateCaseStudies()
generateSpeaking()
