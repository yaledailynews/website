'use client'

import { IconSearch } from '@tabler/icons-react'
import { useRouter, useSearchParams } from 'next/navigation'

export function Search() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const query = searchParams.get('q')

  return (
    <>
      <h1 className="sr-only">Search</h1>
      <form
        action="/search"
        method="get"
        className="relative flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          const form = e.currentTarget
          const formData = new FormData(form)
          const q = formData.get('q') as string
          router.push(`/search?q=${encodeURIComponent(q)}`)
        }}
      >
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <IconSearch className="w-4 h-4 text-gray-500" />
          </div>
          <input
            name="q"
            placeholder="Search"
            autoFocus={!query}
            defaultValue={query || ''}
            className="w-full bg-gray-100 rounded-none focus:border-gray-400 focus:outline-none border border-solid border-gray-300 pr-3 pl-9 py-1.5 sm:py-2 shadow-inner"
          />
        </div>
        <button
          type="submit"
          aria-label="Search"
          className="text-sm sm:text-base bg-sky-700 rounded-none focus:ring-0 focus:outline-none px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 text-white hover:bg-sky-800 active:bg-sky-900 transition-colors"
        >
          Search
        </button>
      </form>
    </>
  )
}
