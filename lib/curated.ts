import data from '@/data/curated.json'
import type { Filters, Restaurant } from './types'
import { isBorough } from './types'

export const CURATED: Restaurant[] = data.map((row) => {
  if (!isBorough(row.borough)) throw new Error(`Unknown borough for ${row.name}: ${row.borough}`)
  return { ...row, borough: row.borough, source: 'curated' as const }
})

export const CURATED_CUISINES = [...new Set(CURATED.map((r) => r.cuisine))].sort()

export function filterCurated(list: readonly Restaurant[], filters: Filters): Restaurant[] {
  return list.filter(
    (r) =>
      (filters.boroughs.length === 0 || filters.boroughs.includes(r.borough)) &&
      (filters.cuisine === null || r.cuisine === filters.cuisine) &&
      (filters.prices.length === 0 || (r.price !== undefined && filters.prices.includes(r.price))),
  )
}

export function findCurated(id: string): Restaurant | undefined {
  return CURATED.find((r) => r.id === id)
}
