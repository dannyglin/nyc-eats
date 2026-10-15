import { describe, expect, it } from 'vitest'
import { CURATED, filterCurated } from '@/lib/curated'
import { BOROUGHS, DEFAULT_FILTERS } from '@/lib/types'

describe('curated dataset', () => {
  it('has unique ids and complete rows', () => {
    const ids = new Set(CURATED.map((r) => r.id))
    expect(ids.size).toBe(CURATED.length)
    for (const r of CURATED) {
      expect(r.name && r.cuisine && r.address && r.note).toBeTruthy()
      expect(r.price).toBeGreaterThanOrEqual(1)
      expect(r.price).toBeLessThanOrEqual(4)
    }
  })
  it('covers every borough', () => {
    for (const b of BOROUGHS) expect(CURATED.some((r) => r.borough === b)).toBe(true)
  })
})

describe('filterCurated', () => {
  it('returns everything with default filters', () => {
    expect(filterCurated(CURATED, DEFAULT_FILTERS)).toHaveLength(CURATED.length)
  })
  it('combines borough, cuisine and price', () => {
    const out = filterCurated(CURATED, { ...DEFAULT_FILTERS, boroughs: ['Brooklyn'], cuisine: 'Pizza', prices: [1, 2] })
    expect(out.length).toBeGreaterThan(0)
    for (const r of out) {
      expect(r.borough).toBe('Brooklyn')
      expect(r.cuisine).toBe('Pizza')
      expect([1, 2]).toContain(r.price)
    }
  })
  it('treats several boroughs as "any of"', () => {
    const out = filterCurated(CURATED, { ...DEFAULT_FILTERS, boroughs: ['Bronx', 'Staten Island'] })
    expect(new Set(out.map((r) => r.borough))).toEqual(new Set(['Bronx', 'Staten Island']))
  })
})
