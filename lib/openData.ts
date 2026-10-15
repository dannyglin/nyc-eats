/**
 * Live restaurant source: NYC Open Data's "DOHMH New York City Restaurant
 * Inspection Results" dataset. It lists every restaurant the Health Department
 * inspects (tens of thousands of places), is free, and needs no API key.
 * https://data.cityofnewyork.us/Health/DOHMH-New-York-City-Restaurant-Inspection-Results/43nn-pn8j
 *
 * The dataset has one row per inspection violation, so restaurants are
 * de-duplicated by their CAMIS id with SoQL's group by / count(distinct).
 */
import { titleCase, formatPhone } from './format'
import { randomInt, type Rng } from './random'
import type { Filters, Restaurant } from './types'
import { isBorough } from './types'

export const ENDPOINT = 'https://data.cityofnewyork.us/resource/43nn-pn8j.json'

/** Only consider places inspected this recently, so closed restaurants mostly drop out. */
export const ACTIVE_WITHIN_MONTHS = 18

/** Big chains hidden by the "skip chains" toggle. Matched as name prefixes. */
export const CHAINS = [
  'MCDONALD', 'STARBUCKS', 'DUNKIN', 'SUBWAY', 'BURGER KING', "WENDY'S", 'CHIPOTLE', 'POPEYES',
  'KFC', 'TACO BELL', "DOMINO'S", "PAPA JOHN", 'PIZZA HUT', 'PANERA', 'SWEETGREEN', 'CHICK-FIL-A',
  'JUST SALAD', 'CAVA', 'FIVE GUYS', 'SHAKE SHACK', 'LITTLE CAESARS', 'DUNKIN DONUTS', "CHECKERS",
  'WHITE CASTLE', 'BASKIN', 'AUNTIE ANNE', 'CROWN FRIED CHICKEN', 'KENNEDY FRIED CHICKEN',
  'PRET A MANGER', 'TIM HORTONS', 'BLUESTONE LANE', 'JOE & THE JUICE', 'DIG',
]

/** Categories that are not really a meal out. Skipped unless picked explicitly. */
export const NOT_A_MEAL = [
  'Coffee/Tea', 'Bottled Beverages', 'Juice, Smoothies, Fruit Salads', 'Donuts', 'Frozen Desserts',
  'Nuts/Confectionary', 'Fruits/Vegetables', 'Not Listed/Not Applicable', 'Hotdogs/Pretzels',
]

type Fetch = typeof fetch

export function quote(value: string): string {
  return `'${value.replace(/'/g, "''")}'`
}

export function sinceDate(now: Date, months = ACTIVE_WITHIN_MONTHS): string {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - months, now.getUTCDate()))
  return d.toISOString().slice(0, 10)
}

/** SoQL $where clause for the given filters. */
export function buildWhere(filters: Filters, now = new Date()): string {
  const clauses = [
    `inspection_date > ${quote(sinceDate(now))}`,
    'latitude > 0',
    'cuisine_description IS NOT NULL',
    'dba IS NOT NULL',
  ]
  if (filters.boroughs.length > 0) clauses.push(`boro in(${filters.boroughs.map(quote).join(',')})`)
  if (filters.cuisine) clauses.push(`cuisine_description = ${quote(filters.cuisine)}`)
  else clauses.push(`cuisine_description not in(${NOT_A_MEAL.map(quote).join(',')})`)
  if (filters.gradeAOnly) clauses.push(`grade = 'A'`)
  if (filters.skipChains) for (const chain of CHAINS) clauses.push(`dba not like ${quote(chain + '%')}`)
  return clauses.join(' AND ')
}

export function buildUrl(params: Record<string, string | number>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) search.set(key, String(value))
  return `${ENDPOINT}?${search.toString()}`
}

interface InspectionRow {
  camis: string
  dba?: string
  boro?: string
  building?: string
  street?: string
  zipcode?: string
  phone?: string
  cuisine_description?: string
  grade?: string
  grade_date?: string
  latitude?: string
  longitude?: string
}

