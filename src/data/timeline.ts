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
    date: [800, 15099],
    emptySection: true
  },
  {
    date: [15000, 15099],
  },
  {
    date: [15100, 15199],
  },
  {
    date: [15200, 15299],
  },
  {
    date: [15300, 15399],
  },
  {
    date: [15400, 15499],
  },
  {
    date: [15500, 15599],
  },
  {
    date: [15600, 15699],
  },
  {
    date: [15700, 15799],
  },
  {
    date: [15800, 15899],
  },
  {
    date: [15900, 15999],
  },
  {
    date: [16000, 16099],
  },
  {
    date: [16100, 16199],
  },
  {
    date: [16200, 16299],
  },
  {
    date: [16300, 16399],
  },
  {
    date: [16400, 16499],
  },
  {
    date: [16500, 16599],
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
    date: [17100, 17199],
  },
  {
    date: [17200, 99899],
    emptySection: true
  },
  {
    date: [99900, 99999],
  },
  {
    date: [100000, 100099],
    action: 'The Potentials Awaken'
  },
  {
    date: [100100, 100199],
  },
  {
    date: [100200, 128599],
    emptySection: true
  },
  {
    date: [128600, 128699],
  },
]

export default timeline;