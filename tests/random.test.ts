import { describe, expect, it } from 'vitest'
import { pickFresh, randomInt } from '@/lib/random'

const pool = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]

describe('randomInt', () => {
  it('stays in range even when rng returns 1', () => {
    expect(randomInt(3, () => 0.999999)).toBe(2)
    expect(randomInt(3, () => 1)).toBe(2)
    expect(randomInt(3, () => 0)).toBe(0)
  })
  it('rejects an empty range', () => {
    expect(() => randomInt(0)).toThrow()
  })
})

describe('pickFresh', () => {
  it('returns null for an empty pool', () => {
    expect(pickFresh([], new Set())).toBeNull()
  })
  it('skips recently seen items', () => {
    for (let i = 0; i < 50; i++) expect(pickFresh(pool, new Set(['a', 'b']))?.id).toBe('c')
  })
  it('falls back to the whole pool once everything has been seen', () => {
    expect(pickFresh(pool, new Set(['a', 'b', 'c']), () => 0)?.id).toBe('a')
  })
})
