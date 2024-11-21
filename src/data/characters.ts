interface Character {
  name: string
  appearance: number
  death?: number
  state: "good" | "evil" | "neutral"
  connections?: string[]
  image: string
  summary?: string
  description?: string
  stories?: Story[]
}

interface Story {
  video: string
  image: string
  summary: string
  description: string
}

const characters: Character[] = [
  {
    name: 'Architect',
    appearance: 0,
    death: 40,
    state: "evil",
    connections: ['Collector', 'CoNexus'],
    image: '/blank.avif'
  },
  {
    name: 'CoNexus',
    appearance: 2,
    death: 34,
    state: "evil",
    connections: ['Architect', 'Collector', 'Warden'],
    image: '/blank.avif'
  },
  {
    name: 'Collector',
    appearance: 5,
    death: 27,
    state: "evil",
    connections: ['Architect', 'CoNexus'],
    image: '/blank.avif'
  },
  {
    name: 'Warden',
    appearance: 5,
    death: 15,
    state: "evil",
    connections: ['CoNexus'],
    image: '/blank.avif'
  },
  {
    name: 'Meme',
    appearance: 8,
    death: 16,
    state: "evil",
    connections: ['Politician', 'Watcher'],
    image: '/blank.avif'
  },
  {
    name: 'Warlord',
    appearance: 14,
    death: 21,
    state: "evil",
    connections: ['Vortex'],
    image: '/blank.avif'
  },
  {
    name: 'Politician',
    appearance: 14,
    death: 15,
    state: "evil",
    connections: ['Meme'],
    image: '/blank.avif'
  },
  {
    name: 'Watcher',
    appearance: 14,
    state: "evil",
    connections: ['Game Master', 'Meme'],
    image: '/blank.avif'
  },
  {
    name: 'Vortex',
    appearance: 15,
    state: "evil",
    connections: ['Warlord', 'Game Master'],
    image: '/blank.avif'
  },
  {
    name: 'Game Master',
    appearance: 18,
    death: 20,
    state: "evil",
    connections: ['Vortex', 'Watcher'],
    image: '/blank.avif'
  },
  {
    name: 'Necromancer',
    appearance: 23,
    death: 29,
    state: "evil",
    image: '/blank.avif'
  },
  {
    name: 'Human',
    appearance: 25,
    death: 27,
    state: "evil",
    connections: ['The Nomad'],
    image: '/blank.avif'
  },
  {
    name: 'Kael',
    appearance: 31,
    state: "good",
    connections: ['Iron Lion'],
    image: '/blank.avif'
  },
  {
    name: 'Agent Zero',
    appearance: 33,
    state: "good",
    connections: ['The Oracle', 'The Engineer', 'Iron Lion'],
    image: '/blank.avif'
  },
  {
    name: 'Iron Lion',
    appearance: 33,
    death: 34,
    state: "good",
    connections: ['Kael', 'Agent Zero', 'The Oracle', 'The Engineer'],
    image: '/blank.avif'
  },
  {
    name: 'The Oracle',
    appearance: 36,
    state: "good",
    connections: ['Agent Zero', 'Iron Lion'],
    image: '/blank.avif'
  },
  {
    name: 'The Engineer',
    appearance: 37,
    death: 45,
    state: "good",
    connections: ['Agent Zero', 'Iron Lion'],
    image: '/blank.avif'
  },
  {
    name: 'The Eyes of the Watcher',
    appearance: 38,
    state: "good",
    connections: ['Captain Arion', 'The Hierophant'],
    image: '/blank.avif'
  },
  {
    name: 'The Nomad',
    appearance: 31,
    state: "good",
    connections: ['Human'],
    image: '/blank.avif'
  },
  {
    name: 'The Hierophant',
    appearance: 44,
    state: "neutral",
    connections: ['The Eyes of the Watcher', 'Ambassador Veron'],
    image: '/blank.avif'
  },
  {
    name: 'Captain Arion',
    appearance: 45,
    death: 48,
    state: "neutral",
    connections: ['The Eyes of the Watcher', 'The Council of Harmony'],
    image: '/blank.avif'
  },
  {
    name: 'Ambassador Veron',
    appearance: 45,
    death: 46,
    state: "neutral",
    connections: ['The Hierophant'],
    image: '/blank.avif'
  },
  {
    name: 'The Council of Harmony',
    appearance: 47,
    state: "neutral",
    connections: ['Captain Arion'],
    image: '/blank.avif'
  }
]

export default characters;