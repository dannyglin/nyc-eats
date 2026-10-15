import { describe, expect, it } from 'vitest'
import { DEFAULT_FILTERS } from '@/lib/types'
import { parseUrlState, toSearch } from '@/lib/urlState'

describe('url state', () => {
  it('round-trips filters and a pick', () => {
    const state = { source: 'curated' as const, filters: { ...DEFAULT_FILTERS, boroughs: ['Queens' as const], cuisine: 'Thai', prices: [1, 2] }, pick: 'lucali' }
    expect(parseUrlState(toSearch(state))).toEqual(state)
  })
  it('ignores junk', () => {
    const state = parseUrlState('?boro=Narnia,brooklyn&price=0,2,9&mode=nope&price=0,2,9')
    expect(state.source).toBe('live')
    expect(state.filters.boroughs).toEqual(['Brooklyn'])
    expect(state.filters.prices).toEqual([2])
  })
  it('keeps the default URL clean', () => {
    expect(toSearch({ source: 'live', filters: DEFAULT_FILTERS })).toBe('')
  })
})

describe('live url state', () => {
  it('round-trips live-only toggles', () => {
    const state = { source: 'live' as const, filters: { ...DEFAULT_FILTERS, boroughs: ['Queens' as const], gradeAOnly: true, skipChains: false }, pick: '123' }
    expect(parseUrlState(toSearch(state))).toEqual(state)
  })
})