export function toRestaurant(row: InspectionRow, graded?: InspectionRow): Restaurant | null {
  if (!row.dba || !row.boro || !isBorough(row.boro)) return null
  const lat = Number(row.latitude)
  const lng = Number(row.longitude)
  const grade = graded?.grade
  return {
    id: row.camis,
    source: 'live',
    name: titleCase(row.dba),
    cuisine: row.cuisine_description ?? 'Restaurant',
    borough: row.boro,
    address: titleCase([row.building, row.street].filter(Boolean).join(' ')),
    zipcode: row.zipcode,
    phone: formatPhone(row.phone),
    grade: grade && /^[ABC]$/.test(grade) ? grade : undefined,
    gradeDate: grade ? graded?.grade_date?.slice(0, 10) : undefined,
    lat: lat > 0 ? lat : undefined,
    lng: lat > 0 && lng < 0 ? lng : undefined,
  }
}

export class OpenDataError extends Error {}

export class LiveSource {
  private counts = new Map<string, number>()

  constructor(
    private fetchImpl: Fetch = (...args) => fetch(...args),
    private now: () => Date = () => new Date(),
  ) {}

  private async get<T>(params: Record<string, string | number>): Promise<T> {
    let res: Response
    try {
      res = await this.fetchImpl(buildUrl(params), { headers: { Accept: 'application/json' } })
    } catch {
      throw new OpenDataError("Couldn't reach NYC Open Data. Check your connection.")
    }
    if (!res.ok) throw new OpenDataError(`NYC Open Data returned ${res.status}.`)
    return (await res.json()) as T
  }

  /** How many distinct restaurants match. Cached per filter set. */
  async count(filters: Filters): Promise<number> {
    const where = buildWhere(filters, this.now())
    const cached = this.counts.get(where)
    if (cached !== undefined) return cached
    const rows = await this.get<{ n: string }[]>({ $select: 'count(distinct camis) as n', $where: where })
    const n = Number(rows[0]?.n ?? 0)
    this.counts.set(where, n)
    return n
  }

  /** A random matching restaurant, avoiding recent ids when it can. */
  async random(filters: Filters, recent: ReadonlySet<string> = new Set(), rng: Rng = Math.random): Promise<Restaurant | null> {
    const total = await this.count(filters)
    if (total === 0) return null
    const where = buildWhere(filters, this.now())
    let camis: string | undefined
    for (let attempt = 0; attempt < 3; attempt++) {
      const rows = await this.get<{ camis: string }[]>({
        $select: 'camis',
        $where: where,
        $group: 'camis',
        $order: 'camis',
        $limit: 1,
        $offset: randomInt(total, rng),
      })
      camis = rows[0]?.camis
      if (camis && !recent.has(camis)) break
    }
    if (!camis) return null
    return this.byId(camis)
  }

  /** Latest details for one restaurant, plus its most recent letter grade. */
  async byId(camis: string): Promise<Restaurant | null> {
    if (!/^\d+$/.test(camis)) return null
    const [latest, graded] = await Promise.all([
      this.get<InspectionRow[]>({ $where: `camis = ${quote(camis)}`, $order: 'inspection_date DESC', $limit: 1 }),
      this.get<InspectionRow[]>({
        $where: `camis = ${quote(camis)} AND grade in('A','B','C')`,
        $order: 'grade_date DESC',
        $limit: 1,
      }),
    ])
    return latest[0] ? toRestaurant(latest[0], graded[0]) : null
  }

  /** Cuisines with at least a handful of active restaurants, alphabetically. */
  async cuisines(): Promise<string[]> {
    const rows = await this.get<{ c?: string; n: string }[]>({
      $select: 'cuisine_description as c, count(distinct camis) as n',
      $where: `inspection_date > ${quote(sinceDate(this.now()))} AND cuisine_description IS NOT NULL`,
      $group: 'cuisine_description',
      $order: 'c',
      $limit: 500,
    })
    return rows.filter((r) => r.c && Number(r.n) >= 5).map((r) => r.c as string)
  }
}
