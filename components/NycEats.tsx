'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CURATED, CURATED_CUISINES, filterCurated, findCurated } from '@/lib/curated'
import { LiveSource, OpenDataError } from '@/lib/openData'
import { pickFresh } from '@/lib/random'
import { keyOf, load, pushHistory, save } from '@/lib/storage'
import { DEFAULT_FILTERS, type Filters, type Restaurant, type Source } from '@/lib/types'
import { parseUrlState, toSearch } from '@/lib/urlState'
import FilterPanel from './FilterPanel'
import ModeSwitch from './ModeSwitch'
import PickLists from './PickLists'
import ResultCard from './ResultCard'
import SpinButton from './SpinButton'

type Phase = 'idle' | 'spinning' | 'done' | 'empty' | 'error'

const MIN_SPIN_MS = 1100
const live = new LiveSource()
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export default function NycEats() {
  const [source, setSource] = useState<Source>('live')
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [pick, setPick] = useState<Restaurant | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<Restaurant[]>([])
  const [saved, setSaved] = useState<Restaurant[]>([])
  const [liveCount, setLiveCount] = useState<number | null>(null)
  const [liveCuisines, setLiveCuisines] = useState<string[]>([])
  const [toast, setToast] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)

  // Restore filters, any shared pick, and this browser's history on first load.
  useEffect(() => {
    const state = parseUrlState(window.location.search)
    setSource(state.source)
    setFilters(state.filters)
    setHistory(load('history', []))
    setSaved(load('saved', []))
    setReady(true)
    if (!state.pick) return
    if (state.source === 'curated') {
      const found = findCurated(state.pick)
      if (found) {
        setPick(found)
        setPhase('done')
      }
    } else {
      live.byId(state.pick).then((found) => {
        if (found) {
          setPick(found)
          setPhase('done')
        }
      }).catch(() => {})
    }
  }, [])

  useEffect(() => { if (ready) save('history', history) }, [history, ready])
  useEffect(() => { if (ready) save('saved', saved) }, [saved, ready])

  // Keep the address bar shareable.
  useEffect(() => {
    if (!ready) return
    const pickId = pick && pick.source === source ? pick.id : undefined
    const url = window.location.pathname + toSearch({ source, filters, pick: pickId })
    window.history.replaceState(null, '', url)
  }, [source, filters, pick, ready])

  const curatedMatches = useMemo(() => filterCurated(CURATED, filters), [filters])

  // Live mode: load cuisines once, and count matches as filters change.
  useEffect(() => {
    if (source !== 'live' || liveCuisines.length) return
    live.cuisines().then(setLiveCuisines).catch(() => {})
  }, [source, liveCuisines.length])

  useEffect(() => {
    if (source !== 'live') return
    setLiveCount(null)
    const t = setTimeout(() => {
      live.count(filters).then(setLiveCount).catch(() => setLiveCount(-1))
    }, 250)
    return () => clearTimeout(t)
  }, [source, filters])

  const matchCount = source === 'curated' ? curatedMatches.length : liveCount

  const flash = useCallback((message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }, [])

  const spin = useCallback(async () => {
    if (phase === 'spinning') return
    setPhase('spinning')
    setError(null)
    const started = Date.now()
    try {
      const recent = new Set(history.filter((h) => h.source === source).map((h) => h.id))
      const result =
        source === 'curated' ? pickFresh(curatedMatches, recent) : await live.random(filters, recent)
      await wait(Math.max(0, MIN_SPIN_MS - (Date.now() - started)))
      if (!result) {
        setPhase('empty')
        return
      }
      setPick(result)
      setHistory((h) => pushHistory(h, result))
      setPhase('done')
      requestAnimationFrame(() => {
        const el = resultRef.current
        if (el && el.getBoundingClientRect().top > window.innerHeight * 0.6) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    } catch (e) {
      await wait(Math.max(0, MIN_SPIN_MS - (Date.now() - started)))
      // City data unreachable: fall back to the bundled list so a spin never dead-ends.
      const backup = source === 'live' ? pickFresh(filterCurated(CURATED, { ...filters, prices: [] }), new Set()) : null
      if (backup) {
        setPick(backup)
        setHistory((h) => pushHistory(h, backup))
        setPhase('done')
        flash("Couldn't reach the city's data, so here's a hand-picked spot")
        return
      }
      setError(e instanceof OpenDataError ? e.message : 'Something went wrong. Try again.')
      setPhase('error')
    }
  }, [phase, history, source, curatedMatches, filters, flash])

  // Space bar spins, unless you're typing or using a control.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || e.repeat) return
      const t = e.target as HTMLElement
      if (t.closest('input, select, textarea, button, a, [role="radio"], [role="switch"]')) return
      e.preventDefault()
      void spin()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [spin])

  const isSaved = (r: Restaurant) => saved.some((s) => keyOf(s) === keyOf(r))
  const toggleSaved = (r: Restaurant) => {
    if (isSaved(r)) {
      setSaved((s) => s.filter((x) => keyOf(x) !== keyOf(r)))
    } else {
      setSaved((s) => [r, ...s])
      flash(`Saved ${r.name}`)
    }
  }

  const share = async (r: Restaurant) => {
    const url = window.location.origin + window.location.pathname + toSearch({ source: r.source, filters: DEFAULT_FILTERS, pick: r.id })
    const text = `Let's eat at ${r.name} (${r.cuisine}, ${r.borough})`
    try {
      if (navigator.share) {
        await navigator.share({ title: r.name, text, url })
        return
      }
      await navigator.clipboard.writeText(`${text}: ${url}`)
      flash('Link copied')
    } catch {
      // The share sheet was dismissed.
    }
  }

  const changeSource = (next: Source) => {
    if (next === source) return
    setSource(next)
    setFilters((f) => ({ ...f, cuisine: null }))
    if (phase !== 'done') setPhase('idle')
  }

  const reelWords = source === 'curated' ? CURATED.map((r) => r.name) : liveCuisines.length ? liveCuisines : CURATED_CUISINES

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sauce">Five boroughs, one decision</p>
          <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl">
            NYC Eats<span className="text-sauce">.</span>
          </h1>
        </div>
        <ModeSwitch value={source} onChange={changeSource} />
      </header>
      <p className="mt-3 max-w-xl text-base text-muted sm:text-lg">
        {source === 'live'
          ? "Spin across every restaurant the city's Health Department has inspected recently, live from NYC Open Data."
          : 'Spin through a hand-picked list of New York institutions, old and new.'}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
        <section aria-label="Filters" className="rounded-3xl border border-line bg-card/80 p-5 shadow-sm backdrop-blur sm:p-6">
          <FilterPanel
            source={source}
            filters={filters}
            onChange={setFilters}
            cuisines={source === 'curated' ? CURATED_CUISINES : liveCuisines}
          />
          <div className="mt-6 border-t border-line pt-5">
            <SpinButton spinning={phase === 'spinning'} disabled={matchCount === 0} onClick={spin} />
            <p className="mt-3 text-center text-sm text-muted" aria-live="polite">
              {matchCount === null
                ? 'Counting places…'
                : matchCount < 0
                  ? "Couldn't reach the city's data right now"
                  : matchCount === 0
                  ? 'Nothing matches. Loosen a filter.'
                  : `${matchCount.toLocaleString()} ${matchCount === 1 ? 'place matches' : 'places match'}`}
              {matchCount !== null && matchCount > 0 && <span className="hidden sm:inline"> · or press Space</span>}
            </p>
          </div>
        </section>

        <div ref={resultRef} className="scroll-mt-4">
          <ResultCard
            phase={phase}
            pick={pick}
            error={error}
            reelWords={reelWords}
            saved={pick ? isSaved(pick) : false}
            onSave={toggleSaved}
            onShare={share}
            onRetry={spin}
          />
        </div>
      </div>

      <PickLists
        history={history}
        saved={saved}
        onSelect={(r) => {
          setPick(r)
          setPhase('done')
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
        onClearHistory={() => setHistory([])}
        onToggleSaved={toggleSaved}
      />

      <footer className="mt-16 border-t border-line pt-6 text-sm text-muted">
        <p>
          Live picks come from{' '}
          <a className="underline decoration-line underline-offset-4 hover:text-ink" href="https://data.cityofnewyork.us/Health/DOHMH-New-York-City-Restaurant-Inspection-Results/43nn-pn8j" target="_blank" rel="noreferrer">
            NYC Open Data
          </a>{' '}
          (DOHMH restaurant inspections). The hand-picked list was last reviewed in October 2026. Restaurants change, so check before you go. Maps by{' '}
          <a className="underline decoration-line underline-offset-4 hover:text-ink" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
            OpenStreetMap
          </a>
          .
        </p>
      </footer>

      <div
        role="status"
        className={`pointer-events-none fixed inset-x-0 bottom-6 z-50 mx-auto w-fit rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper shadow-lg transition-all duration-300 ${toast ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        {toast}
      </div>
    </div>
  )
}
