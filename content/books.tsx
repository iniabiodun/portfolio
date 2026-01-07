export interface Book {
  slug: string
  title: string
  author: string
  year: number
  lastUpdated?: string
  coverImage?: string
  spineImage?: string
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
    "lastUpdated": "01-04-2026",
    "hasNotes": true,
    "isReading": true,
    "coverImage": "/Bookshelf/book-covers-for-folio/circe-cover.png",
    "spineImage": "/Bookshelf/book-covers-for-folio/circe-spine.png",
    "content": "<p>I am loving the modern retellings of these Greek mythologies. Madeline Miller is an absolute beast of a writer.</p><blockquote><em>My favourite quote: \"I will not be like a bird bred in a cage, I thought, too dull to fly even when the door stands open. I stepped into those woods and my life began.\"</em></blockquote><p><strong>Woman. Witch. Myth. Mortal. Outcast. Lover. Destroyer. Survivor. CIRCE.</strong></p><p>We see Circe as she grows in what is considered strangeness for her ilk and kind. She's not powerful or terrible like her father. She's not gorgeous, manipulative and calculating like her mother or siblings.</p><p>She's scorned and rejected. And Circe grows up in the shadows at home in neither the world of gods nor mortals. Infact, her voice is described as being so soft, she's compared to mortals; unlike the thunderous voices of gods and titans.</p><p>But Circe has a dark power of her own, witchcraft. And when this gift threatens the gods, she is banished to the island of Aiaia, where she hones her craft, casting spells, gathering strange herbs, taming wild beasts.</p><p>Yet as we know a woman who stands alone will never be left in peace for long. And among her island's many guests who get turned into swine, there is an unexpected but prophesied visitor: the mortal Odysseus for whom Circe will risk everything.</p><p>This is a story, a vivid mesmerizing epic of family rivalry, of love and loss, and a defiant inextinguishable song of a woman burning hot and bright through the darkness of a man's world.</p>"
  },
  {
    "slug": "firstborn-of-the-sun",
    "title": "Firstborn of the Sun",
    "author": "Marvellous Michael Anson",
    "year": 2022,
    "hasNotes": false,
    "isReading": true,
    "coverImage": "/Bookshelf/book-covers-for-folio/firstborn-of-the-sun-cover.png",
    "spineImage": "/Bookshelf/book-covers-for-folio/firstborn-of-the-sun-spine.png",
    "content": ""
  },
  {
    "slug": "girl-goddess-queen",
    "title": "Girl, Goddess, Queen",
    "author": "Bea Fitzgerald",
    "year": 2023,
    "hasNotes": false,
    "isReading": true,
    "coverImage": "/Bookshelf/book-covers-for-folio/girl-goddess-queen-cover.png",
    "spineImage": "/Bookshelf/book-covers-for-folio/girl-goddess-queen-spine.png",
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
    "lastUpdated": "12-05-2025",
    "hasNotes": true,
    "isReading": true,
    "coverImage": "/Bookshelf/book-covers-for-folio/song-of-achilles-cover.png",
    "spineImage": "/Bookshelf/book-covers-for-folio/song-of-achilles-spine.png",
    "content": "<blockquote><em>I have heard such good things about Madeleine. Nothing prepared me for actually reading her books. Her writing flows uncomplicated, like drinking a warm cuppa and thick blanket on a rainy day. I tucked in and find myself eager to return to it.</em></blockquote>"
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
    "isReading": true,
    "coverImage": "/Bookshelf/book-covers-for-folio/women-of-troy-cover.png",
    "spineImage": "/Bookshelf/book-covers-for-folio/women-of-troy-spine.png",
    "content": ""
  }
]
