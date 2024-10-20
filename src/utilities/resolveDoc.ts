import { getPayloadHMR } from "@payloadcms/next/utilities"
import configPromise from '@payload-config'

import type { Config } from '@/payload-types'
import { unstable_cache } from "next/cache"
import { getId } from "./getId"
type Collection = keyof Config['collections']

export const resolveDocument = async <T extends Collection>(collection: T, entry: Config['collections'][T] | number, depth = 0) => {
  if (typeof entry === 'number') {
    const payload = await getPayloadHMR({ config: configPromise })
    if (typeof entry === 'number') {
      return await payload.findByID({
        collection,
        depth,
        id: entry,
      })
    }
  }
  return entry
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const resolveCachedDocument = <T extends Collection>(collection: T, entry: Config['collections'][T] | number, depth = 0) => {
  const id = getId(entry)
  return unstable_cache(async () => resolveDocument(collection, entry, depth), [collection, id.toString(), depth.toString()], {
    tags: [`${collection}_${id}_${depth}`],
  })
}
