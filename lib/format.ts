const SMALL_WORDS = new Set(['a', 'an', 'and', 'at', 'de', 'del', 'di', 'el', 'la', 'le', 'of', 'on', 'the'])

/** "JOE'S PIZZA & GRILL" -> "Joe's Pizza & Grill". The city data is all caps. */
export function titleCase(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((word, i) => {
      if (i > 0 && SMALL_WORDS.has(word)) return word
      return word.replace(/(^|[-/(."])([a-z])/g, (_, sep: string, ch: string) => sep + ch.toUpperCase())
    })
    .join(' ')
}

/** "7183801172" -> "(718) 380-1172". Returns undefined for junk numbers. */
export function formatPhone(raw?: string): string | undefined {
  const digits = (raw ?? '').replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '')
  if (digits.length !== 10 || /^(\d)\1+$/.test(digits)) return undefined
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

export function priceLabel(price?: number): string {
  return price ? '$'.repeat(price) : ''
}

export function mapsSearchUrl(name: string, address: string, borough: string): string {
  const q = `${name}, ${address}, ${borough}, NY`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
}

export function directionsUrl(r: { name: string; address: string; borough: string; lat?: number; lng?: number }): string {
  const destination = r.lat && r.lng ? `${r.lat},${r.lng}` : `${r.name}, ${r.address}, ${r.borough}, NY`
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`
}

/** OpenStreetMap embed centred on a point. Free and needs no API key. */
export function osmEmbedUrl(lat: number, lng: number): string {
  const d = 0.004
  const bbox = [lng - d, lat - d * 0.75, lng + d, lat + d * 0.75].map((n) => n.toFixed(5)).join(',')
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`
}
