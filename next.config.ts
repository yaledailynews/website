import type { NextConfig } from 'next'

import { withPayload } from '@payloadcms/next/withPayload'
import redirects from './redirects'

import { env } from '@/env'

function assertValidProtocol(protocol: string): protocol is 'https' | 'http' {
  return protocol === 'https' || protocol === 'http'
}
function getUrlProtocol(url: string): 'https' | 'http' {
  const protocol = new URL(url).protocol.split(':')[0]
  if (!assertValidProtocol(protocol)) {
    throw new Error(`Invalid protocol: ${protocol}`)
  }
  return protocol
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...[env.NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item)
        return {
          hostname: url.hostname,
          protocol: getUrlProtocol(item),
        }
      }),
    ],
  },
  reactStrictMode: true,
  redirects,
}

export default withPayload(nextConfig)
