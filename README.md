# NYC Eats

Can't decide where to eat? NYC Eats picks a random restaurant anywhere in the five boroughs.

- **All of NYC (default):** spins across every restaurant the NYC Health Department has inspected in the last 18 months, live from [NYC Open Data](https://data.cityofnewyork.us/Health/DOHMH-New-York-City-Restaurant-Inspection-Results/43nn-pn8j). That's tens of thousands of places, updated daily, with health grades, phone numbers and a map. No API key needed.
- **Hand-picked:** a bundled list of about 140 New York institutions with price and a one-line reason to go. It's also the fallback if the city's data can't be reached.

Filter by borough and cuisine, skip the chains, require an A grade, or set a budget. Picks don't repeat until you've seen everything that matches. Recent and saved picks stay in your browser, and every pick has a shareable link.

## Stack

- Next.js 15 (App Router, static export) + React 19 + TypeScript
- Tailwind CSS
- Data: NYC Open Data's Socrata API queried from the browser (`lib/openData.ts`), plus `data/curated.json`
- Maps: OpenStreetMap embeds. Directions and reviews open Google Maps.
- Tests: Vitest

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # typecheck + unit tests
npm run build      # static site in ./out
```

## Deploy

Pushing to `main` builds and deploys to GitHub Pages with `.github/workflows/nextjs.yml`. Pull requests run the checks in `.github/workflows/ci.yml`.

## Project layout

```
app/            layout, page, global styles, icon
components/     UI (NycEats is the page, the rest are pieces)
lib/openData.ts live NYC Open Data source (SoQL queries, random pick)
lib/curated.ts  hand-picked source and filters
lib/random.ts   no-repeat random picker
lib/urlState.ts shareable URL <-> filters
data/           curated.json
tests/          unit tests
```
