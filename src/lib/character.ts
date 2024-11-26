export interface Character {
  name: string
  appearance: number
  lastSeen?: number
  dead?: boolean
  state: "good" | "evil" | "neutral"
  connections?: string[]
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