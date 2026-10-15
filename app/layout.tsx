import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/inter'
import '@fontsource-variable/bricolage-grotesque'
import './globals.css'

export const metadata: Metadata = {
  title: 'NYC Eats: a random restaurant, anywhere in the five boroughs',
  description:
    "Can't decide where to eat? Spin for a random New York City restaurant from a hand-picked list or the city's own database of every inspected restaurant.",
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f1e7' },
    { media: '(prefers-color-scheme: dark)', color: '#141210' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
