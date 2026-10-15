import { BOROUGHS, type Borough, type Filters, type Source } from '@/lib/types'

interface Props {
  source: Source
  filters: Filters
  cuisines: string[]
  onChange: (f: Filters) => void
}

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item]
}

function Chip({ active, onClick, children, label }: { active: boolean; onClick: () => void; children: React.ReactNode; label?: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={label}
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
        active ? 'border-ink bg-ink text-paper' : 'border-line bg-paper/60 text-ink hover:border-ink/40'
      }`}
    >
      {children}
    </button>
  )
}

function Switch({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="flex w-full items-center justify-between gap-4 text-left">
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-xs text-muted">{hint}</span>
      </span>
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? 'bg-sauce' : 'bg-line'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </span>
    </button>
  )
}

const LABEL = 'mb-2.5 block text-xs font-semibold uppercase tracking-[0.16em] text-muted'
const Label = ({ children }: { children: React.ReactNode }) => <h2 className={LABEL}>{children}</h2>

export default function FilterPanel({ source, filters, cuisines, onChange }: Props) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch })
  const cuisineOptions = filters.cuisine && !cuisines.includes(filters.cuisine) ? [filters.cuisine, ...cuisines] : cuisines

  return (
    <div className="space-y-6">
      <div>
        <Label>Borough</Label>
        <div className="flex flex-wrap gap-2">
          <Chip active={filters.boroughs.length === 0} onClick={() => set({ boroughs: [] })}>
            Anywhere
          </Chip>
          {BOROUGHS.map((b: Borough) => (
            <Chip key={b} active={filters.boroughs.includes(b)} onClick={() => set({ boroughs: toggle(filters.boroughs, b) })}>
              {b}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="cuisine" className={LABEL}>
          Craving
        </label>
        <div className="relative">
          <select
            id="cuisine"
            value={filters.cuisine ?? ''}
            onChange={(e) => set({ cuisine: e.target.value || null })}
            className="w-full appearance-none rounded-xl border border-line bg-paper/60 px-4 py-2.5 pr-10 text-sm font-medium outline-none transition focus:border-ink"
          >
            <option value="">Surprise me (any cuisine)</option>
            {cuisineOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <svg aria-hidden className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5.5 7.5 10 12l4.5-4.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {source === 'curated' ? (
        <div>
          <Label>Budget</Label>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((p) => (
              <Chip key={p} active={filters.prices.includes(p)} onClick={() => set({ prices: toggle(filters.prices, p) })} label={`${p} out of 4 price`}>
                <span className="tabular-nums">{'$'.repeat(p)}</span>
              </Chip>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Switch checked={filters.skipChains} onChange={(v) => set({ skipChains: v })} label="Skip the chains" hint="No McDonald's, Starbucks, Chipotle and friends" />
          <Switch checked={filters.gradeAOnly} onChange={(v) => set({ gradeAOnly: v })} label="A grades only" hint="Earned a Health Dept. A recently" />
        </div>
      )}
    </div>
  )
}
