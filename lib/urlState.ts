import { BOROUGHS, DEFAULT_FILTERS, type Filters, type Source } from './types'

export interface UrlState {
  source: Source
  filters: Filters
  pick?: string
}

export function parseUrlState(search: string): UrlState {
  const p = new URLSearchParams(search)
  const boroughs = (p.get('boro') ?? '')
    .split(',')
    .map((b) => BOROUGHS.find((x) => x.toLowerCase() === b.trim().toLowerCase()))
    .filter((b): b is (typeof BOROUGHS)[number] => Boolean(b))
  const prices = (p.get('price') ?? '')
    .split(',')
    .map(Number)
    .filter((n) => Number.isInteger(n) && n >= 1 && n <= 4)
  return {
    source: p.get('mode') === 'picks' ? 'curated' : 'live',
    filters: {
      ...DEFAULT_FILTERS,
      boroughs,
      cuisine: p.get('cuisine') || null,
      prices,
      gradeAOnly: p.get('grade') === 'a',
      skipChains: p.get('chains') !== 'ok',
    },
    pick: p.get('pick') ?? undefined,
  }
}

export function toSearch({ source, filters, pick }: UrlState): string {
  const p = new URLSearchParams()
  if (source === 'curated') p.set('mode', 'picks')
  if (filters.boroughs.length) p.set('boro', filters.boroughs.join(','))
  if (filters.cuisine) p.set('cuisine', filters.cuisine)
  if (source === 'curated' && filters.prices.length) p.set('price', [...filters.prices].sort().join(','))
  if (source === 'live' && filters.gradeAOnly) p.set('grade', 'a')
  if (source === 'live' && !filters.skipChains) p.set('chains', 'ok')
  if (pick) p.set('pick', pick)
  const s = p.toString()
  return s ? `?${s}` : ''
}
