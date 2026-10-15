import type { Restaurant } from './types'

const PREFIX = 'nyc-eats:'

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function save(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Private mode or storage full. Nothing worth surfacing.
  }
}

export const HISTORY_LIMIT = 20

export function pushHistory(history: Restaurant[], pick: Restaurant): Restaurant[] {
  const key = keyOf(pick)
  return [pick, ...history.filter((r) => keyOf(r) !== key)].slice(0, HISTORY_LIMIT)
}

export function keyOf(r: Pick<Restaurant, 'source' | 'id'>): string {
  return `${r.source}:${r.id}`
}
