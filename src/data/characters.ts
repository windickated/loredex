interface Character {
  name: string
  timeline: number
  state: "good" | "evil" | "neutral"
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
    timeline: 0,
    state: "evil",
    image: '/blank.avif'
  },
  {
    name: 'CoNexus',
    timeline: 2,
    state: "evil",
    image: '/blank.avif'
  },
  {
    name: 'Collector',
    timeline: 5,
    state: "evil",
    image: '/blank.avif'
  },
  {
    name: 'Warden',
    timeline: 5,
    state: "evil",
    image: '/blank.avif'
  },
  {
    name: 'Meme',
    timeline: 8,
    state: "evil",
    image: '/blank.avif'
  },
  {
    name: 'Warlord',
    timeline: 14,
    state: "evil",
    image: '/blank.avif'
  },
  {
    name: 'Politician',
    timeline: 14,
    state: "evil",
    image: '/blank.avif'
  },
  {
    name: 'Watcher',
    timeline: 14,
    state: "evil",
    image: '/blank.avif'
  },
  {
    name: 'Vortex',
    timeline: 15,
    state: "evil",
    image: '/blank.avif'
  },
  {
    name: 'Game Master',
    timeline: 18,
    state: "evil",
    image: '/blank.avif'
  },
  {
    name: 'Necromancer',
    timeline: 23,
    state: "evil",
    image: '/blank.avif'
  },
  {
    name: 'Human',
    timeline: 25,
    state: "evil",
    image: '/blank.avif'
  },
  {
    name: 'Kael',
    timeline: 31,
    state: "good",
    image: '/blank.avif'
  },
  {
    name: 'Agent Zero',
    timeline: 33,
    state: "good",
    image: '/blank.avif'
  },
  {
    name: 'Iron Lion',
    timeline: 33,
    state: "good",
    image: '/blank.avif'
  },
  {
    name: 'The Oracle',
    timeline: 36,
    state: "good",
    image: '/blank.avif'
  },
  {
    name: 'The Engineer',
    timeline: 37,
    state: "good",
    image: '/blank.avif'
  },
  {
    name: 'The Eyes of the Watcher',
    timeline: 38,
    state: "good",
    image: '/blank.avif'
  },
  {
    name: 'The Nomad',
    timeline: 31,
    state: "good",
    image: '/blank.avif'
  },
  {
    name: 'The Hierophant',
    timeline: 44,
    state: "neutral",
    image: '/blank.avif'
  },
  {
    name: 'Captain Arion ',
    timeline: 45,
    state: "neutral",
    image: '/blank.avif'
  },
  {
    name: 'Ambassador Veron',
    timeline: 45,
    state: "neutral",
    image: '/blank.avif'
  },
  {
    name: 'The Council of Harmony',
    timeline: 47,
    state: "neutral",
    image: '/blank.avif'
  }
]

export default characters;