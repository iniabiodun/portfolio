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
    "slug": "100-interiors-around-the-world",
    "title": "100 Interiors Around the World",
    "author": "Balthazar & Laslo Taschen (Eds)",
    "year": 2012,
    "hasNotes": false,
    "isReading": false,
    "content": ""
  },
  {
    "slug": "alexander-mcqueen",
    "title": "Alexander McQueen",
    "author": "Judith Watt",
    "year": 2012,
    "hasNotes": false,
    "isReading": false,
    "content": ""
  },
  {
    "slug": "beasts-of-prey",
    "title": "Beasts of Prey",
    "author": "Ayana Gray",
    "year": 2021,
    "hasNotes": false,
    "isReading": false,
    "content": ""
  },
  {
    "slug": "beasts-of-ruin",
    "title": "Beasts of Ruin",
    "author": "Ayana Gray",
    "year": 2023,
    "hasNotes": false,
    "isReading": false,
    "content": ""
  },
  {
    "slug": "beasts-of-war",
    "title": "Beasts of War",
    "author": "Ayana Gray",
    "year": 2022,
    "hasNotes": false,
    "isReading": false,
    "content": ""
  },
  {
    "slug": "building-rocketships",
    "title": "Building Rocketships",
    "author": "Oji Udezue & Ezinne Udezue",
    "year": 2024,
    "hasNotes": false,
    "isReading": false,
    "content": ""
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
    "content": "<blockquote><em>I am loving the modern retellings of these Greek mythologies. Madeline Miller is an absolute beast of a writer.</em></blockquote>\n<p>TO BE CONTINUED...</p>"
  },
  {
    "slug": "firstborn-of-the-sun",
    "title": "Firstborn of the Sun",
    "author": "Marvellous Michael Anson",
    "year": 2022,
    "hasNotes": false,
    "isReading": false,
    "content": ""
  },
  {
    "slug": "girl-goddess-queen",
    "title": "Girl, Goddess, Queen",
    "author": "Bea Fitzgerald",
    "year": 2023,
    "hasNotes": false,
    "isReading": true,
    "content": ""
  },
  {
    "slug": "girls-just-wanna-have-funds",
    "title": "Girls Just Wanna Have Funds",
    "author": "Due Bitz Falkenberg Hartvigsen",
    "year": 2023,
    "hasNotes": false,
    "isReading": false,
    "content": ""
  },
  {
    "slug": "greek-myths",
    "title": "Greek Myths",
    "author": "Gustav Schwab",
    "year": 1838,
    "hasNotes": false,
    "isReading": false,
    "content": ""
  },
  {
    "slug": "ink-blood-sister-scribe",
    "title": "Ink Blood Sister Scribe",
    "author": "Emma Torzs",
    "year": 2023,
    "hasNotes": false,
    "isReading": false,
    "content": ""
  },
  {
    "slug": "now-try-something-weirder",
    "title": "Now Try Something Weirder",
    "author": "Michael Johnson",
    "year": 2019,
    "hasNotes": false,
    "isReading": false,
    "content": ""
  },
  {
    "slug": "rules-of-work",
    "title": "The Rules of Work",
    "author": "Richard Templar",
    "year": 2015,
    "hasNotes": false,
    "isReading": false,
    "content": ""
  },
  {
    "slug": "shift",
    "title": "Shift",
    "author": "Ethan Kross",
    "year": 2024,
    "hasNotes": false,
    "isReading": false,
    "content": ""
  },
  {
    "slug": "song-of-achilles",
    "title": "The Song of Achilles",
    "author": "Madeline Miller",
    "year": 2011,
    "hasNotes": false,
    "isReading": true,
    "content": ""
  },
  {
    "slug": "strategy",
    "title": "Strategy",
    "author": "Harvard Business Review",
    "year": 2018,
    "hasNotes": false,
    "isReading": false,
    "content": ""
  },
  {
    "slug": "women-of-troy",
    "title": "The Women of Troy",
    "author": "Pat Barker",
    "year": 2021,
    "hasNotes": false,
    "isReading": false,
    "content": ""
  }
]
