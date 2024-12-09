export interface Character {
  name: string
  picture: string
  appearance?: number
  lastSeen?: number
  dead?: boolean
  state: "good" | "evil" | "neutral"
  potentialNFT?: number
  conexusGames?: string[]
  connections?: {
    allies?: string[]
    enemies?: string[]
    neutral?: string[]
  }
  transformations?: Transformation[]
  stories?: CharacterStories[]
  affiliation?: string
  status?: string
  bio?: string
  history?: string
}

interface Transformation {
  name: string
  picture: string
}

export interface CharacterStories {
  season: number
  episodes: number[]
}

export interface Season {
  season: number
  title?: string
  epoch: string
  episodes: Story[]
}

interface Story {
  episode: number
  title: string
  link: string
  date?: number
  bio: string
  description?: string
}

export interface TimeSection {
  date: [number, number]
  note?: string
  action?: string
  emptySection?: boolean
  expandable?: number 
}

export interface Place {
  name: string
  picture: string
  description?: string
}