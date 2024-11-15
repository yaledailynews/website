import type { Metadata } from 'next'

import { cn } from '@cms/utilities/cn'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        {/* <link href="/favicon.svg" rel="icon" type="image/svg+xml" /> */}
      </head>
      <body>{children}</body>
    </html>
  )
}

export const metadata: Metadata = {
  title: {
    default: 'The Yale Daily News',
    template: '%s | The Yale Daily News',
  },
}
