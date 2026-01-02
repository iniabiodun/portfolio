export type BookTopic = 
  | "mythology-classics" 
  | "fiction-fantasy" 
  | "design-craft" 
  | "business-strategy" 
  | "mind-spirit"

export interface Book {
  slug: string
  title: string
  author: string
  year: number
  lastUpdated?: string
  coverImage?: string
  spineImage?: string
  topic?: BookTopic
  hasNotes: boolean
  isReading: boolean
  content: string
}

export const topicLabels: Record<BookTopic, string> = {
  "mythology-classics": "Mythology & Classics",
  "fiction-fantasy": "Fiction & Fantasy",
  "design-craft": "Design & Craft",
  "business-strategy": "Business & Strategy",
  "mind-spirit": "Mind & Spirit",
}

export const books: Book[] = [
  {
    slug: "100-interiors-around-the-world",
    title: "100 Interiors Around the World",
    author: "Balthazar & Laslo Taschen (Eds)",
    year: 2012,
    topic: "design-craft",
    hasNotes: false,
    isReading: false,
    content: ""
  },
  {
    slug: "alexander-mcqueen",
    title: "Alexander McQueen",
    author: "Judith Watt",
    year: 2012,
    topic: "design-craft",
    hasNotes: false,
    isReading: false,
    content: ""
  },
  {
    slug: "beasts-of-prey",
    title: "Beasts of Prey",
    author: "Ayana Gray",
    year: 2021,
    topic: "fiction-fantasy",
    hasNotes: false,
    isReading: false,
    content: ""
  },
  {
    slug: "beasts-of-ruin",
    title: "Beasts of Ruin",
    author: "Ayana Gray",
    year: 2023,
    topic: "fiction-fantasy",
    hasNotes: false,
    isReading: false,
    content: ""
  },
  {
    slug: "beasts-of-war",
    title: "Beasts of War",
    author: "Ayana Gray",
    year: 2022,
    topic: "fiction-fantasy",
    hasNotes: false,
    isReading: false,
    content: ""
  },
  {
    slug: "building-rocketships",
    title: "Building Rocketships",
    author: "Oji Udezue & Ezinne Udezue",
    year: 2024,
    topic: "business-strategy",
    hasNotes: false,
    isReading: false,
    content: ""
  },
  {
    slug: "circe",
    title: "Circe",
    author: "Madeline Miller",
    year: 2018,
    lastUpdated: "12-04-2025",
    topic: "mythology-classics",
    hasNotes: true,
    isReading: true,
    coverImage: "/study/book-covers-for-folio/circe-cover.png",
    spineImage: "/study/book-covers-for-folio/circe-spine.png",
    content: "<blockquote><em>I am loving the modern retellings of these Greek mythologies. Madeline Miller is an absolute beast of a writer.</em></blockquote>"
  },
  {
    slug: "firstborn-of-the-sun",
    title: "Firstborn of the Sun",
    author: "Marvellous Michael Anson",
    year: 2022,
    topic: "fiction-fantasy",
    hasNotes: false,
    isReading: true,
    coverImage: "/study/book-covers-for-folio/firstborn-of-the-sun-cover.png",
    spineImage: "/study/book-covers-for-folio/firstborn-of-the-sun-spine.png",
    content: ""
  },
  {
    slug: "girl-goddess-queen",
    title: "Girl, Goddess, Queen",
    author: "Bea Fitzgerald",
    year: 2023,
    topic: "mythology-classics",
    hasNotes: false,
    isReading: true,
    coverImage: "/study/book-covers-for-folio/girl-goddess-queen-cover.png",
    spineImage: "/study/book-covers-for-folio/girl-goddess-queen-spine.png",
    content: ""
  },
  {
    slug: "girls-just-wanna-have-funds",
    title: "Girls Just Wanna Have Funds",
    author: "Due Bitz Falkenberg Hartvigsen",
    year: 2023,
    topic: "business-strategy",
    hasNotes: false,
    isReading: false,
    content: ""
  },
  {
    slug: "greek-myths",
    title: "Greek Myths",
    author: "Gustav Schwab",
    year: 1838,
    topic: "mythology-classics",
    hasNotes: false,
    isReading: false,
    content: ""
  },
  {
    slug: "ink-blood-sister-scribe",
    title: "Ink Blood Sister Scribe",
    author: "Emma Torzs",
    year: 2023,
    topic: "fiction-fantasy",
    hasNotes: false,
    isReading: false,
    content: ""
  },
  {
    slug: "now-try-something-weirder",
    title: "Now Try Something Weirder",
    author: "Michael Johnson",
    year: 2019,
    topic: "design-craft",
    hasNotes: false,
    isReading: false,
    content: ""
  },
  {
    slug: "rules-of-work",
    title: "The Rules of Work",
    author: "Richard Templar",
    year: 2015,
    topic: "business-strategy",
    hasNotes: false,
    isReading: false,
    content: ""
  },
  {
    slug: "shift",
    title: "Shift",
    author: "Ethan Kross",
    year: 2024,
    topic: "mind-spirit",
    hasNotes: false,
    isReading: false,
    content: ""
  },
  {
    slug: "song-of-achilles",
    title: "The Song of Achilles",
    author: "Madeline Miller",
    year: 2011,
    lastUpdated: "12-05-2025",
    topic: "mythology-classics",
    hasNotes: true,
    isReading: true,
    coverImage: "/study/book-covers-for-folio/song-of-achilles-cover.png",
    spineImage: "/study/book-covers-for-folio/song-of-achilles-spine.png",
    content: "<blockquote><em>I have heard such good things about Madeleine. Nothing prepared me for actually reading her books. Her writing flows uncomplicated, like drinking a warm cuppa and thick blanket on a rainy day. I tucked in and find myself eager to return to it.</em></blockquote>"
  },
  {
    slug: "strategy",
    title: "Strategy",
    author: "Harvard Business Review",
    year: 2018,
    topic: "business-strategy",
    hasNotes: false,
    isReading: false,
    content: ""
  },
  {
    slug: "women-of-troy",
    title: "The Women of Troy",
    author: "Pat Barker",
    year: 2021,
    topic: "mythology-classics",
    hasNotes: false,
    isReading: true,
    coverImage: "/study/book-covers-for-folio/women-of-troy-cover.png",
    spineImage: "/study/book-covers-for-folio/women-of-troy-spine.png",
    content: ""
  }
]
