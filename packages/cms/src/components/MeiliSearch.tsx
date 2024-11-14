'use client'

import { env } from '@cms/env'
import { IconSearch, IconX } from '@tabler/icons-react'
import Link from 'next/link'
import { SearchBox, Hits, Highlight, Pagination, useStats } from 'react-instantsearch'
import { InstantSearchNext } from 'react-instantsearch-nextjs'
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'

const { searchClient } = instantMeiliSearch(
  env.NEXT_PUBLIC_MEILI_URL,
  env.NEXT_PUBLIC_MEILI_SEARCH_KEY,
  {
    meiliSearchParams: {
      hybrid: {
        embedder: 'openai',
        semanticRatio: 0.5,
      },
    },
  },
)

function Hit({ hit }) {
  return (
    <Link href={`/posts/${hit.slug}`}>
      <article className="grid gap-4 sm:grid-cols-[2fr,1fr]">
        <div className="space-y-2 hover:opacity-70 transition-opacity">
          <h1 className="font-headline text-xl">
            <Highlight attribute="title" hit={hit} />
          </h1>
          {hit.subhead && (
            <p className="font-serif text-gray-800">
              <Highlight attribute="subhead" hit={hit} />
            </p>
          )}
          {hit.authors && (
            <p className="text-gray-500 text-xs">
              By <Highlight attribute="authors" hit={hit} />
            </p>
          )}
        </div>
        {hit.coverUrl && <img src={`${env.NEXT_PUBLIC_S3_URL}/${hit.coverUrl}`} alt={hit.title} />}
      </article>
    </Link>
  )
}

function SearchContent() {
  const stats = useStats()

  return (
    <>
      <SearchBox
        submitIconComponent={() => <IconSearch size={20} />}
        resetIconComponent={() => <IconX size={20} />}
        loadingIconComponent={() => <div>Loading...</div>}
        placeholder="Search..."
        autoFocus
        classNames={{
          input:
            'w-full bg-gray-100 rounded-none focus:border-gray-400 focus:outline-none border border-solid border-gray-300 px-3 py-1.5 sm:py-2 shadow-inner',
          form: 'relative flex gap-2',
          submit:
            'text-sm sm:text-base bg-sky-700 rounded-none focus:ring-0 focus:outline-none px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 text-white hover:bg-sky-800 active:bg-sky-900 transition-colors',
          reset: 'hidden',
        }}
      />
      {stats.query.length > 0 ? (
        stats.nbHits > 0 ? (
          <>
            <Hits
              hitComponent={Hit}
              classNames={{
                list: 'grid',
                item: 'border-b border-gray-300 py-6 last:border-b-0 first:pt-0',
              }}
            />
            <Pagination
              classNames={{
                item: 'flex',
                selectedItem: 'text-sm sm:text-base !bg-sky-700 !text-white',
                firstPageItem:
                  'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 transition-colors',
                nextPageItem:
                  'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 transition-colors',
                previousPageItem:
                  'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 transition-colors',
                lastPageItem:
                  'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 transition-colors',
                link: 'text-center text-sm sm:text-base px-4 py-1.5 sm:py-2 hover:cursor-pointer',
                pageItem:
                  'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 transition-colors',
                list: 'flex gap-2 justify-center',
              }}
            />
          </>
        ) : (
          <p className="text-center text-gray-500">No results found</p>
        )
      ) : (
        <p className="text-center text-gray-500">Start typing to search</p>
      )}
    </>
  )
}

export function MeiliSearch() {
  return (
    <InstantSearchNext
      indexName={env.NEXT_PUBLIC_MEILI_SEARCH_INDEX}
      routing
      searchClient={searchClient}
    >
      <SearchContent />
    </InstantSearchNext>
  )
}
