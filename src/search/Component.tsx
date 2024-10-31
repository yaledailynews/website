'use client'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
import React, { useState, useEffect } from 'react'
import { useDebounce } from '@/utilities/useDebounce'
import { useRouter } from 'next/navigation'
import { IconSearch } from '@tabler/icons-react'

export const Search: React.FC = () => {
  const [value, setValue] = useState('')
  const router = useRouter()

  const debouncedValue = useDebounce(value)

  useEffect(() => {
    router.push(`/search${debouncedValue ? `?q=${debouncedValue}` : ''}`)
  }, [debouncedValue, router])

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <IconSearch className="w-5 h-5 text-gray-500" />
          </div>
          <input
            id="search"
            onChange={(event) => {
              setValue(event.target.value)
            }}
            placeholder="Search"
            autoFocus
            className="w-full bg-gray-100 rounded-none focus:ring-0 focus:outline-none border border-solid border-gray-300 pr-3 pl-9 py-2"
          />
        </div>
        <button type="submit" className="sr-only">
          submit
        </button>
      </form>
    </div>
  )
}
