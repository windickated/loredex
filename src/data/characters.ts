interface Character {
  name: string
  timeline: number[]
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
    timeline: [0,40],
    state: "evil",
    connections: ['Collector', 'CoNexus'],
    image: '/blank.avif'
  },
  {
    name: 'CoNexus',
    timeline: [2,34],
    state: "evil",
    connections: ['Architect', 'Collector', 'Warden'],
    image: '/blank.avif'
  },
  {
    name: 'Collector',
    timeline: [5,27],
    state: "evil",
    connections: ['Architect', 'CoNexus'],
    image: '/blank.avif'
  },
  {
    name: 'Warden',
    timeline: [5,15],
    state: "evil",
    connections: ['CoNexus'],
    image: '/blank.avif'
  },
  {
    name: 'Meme',
    timeline: [8,16],
    state: "evil",
    connections: ['Politician', 'Watcher'],
    image: '/blank.avif'
  },
  {
    name: 'Warlord',
    timeline: [14,21],
    state: "evil",
    connections: ['Vortex'],
    image: '/blank.avif'
  },
  {
    name: 'Politician',
    timeline: [14,15],
    state: "evil",
    connections: ['Meme'],
    image: '/blank.avif'
  },
  {
    name: 'Watcher',
    timeline: [14],
    state: "evil",
    connections: ['Game Master', 'Meme'],
    image: '/blank.avif'
  },
  {
    name: 'Vortex',
    timeline: [15],
    state: "evil",
    connections: ['Warlord', 'Game Master'],
    image: '/blank.avif'
  },
  {
    name: 'Game Master',
    timeline: [18,20],
    state: "evil",
    connections: ['Vortex', 'Watcher'],
    image: '/blank.avif'
  },
  {
    name: 'Necromancer',
    timeline: [23,29],
    state: "evil",
    image: '/blank.avif'
  },
  {
    name: 'Human',
    timeline: [25,27],
    state: "evil",
    connections: ['The Nomad'],
    image: '/blank.avif'
  },
  {
    name: 'Kael',
    timeline: [31],
    state: "good",
    connections: ['Iron Lion'],
    image: '/blank.avif'
  },
  {
    name: 'Agent Zero',
    timeline: [33],
    state: "good",
    connections: ['The Oracle', 'The Engineer', 'Iron Lion'],
    image: '/blank.avif'
  },
  {
    name: 'Iron Lion',
    timeline: [33,34],
    state: "good",
    connections: ['Kael', 'Agent Zero', 'The Oracle', 'The Engineer'],
    image: '/blank.avif'
  },
  {
    name: 'The Oracle',
    timeline: [36,40],
    state: "good",
    connections: ['Agent Zero', 'Iron Lion'],
    image: '/blank.avif'
  },
  {
    name: 'The Engineer',
    timeline: [37,45],
    state: "good",
    connections: ['Agent Zero', 'Iron Lion'],
    image: '/blank.avif'
  },
  {
    name: 'The Eyes of the Watcher',
    timeline: [38],
    state: "good",
    connections: ['Captain Arion', 'The Hierophant'],
    image: '/blank.avif'
  },
  {
    name: 'The Nomad',
    timeline: [31],
    state: "good",
    connections: ['Human'],
    image: '/blank.avif'
  },
  {
    name: 'The Hierophant',
    timeline: [44],
    state: "neutral",
    connections: ['The Eyes of the Watcher', 'Ambassador Veron'],
    image: '/blank.avif'
  },
  {
    name: 'Captain Arion',
    timeline: [45,48],
    state: "neutral",
    connections: ['The Eyes of the Watcher', 'The Council of Harmony'],
    image: '/blank.avif'
  },
  {
    name: 'Ambassador Veron',
    timeline: [45,46],
    state: "neutral",
    connections: ['The Hierophant'],
    image: '/blank.avif'
  },
  {
    name: 'The Council of Harmony',
    timeline: [47],
    state: "neutral",
    connections: ['Captain Arion'],
    image: '/blank.avif'
  }
]

export default characters;