'use client'

import { useState } from 'react'
import { keyOf } from '@/lib/storage'
import type { Restaurant } from '@/lib/types'

interface Props {
  history: Restaurant[]
  saved: Restaurant[]
  onSelect: (r: Restaurant) => void
  onClearHistory: () => void
  onToggleSaved: (r: Restaurant) => void
}

export default function PickLists({ history, saved, onSelect, onClearHistory, onToggleSaved }: Props) {
  const [tab, setTab] = useState<'recent' | 'saved'>('recent')
  if (history.length === 0 && saved.length === 0) return null
  const list = tab === 'recent' ? history : saved

  return (
    <section className="mt-12" aria-label="Your picks">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-6">
          {(['recent', 'saved'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-pressed={tab === t}
              className={`font-display text-2xl font-bold transition ${tab === t ? 'text-ink' : 'text-muted/60 hover:text-muted'}`}
            >
              {t === 'recent' ? 'Recent' : 'Saved'}
              <span className="ml-1.5 align-top text-sm font-semibold">{(t === 'recent' ? history : saved).length}</span>
            </button>
          ))}
        </div>
        {tab === 'recent' && history.length > 0 && (
          <button onClick={onClearHistory} className="text-sm font-medium text-muted underline-offset-4 hover:text-ink hover:underline">
            Clear
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <p className="mt-4 text-muted">{tab === 'saved' ? 'Tap Save on a pick to keep it here.' : 'Your picks will show up here.'}</p>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((r) => (
            <li key={keyOf(r)} className="group flex items-center gap-3 rounded-2xl border border-line bg-card p-4 transition hover:border-ink/30">
              <button onClick={() => onSelect(r)} className="min-w-0 flex-1 text-left">
                <span className="block truncate font-semibold">{r.name}</span>
                <span className="block truncate text-sm text-muted">
                  {r.cuisine} · {r.neighborhood ?? r.borough}
                </span>
              </button>
              {tab === 'saved' && (
                <button onClick={() => onToggleSaved(r)} aria-label={`Remove ${r.name}`} className="rounded-lg p-1.5 text-muted hover:bg-paper hover:text-sauce">
                  <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 5l10 10M15 5L5 15" />
                  </svg>
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
