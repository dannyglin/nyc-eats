import { Suspense } from 'react'
import NycEats from '@/components/NycEats'

export default function Page() {
  return (
    <Suspense>
      <NycEats />
    </Suspense>
  )
}
