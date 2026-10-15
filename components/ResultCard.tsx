'use client'

import { useEffect, useState } from 'react'
import { directionsUrl, mapsSearchUrl, osmEmbedUrl, priceLabel } from '@/lib/format'
import type { Restaurant } from '@/lib/types'

interface Props {
  phase: 'idle' | 'spinning' | 'done' | 'empty' | 'error'
  pick: Restaurant | null
  error: string | null
  reelWords: string[]
  saved: boolean
  onSave: (r: Restaurant) => void
  onShare: (r: Restaurant) => void
  onRetry: () => void
}

const Shell = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <article className={`relative overflow-hidden rounded-3xl border border-line bg-card shadow-sm ${className}`}>{children}</article>
)

function Reel({ words }: { words: string[] }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (words.length === 0) return
    setI(Math.floor(Math.random() * words.length))
    const t = setInterval(() => setI((n) => (n + 7) % words.length), 75)
    return () => clearInterval(t)
  }, [words])
  return (
    <Shell className="flex min-h-[22rem] flex-col items-center justify-center p-8 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Spinning the boroughs</p>
      <p aria-hidden className="mt-4 line-clamp-2 font-display text-4xl font-bold text-ink/80 blur-[0.5px] sm:text-5xl">{words[i] ?? '…'}</p>
      <div className="mt-6 flex gap-1.5">
        {[0, 1, 2].map((d) => (
          <span key={d} className="h-2 w-2 animate-blink rounded-full bg-sauce" style={{ animationDelay: `${d * 160}ms` }} />
        ))}
      </div>
    </Shell>
  )
}

function GradeBadge({ grade, date }: { grade: string; date?: string }) {
  return (
    <div className="flex shrink-0 flex-col items-center" title={date ? `Health inspection grade, ${date}` : 'Health inspection grade'}>
      <div className="grid h-16 w-16 place-items-center rounded-lg border-[3px] border-grade bg-white font-display text-4xl font-extrabold text-[#1b4ea0]">
        {grade}
      </div>
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted">Health grade</span>
    </div>
  )
}

const buttonBase = 'inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition'
const actionClass = `${buttonBase} border-line bg-paper/60 hover:border-ink/40`
const primaryClass = `${buttonBase} border-ink bg-ink text-paper hover:opacity-90`

export default function ResultCard({ phase, pick, error, reelWords, saved, onSave, onShare, onRetry }: Props) {
  if (phase === 'spinning') return <Reel words={reelWords} />

  if (phase === 'error' || phase === 'empty') {
    return (
      <Shell className="flex min-h-[22rem] flex-col items-center justify-center p-8 text-center">
        <p className="font-display text-3xl font-bold">{phase === 'empty' ? 'Slim pickings.' : 'The kitchen is backed up.'}</p>
        <p className="mt-2 max-w-sm text-muted">{phase === 'empty' ? 'No restaurant matches those filters. Try another borough or cuisine.' : error}</p>
        {phase === 'error' && (
          <button onClick={onRetry} className={`${actionClass} mt-6`}>
            Try again
          </button>
        )}
      </Shell>
    )
  }

  if (!pick) {
    return (
      <Shell className="flex min-h-[22rem] flex-col justify-between bg-[linear-gradient(135deg,rgb(var(--taxi))_0%,rgb(var(--taxi))_55%,rgb(var(--sauce))_55.2%)] p-8 text-[#1a1714]">
        <p className="text-xs font-bold uppercase tracking-[0.2em]">Tonight's special</p>
        <div>
          <p className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            Can't decide
            <br />
            where to eat?
          </p>
          <p className="mt-3 max-w-xs text-base font-medium">Set a borough or a craving, or leave it all to chance. Then hit the button.</p>
        </div>
      </Shell>
    )
  }

  const meta = [pick.cuisine, pick.neighborhood, priceLabel(pick.price)].filter(Boolean)

  return (
    <Shell key={`${pick.source}:${pick.id}`} className="animate-rise">
      {pick.lat && pick.lng ? (
        <iframe
          title={`Map of ${pick.name}`}
          src={osmEmbedUrl(pick.lat, pick.lng)}
          loading="lazy"
          className="h-44 w-full border-0 border-b border-line grayscale-[30%] sm:h-52"
        />
      ) : (
        <div className="h-3 bg-[repeating-linear-gradient(90deg,rgb(var(--sauce))_0_24px,rgb(var(--taxi))_24px_48px)]" />
      )}
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sauce">
              {pick.source === 'curated' ? 'Hand-picked' : 'Live from city data'} · {pick.borough}
            </p>
            <h2 className="mt-2 break-words font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">{pick.name}</h2>
            <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-base font-medium text-muted">
              {meta.map((m, i) => (
                <span key={i} className="after:ml-3 after:text-line after:content-['•'] last:after:hidden">
                  {m}
                </span>
              ))}
            </p>
          </div>
          {pick.grade && <GradeBadge grade={pick.grade} date={pick.gradeDate} />}
        </div>

        {pick.note && <p className="mt-5 text-lg leading-relaxed">{pick.note}</p>}

        <dl className="mt-5 grid gap-1 text-sm">
          <div className="flex gap-2">
            <dt className="sr-only">Address</dt>
            <dd>
              {pick.address}, {pick.borough}
              {pick.zipcode ? ` ${pick.zipcode}` : ''}
            </dd>
          </div>
          {pick.phone && (
            <div className="flex gap-2">
              <dt className="sr-only">Phone</dt>
              <dd>
                <a href={`tel:${pick.phone.replace(/\D/g, '')}`} className="underline decoration-line underline-offset-4">
                  {pick.phone}
                </a>
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-6 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
          <a href={directionsUrl(pick)} target="_blank" rel="noreferrer" className={`${primaryClass} col-span-3 sm:col-span-1`}>
            Directions
          </a>
          <a href={mapsSearchUrl(pick.name, pick.address, pick.borough)} target="_blank" rel="noreferrer" className={actionClass}>
            <span className="sm:hidden">Reviews</span>
            <span className="hidden sm:inline">Reviews &amp; hours</span>
          </a>
          <button onClick={() => onShare(pick)} className={actionClass}>
            Share
          </button>
          <button onClick={() => onSave(pick)} aria-pressed={saved} className={`${actionClass} ${saved ? 'border-sauce text-sauce' : ''}`}>
            <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M12 21s-7-4.4-9.3-9C1 8.5 3 5 6.5 5c2 0 3.6 1.1 4.5 2.6h2C13.9 6.1 15.5 5 17.5 5 21 5 23 8.5 21.3 12 19 16.6 12 21 12 21z" />
            </svg>
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </Shell>
  )
}
