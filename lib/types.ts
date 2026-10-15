export const BOROUGHS = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'] as const
export type Borough = (typeof BOROUGHS)[number]

export type Source = 'curated' | 'live'

export interface Restaurant {
  /** Slug for curated picks, the city's CAMIS id for live picks. */
  id: string
  source: Source
  name: string
  cuisine: string
  borough: Borough
  address: string
  neighborhood?: string
  zipcode?: string
  phone?: string
  /** 1 to 4 dollar signs. Curated picks only. */
  price?: number
  note?: string
  /** Latest NYC health inspection letter grade. Live picks only. */
  grade?: string
  gradeDate?: string
  lat?: number
  lng?: number
}

export interface Filters {
  boroughs: Borough[]
  /** null means any cuisine. */
  cuisine: string | null
  /** Empty means any price. Curated picks only. */
  prices: number[]
  /** Live picks only. */
  gradeAOnly: boolean
  /** Live picks only. */
  skipChains: boolean
}

export const DEFAULT_FILTERS: Filters = {
  boroughs: [],
  cuisine: null,
  prices: [],
  gradeAOnly: false,
  skipChains: true,
}

export function isBorough(value: string): value is Borough {
  return (BOROUGHS as readonly string[]).includes(value)
}
