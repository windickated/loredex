export interface Character {
  name: string
  appearance: number
  lastSeen?: number
  dead?: boolean
  state: "good" | "evil" | "neutral"
  connections?: string[]
  transformations?: string[]
  affiliation?: string
  status?: string
  bio?: string
  history?: string
  stories?: Story[]
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