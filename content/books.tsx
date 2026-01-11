export interface Book {
  slug: string
  title: string
  author: string
  year: number
  lastUpdated?: string
  coverImage?: string
  spineImage?: string
  aspectRatio?: number
  hasNotes: boolean
  isReading: boolean
  content: string
}

export const books: Book[] = [
  {
    "slug": "1929-inside-the-greatest-crash",
    "title": "1929: Inside the Greatest Crash",
    "author": "Andrew Ross Sorkin",
    "year": 2025,
    "hasNotes": false,
    "isReading": false,
    "coverImage": "/Bookshelf/1929-cover.png",
    "content": ""
  },
  {
    "slug": "abundance",
    "title": "Abundance",
    "author": "Ezra Klein & Derek Thompson",
    "year": 2025,
    "hasNotes": false,
    "isReading": false,
    "coverImage": "/Bookshelf/abundance-cover.png",
    "content": ""
  },
  {
    "slug": "alexander-mcqueen",
    "title": "Alexander McQueen",
    "author": "Judith Watt",
    "year": 2012,
    "hasNotes": false,
    "isReading": false,
    "coverImage": "/Bookshelf/alexander-mcqueen-cover.png",
    "aspectRatio": 0.73,
    "content": ""
  },
  {
    "slug": "beasts-of-prey",
    "title": "Beasts of Prey",
    "author": "Ayana Gray",
    "year": 2021,
    "hasNotes": true,
    "isReading": false,
    "coverImage": "/Bookshelf/beasts-of-prey-cover.png",
    "content": ""
  },
  {
    "slug": "black-panther",
    "title": "Black Panther (2016-2018) #1",
    "author": "Ta-Nehisi Coates",
    "year": 2016,
    "hasNotes": false,
    "isReading": false,
    "coverImage": "/Bookshelf/black-panther-cover.png",
    "content": ""
  },
  {
    "slug": "building-rocketships",
    "title": "Building Rocketships",
    "author": "Oji Udezue & Ezinne Udezue",
    "year": 2024,
    "hasNotes": false,
    "isReading": false,
    "coverImage": "/Bookshelf/building-rocketships-cover.png",
    "content": ""
  },
  {
    "slug": "careless-people",
    "title": "Careless People",
    "author": "Sarah Wynn-Williams",
    "year": 2025,
    "hasNotes": false,
    "isReading": false,
    "coverImage": "/Bookshelf/careless-people-cover.png",
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
    "content": "<p>I am loving the modern retellings of these Greek mythologies. Madeline Miller is an absolute beast of a writer.</p>\n<blockquote><em>My favourite quote: \"I will not be like a bird bred in a cage, I thought, too dull to fly even when the door stands open. I stepped into those woods and my life began.\"</em></blockquote>\n<p><strong class=\"font-semibold\">Woman. Witch. Myth. Mortal. Outcast. Lover. Destroyer. Survivor. CIRCE.</strong></p>\n<p>We see Circe as she grows in what is considered strangeness for her ilk and kind. She's not powerful or terrible like her father. She's not gorgeous, manipulative and calculating like her mother or siblings.</p>\n<p>She's scorned and rejected. And Circe grows up in the shadows at home in neither the world of gods nor mortals. Infact, her voice is described as being so soft, she's compared to mortals; unlike the thunderous voices of gods and titans.</p>\n<p>But Circe has a dark power of her own, witchcraft. And when this gift threatens the gods, she is banished to the island of Aiaia, where she hones her craft, casting spells, gathering strange herbs, taming wild beasts.</p>\n<p>Yet as we know a woman who stands alone will never be left in peace for long. And among her island's many guests who get turned into swine, there is an unexpected but prophesied visitor: the mortal Odysseus for whom Circe will risk everything.</p>\n<p>This is a story, a vivid mesmerizing epic of family rivalry, of love and loss, and a defiant inextinguishable song of a woman burning hot and bright through the darkness of a man's world.</p>"
  },
  {
    "slug": "empire-of-ai",
    "title": "Empire of AI",
    "author": "Karen Hao",
    "year": 2025,
    "hasNotes": false,
    "isReading": true,
    "coverImage": "/Bookshelf/empire-of-ai-cover.png",
    "content": ""
  },
  {
    "slug": "everything-is-a-prototype",
    "title": "Everything is a Prototype",
    "author": "Brendan Kearns",
    "year": 2025,
    "hasNotes": false,
    "isReading": true,
    "coverImage": "/Bookshelf/everything-is-a-prototype-cover.png",
    "content": ""
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
    "coverImage": "/Bookshelf/girls-just-wanna-have-funds-cover.png",
    "aspectRatio": 0.79,
    "content": ""
  },
  {
    "slug": "greek-myths",
    "title": "Greek Myths",
    "author": "Gustav Schwab",
    "year": 1838,
    "hasNotes": false,
    "isReading": false,
    "coverImage": "/Bookshelf/greek-myths-cover.png",
    "aspectRatio": 0.82,
    "content": ""
  },
  {
    "slug": "how-to-live-with-objects",
    "title": "How to Live with Objects",
    "author": "Monica Khemsurov & Jill Singer",
    "year": 2022,
    "hasNotes": false,
    "isReading": false,
    "coverImage": "/Bookshelf/how-to-live-with-objects-cover.png",
    "aspectRatio": 0.75,
    "content": ""
  },
  {
    "slug": "ink-blood-sister-scribe",
    "title": "Ink Blood Sister Scribe",
    "author": "Emma Torzs",
    "year": 2023,
    "hasNotes": false,
    "isReading": false,
    "coverImage": "/Bookshelf/ink-blood-sister-scribe-cover.png",
    "content": ""
  },
  {
    "slug": "now-try-something-weirder",
    "title": "Now Try Something Weirder",
    "author": "Michael Johnson",
    "year": 2019,
    "hasNotes": false,
    "isReading": false,
    "coverImage": "/Bookshelf/now-try-something-weirder-cover.png",
    "aspectRatio": 0.78,
    "content": ""
  },
  {
    "slug": "reflections-on-the-existence-of-god",
    "title": "Reflections On The Existence Of God",
    "author": "Richard E Simmons III",
    "year": 2019,
    "hasNotes": false,
    "isReading": false,
    "coverImage": "/Bookshelf/reflections-on-the-existence-of-God-cover.png",
    "content": ""
  },
  {
    "slug": "rules-of-work",
    "title": "The Rules of Work",
    "author": "Richard Templar",
    "year": 2015,
    "hasNotes": false,
    "isReading": false,
    "coverImage": "/Bookshelf/the-rules-of-work-cover.png",
    "content": ""
  },
  {
    "slug": "shift",
    "title": "Shift",
    "author": "Ethan Kross",
    "year": 2024,
    "hasNotes": false,
    "isReading": false,
    "coverImage": "/Bookshelf/shift-cover.png",
    "aspectRatio": 1,
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
    "coverImage": "/Bookshelf/strategy-hbr-cover.png",
    "aspectRatio": 1,
    "content": ""
  },
  {
    "slug": "the-anxious-generation",
    "title": "The Anxious Generation",
    "author": "Jonathan Haidt",
    "year": 2024,
    "hasNotes": false,
    "isReading": true,
    "coverImage": "/Bookshelf/the-anxious-generation-cover.png",
    "content": ""
  },
  {
    "slug": "the-curiosity-curve",
    "title": "The Curiosity Curve",
    "author": "Dr. Debra Clary",
    "year": 2025,
    "hasNotes": false,
    "isReading": false,
    "coverImage": "/Bookshelf/the-curiosity-curve-cover.png",
    "content": ""
  },
  {
    "slug": "the-four-loves",
    "title": "The Four Loves",
    "author": "C. S. Lewis",
    "year": 2017,
    "hasNotes": false,
    "isReading": false,
    "coverImage": "/Bookshelf/the-four-loves-cover.png",
    "content": ""
  },
  {
    "slug": "the-great-divorce",
    "title": "The Great Divorce",
    "author": "C. S. Lewis",
    "year": 2009,
    "hasNotes": false,
    "isReading": false,
    "coverImage": "/Bookshelf/the-great-divorce-cover.png",
    "content": ""
  },
  {
    "slug": "the-practice-of-the-presence-of-god",
    "title": "The Practice of the Presence of God",
    "author": "Brother Lawrence",
    "year": 2024,
    "hasNotes": false,
    "isReading": true,
    "coverImage": "/Bookshelf/the-practice-of-the-presence-of-God-cover.png",
    "content": ""
  },
  {
    "slug": "the-war-for-middle-earth",
    "title": "The War for Middle-earth",
    "author": "Joseph Loconte",
    "year": 2025,
    "hasNotes": false,
    "isReading": false,
    "coverImage": "/Bookshelf/the-war-for-middle-earth-cover.png",
    "content": ""
  },
  {
    "slug": "things-become-other-things",
    "title": "Things Become Other Things",
    "author": "Craig Mod",
    "year": 2025,
    "hasNotes": false,
    "isReading": false,
    "coverImage": "/Bookshelf/things-become-other-things-cover.png",
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
