// TODO

import type { Metadata } from 'next/types'

import React from 'react'
import { PostItem } from '@/components/PostItem'
import { MediaFigure } from '@/components/MediaFigure'
import { getDocById } from '@/utilities/cache'
import OpenAI from 'openai'
import { Pinecone } from '@pinecone-database/pinecone'
import { env } from '@/env'
import { IconSearch } from '@tabler/icons-react'
import { PineconeMetadata } from '@/collections/Posts/hooks/addToPinecone'

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

  return await Promise.all(
    results.matches.map((match) => {
      const { collection, id } = match.metadata as PineconeMetadata
      return getDocById(collection, id, 3)()
    }),
  )
}

type Args = {
  searchParams: Promise<{
    q: string
  }>
}
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise

  const results = query ? await searchPinecone(query) : null

  return (
    <main className="w-full flex flex-col items-center gap-5 pb-6 sm:pb-8 md:pb-10 lg:pb-14 overflow-hidden">
      <div className="py-4 sm:py-6 md:py-8 lg:py-9 flex flex-col items-center w-full">
        <div className="max-w-screen-sm px-5 md:px-0 md:mx-0 flex flex-col gap-12 justify-start w-full">
          <h1 className="sr-only">Search</h1>
          <form action="/search" method="get" className="relative flex gap-2">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <IconSearch className="w-5 h-5 text-gray-500" />
              </div>
              <input
                name="q"
                placeholder="Search"
                autoFocus
                defaultValue={query}
                className="w-full bg-gray-100 rounded-none focus:ring-0 focus:outline-none border border-solid border-gray-300 pr-3 pl-9 py-2"
              />
            </div>
            <button
              type="submit"
              aria-label="Search"
              className="bg-sky-700 rounded-none focus:ring-0 focus:outline-none border border-solid border-sky-400 px-4 py-2 text-white hover:bg-sky-800 active:bg-sky-900 transition-colors"
            >
              Search
            </button>
          </form>

          {results ? (
            results.length > 0 ? (
              <div className="flex flex-col gap-5">
                {results.map((post) => (
                  <div key={post.id} className="grid sm:grid-cols-[2fr_1fr] gap-6 pb-6 border-b">
                    <PostItem post={post} />
                    <MediaFigure
                      media={post.cover}
                      href={`/posts/${post.slug}`}
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No results found</p>
            )
          ) : (
            <p className="text-gray-500 text-center">Enter a search query</p>
          )}
        </div>
      </div>
    </main>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Search`,
  }
}
