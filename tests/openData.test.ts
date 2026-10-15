import { describe, expect, it, vi } from 'vitest'
import { LiveSource, OpenDataError, buildWhere, quote, sinceDate, toRestaurant } from '@/lib/openData'
import { DEFAULT_FILTERS } from '@/lib/types'

const NOW = new Date('2026-10-15T12:00:00Z')

describe('SoQL building', () => {
  it('escapes single quotes', () => {
    expect(quote("JOE'S")).toBe("'JOE''S'")
  })
  it('looks back 18 months', () => {
    expect(sinceDate(NOW)).toBe('2025-04-15')
  })
  it('builds a where clause from filters', () => {
    const where = buildWhere({ ...DEFAULT_FILTERS, boroughs: ['Queens', 'Bronx'], cuisine: 'Thai', gradeAOnly: true, skipChains: false }, NOW)
    expect(where).toContain("inspection_date > '2025-04-15'")
    expect(where).toContain("boro in('Queens','Bronx')")
    expect(where).toContain("cuisine_description = 'Thai'")
    expect(where).toContain("grade = 'A'")
    expect(where).not.toContain('dba not like')
    expect(where).not.toContain('not in(')
  })
  it('skips chains and non-meal categories by default', () => {
    const where = buildWhere(DEFAULT_FILTERS, NOW)
    expect(where).toContain("dba not like 'MCDONALD%'")
    expect(where).toContain("dba not like 'WENDY''S%'")
    expect(where).toContain("cuisine_description not in('Coffee/Tea'")
  })
})

describe('toRestaurant', () => {
  const row = {
    camis: '40377385', dba: "NAPOLI PIZZA & PASTA", boro: 'Queens', building: '164-02', street: '69 AVENUE',
    zipcode: '11365', phone: '7183801172', cuisine_description: 'Pizza', latitude: '40.7330', longitude: '-73.8047',
  }
  it('cleans up the city data', () => {
    const r = toRestaurant(row, { camis: row.camis, grade: 'A', grade_date: '2026-09-29T00:00:00.000' })
    expect(r).toMatchObject({
      id: '40377385', source: 'live', name: 'Napoli Pizza & Pasta', address: '164-02 69 Avenue',
      phone: '(718) 380-1172', grade: 'A', gradeDate: '2026-09-29', lat: 40.733, lng: -73.8047,
    })
  })
  it('drops pending grades and missing coordinates', () => {
    const r = toRestaurant({ ...row, latitude: '0', longitude: '0' }, { camis: row.camis, grade: 'Z' })
    expect(r?.grade).toBeUndefined()
    expect(r?.lat).toBeUndefined()
  })
  it('rejects rows without a real borough', () => {
    expect(toRestaurant({ ...row, boro: '0' })).toBeNull()
  })
})

function fakeFetch(handler: (params: URLSearchParams) => unknown) {
  return vi.fn(async (input: RequestInfo | URL) => {
    const url = new URL(String(input))
    return new Response(JSON.stringify(handler(url.searchParams)), { status: 200 })
  }) as unknown as typeof fetch
}

describe('LiveSource', () => {
  it('counts, picks an offset, then loads the restaurant', async () => {
    const offsets: string[] = []
    const fetchImpl = fakeFetch((p) => {
      if (p.get('$select')?.startsWith('count')) return [{ n: '10' }]
      if (p.get('$group') === 'camis') {
        offsets.push(p.get('$offset')!)
        return [{ camis: '123' }]
      }
      if (p.get('$where')?.includes('grade in')) return [{ camis: '123', grade: 'B', grade_date: '2026-01-02T00:00:00.000' }]
      return [{ camis: '123', dba: 'PLACE', boro: 'Bronx', building: '1', street: 'MAIN ST', cuisine_description: 'Thai' }]
    })
    const source = new LiveSource(fetchImpl, () => NOW)
    const r = await source.random(DEFAULT_FILTERS, new Set(), () => 0.55)
    expect(offsets).toEqual(['5'])
    expect(r).toMatchObject({ id: '123', name: 'Place', borough: 'Bronx', grade: 'B' })
  })

  it('caches counts per filter set', async () => {
    const fetchImpl = fakeFetch(() => [{ n: '3' }])
    const source = new LiveSource(fetchImpl, () => NOW)
    await source.count(DEFAULT_FILTERS)
    await source.count(DEFAULT_FILTERS)
    expect(fetchImpl).toHaveBeenCalledTimes(1)
  })

  it('returns null when nothing matches', async () => {
    const source = new LiveSource(fakeFetch(() => [{ n: '0' }]), () => NOW)
    expect(await source.random(DEFAULT_FILTERS)).toBeNull()
  })

  it('reports network failures in plain words', async () => {
    const source = new LiveSource((async () => { throw new TypeError('fetch failed') }) as typeof fetch, () => NOW)
    await expect(source.count(DEFAULT_FILTERS)).rejects.toBeInstanceOf(OpenDataError)
  })
})
