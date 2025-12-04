export interface Book {
  slug: string
  title: string
  author: string
  year: number
  lastUpdated?: string
  coverImage?: string
  hasNotes: boolean
  isReading: boolean
  content: string
}

export const books: Book[] = [
  {
    "slug": "analog",
    "title": "Analog",
    "author": "Robert Hassan",
    "year": 2022,
    "lastUpdated": "10-26-2025",
    "hasNotes": true,
    "isReading": true,
    "content": "<ul><li>Zen and the Art of Motorcycle Maintenance, Robert Pirsig (1974), p. 38</li></ul>"
  },
  {
    "slug": "circe",
    "title": "Circe",
    "author": "Madeline Miller",
    "year": 2018,
    "lastUpdated": "12-04-2025",
    "hasNotes": true,
    "isReading": true,
    "coverImage": "/Bookshelf/Circe.png",
    "content": "<blockquote>*I am loving the modern retellings of these Greek mythologies. Madeline Miller is an absolute beast of a writer.*</blockquote>\n<p>TO BE CONTINUED...</p>"
  },
  {
    "slug": "colors-of-wes-anderson",
    "title": "Colors of Wes Anderson",
    "author": "Hannah Strong",
    "year": 2025,
    "hasNotes": false,
    "isReading": false,
    "content": ""
  },
  {
    "slug": "prayer",
    "title": "Prayer",
    "author": "Timothy Keller",
    "year": 2014,
    "hasNotes": false,
    "isReading": true,
    "content": ""
  },
  {
    "slug": "severence",
    "title": "Severance",
    "author": "Ling Ma",
    "year": 2018,
    "hasNotes": false,
    "isReading": false,
    "content": ""
  },
  {
    "slug": "wabi-sabi",
    "title": "Wabi-Sabi for Artists, Designers, and Creatives",
    "author": "Leonard Koren",
    "year": 1994,
    "hasNotes": false,
    "isReading": false,
    "content": ""
  }
]
