export interface Character {
  name: string
  picture: string
  appearance: number
  lastSeen?: number
  dead?: boolean
  state: "good" | "evil" | "neutral"
  potentialNFT?: number
  connections?: string[]
  transformations?: Transformation[]
  affiliation?: string
  status?: string
  bio?: string
  history?: string
  stories?: Story[]
}

interface Transformation {
  name: string
  picture: string
}

interface Story {
  link: string
  description: string
}

export interface TimeSection {
  date: [number, number]
  note?: string
  action?: string
  emptySection?: boolean
}