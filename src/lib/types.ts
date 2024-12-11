export interface Character {
  name: string
  picture: string
  appearance?: number
  lastSeen?: number
  dead?: boolean
  state: "good" | "evil" | "neutral"
  potentialNFT?: number
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
  episodes: string[]
}

export interface Season {
  season: number
  title?: string
  epoch: string
  episodes: Story[]
}

interface Story {
  title: string
  link?: string
  date?: number
  bio?: string
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