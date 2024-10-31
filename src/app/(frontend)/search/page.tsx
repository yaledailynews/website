// TODO

import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import React from 'react'
import { Post } from '@payload-types'
import { Search } from '@/search/Component'
import { PostItem } from '@/components/PostItem'
import { MediaFigure } from '@/components/MediaFigure'
import { findDocById } from '@/utilities/cache'

type Args = {
  searchParams: Promise<{
    q: string
  }>
}
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayloadHMR({ config: configPromise })

  if (!query) {
    return (
      <main className="w-full flex flex-col items-center gap-5 pb-6 sm:pb-8 md:pb-10 lg:pb-14 overflow-hidden">
        <div className="py-4 sm:py-6 md:py-8 lg:py-9 flex flex-col items-center w-full">
          <div className="max-w-screen-sm px-5 md:px-0 md:mx-0 flex flex-col gap-6 justify-start w-full">
            <h1 className="sr-only">Search</h1>
            <Search />
            <p className="text-gray-500 text-center">Search for something</p>
          </div>
        </div>
      </main>
    )
  }

  const results = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    ...(query
      ? {
          where: {
            or: [
              {
                'meta.title': {
                  like: query,
                },
              },
              {
                slug: {
                  like: query,
                },
              },
              {
                'meta.subhead': {
                  like: query,
                },
              },
            ],
          },
        }
      : {}),
  })

  const posts = await Promise.all(
    results.docs.map(async (item) => {
      const doc = await findDocById(item.doc.relationTo, item.doc.value, 2)
      return { ...item, doc }
    }),
  )

  return (
    <main className="w-full flex flex-col items-center gap-5 pb-6 sm:pb-8 md:pb-10 lg:pb-14 overflow-hidden">
      <div className="py-4 sm:py-6 md:py-8 lg:py-9 flex flex-col items-center w-full">
        <div className="max-w-screen-sm px-5 md:px-0 md:mx-0 flex flex-col gap-6 justify-start w-full">
          <h1 className="sr-only">Search</h1>
          <Search />

          {posts.length > 0 ? (
            <div className="flex flex-col gap-5">
              {posts.map((post) => (
                <div key={post.id} className="grid sm:grid-cols-[2fr_1fr] gap-6 pb-6 border-b">
                  <PostItem post={post.doc} size="xl" />
                  <MediaFigure
                    media={post.doc.cover}
                    href={`/posts/${post.slug}`}
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="w-full"
                  />
                </div>
              ))}
              {/* TODO: pagination */}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No results found</p>
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
