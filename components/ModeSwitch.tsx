import type { Source } from '@/lib/types'

const OPTIONS: { value: Source; label: string; hint: string }[] = [
  { value: 'live', label: 'All of NYC', hint: 'Live city data' },
  { value: 'curated', label: 'Hand-picked', hint: '140+ favorites' },
]

export default function ModeSwitch({ value, onChange }: { value: Source; onChange: (s: Source) => void }) {
  return (
    <div role="radiogroup" aria-label="Where to pick from" className="inline-flex rounded-2xl border border-line bg-card p-1 shadow-sm">
      {OPTIONS.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`rounded-xl px-4 py-2 text-left transition ${active ? 'bg-ink text-paper shadow' : 'text-muted hover:text-ink'}`}
          >
            <span className="block text-sm font-semibold">{o.label}</span>
            <span className={`block text-xs ${active ? 'text-paper/70' : 'text-muted'}`}>{o.hint}</span>
          </button>
        )
      })}
    </div>
  )
}
