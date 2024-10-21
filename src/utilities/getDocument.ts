import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'

type Collection = keyof Config['collections']

async function getDocument<T extends Collection>(collection: T, slug: string, depth = 0) {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayloadHMR({ config: configPromise })

  const page = await payload.find({
    collection,
    depth,
    draft,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  return page.docs[0]
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedDocument = <T extends Collection>(collection: T, slug: string, depth = 0) =>
  unstable_cache(async () => getDocument(collection, slug, depth), [collection, slug], {
    tags: [`${collection}_${slug}`],
  })
