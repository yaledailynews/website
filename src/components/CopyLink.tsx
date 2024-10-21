'use client'

import { cn } from '@/utilities/cn'
import { IconCheck, IconLink } from '@tabler/icons-react'
import React from 'react'
import { useState } from 'react'

export function CopyLink() {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    })
  }

  return (
    <button
      className={cn('py-2 px-3 rounded-full transition-colors flex items-center gap-2', {
        'bg-gray-100 hover:bg-gray-200 active:bg-gray-300': !copied,
        'bg-blue-200 text-blue-800': copied,
      })}
      aria-label="Copy link"
      onClick={copy}
    >
      <span className="text-sm">{copied ? 'Copied' : 'Copy'}</span>
      {copied ? <IconCheck size={20} /> : <IconLink size={20} />}
    </button>
  )
}
