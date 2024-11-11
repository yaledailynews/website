import type { Config } from '@payload-types'

import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import { getId } from './getId'
import { DataFromCollectionSlug, Where } from 'payload'

type Collections = Config['collections']
type Collection = keyof Collections
type Globals = Config['globals']
type Global = keyof Globals

async function findDocBySlug<T extends Collection>(
  collection: T,
  slug: string,
  depth: number,
): Promise<DataFromCollectionSlug<T> | null> {
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
  return page.docs[0] || null
}

export const getDocBySlug = <T extends Collection>(collection: T, slug: string, depth = 0) =>
  unstable_cache(async () => findDocBySlug(collection, slug, depth), [collection, slug], {
    tags: [`${collection}_${slug}`],
  })

async function findGlobal<T extends Global>(slug: T, depth: number) {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayloadHMR({ config: configPromise })

  return await payload.findGlobal({
    slug,
    depth: 0,
    draft,
    overrideAccess: draft,
  })
}

export const getGlobal = <T extends Global>(slug: T, depth = 0) =>
  unstable_cache(async () => findGlobal(slug, depth), [slug], {
    tags: [`global_${slug}`],
  })

export const findDocById = async <T extends Collection>(
  collection: T,
  entry: number | Collections[T],
  depth: number,
) => {
  if (typeof entry === 'object') {
    return entry
  }

  const { isEnabled: draft } = await draftMode()
  const payload = await getPayloadHMR({ config: configPromise })

  const result = await payload.findByID({
    collection,
    draft,
    overrideAccess: draft,
    depth,
    id: entry,
  })
  if (!result) {
    throw new Error(`Document with id ${entry} not found in collection ${collection}`)
  }
  return result
}

export const getDocById = <T extends Collection>(
  collection: T,
  entry: number | Collections[T],
  depth = 0,
) => {
  const id = getId(entry)
  return unstable_cache(
    async () => findDocById(collection, entry, depth),
    [collection, id.toString()],
    {
      tags: [`${collection}_id_${entry}`],
    },
  )
}

export const getDoc = <T extends Collection>(
  collection: T,
  entry: Collections[T] | number | string,
) => {
  if (typeof entry === 'string') {
    return getDocBySlug(collection, entry)
  }
  return getDocById(collection, entry)
}

export async function findRedirects(depth = 1) {
  const payload = await getPayloadHMR({ config: configPromise })

  const { docs: redirects } = await payload.find({
    collection: 'redirects',
    depth,
    limit: 0,
    pagination: false,
  })

  return redirects
}

export const getRedirects = () =>
  unstable_cache(async () => findRedirects(), ['redirects'], {
    tags: ['redirects'],
  })

export async function findPostsByCategory(id: number, depth: number, limit: number, where?: Where) {
  const payload = await getPayloadHMR({ config: configPromise })

  const { docs: posts } = await payload.find({
    collection: 'posts',
    depth,
    limit,
    where: {
      categories: {
        contains: id,
      },
      ...where,
    },
  })

  // tag each post for revalidation
  for (const post of posts) {
    getDocById('posts', post.id)
  }

  return posts
}

export const getPostsByCategory = (id: number, depth = 0, limit = 100, where?: Where) =>
  unstable_cache(async () => findPostsByCategory(id, depth, limit, where), [id.toString()], {
    tags: [`posts_category_${id}`],
  })

export async function findPostsByAuthor(id: number, depth: number, limit: number) {
  const payload = await getPayloadHMR({ config: configPromise })

  const { docs: posts } = await payload.find({
    collection: 'posts',
    depth,
    limit,
    where: {
      authors: {
        contains: id,
      },
    },
    sort: '-publishedAt',
  })

  // tag each post for revalidation
  for (const post of posts) {
    getDocById('posts', post.id)
  }

  return posts
}

export const getPostsByAuthor = (id: number, depth = 0, limit = 100) =>
  unstable_cache(async () => findPostsByAuthor(id, depth, limit), [id.toString()], {
    tags: [`posts_author_${id}`],
  })

export async function findMediaByAuthor(id: number, depth: number, limit: number) {
  const payload = await getPayloadHMR({ config: configPromise })

  const { docs: media } = await payload.find({
    collection: 'media',
    depth,
    limit,
    where: {
      author: {
        equals: id,
      },
    },
  })

  // tag each media for revalidation
  for (const item of media) {
    getDocById('media', item.id)
  }

  return media
}

export const getMediaByAuthor = (id: number, depth = 0, limit = 100) =>
  unstable_cache(async () => findMediaByAuthor(id, depth, limit), [id.toString()], {
    tags: [`media_author_${id}`],
  })
