const MINIMUM_SCORE = 0.26

import { MediaFigure } from '@/components/MediaFigure'
import { getDocById } from '@/utilities/cache'
import OpenAI from 'openai'
import { Pinecone } from '@pinecone-database/pinecone'
import { env } from '@/env'
import { PineconeMetadata } from '@/hooks/addToPinecone'
import { PostItem } from '@/components/PostItem'
import { Suspense } from 'react'
import { Search } from '@/components/Search'
import { IconLoader2 } from '@tabler/icons-react'
import { Author, Category, Page, Post } from '@payload-types'
import { AvatarImage } from '@/components/AvatarImage'
import Link from 'next/link'

const openai = new OpenAI()

const pc = new Pinecone({
  apiKey: env.PINECONE_API_KEY,
})
const search = pc.index('search')

async function searchPinecone(query: string) {
  // Get text embedding
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
    encoding_format: 'float',
  })

  const [data] = response.data

  // Search Pinecone
  const results = await search.query({
    vector: data.embedding,
    topK: 10,
    includeMetadata: true,
  })

  return (await Promise.all(
    results.matches.map(async (match) => {
      const { collection, id } = match.metadata as PineconeMetadata
      return { collection, item: await getDocById(collection, id, 3)(), score: match.score } as
        | { collection: 'posts'; item: Post, score: number }
        | { collection: 'pages'; item: Page, score: number }
        | { collection: 'authors'; item: Author, score: number }
        | { collection: 'categories'; item: Category, score: number }
    })
  )).filter((result) => result.score > MINIMUM_SCORE)
}

async function Results({ query }: { query?: string }) {
  if (!query) return <p className="text-gray-500 text-center text-lg">Enter a search query</p>

  const results = await searchPinecone(query)

  return results.length > 0 ? (
    <div className="flex flex-col gap-5">
      {results.map((result) => (
        <div className="pb-6 border-b">
          {result.collection === 'posts' ? (
            <div className="grid sm:grid-cols-[2fr_1fr] gap-6 ">
              <PostItem post={result.item} size="md" />
              <MediaFigure
                media={result.item.cover}
                href={`/posts/${result.item.slug}`}
                sizes="(min-width: 640px) 50vw, 100vw"
                className="w-full"
              />
            </div>
          ) : result.collection === 'pages' ? (
            <Link href={`/pages/${result.item.slug}`}>
              <p className="text-gray-500 text-sm">Page</p>
              <h2 className="font-headline text-xl md:text-lg">{result.item.title}</h2>
            </Link>
          ) : result.collection === 'authors' ? (
            <Link
              className="flex gap-3 items-start justify-between"
              href={`/authors/${result.item.slug}`}
            >
              <div>
                <p className="text-gray-500 text-sm">Author</p>
                <h2 className="font-headline text-xl md:text-lg">{result.item.name}</h2>
              </div>
              <AvatarImage media={result.item.avatar} size="sm" className="w-10 rounded-full" />
            </Link>
          ) : result.collection === 'categories' ? (
            <Link href={`/categories/${result.item.slug}`}>
              <p className="text-gray-500 text-sm">Category</p>
              <h2 className="font-headline text-xl md:text-lg">{result.item.title}</h2>
            </Link>
          ) : null}
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500 text-center text-lg">No results found</p>
  )
}

function ResultsWrapper({ query }: { query?: string }) {
  return (
    <Suspense
      fallback={
        <p className="text-gray-500 text-lg flex items-center justify-center gap-3">
          <IconLoader2 className="animate-spin text-gray-400" />
          <span>Searching...</span>
        </p>
      }
    >
      <Results query={query} key={query} />
    </Suspense>
  )
}

type Args = {
  searchParams: Promise<{
    q?: string
  }>
}
export default async function SearchPage({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise

  return (
    <main className="w-full flex flex-col items-center gap-5 pb-6 sm:pb-8 md:pb-10 lg:pb-14 overflow-hidden">
      <div className="py-4 sm:py-6 md:py-8 lg:py-9 flex flex-col items-center w-full">
        <div className="max-w-screen-sm px-5 md:px-0 md:mx-0 flex flex-col gap-7 sm:gap-12 justify-start w-full">
          <Search />
          <div className="flex flex-col gap-5">
            <ResultsWrapper query={query} key={query} />
          </div>
        </div>
      </div>
    </main>
  )
}
