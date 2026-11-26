import './globals.css'

export const metadata = {
  title: 'NYC Eats - Random Restaurant Finder',
  description: 'Discover your next favorite restaurant in New York City with filters for borough, cuisine, and price range.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
