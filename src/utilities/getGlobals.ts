import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'

type Global = keyof Config['globals']

async function getGlobal<T extends Global>(slug: T, depth = 0) {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayloadHMR({ config: configPromise })

  return await payload.findGlobal({
    slug,
    depth,
    draft,
    overrideAccess: draft,
  })
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = <T extends Global>(slug: T, depth = 0) =>
  unstable_cache(async () => getGlobal(slug, depth), [slug], {
    tags: [`global_${slug}`],
  })
