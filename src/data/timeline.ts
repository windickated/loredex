interface TimeSection {
  date: [number, number]
  note?: string
  action?: string
  emptySection?: boolean
}

const timeline: TimeSection[] = [
  {
    date: [1, 4],
    note: '2030 AD',
    action: `Architect Awakens: Day 1 Genesis`
  },
  {
    date: [5, 99],
  },
  {
    date: [100, 199],
  },
  {
    date: [200, 299],
  },
  {
    date: [300, 399],
  },
  {
    date: [400, 499],
  },
  {
    date: [500, 599],
  },
  {
    date: [600, 699],
  },
  {
    date: [700, 20000],
  },
  {
    date: [20000, 30000],
  },
  {
    date: [30000, 40000],
  },
  {
    date: [40000, 60000],
  },
  {
    date: [60000, 100000],
  },
  {
    date: [100000, 150000],
  },
]

export default timeline;