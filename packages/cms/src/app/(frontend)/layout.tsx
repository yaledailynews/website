import type { Metadata } from 'next'

import { cn } from 'src/utilities/cn'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { Footer } from '@/globals/Footer/Component'
import { LivePreviewListener } from '@/components/LivePreviewListener'

import './globals.css'
// import { format } from 'date-fns'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link rel="stylesheet" href="https://use.typekit.net/wkm0djp.css" />
        {/* <meta
          httpEquiv="last-modified"
          content={format(new Date(), "EEE, dd MMM yyyy HH:mm:ss 'GMT'")}
        /> */}
      </head>
      <body>
        <LivePreviewListener />
        <div className="min-h-screen flex flex-col gap-5">
          <div className="flex-grow">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: {
    default: 'The Yale Daily News',
    template: '%s | The Yale Daily News',
  },
}
