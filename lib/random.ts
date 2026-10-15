export type Rng = () => number

/** Random integer in [0, max). */
export function randomInt(max: number, rng: Rng = Math.random): number {
  if (max <= 0) throw new RangeError('max must be positive')
  return Math.min(max - 1, Math.floor(rng() * max))
}

/**
 * Picks a random item, avoiding anything in `recent` until every item in the
 * pool has been seen. Returns null for an empty pool.
 */
export function pickFresh<T extends { id: string }>(
  pool: readonly T[],
  recent: ReadonlySet<string>,
  rng: Rng = Math.random,
): T | null {
  if (pool.length === 0) return null
  const fresh = pool.filter((item) => !recent.has(item.id))
  const candidates = fresh.length > 0 ? fresh : pool
  return candidates[randomInt(candidates.length, rng)]
}
