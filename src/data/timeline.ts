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
    date: [700, 799],
  },
  {
    date: [800, 16499],
    emptySection: true
  },
  {
    date: [16500, 16599],
    action: `The Advocate begins ruling the Empire of Shadows`
  },
  {
    date: [16600, 16699],
  },
  {
    date: [16700, 16799],
  },
  {
    date: [16800, 16899],
  },
  {
    date: [16900, 16999],
  },
  {
    date: [17000, 17099],
    note: '19072 CE',
    action: 'The Fall of Reality occurs'
  },
  {
    date: [17100, 18000],
  },
  {
    date: [18000, 20000],
  },
  {
    date: [20000, 30000],
  },
  {
    date: [30000, 40000],
  },
  {
    date: [40000, 50000],
  },
  {
    date: [50000, 60000],
  },
  {
    date: [60000, 70000],
  },
  {
    date: [70000, 80000],
  },
  {
    date: [80000, 90000],
  },
  {
    date: [90000, 100000],
  },
  {
    date: [100000, 125000],
  },
  {
    date: [125000, 150000],
  },
]

export default timeline;