import { readFile } from 'fs/promises'
import type { InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export async function getStaticProps() {
  const document = await readFile('index.html', 'utf8')
  const body = document.match(/<body>([\s\S]*?)<\/body>/i)
  const title = document.match(/<title>(.*?)<\/title>/i)
  if (!body || !title) throw new Error('The picker needs a page title and body.')

  // Next loads these scripts after hydration so they can update the picker controls.
  const markup = body[1].replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
  return { props: { title: title[1], markup } }
}

export default function Home({ title, markup }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { basePath } = useRouter()
  useEffect(() => {
    require('../public/picker-data.js')
    require('../script.js')
  }, [])

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Spin the Meal Machine to pick your next NYC restaurant." />
        <meta name="theme-color" content="#fcf7e8" />
        <link rel="icon" href={`${basePath}/arcade-food/burger.png`} type="image/png" />
      </Head>
      <div dangerouslySetInnerHTML={{ __html: markup.replace(/(src|href)="(?:\.\/)?public\//g, `$1="${basePath}/`) }} />
    </>
  )
}
